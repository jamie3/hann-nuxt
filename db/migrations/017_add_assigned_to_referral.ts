import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Add assigned_to column to referral table
  await db.schema
    .alterTable('referral')
    .addColumn('assigned_to', 'integer', (col) => col.references('user.id').onDelete('set null'))
    .execute();

  // Create index for faster lookups
  await db.schema
    .createIndex('referral_assigned_to_idx')
    .on('referral')
    .column('assigned_to')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('referral').dropColumn('assigned_to').execute();
}
