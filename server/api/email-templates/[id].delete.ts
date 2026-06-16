import { useDB } from '~/server/utils/db';
import { requireAdmin } from '~/server/utils/require-admin';
import { EmailTemplateRepository } from '~/server/repository/email-template-repository';
import { withErrorHandler } from '~/server/utils/error-handler';

/**
 * Admin: soft-delete an email template.
 */
export default defineEventHandler(
  withErrorHandler(async (event) => {
    await requireAdmin(event);

    const id = getRouterParam(event, 'id');
    if (!id) {
      throw createError({ statusCode: 400, message: 'Template ID is required' });
    }

    const db = useDB();
    const repo = new EmailTemplateRepository(db);

    const existing = await repo.findById(parseInt(id));
    if (!existing) {
      throw createError({ statusCode: 404, message: 'Template not found' });
    }

    await repo.delete(id);

    return { success: true };
  }, 'Delete Email Template')
);
