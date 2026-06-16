import { useDB } from '~/server/utils/db';
import { env } from '~/server/utils/env';
import { ReferralEmailRepository } from '~/server/repository/referral-email-repository';
import { EmailTemplateRepository } from '~/server/repository/email-template-repository';
import { renderTemplateString } from '~/server/utils/email-templates';
import { buildTemplateContext } from '~/server/utils/template-context';
import { emailService } from '~/server/service/email-service';
import { withErrorHandler } from '~/server/utils/error-handler';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_MODES = ['draft', 'send', 'schedule'] as const;
type Mode = (typeof VALID_MODES)[number];

/**
 * Generate an email for a referral from a template.
 * Modes:
 *   - draft:    save as an unsent draft
 *   - send:     send immediately via Postmark
 *   - schedule: store for later delivery (processed by the scheduler)
 */
export default defineEventHandler(
  withErrorHandler(async (event) => {
    const id = getRouterParam(event, 'id');
    if (!id) {
      throw createError({ statusCode: 400, message: 'Referral ID is required' });
    }

    const body = await readBody(event);
    const mode: Mode = body?.mode;
    const templateId = body?.templateId;
    const scheduledAtRaw = body?.scheduledAt;

    if (!VALID_MODES.includes(mode)) {
      throw createError({ statusCode: 400, message: 'Invalid mode' });
    }

    const db = useDB();

    const referral = await db
      .selectFrom('referral')
      .selectAll()
      .where('id', '=', parseInt(id))
      .where('is_deleted', '=', false)
      .executeTakeFirst();

    if (!referral) {
      throw createError({ statusCode: 404, message: 'Referral not found' });
    }

    // Resolve the recipient (override falls back to the email on file)
    const recipient = (body?.recipient || referral.email || '').trim();
    if (!recipient || !EMAIL_REGEX.test(recipient)) {
      throw createError({ statusCode: 400, message: 'A valid recipient email is required' });
    }

    // Resolve subject/body: use the (possibly edited) values from the client,
    // otherwise render them from the template.
    let subject: string = body?.subject;
    let emailBody: string = body?.body;

    if ((subject == null || emailBody == null) && !templateId) {
      throw createError({
        statusCode: 400,
        message: 'A template or explicit subject and body is required',
      });
    }

    if (subject == null || emailBody == null) {
      const templateRepo = new EmailTemplateRepository(db);
      const template = await templateRepo.findById(parseInt(templateId));
      if (!template) {
        throw createError({ statusCode: 404, message: 'Template not found' });
      }
      const context = await buildTemplateContext(event, referral);
      if (subject == null) subject = await renderTemplateString(template.subject, context);
      if (emailBody == null) emailBody = await renderTemplateString(template.body, context);
    }

    if (!subject?.trim() || !emailBody?.trim()) {
      throw createError({ statusCode: 400, message: 'Subject and body are required' });
    }

    const session = await getUserSession(event);
    const userId = (session?.user as { id: number } | undefined)?.id ?? null;
    const templateIdValue = templateId ? parseInt(templateId) : null;

    // Send immediately
    if (mode === 'send') {
      await emailService.sendCustomEmail({
        referral,
        recipientEmail: recipient,
        subject,
        htmlBody: emailBody,
        templateId: templateIdValue,
        createdBy: userId,
      });
      return { success: true, status: 'sent' };
    }

    // Validate schedule time
    let scheduledAt: Date | null = null;
    if (mode === 'schedule') {
      if (!scheduledAtRaw) {
        throw createError({ statusCode: 400, message: 'A scheduled time is required' });
      }
      scheduledAt = new Date(scheduledAtRaw);
      if (isNaN(scheduledAt.getTime())) {
        throw createError({ statusCode: 400, message: 'Invalid scheduled time' });
      }
      if (scheduledAt.getTime() <= Date.now()) {
        throw createError({ statusCode: 400, message: 'Scheduled time must be in the future' });
      }
    }

    // Persist as draft or scheduled (unsent)
    const emailRepo = new ReferralEmailRepository(db);
    await emailRepo.create({
      referral_id: parseInt(id),
      from_email: env.EMAIL_FROM,
      recipient_email: recipient,
      status: mode === 'schedule' ? 'scheduled' : 'draft',
      tag: 'custom-email',
      subject,
      email_content: emailBody,
      template_id: templateIdValue,
      created_by: userId,
      scheduled_at: scheduledAt,
      file_id: null,
    });

    return { success: true, status: mode === 'schedule' ? 'scheduled' : 'draft' };
  }, 'Generate Referral Email')
);
