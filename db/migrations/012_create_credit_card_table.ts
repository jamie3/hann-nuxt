import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('credit_card')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('referral_id', 'integer', (col) =>
      col.notNull().references('referral.id').onDelete('cascade')
    )
    .addColumn('card_number_encrypted', 'text', (col) => col.notNull()) // Encrypted
    .addColumn('expiry_encrypted', 'text', (col) => col.notNull()) // Encrypted
    .addColumn('cvv_encrypted', 'text', (col) => col.notNull()) // Encrypted
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute();

  // Create index on referral_id for faster lookups
  await db.schema
    .createIndex('credit_card_referral_id_idx')
    .on('credit_card')
    .column('referral_id')
    .execute();

  // Create trigger for updated_at
  await sql`
    CREATE TRIGGER update_credit_card_updated_at
    BEFORE UPDATE ON credit_card
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('credit_card').execute();
}
