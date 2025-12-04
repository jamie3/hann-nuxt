import { logger } from '../lib/logger';

export default defineEventHandler(async (event) => {
  const url = event.node.req.url || '';

  // Only apply to API routes
  if (!url.startsWith('/api')) {
    return;
  }

  // Public API routes that don't require authentication
  const publicApiRoutes = [
    '/api/auth/login',
    '/api/auth/logout',
    '/api/referral/self',
    '/api/referral/professional',
    '/api/health',
  ];

  // Check if the current route is public
  const isPublicRoute = publicApiRoutes.some((route) => url.startsWith(route));

  if (isPublicRoute) {
    return;
  }

  // Check authentication
  const session = await getUserSession(event);

  if (!session || !session.user) {
    logger.warn('Unauthorized API access attempt', {
      url,
      sourceIp:
        event.node.req.headers['x-forwarded-for'] ||
        event.node.req.headers['x-real-ip'] ||
        event.node.req.socket.remoteAddress,
    });

    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'You must be logged in to access this resource',
    });
  }

  // User is authenticated, allow the request to continue
});
