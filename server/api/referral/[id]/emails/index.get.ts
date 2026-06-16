import { useDB } from '~/server/utils/db';
import { ReferralEmailRepository } from '~/server/repository/referral-email-repository';
import { withErrorHandler } from '~/server/utils/error-handler';

/**
 * List the email activity (sent / draft / scheduled) for a referral.
 */
export default defineEventHandler(
  withErrorHandler(async (event) => {
    const id = getRouterParam(event, 'id');
    if (!id) {
      throw createError({ statusCode: 400, message: 'Referral ID is required' });
    }

    const db = useDB();
    const emailRepo = new ReferralEmailRepository(db);
    const emails = await emailRepo.findByReferralIdWithTemplate(id);

    return {
      success: true,
      emails: emails.map((email) => ({
        id: email.id.toString(),
        recipient_email: email.recipient_email,
        subject: email.subject,
        template_name: email.template_name ?? null,
        status: email.status,
        tag: email.tag,
        scheduled_at: email.scheduled_at ? email.scheduled_at.toISOString() : null,
        sent_at: email.sent_at ? email.sent_at.toISOString() : null,
        delivered_at: email.delivered_at ? email.delivered_at.toISOString() : null,
        opened_at: email.opened_at ? email.opened_at.toISOString() : null,
        clicked_at: email.clicked_at ? email.clicked_at.toISOString() : null,
        bounced_at: email.bounced_at ? email.bounced_at.toISOString() : null,
        created_at: email.created_at.toISOString(),
      })),
    };
  }, 'List Referral Emails')
);
