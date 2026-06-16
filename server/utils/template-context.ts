import type { H3Event } from 'h3';
import { useDB } from './db';

/**
 * Build the data context used to render email templates (Liquid).
 *
 * Exposes:
 *   - referral.*  — the referral the email is about
 *   - user.name / user.email — the currently logged-in user (the sender)
 *
 * The user's email isn't stored on the session, so it's looked up from the
 * database by the session user id.
 */
export async function buildTemplateContext(event: H3Event, referral: any) {
  const session = await getUserSession(event);
  const userId = (session?.user as { id?: number | string } | undefined)?.id;

  let user: { name: string | null; email: string | null } = { name: null, email: null };

  if (userId != null) {
    const row = await useDB()
      .selectFrom('user')
      .select(['name', 'email'])
      .where('id', '=', parseInt(String(userId), 10))
      .executeTakeFirst();

    if (row) {
      user = { name: row.name ?? null, email: row.email ?? null };
    }
  }

  return { referral, user };
}
