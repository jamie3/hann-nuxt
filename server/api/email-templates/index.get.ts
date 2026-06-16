import { useDB } from '~/server/utils/db';
import { EmailTemplateRepository } from '~/server/repository/email-template-repository';
import { withErrorHandler } from '~/server/utils/error-handler';

/**
 * List all (non-deleted) email templates.
 * Readable by any authenticated user so staff can pick a template when
 * generating an email; creating/editing/deleting remains admin-only.
 */
export default defineEventHandler(
  withErrorHandler(async (event) => {
    const db = useDB();
    const repo = new EmailTemplateRepository(db);
    const templates = await repo.findAllTemplates();

    return {
      success: true,
      templates: templates.map((t) => ({
        id: t.id.toString(),
        public_id: t.public_id,
        name: t.name,
        description: t.description,
        subject: t.subject,
        body: t.body,
        created_by: t.created_by,
        created_at: t.created_at.toISOString(),
        updated_at: t.updated_at.toISOString(),
      })),
    };
  }, 'List Email Templates')
);
