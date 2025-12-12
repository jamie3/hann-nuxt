import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Rename mailing_address to address_1
  await db.schema.alterTable('referral').renameColumn('mailing_address', 'address_1').execute();

  // Add new address fields
  await db.schema
    .alterTable('referral')
    .addColumn('address_2', 'text')
    .addColumn('city', 'text')
    .addColumn('province_state', 'text')
    .addColumn('country', 'text')
    .addColumn('postal_zip', 'text')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Drop new columns
  await db.schema
    .alterTable('referral')
    .dropColumn('address_2')
    .dropColumn('city')
    .dropColumn('province_state')
    .dropColumn('country')
    .dropColumn('postal_zip')
    .execute();

  // Rename address_1 back to mailing_address
  await db.schema.alterTable('referral').renameColumn('address_1', 'mailing_address').execute();
}
