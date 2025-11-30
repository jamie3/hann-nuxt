import { Kysely, sql } from 'kysely';
import { createUpdatedAtTrigger, dropUpdatedAtTrigger } from '../helpers/triggers';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('clinical_note')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`uuid_generate_v4()`))
    .addColumn('referral_id', 'uuid', (col) =>
      col.notNull().references('referral.id').onDelete('cascade')
    )
    .addColumn('note_date', 'date', (col) => col.notNull())
    .addColumn('content', 'text', (col) => col.notNull())
    .addColumn('author_id', 'uuid', (col) => col.references('user.id').onDelete('set null'))
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute();

  // Create index on referral_id for faster lookups
  await db.schema
    .createIndex('clinical_note_referral_id_idx')
    .on('clinical_note')
    .column('referral_id')
    .execute();

  // Create index on author_id for faster lookups
  await db.schema
    .createIndex('clinical_note_author_id_idx')
    .on('clinical_note')
    .column('author_id')
    .execute();

  // Create updated_at trigger
  await createUpdatedAtTrigger(db, 'clinical_note');
}

export async function down(db: Kysely<any>): Promise<void> {
  await dropUpdatedAtTrigger(db, 'clinical_note');
  await db.schema.dropTable('clinical_note').execute();
}
