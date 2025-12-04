import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Change date_of_birth from date to timestamptz
  await db.schema
    .alterTable('referral')
    .alterColumn('date_of_birth', (col) => col.setDataType('timestamptz'))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Revert date_of_birth from timestamptz back to date
  await db.schema
    .alterTable('referral')
    .alterColumn('date_of_birth', (col) => col.setDataType('date'))
    .execute();
}
