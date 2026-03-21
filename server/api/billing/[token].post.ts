import { z } from 'zod';
import { useDB } from '~/server/utils/db';
import { encrypt } from '~/server/utils/encryption';
import { CreditCardRepository } from '~/server/repository/credit-card-repository';
import { logger } from '~/server/lib/logger';
import { rateLimit } from '~/server/utils/rate-limiter';

const creditCardSchema = z.object({
  cardNumber: z.string().min(13).max(19),
  expiry: z.string().regex(/^\d{2}\/\d{2}$/, 'Expiry must be in MM/YY format'),
  cvv: z
    .string()
    .min(3)
    .max(4)
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
});

/**
 * Public endpoint: submit credit card information using a one-time token.
 * Saves the encrypted card data, then expires the token so it cannot be reused.
 * No authentication required.
 * Rate limited to 5 submissions per 15 minutes per IP.
 */
export default defineEventHandler(async (event) => {
  // Rate limit: 5 submissions per 15 minutes per IP (strict — sensitive endpoint)
  rateLimit(event, { max: 5, windowMs: 15 * 60 * 1000, keyPrefix: 'billing-post' });

  try {
    const token = getRouterParam(event, 'token');

    if (!token) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Token is required',
      });
    }

    const db = useDB();

    // Look up and validate the token in a single query
    const referral = await db
      .selectFrom('referral')
      .select(['id', 'cc_token', 'cc_token_expires_at', 'is_deleted'])
      .where('cc_token', '=', token)
      .executeTakeFirst();

    if (!referral || referral.is_deleted) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Invalid or expired token',
        message: 'This payment link is invalid or has already been used.',
      });
    }

    if (!referral.cc_token_expires_at || new Date(referral.cc_token_expires_at) < new Date()) {
      throw createError({
        statusCode: 410,
        statusMessage: 'Token expired',
        message: 'This payment link has expired. Please contact the clinic for a new link.',
      });
    }

    // Validate the submitted card data
    const body = await readBody(event);
    const validation = creditCardSchema.safeParse(body);

    if (!validation.success) {
      throw createError({
        statusCode: 400,
        statusMessage: validation.error.issues[0].message,
        message: validation.error.issues[0].message,
      });
    }

    const { cardNumber, expiry, cvv } = validation.data;

    // Encrypt sensitive card data
    const encryptedData = {
      referral_id: referral.id,
      card_number_encrypted: encrypt(cardNumber),
      expiry_encrypted: encrypt(expiry),
      cvv_encrypted: cvv ? encrypt(cvv) : null,
    };

    // Save (upsert) the credit card
    const creditCardRepository = new CreditCardRepository(db);
    await creditCardRepository.upsert(referral.id.toString(), encryptedData);

    // Expire the token so it cannot be reused
    await db
      .updateTable('referral')
      .set({
        cc_token: null,
        cc_token_expires_at: null,
        updated_at: new Date(),
      })
      .where('id', '=', referral.id)
      .execute();

    logger.info('Credit card saved via billing token', { referralId: referral.id });

    return {
      success: true,
      message: 'Credit card saved successfully.',
    };
  } catch (error: any) {
    logger.error('Billing token card submission failed', { error: error.message });
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to save credit card',
      message: error.message || 'Failed to save credit card',
    });
  }
});
