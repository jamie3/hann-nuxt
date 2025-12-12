import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Add email_content column to store the email body
  await db.schema.alterTable('referral_email').addColumn('email_content', 'text').execute();

  // Add file_id column to reference the PDF file that was attached
  await db.schema
    .alterTable('referral_email')
    .addColumn('file_id', 'integer', (col) => col.references('file.id').onDelete('set null'))
    .execute();

  // Create index on file_id for faster lookups
  await db.schema
    .createIndex('referral_email_file_id_idx')
    .on('referral_email')
    .column('file_id')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('referral_email').dropColumn('file_id').execute();
  await db.schema.alterTable('referral_email').dropColumn('email_content').execute();
}
