import { useDB } from '~/server/utils/db';
import { EmailTemplateRepository } from '~/server/repository/email-template-repository';
import { withErrorHandler } from '~/server/utils/error-handler';

/**
 * Fetch a single email template by id. Readable by any authenticated user;
 * mutations remain admin-only.
 */
export default defineEventHandler(
  withErrorHandler(async (event) => {
    const id = getRouterParam(event, 'id');
    if (!id) {
      throw createError({ statusCode: 400, message: 'Template ID is required' });
    }

    const db = useDB();
    const repo = new EmailTemplateRepository(db);
    const template = await repo.findById(parseInt(id));

    if (!template) {
      throw createError({ statusCode: 404, message: 'Template not found' });
    }

    return {
      success: true,
      template: {
        id: template.id.toString(),
        public_id: template.public_id,
        name: template.name,
        description: template.description,
        subject: template.subject,
        body: template.body,
        created_by: template.created_by,
        created_at: template.created_at.toISOString(),
        updated_at: template.updated_at.toISOString(),
      },
    };
  }, 'Get Email Template')
);
