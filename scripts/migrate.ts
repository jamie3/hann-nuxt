import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { migrateToLatest } from '../db/migrator';

async function runMigrations() {
  console.log('Running database migrations...\n');

  const db = new Kysely<any>({
    dialect: new PostgresDialect({
      pool: new Pool({
        host: process.env.DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DATABASE_PORT || '5432'),
        user: process.env.DATABASE_USER || 'postgres',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'hann',
      }),
    }),
  });

  await migrateToLatest(db);
  console.log('\n✓ All migrations completed');
}

runMigrations().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
