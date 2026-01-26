import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Change the default status from 'unassigned' back to 'new'
  await db.schema
    .alterTable('referral')
    .alterColumn('status', (col) => col.setDefault('new'))
    .execute();

  // Update existing referrals that have status 'unassigned'
  // Change their status to 'new'
  await db
    .updateTable('referral')
    .set({ status: 'new' })
    .where('status', '=', 'unassigned')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Revert new status back to unassigned for unassigned referrals
  await db
    .updateTable('referral')
    .set({ status: 'unassigned' })
    .where('status', '=', 'new')
    .where('assigned_to', 'is', null)
    .execute();

  // Change the default status back to 'unassigned'
  await db.schema
    .alterTable('referral')
    .alterColumn('status', (col) => col.setDefault('unassigned'))
    .execute();
}
