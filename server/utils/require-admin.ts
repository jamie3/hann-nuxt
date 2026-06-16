import type { H3Event } from 'h3';
import { useDB } from './db';
import { logger } from '../lib/logger';

export const ADMIN_ROLE = 'admin';

/**
 * Check whether a user has a given role.
 */
export async function userHasRole(userId: number, role: string): Promise<boolean> {
  const db = useDB();
  const match = await db
    .selectFrom('user_role')
    .select('id')
    .where('user_id', '=', userId)
    .where('role', '=', role)
    .executeTakeFirst();

  return !!match;
}

/**
 * Ensure the current session belongs to an authenticated admin user.
 *
 * Throws 401 if there is no session and 403 if the user is not an admin.
 * Returns the session user on success.
 */
export async function requireAdmin(event: H3Event) {
  const session = await getUserSession(event);

  if (!session || !session.user) {
    throw createError({
      statusCode: 401,
      message: 'You must be logged in to access this resource',
    });
  }

  const userId = (session.user as { id: number }).id;
  const isAdmin = await userHasRole(userId, ADMIN_ROLE);

  if (!isAdmin) {
    logger.warn('Forbidden admin access attempt', {
      userId,
      url: event.node.req.url,
    });

    throw createError({
      statusCode: 403,
      message: 'You do not have permission to perform this action',
    });
  }

  return session.user;
}
