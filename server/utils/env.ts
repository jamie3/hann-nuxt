/**
 * Environment configuration utilities
 * Uses Zod for type-safe environment variable validation
 */

import { z } from 'zod';

const envSchema = z.object({
  // Postmark Configuration
  POSTMARK_WEBHOOK_API_KEY: z.string().default('5384883d-1ffd-41cd-95a7-b0900be2ba66'),
  POSTMARK_SERVER_API_TOKEN: z.string().optional(),

  // Email Configuration
  EMAIL_FROM: z.email().default('noreply@hannpsychologicalservices.com'),
  EMAIL_TO: z.email().default('info@hannpsychologicalservices.com'),

  // Security
  ENCRYPTION_KEY: z.string().optional(),
  NUXT_TURNSTILE_ENABLED: z
    .string()
    .optional()
    .default('true')
    .transform((val) => val === 'true'),

  // Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// Parse and validate environment variables
export const env = envSchema.parse({
  POSTMARK_WEBHOOK_API_KEY: process.env.POSTMARK_WEBHOOK_API_KEY,
  POSTMARK_SERVER_API_TOKEN: process.env.POSTMARK_SERVER_API_TOKEN,
  EMAIL_FROM: process.env.EMAIL_FROM,
  EMAIL_TO: process.env.EMAIL_TO,
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  NUXT_TURNSTILE_ENABLED: process.env.NUXT_TURNSTILE_ENABLED,
  NODE_ENV: process.env.NODE_ENV,
});

export type Env = z.infer<typeof envSchema>;
