import { Kysely, sql } from 'kysely';
import {
  createUpdatedAtTrigger,
  dropUpdatedAtTrigger,
  dropUpdatedAtFunction,
} from '../helpers/triggers';

export async function up(db: Kysely<any>): Promise<void> {
  // Enable uuid-ossp extension
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`.execute(db);

  await db.schema
    .createTable('user')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('public_id', 'uuid', (col) =>
      col
        .notNull()
        .unique()
        .defaultTo(sql`uuid_generate_v4()`)
    )
    .addColumn('username', 'varchar(255)', (col) => col.notNull().unique())
    .addColumn('password', 'varchar(255)', (col) => col.notNull())
    .addColumn('last_login_at', 'timestamptz')
    .addColumn('is_deleted', 'boolean', (col) => col.defaultTo(false).notNull())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute();

  // Create updated_at trigger
  await createUpdatedAtTrigger(db, 'user');
}

export async function down(db: Kysely<any>): Promise<void> {
  await dropUpdatedAtTrigger(db, 'user');
  await dropUpdatedAtFunction(db);
  await db.schema.dropTable('user').execute();
}
