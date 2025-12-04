import { Kysely, sql } from 'kysely';
import { createUpdatedAtTrigger, dropUpdatedAtTrigger } from '../helpers/triggers';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('file')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('public_id', 'uuid', (col) =>
      col
        .notNull()
        .unique()
        .defaultTo(sql`uuid_generate_v4()`)
    )
    .addColumn('referral_id', 'integer', (col) =>
      col.notNull().references('referral.id').onDelete('cascade')
    )
    .addColumn('file_name', 'varchar(255)', (col) => col.notNull())
    .addColumn('file_size', 'bigint', (col) => col.notNull())
    .addColumn('mime_type', 'varchar(100)', (col) => col.notNull())
    .addColumn('file_data', 'bytea', (col) => col.notNull())
    .addColumn('uploaded_by', 'integer', (col) => col.references('user.id').onDelete('set null'))
    .addColumn('is_deleted', 'boolean', (col) => col.defaultTo(false).notNull())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute();

  // Create updated_at trigger
  await createUpdatedAtTrigger(db, 'file');

  // Create index on referral_id for faster lookups
  await db.schema.createIndex('file_referral_id_idx').on('file').column('referral_id').execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex('file_referral_id_idx').execute();
  await dropUpdatedAtTrigger(db, 'file');
  await db.schema.dropTable('file').execute();
}
