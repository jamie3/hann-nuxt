import { logger } from '../lib/logger';

export default defineEventHandler((event) => {
  const startTime = Date.now();
  const method = event.node.req.method;
  const url = event.node.req.url;

  // Log incoming request
  logger.info('Incoming request', {
    method,
    url,
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
