import crypto from 'crypto';
import { useDB } from '~/server/utils/db';
import { logger } from '~/server/lib/logger';
import { emailService } from '~/server/service/email-service';
import { withErrorHandler } from '~/server/utils/error-handler';

// Token is valid for 7 days
const TOKEN_EXPIRY_DAYS = 7;

/**
 * Authenticated endpoint: generate a one-time payment token and send it via email.
 * Accepts a recipient email address in the request body.
 */
export default defineEventHandler(
  withErrorHandler(async (event) => {
    const id = getRouterParam(event, 'id');

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Referral ID is required',
      });
    }

    const body = await readBody(event);
    const recipientEmail: string | undefined = body?.email;

    if (!recipientEmail) {
      throw createError({
        statusCode: 400,
        message: 'Email address is required',
      });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      throw createError({
        statusCode: 400,
        message: 'Invalid email address',
      });
    }

    const db = useDB();

    // Ensure referral exists and is not deleted
    const referral = await db
      .selectFrom('referral')
      .select(['id', 'is_deleted', 'first_name', 'last_name'])
      .where('id', '=', parseInt(id))
      .executeTakeFirst();

    if (!referral || referral.is_deleted) {
      throw createError({
        statusCode: 404,
        message: 'Referral not found',
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

    // Build the payment URL
    const config = useRuntimeConfig();
    const baseUrl = config.public.baseUrl || '';
    const paymentUrl = `${baseUrl}/billing/${token}`;

    logger.info('Payment token generated for email delivery', {
      referralId: referral.id,
      expiresAt,
      recipientEmail,
    });

    // Send the payment link via email
    await emailService.sendPaymentLink(referral, recipientEmail, paymentUrl, expiresAt);

    return {
      success: true,
      token,
      expiresAt: expiresAt.toISOString(),
      paymentUrl,
    };
  }, 'Send Payment Link')
);
