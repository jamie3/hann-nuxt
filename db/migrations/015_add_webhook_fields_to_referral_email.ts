import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Add columns for bounce/spam data
  await db.schema
    .alterTable('referral_email')
    .addColumn('bounce_type', 'varchar(50)') // HardBounce, SoftBounce, etc.
    .addColumn('bounce_description', 'text')
    .execute();

  // Add columns for open/click data
  await db.schema
    .alterTable('referral_email')
    .addColumn('platform', 'varchar(50)') // Desktop, Mobile, WebMail, etc.
    .addColumn('user_agent', 'text')
    .addColumn('first_open', 'boolean')
    .addColumn('click_location', 'varchar(50)') // HTML, Text
    .addColumn('original_link', 'text')
    .execute();

  // Add webhook_data column for storing full webhook payload (OS, Client, Geo, etc.)
  await db.schema.alterTable('referral_email').addColumn('webhook_data', 'jsonb').execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('referral_email')
    .dropColumn('bounce_type')
    .dropColumn('bounce_description')
    .dropColumn('platform')
    .dropColumn('user_agent')
    .dropColumn('first_open')
    .dropColumn('click_location')
    .dropColumn('original_link')
    .dropColumn('webhook_data')
    .execute();
}
