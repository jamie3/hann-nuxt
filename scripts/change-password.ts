import bcrypt from 'bcrypt';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as readline from 'readline';
import type { DB } from '../server/types/database-types';

// Parse command line arguments
const args = process.argv.slice(2);
const envIndex = args.indexOf('--env');
const envName = envIndex !== -1 && args[envIndex + 1] ? args[envIndex + 1] : 'development';

// Load environment variables from appropriate .env file
const envFile = envName === 'development' ? '.env' : `.env.${envName}`;
config({ path: envFile });

console.log(`Loading environment from: ${envFile}\n`);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function questionHidden(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    const stdout = process.stdout;

    stdout.write(prompt);

    // Disable echo
    if ((stdin as any).setRawMode) {
      (stdin as any).setRawMode(true);
    }

    let password = '';
    const onData = (char: Buffer) => {
      const c = char.toString('utf8');

      switch (c) {
        case '\n':
        case '\r':
        case '\u0004':
          // Enter or Ctrl+D
          stdin.removeListener('data', onData);
          if ((stdin as any).setRawMode) {
            (stdin as any).setRawMode(false);
          }
          stdout.write('\n');
          resolve(password);
          break;
        case '\u0003':
          // Ctrl+C
          process.exit();
          break;
        case '\u007f':
        case '\b':
          // Backspace
          if (password.length > 0) {
            password = password.slice(0, -1);
            stdout.clearLine(0);
            stdout.cursorTo(0);
            stdout.write(prompt + '*'.repeat(password.length));
          }
          break;
        default:
          password += c;
          stdout.write('*');
          break;
      }
    };

    stdin.on('data', onData);
    stdin.resume();
  });
}

async function changePassword() {
  const host = process.env.DATABASE_HOST || 'localhost';
  const port = parseInt(process.env.DATABASE_PORT || '5432');
  const database = process.env.DATABASE_NAME || 'hann';

  console.log('=== Database Connection ===');
  console.log(`Database Host: ${host}:${port}`);
  console.log(`Database Name: ${database}`);
  console.log('===========================\n');

  // Configure database connection
  const poolConfig: any = {
    host,
    port,
    user: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || '',
    database,
  };

  // Add SSL configuration for test and production environments
  if (envName === 'test' || envName === 'production') {
    const certFileName =
      envName === 'test' ? 'ca-certificate-test.crt' : 'ca-certificate-production.crt';
    const caCertPath = join(process.cwd(), 'db', certFileName);
    try {
      const ca = readFileSync(caCertPath, 'utf8');
      poolConfig.ssl = {
        rejectUnauthorized: true,
        ca: ca,
      };
      console.log(`✓ Using SSL with CA certificate for ${envName} environment\n`);
    } catch (error) {
      console.error(`❌ Failed to read CA certificate from ${caCertPath}:`, error);
      process.exit(1);
    }
  }

  const db = new Kysely<DB>({
    dialect: new PostgresDialect({
      pool: new Pool(poolConfig),
    }),
  });

  try {
    const username = await question('Enter username: ');

    // Check if user exists
    const user = await db
      .selectFrom('user')
      .selectAll()
      .where('username', '=', username)
      .where('is_deleted', '=', false)
      .executeTakeFirst();

    if (!user) {
      console.error('\n✗ Error: User not found');
      return;
    }

    console.log(`\nFound user: ${user.username} (ID: ${user.id})`);

    const newPassword = await questionHidden('Enter new password: ');
    const confirmPassword = await questionHidden('Confirm new password: ');

    if (newPassword !== confirmPassword) {
      console.error('\n✗ Error: Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      console.error('\n✗ Error: Password must be at least 6 characters long');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and reset failed login attempts
    await db
      .updateTable('user')
      .set({
        password: hashedPassword,
        failed_login_attempts: 0,
        locked: false,
        updated_at: new Date(),
      })
      .where('id', '=', user.id)
      .execute();

    console.log('\n✓ Password changed successfully');
    console.log('  - Password updated');
    console.log('  - Failed login attempts reset to 0');
    console.log('  - Account unlocked (if it was locked)');
  } catch (error: any) {
    console.error('\n✗ Error changing password:', error.message);
  } finally {
    await db.destroy();
    rl.close();
  }
}

changePassword();
