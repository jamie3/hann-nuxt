import { useDB } from '~/server/utils/db';
import { requireAdmin } from '~/server/utils/require-admin';
import { EmailTemplateRepository } from '~/server/repository/email-template-repository';
import { withErrorHandler } from '~/server/utils/error-handler';

/**
 * Admin: create a new email template.
 */
export default defineEventHandler(
  withErrorHandler(async (event) => {
    const user = await requireAdmin(event);

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

    const template = await repo.create({
      name,
      description: body?.description?.trim() || null,
      subject,
      body: templateBody,
      created_by: (user as { id: number }).id,
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
  }, 'Create Email Template')
);
