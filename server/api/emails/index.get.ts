import { ReferralEmailRepository } from '~/server/repository/referral-email-repository';
import { useDB } from '~/server/utils/db';
import { logger } from '~/server/lib/logger';

export default defineEventHandler(async (event) => {
  try {
    const db = useDB();
    const emailRepository = new ReferralEmailRepository(db);

    // Get all email records with referral info using repository
    const emails = await emailRepository.findAllEmailsWithReferralInfo();

    return {
      success: true,
      emails: emails.map((email) => ({
        id: email.id.toString(),
        referral_id: email.referral_id.toString(),
        first_name: email.first_name || null,
        last_name: email.last_name || null,
        from_email: email.from_email,
        recipient_email: email.recipient_email,
        message_id: email.message_id,
        status: email.status,
        record_type: email.record_type,
        tag: email.tag,
        delivered_at: email.delivered_at ? email.delivered_at.toISOString() : null,
        bounced_at: email.bounced_at ? email.bounced_at.toISOString() : null,
        opened_at: email.opened_at ? email.opened_at.toISOString() : null,
        clicked_at: email.clicked_at ? email.clicked_at.toISOString() : null,
        spam_complaint_at: email.spam_complaint_at ? email.spam_complaint_at.toISOString() : null,
        details: email.details,
        metadata: email.metadata,
        created_at: email.created_at.toISOString(),
        updated_at: email.updated_at.toISOString(),
      })),
    };
  } catch (error: any) {
    logger.error('Error fetching emails', { error: error.message });
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to fetch emails',
    });
  }
});
