import crypto from 'crypto';
import { logger } from '../lib/logger';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 64;

/**
 * Get encryption key from environment variable
 * Falls back to a default key for development (NOT for production!)
 */
function getEncryptionKey(): string {
  const key = process.env.ENCRYPTION_KEY;

  if (!key) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('ENCRYPTION_KEY environment variable must be set in production');
    }
    // Development fallback - DO NOT use in production
    logger.warn('Using default encryption key. Set ENCRYPTION_KEY in .env for production');
    return 'dev-default-key-32-chars-long!!';
  }

  return key;
}

/**
 * Derive a key from the encryption key using PBKDF2
 */
function deriveKey(salt: Buffer): Buffer {
  const encryptionKey = getEncryptionKey();
  return crypto.pbkdf2Sync(encryptionKey, salt, 100000, 32, 'sha256');
}

/**
 * Encrypt a string value
 * @param text - The plaintext to encrypt
 * @returns The encrypted value in format: salt:iv:authTag:encryptedData (all base64)
 */
export function encrypt(text: string): string {
  const salt = crypto.randomBytes(SALT_LENGTH);
  const key = deriveKey(salt);
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  const authTag = cipher.getAuthTag();

  // Return format: salt:iv:authTag:encryptedData
  return `${salt.toString('base64')}:${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted}`;
}

/**
 * Decrypt an encrypted string value
 * @param encryptedText - The encrypted value in format: salt:iv:authTag:encryptedData
 * @returns The decrypted plaintext
 */
export function decrypt(encryptedText: string): string {
  const parts = encryptedText.split(':');

  if (parts.length !== 4) {
    throw new Error('Invalid encrypted data format');
  }

  const salt = Buffer.from(parts[0], 'base64');
  const iv = Buffer.from(parts[1], 'base64');
  const authTag = Buffer.from(parts[2], 'base64');
  const encrypted = parts[3];

  const key = deriveKey(salt);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Mask a credit card number for display (show last 4 digits only)
 * @param cardNumber - The full card number
 * @returns Masked card number (e.g., "**** **** **** 1234")
 */
export function maskCardNumber(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (cleaned.length < 4) {
    return '****';
  }
  const lastFour = cleaned.slice(-4);
  return `**** **** **** ${lastFour}`;
}
