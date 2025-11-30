import { Kysely, sql } from 'kysely';

export async function createUpdatedAtTrigger(db: Kysely<any>, tableName: string): Promise<void> {
  // Create the function if it doesn't exist
  await sql`
    CREATE OR REPLACE FUNCTION set_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `.execute(db);

  // Create the trigger
  await sql`
    DROP TRIGGER IF EXISTS ${sql.raw(`${tableName}_updated_at`)} ON ${sql.table(tableName)};
  `.execute(db);

  await sql`
    CREATE TRIGGER ${sql.raw(`${tableName}_updated_at`)}
    BEFORE UPDATE ON ${sql.table(tableName)}
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
  `.execute(db);
}

export async function dropUpdatedAtTrigger(db: Kysely<any>, tableName: string): Promise<void> {
  await sql`DROP TRIGGER IF EXISTS ${sql.raw(`${tableName}_updated_at`)} ON ${sql.table(tableName)}`.execute(
    db
  );
}

export async function dropUpdatedAtFunction(db: Kysely<any>): Promise<void> {
  await sql`DROP FUNCTION IF EXISTS set_updated_at()`.execute(db);
}
