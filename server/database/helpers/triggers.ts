import { Kysely, sql } from 'kysely'

/**
 * Creates an updated_at trigger for a table that automatically updates
 * the updated_at column whenever a row is modified
 */
export async function createUpdatedAtTrigger(
  db: Kysely<any>,
  tableName: string
): Promise<void> {
  // Create the trigger function if it doesn't exist
  await sql`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ language 'plpgsql'
  `.execute(db)

  // Create the trigger for the specific table
  await sql`
    CREATE TRIGGER ${sql.raw(`update_${tableName}_updated_at`)}
    BEFORE UPDATE ON ${sql.table(tableName)}
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column()
  `.execute(db)
}

/**
 * Drops the updated_at trigger for a table
 */
export async function dropUpdatedAtTrigger(
  db: Kysely<any>,
  tableName: string
): Promise<void> {
  await sql`DROP TRIGGER IF EXISTS ${sql.raw(`update_${tableName}_updated_at`)} ON ${sql.table(tableName)}`.execute(db)
}

/**
 * Drops the update_updated_at_column function
 * Only call this if no tables are using it anymore
 */
export async function dropUpdatedAtFunction(db: Kysely<any>): Promise<void> {
  await sql`DROP FUNCTION IF EXISTS update_updated_at_column()`.execute(db)
}
