import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Add subject column to store email subject line
  await db.schema.alterTable('referral_email').addColumn('subject', 'text').execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('referral_email').dropColumn('subject').execute();
}
