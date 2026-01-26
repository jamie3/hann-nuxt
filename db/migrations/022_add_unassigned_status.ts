import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Change the default status from 'new' to 'unassigned'
  await db.schema
    .alterTable('referral')
    .alterColumn('status', (col) => col.setDefault('unassigned'))
    .execute();

  // Update existing referrals that have status 'new' and are not assigned to anyone
  // Change their status to 'unassigned'
  await db
    .updateTable('referral')
    .set({ status: 'unassigned' })
    .where('status', '=', 'new')
    .where('assigned_to', 'is', null)
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Revert unassigned status back to new
  await db
    .updateTable('referral')
    .set({ status: 'new' })
    .where('status', '=', 'unassigned')
    .execute();

  // Change the default status back to 'new'
  await db.schema
    .alterTable('referral')
    .alterColumn('status', (col) => col.setDefault('new'))
    .execute();
}
