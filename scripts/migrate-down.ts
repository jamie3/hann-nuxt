import { Kysely, PostgresDialect, Migrator, FileMigrationProvider } from 'kysely';
import { Pool } from 'pg';
import { promises as fs } from 'fs';
import path from 'path';
import { config } from 'dotenv';
import { readFileSync } from 'fs';

// Parse command line arguments
const args = process.argv.slice(2);
const envIndex = args.indexOf('--env');
const envName = envIndex !== -1 && args[envIndex + 1] ? args[envIndex + 1] : 'development';

// Load environment variables from appropriate .env file
const envFile = envName === 'development' ? '.env' : `.env.${envName}`;
config({ path: envFile });

console.log(`Loading environment from: ${envFile}`);

async function migrateDown() {
  const host = process.env.DATABASE_HOST || 'localhost';
  const port = parseInt(process.env.DATABASE_PORT || '5432');
  const database = process.env.DATABASE_NAME || 'hann';

  console.log('\n=== Database Migration Down ===');
  console.log(`Database Host: ${host}:${port}`);
  console.log(`Database Name: ${database}`);
  console.log('================================\n');

  // Configure SSL for test environment
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
    const caCertPath = path.join(process.cwd(), 'db', certFileName);
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

  const db = new Kysely<any>({
    dialect: new PostgresDialect({
      pool: new Pool(poolConfig),
    }),
  });

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(process.cwd(), 'db/migrations'),
    }),
  });

  const { error, results } = await migrator.migrateDown();

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`✓ Migration "${it.migrationName}" was reverted successfully`);
    } else if (it.status === 'Error') {
      console.error(`✗ Failed to revert migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error('❌ Failed to migrate down');
    console.error(error);
    await db.destroy();
    process.exit(1);
  }

  await db.destroy();
  console.log('\n✅ Migration down complete');
}

migrateDown().catch((error) => {
  console.error('Migration down failed:', error);
  process.exit(1);
});
