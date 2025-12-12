import { ReferralEmailRepository } from '~/server/repository/referral-email-repository';
import { useDB } from '~/server/utils/db';
import { logger } from '~/server/lib/logger';

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email ID is required',
      });
    }

    const db = useDB();
    const emailRepository = new ReferralEmailRepository(db);

    // Use repository method that doesn't check is_deleted
    const email = await emailRepository.findEmailById(id);

    if (!email) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Email not found',
      });
    }

    return {
      success: true,
      email: {
        id: email.id.toString(),
        referral_id: email.referral_id.toString(),
        from_email: email.from_email,
        recipient_email: email.recipient_email,
        message_id: email.message_id,
        status: email.status,
        record_type: email.record_type,
        tag: email.tag,
        email_content: email.email_content,
        file_id: email.file_id?.toString() || null,
        delivered_at: email.delivered_at ? email.delivered_at.toISOString() : null,
        bounced_at: email.bounced_at ? email.bounced_at.toISOString() : null,
        opened_at: email.opened_at ? email.opened_at.toISOString() : null,
        clicked_at: email.clicked_at ? email.clicked_at.toISOString() : null,
        spam_complaint_at: email.spam_complaint_at ? email.spam_complaint_at.toISOString() : null,
        details: email.details,
        metadata: email.metadata,
        created_at: email.created_at.toISOString(),
        updated_at: email.updated_at.toISOString(),
      },
    };
  } catch (error: any) {
    logger.error('Error fetching email details', { error: error.message });
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to fetch email',
    });
  }
});
