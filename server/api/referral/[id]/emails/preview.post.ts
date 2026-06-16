import { useDB } from '~/server/utils/db';
import { EmailTemplateRepository } from '~/server/repository/email-template-repository';
import { renderTemplateString } from '~/server/utils/email-templates';
import { buildTemplateContext } from '~/server/utils/template-context';
import { withErrorHandler } from '~/server/utils/error-handler';

/**
 * Render an email template against a referral and return the result.
 * Does not send or persist anything — used for the preview in the
 * "generate email" modal.
 */
export default defineEventHandler(
  withErrorHandler(async (event) => {
    const id = getRouterParam(event, 'id');
    if (!id) {
      throw createError({ statusCode: 400, message: 'Referral ID is required' });
    }

    const body = await readBody(event);
    const templateId = body?.templateId;
    if (!templateId) {
      throw createError({ statusCode: 400, message: 'Template ID is required' });
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

    const templateRepo = new EmailTemplateRepository(db);
    const template = await templateRepo.findById(parseInt(templateId));
    if (!template) {
      throw createError({ statusCode: 404, message: 'Template not found' });
    }

    const context = await buildTemplateContext(event, referral);
    const subject = await renderTemplateString(template.subject, context);
    const renderedBody = await renderTemplateString(template.body, context);

    return {
      success: true,
      subject,
      body: renderedBody,
      recipient: referral.email || '',
    };
  }, 'Preview Referral Email')
);
