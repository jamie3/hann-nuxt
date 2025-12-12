import { Kysely, sql } from 'kysely';
import { createUpdatedAtTrigger } from '../helpers/triggers';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('referral_email')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('referral_id', 'integer', (col) =>
      col.notNull().references('referral.id').onDelete('cascade')
    )
    .addColumn('from_email', 'varchar(255)', (col) => col.notNull())
    .addColumn('recipient_email', 'varchar(255)', (col) => col.notNull())
    .addColumn('message_id', 'varchar(255)', (col) => col.unique()) // Postmark MessageID
    .addColumn('status', 'varchar(50)', (col) => col.notNull().defaultTo('sent')) // sent, delivered, bounced, spam_complaint, opened, clicked
    .addColumn('record_type', 'varchar(50)') // Postmark RecordType
    .addColumn('tag', 'text') // Postmark Tag
    .addColumn('delivered_at', 'timestamptz')
    .addColumn('bounced_at', 'timestamptz')
    .addColumn('opened_at', 'timestamptz')
    .addColumn('clicked_at', 'timestamptz')
    .addColumn('spam_complaint_at', 'timestamptz')
    .addColumn('details', 'text') // Additional details from webhook
    .addColumn('metadata', 'jsonb') // Postmark Metadata
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute();

  // Create index on referral_id for faster lookups
  await db.schema
    .createIndex('referral_email_referral_id_idx')
    .on('referral_email')
    .column('referral_id')
    .execute();

  // Create index on message_id for webhook lookups
  await db.schema
    .createIndex('referral_email_message_id_idx')
    .on('referral_email')
    .column('message_id')
    .execute();

  // Create updated_at trigger
  await createUpdatedAtTrigger(db, 'referral_email');
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('referral_email').execute();
}
