import { Kysely, sql } from 'kysely';
import { createUpdatedAtTrigger, dropUpdatedAtTrigger } from '../helpers/triggers';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('referral')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`uuid_generate_v4()`))
    .addColumn('first_name', 'varchar(255)', (col) => col.notNull())
    .addColumn('last_name', 'varchar(255)', (col) => col.notNull())
    .addColumn('date_of_birth', 'date', (col) => col.notNull())
    .addColumn('parents_guardians', 'varchar(255)')
    .addColumn('primary_telephone', 'varchar(50)', (col) => col.notNull())
    .addColumn('secondary_telephone', 'varchar(50)')
    .addColumn('email', 'varchar(255)')
    .addColumn('mailing_address', 'text')
    .addColumn('referrer_name', 'varchar(255)')
    .addColumn('referrer_relationship', 'varchar(255)')
    .addColumn('referrer_email', 'varchar(255)')
    .addColumn('requested_service', 'varchar(100)', (col) => col.notNull())
    .addColumn('presenting_issues', 'text')
    .addColumn('method_of_payment', 'varchar(100)')
    .addColumn('referrer_prefers_contact', 'boolean')
    .addColumn('referral_type', 'varchar(20)', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute();

  // Create updated_at trigger
  await createUpdatedAtTrigger(db, 'referral');
}

export async function down(db: Kysely<any>): Promise<void> {
  await dropUpdatedAtTrigger(db, 'referral');
  await db.schema.dropTable('referral').execute();
}
