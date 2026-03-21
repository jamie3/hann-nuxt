import { useDB } from '~/server/utils/db';
import { logger } from '~/server/lib/logger';
import { rateLimit } from '~/server/utils/rate-limiter';

/**
 * Public endpoint: validate a credit card token and return basic referral info.
 * No authentication required.
 * Rate limited to 20 requests per 15 minutes per IP.
 */
export default defineEventHandler(async (event) => {
  // Rate limit: 20 look-ups per 15 minutes per IP
  rateLimit(event, { max: 20, windowMs: 15 * 60 * 1000, keyPrefix: 'billing-get' });

  try {
    const token = getRouterParam(event, 'token');

    if (!token) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Token is required',
      });
    }

    const db = useDB();

    const referral = await db
      .selectFrom('referral')
      .select(['id', 'first_name', 'last_name', 'cc_token', 'cc_token_expires_at', 'is_deleted'])
      .where('cc_token', '=', token)
      .executeTakeFirst();

    if (!referral || referral.is_deleted) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Invalid or expired token',
        message: 'This payment link is invalid or has already been used.',
      });
    }

    // Check expiry
    if (!referral.cc_token_expires_at || new Date(referral.cc_token_expires_at) < new Date()) {
      throw createError({
        statusCode: 410,
        statusMessage: 'Token expired',
        message: 'This payment link has expired. Please contact the clinic for a new link.',
      });
    }

    return {
      success: true,
      referral: {
        firstName: referral.first_name,
        lastName: referral.last_name,
        expiresAt: new Date(referral.cc_token_expires_at).toISOString(),
      },
    };
  } catch (error: any) {
    logger.warn('Billing token validation failed', { error: error.message });
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to validate token',
      message: error.message || 'Failed to validate token',
    });
  }
});
