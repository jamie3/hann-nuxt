import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('referral').addColumn('gender', 'varchar(50)').execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('referral').dropColumn('gender').execute();
}
