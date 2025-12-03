import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('user')
    .addColumn('name', 'varchar(255)')
    .addColumn('locked', 'boolean', (col) => col.defaultTo(false).notNull())
    .addColumn('disabled', 'boolean', (col) => col.defaultTo(false).notNull())
    .addColumn('failed_login_attempts', 'integer', (col) => col.defaultTo(0).notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('user')
    .dropColumn('name')
    .dropColumn('locked')
    .dropColumn('disabled')
    .dropColumn('failed_login_attempts')
    .execute();
}
