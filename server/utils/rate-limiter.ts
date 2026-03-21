import type { H3Event } from 'h3';
import { logger } from '../lib/logger';

interface RateLimitEntry {
  timestamps: number[];
}

// In-memory store: key -> sliding-window timestamps
const store = new Map<string, RateLimitEntry>();

// Purge entries older than 1 hour every 10 minutes to prevent unbounded growth
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000;
const CLEANUP_AGE_MS = 60 * 60 * 1000;

setInterval(() => {
  const cutoff = Date.now() - CLEANUP_AGE_MS;
  for (const [key, entry] of store.entries()) {
    entry.timestamps = entry.timestamps.filter((t) => t > cutoff);
    if (entry.timestamps.length === 0) {
      store.delete(key);
    }
  }
}, CLEANUP_INTERVAL_MS);

/**
 * Resolve the best available client IP from the H3 event.
 */
function getClientIp(event: H3Event): string {
  const req = event.node.req;
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return (Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0]).trim();
  }
  return (req.headers['x-real-ip'] as string | undefined) || req.socket?.remoteAddress || 'unknown';
}

/**
 * Apply a sliding-window rate limit to the current request.
 *
 * @param event   - H3 event
 * @param options.max      - maximum number of requests allowed in the window
 * @param options.windowMs - window size in milliseconds
 * @param options.keyPrefix - prefix to namespace different limits
 *
 * Throws a 429 error when the limit is exceeded.
 */
export function rateLimit(
  event: H3Event,
  options: { max: number; windowMs: number; keyPrefix?: string }
): void {
  const { max, windowMs, keyPrefix = 'rl' } = options;
  const ip = getClientIp(event);
  const key = `${keyPrefix}:${ip}`;
  const now = Date.now();
  const windowStart = now - windowMs;

  let entry = store.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  // Discard timestamps outside the current window
  entry.timestamps = entry.timestamps.filter((t) => t > windowStart);

  if (entry.timestamps.length >= max) {
    logger.warn('Rate limit exceeded', { ip, key, count: entry.timestamps.length, max });
    throw createError({
      statusCode: 429,
      statusMessage: 'Too Many Requests',
      message: 'Too many requests. Please wait a moment before trying again.',
    });
  }

  entry.timestamps.push(now);
}
