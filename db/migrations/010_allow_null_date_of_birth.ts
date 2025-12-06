import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Allow date_of_birth to be null
  await sql`ALTER TABLE referral ALTER COLUMN date_of_birth DROP NOT NULL`.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  // Revert to not null (this will fail if there are null values)
  await sql`ALTER TABLE referral ALTER COLUMN date_of_birth SET NOT NULL`.execute(db);
}
