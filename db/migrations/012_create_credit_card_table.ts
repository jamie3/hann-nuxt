import { Kysely, sql } from 'kysely';
import { createUpdatedAtTrigger } from '../helpers/triggers';

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

  // Create updated_at trigger
  await createUpdatedAtTrigger(db, 'credit_card');
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('credit_card').execute();
}
