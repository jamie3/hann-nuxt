import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { config } from 'dotenv';
import * as readline from 'readline';
import { readFileSync } from 'fs';
import { join } from 'path';
import { migrateToLatest } from '../db/migrator';

// Parse command line arguments
const args = process.argv.slice(2);
const envIndex = args.indexOf('--env');
const envName = envIndex !== -1 && args[envIndex + 1] ? args[envIndex + 1] : 'development';

// Load environment variables from appropriate .env file
const envFile = envName === 'development' ? '.env' : `.env.${envName}`;
config({ path: envFile });

console.log(`Loading environment from: ${envFile}`);

function askConfirmation(question: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      const response = answer.toLowerCase().trim();
      resolve(response === 'yes' || response === 'y');
    });
  });
}

async function runMigrations() {
  const host = process.env.DATABASE_HOST || 'localhost';
  const port = parseInt(process.env.DATABASE_PORT || '5432');
  const database = process.env.DATABASE_NAME || 'hann';

  console.log('\n=== Database Migration ===');
  console.log(`Database Host: ${host}:${port}`);
  console.log(`Database Name: ${database}`);
  console.log('==========================\n');

  const confirmed = await askConfirmation(
    'Do you want to apply migrations to this database? (yes/no): '
  );

  if (!confirmed) {
    console.log('\n❌ Migration cancelled by user');
    process.exit(0);
  }

  console.log('\n✓ Confirmed. Running migrations...\n');

  // Configure SSL for test environment
  const poolConfig: any = {
    host,
    port,
    user: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || '',
    database,
  };

  // Add SSL configuration for test environment
  if (envName === 'test') {
    const caCertPath = join(process.cwd(), 'db', 'ca-certificate-test.crt');
    try {
      const ca = readFileSync(caCertPath, 'utf8');
      poolConfig.ssl = {
        rejectUnauthorized: true,
        ca: ca,
      };
      console.log('✓ Using SSL with CA certificate for test environment\n');
    } catch (error) {
      console.error('❌ Failed to read CA certificate:', error);
      process.exit(1);
    }
  }

  const db = new Kysely<any>({
    dialect: new PostgresDialect({
      pool: new Pool(poolConfig),
    }),
  });

  await migrateToLatest(db);
  console.log('\n✓ All migrations completed');
}

runMigrations().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
