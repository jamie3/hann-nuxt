import { logger } from '../lib/logger';

export default defineEventHandler((event) => {
  const startTime = Date.now();
  const method = event.node.req.method;
  const url = event.node.req.url;

  // Get client IP address (considering proxies)
  const forwardedFor = event.node.req.headers['x-forwarded-for'];
  const realIp = event.node.req.headers['x-real-ip'];
  const sourceIp =
    (typeof forwardedFor === 'string' ? forwardedFor.split(',')[0] : null) ||
    (typeof realIp === 'string' ? realIp : null) ||
    event.node.req.socket.remoteAddress ||
    'unknown';

  // Log incoming request
  logger.info('Incoming request', {
    method,
    url,
    sourceIp,
    headers: {
      userAgent: event.node.req.headers['user-agent'],
      contentType: event.node.req.headers['content-type'],
    },
  });

  // Hook into response to log completion
  event.node.res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusCode = event.node.res.statusCode;

    const logData = {
      method,
      url,
      sourceIp,
      statusCode,
      duration: `${duration}ms`,
    };

    // Log based on status code
    if (statusCode >= 500) {
      logger.error('Request failed with server error', logData);
    } else if (statusCode >= 400) {
      logger.warn('Request failed with client error', logData);
    } else {
      logger.info('Request completed', logData);
    }
  });
});
