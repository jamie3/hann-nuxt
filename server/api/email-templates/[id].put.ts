import { useDB } from '~/server/utils/db';
import { requireAdmin } from '~/server/utils/require-admin';
import { EmailTemplateRepository } from '~/server/repository/email-template-repository';
import { withErrorHandler } from '~/server/utils/error-handler';

/**
 * Admin: update an existing email template.
 */
export default defineEventHandler(
  withErrorHandler(async (event) => {
    await requireAdmin(event);

    const id = getRouterParam(event, 'id');
    if (!id) {
      throw createError({ statusCode: 400, message: 'Template ID is required' });
    }

    const body = await readBody(event);
    const name = body?.name?.trim();
    const subject = body?.subject?.trim();
    const templateBody = body?.body;

    if (!name || !subject || !templateBody) {
      throw createError({
        statusCode: 400,
        message: 'Name, subject, and body are required',
      });
    }

    const db = useDB();
    const repo = new EmailTemplateRepository(db);

    const existing = await repo.findById(parseInt(id));
    if (!existing) {
      throw createError({ statusCode: 404, message: 'Template not found' });
    }

    const template = await repo.update(id, {
      name,
      description: body?.description?.trim() || null,
      subject,
      body: templateBody,
    });

    return {
      success: true,
      template: {
        id: template.id.toString(),
        public_id: template.public_id,
        name: template.name,
        description: template.description,
        subject: template.subject,
        body: template.body,
        created_at: template.created_at.toISOString(),
        updated_at: template.updated_at.toISOString(),
      },
    };
  }, 'Update Email Template')
);
