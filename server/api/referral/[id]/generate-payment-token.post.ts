import crypto from 'crypto';
import { useDB } from '~/server/utils/db';
import { logger } from '~/server/lib/logger';

// Token is valid for 7 days
const TOKEN_EXPIRY_DAYS = 7;

/**
 * Authenticated endpoint: generate a one-time payment token for a referral.
 * The token is stored on the referral row and expires after 7 days.
 * Share the resulting URL with the client so they can enter their credit card.
 */
export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Referral ID is required',
      });
    }

    const db = useDB();

    // Ensure referral exists and is not deleted
    const referral = await db
      .selectFrom('referral')
      .select(['id', 'is_deleted'])
      .where('id', '=', parseInt(id))
      .executeTakeFirst();

    if (!referral || referral.is_deleted) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Referral not found',
      });
    }

    // Generate a secure random token
    const token = crypto.randomBytes(32).toString('hex');

    // Calculate expiry timestamp
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + TOKEN_EXPIRY_DAYS);

    // Persist the token on the referral
    await db
      .updateTable('referral')
      .set({
        cc_token: token,
        cc_token_expires_at: expiresAt,
        updated_at: new Date(),
      })
      .where('id', '=', referral.id)
      .execute();

    logger.info('Payment token generated', { referralId: referral.id, expiresAt });

    // Build the public URL (relative — the client will know the origin)
    const config = useRuntimeConfig();
    const baseUrl = config.public.baseUrl || '';
    const paymentUrl = `${baseUrl}/billing/${token}`;

    return {
      success: true,
      token,
      expiresAt: expiresAt.toISOString(),
      paymentUrl,
    };
  } catch (error: any) {
    logger.error('Failed to generate payment token', { error: error.message });
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to generate payment token',
      message: error.message || 'Failed to generate payment token',
    });
  }
});
