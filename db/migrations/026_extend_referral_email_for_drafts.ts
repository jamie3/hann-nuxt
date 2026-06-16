import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('referral_email')
    // Template used to generate this email (null for system/automated emails)
    .addColumn('template_id', 'integer', (col) =>
      col.references('email_template.id').onDelete('set null')
    )
    // When the email is scheduled to be sent (status = 'scheduled')
    .addColumn('scheduled_at', 'timestamptz')
    // When the email was actually sent
    .addColumn('sent_at', 'timestamptz')
    // User who created the draft / triggered the send
    .addColumn('created_by', 'integer', (col) => col.references('user.id').onDelete('set null'))
    .execute();

  // Index to efficiently find due scheduled emails for the cron worker
  await db.schema
    .createIndex('referral_email_status_scheduled_at_idx')
    .on('referral_email')
    .columns(['status', 'scheduled_at'])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex('referral_email_status_scheduled_at_idx').execute();
  await db.schema.alterTable('referral_email').dropColumn('template_id').execute();
  await db.schema.alterTable('referral_email').dropColumn('scheduled_at').execute();
  await db.schema.alterTable('referral_email').dropColumn('sent_at').execute();
  await db.schema.alterTable('referral_email').dropColumn('created_by').execute();
}
