import { Kysely, PostgresDialect, Generated } from 'kysely';
import { Pool } from 'pg';
import { Database } from '../types/database-types';

let db: Kysely<Database> | null = null;

export const useDB = () => {
  if (!db) {
    const config = useRuntimeConfig();

    db = new Kysely<Database>({
      dialect: new PostgresDialect({
        pool: new Pool({
          host: config.database.host,
          port: config.database.port,
          user: config.database.user,
          password: config.database.password,
          database: config.database.name,
          max: 10,
        }),
      }),
    });
  }

  return db;
};
