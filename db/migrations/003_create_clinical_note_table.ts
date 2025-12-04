import { Kysely, sql } from 'kysely';
import { createUpdatedAtTrigger, dropUpdatedAtTrigger } from '../helpers/triggers';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('clinical_note')
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
    .addColumn('session_date', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn('content', 'text', (col) => col.notNull())
    .addColumn('author_id', 'integer', (col) => col.references('user.id').onDelete('set null'))
    .addColumn('is_deleted', 'boolean', (col) => col.defaultTo(false).notNull())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute();

  // Create updated_at trigger
  await createUpdatedAtTrigger(db, 'clinical_note');
}

export async function down(db: Kysely<any>): Promise<void> {
  await dropUpdatedAtTrigger(db, 'clinical_note');
  await db.schema.dropTable('clinical_note').execute();
}
