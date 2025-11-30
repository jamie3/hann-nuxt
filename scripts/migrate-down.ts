import { Kysely, PostgresDialect, Migrator, FileMigrationProvider } from 'kysely';
import { Pool } from 'pg';
import { promises as fs } from 'fs';
import path from 'path';

async function migrateDown() {
  console.log('Running database migration down...\n');

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
