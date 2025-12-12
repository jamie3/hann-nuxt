import { Kysely, sql } from 'kysely';
import { createUpdatedAtTrigger } from '../helpers/triggers';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('user_role')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('user_id', 'integer', (col) =>
      col.notNull().references('user.id').onDelete('cascade')
    )
    .addColumn('role', 'text', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute();

  // Create unique constraint to prevent duplicate user-role combinations
  await db.schema
    .createIndex('user_role_user_id_role_unique')
    .on('user_role')
    .columns(['user_id', 'role'])
    .unique()
    .execute();

  // Create updated_at trigger
  await createUpdatedAtTrigger(db, 'user_role');
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('user_role').execute();
}
