import { H3Event, H3Error } from 'h3';
import { logger } from '../lib/logger';

/**
 * Handles errors in API routes:
 * - Logs full error details server-side
 * - Returns generic message for 500 errors to client
 * - Passes through other error types (400, 401, 404, etc.)
 */
export function handleApiError(error: any, event: H3Event, context?: string): never {
  const statusCode = error.statusCode || error.status || 500;

  // Log full error details
  logger.error('API Error occurred:', {
    context: context || 'Unknown',
    path: event.path,
    method: event.method,
    statusCode,
    message: error.message,
    stack: error.stack,
    data: error.data,
  });

  // For 500 errors, return generic message
  if (statusCode >= 500) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Internal Server Error',
    });
  }

  // For other errors (400, 401, 403, 404), pass through
  throw createError({
    statusCode,
    statusMessage: error.statusMessage || error.message,
    message: error.message,
    data: error.data,
  });
}

/**
 * Wraps an async handler function with error handling
 * Usage: export default defineEventHandler(withErrorHandler(async (event) => { ... }))
 */
export function withErrorHandler<T>(handler: (event: H3Event) => Promise<T>, context?: string) {
  return async (event: H3Event): Promise<T> => {
    try {
      return await handler(event);
    } catch (error: any) {
      handleApiError(error, event, context);
    }
  };
}
