import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('email_template')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('public_id', 'uuid', (col) =>
      col
        .notNull()
        .unique()
        .defaultTo(sql`uuid_generate_v4()`)
    )
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('description', 'text')
    // Subject may itself contain Liquid variables, e.g. {{ referral.first_name }}
    .addColumn('subject', 'varchar(500)', (col) => col.notNull())
    // HTML body with Liquid variables, e.g. {{ referral.first_name }}
    .addColumn('body', 'text', (col) => col.notNull())
    .addColumn('created_by', 'integer', (col) => col.references('user.id').onDelete('set null'))
    // Soft delete (see requirement: deleting a template is a soft delete)
    .addColumn('is_deleted', 'boolean', (col) => col.defaultTo(false).notNull())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute();

  // Note: updated_at triggers were dropped app-wide in migration 021.
  // updated_at is maintained in application code (see BaseRepository.update).
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('email_template').execute();
}
