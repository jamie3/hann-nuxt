import type { H3Error } from 'h3';
import { logger } from '../lib/logger';

export default defineNitroErrorHandler((error: H3Error, event) => {
  // Log the full error details
  logger.error('Server error occurred:', {
    path: event.path,
    method: event.method,
    statusCode: error.statusCode,
    statusMessage: error.statusMessage,
    message: error.message,
    stack: error.stack,
  });

  // If it's a 500 error, hide details from client
  if (error.statusCode === 500 || !error.statusCode) {
    setResponseStatus(event, 500, 'Internal Server Error');
    return send(
      event,
      JSON.stringify({
        statusCode: 500,
        statusMessage: 'Internal Server Error',
        message: 'Internal Server Error',
      })
    );
  }

  // For other errors (400, 401, 403, 404, etc.), return as-is
  setResponseStatus(event, error.statusCode, error.statusMessage);
  return send(
    event,
    JSON.stringify({
      statusCode: error.statusCode,
      statusMessage: error.statusMessage,
      message: error.message || error.statusMessage,
    })
  );
});
