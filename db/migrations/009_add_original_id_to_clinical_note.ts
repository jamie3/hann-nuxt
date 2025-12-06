import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Add original_id column to clinical_note table
  await db.schema
    .alterTable('clinical_note')
    .addColumn('original_id', 'bigint', (col) => col.unique())
    .execute();

  // Add index for faster lookups
  await db.schema
    .createIndex('clinical_note_original_id_idx')
    .on('clinical_note')
    .column('original_id')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Drop index
  await db.schema.dropIndex('clinical_note_original_id_idx').execute();

  // Drop column
  await db.schema.alterTable('clinical_note').dropColumn('original_id').execute();
}
