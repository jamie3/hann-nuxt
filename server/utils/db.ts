import { Kysely, PostgresDialect, Generated } from 'kysely';
import { Pool } from 'pg';
import { DB } from '../types/database-types';

let db: Kysely<DB> | null = null;

export const useDB = () => {
  if (!db) {
    const config = useRuntimeConfig();

    // Build pool configuration
    const poolConfig: any = {
      host: config.database.host,
      port: config.database.port,
      user: config.database.user,
      password: config.database.password,
      database: config.database.name,
      max: 10,
    };

    // Add SSL configuration if CA certificate is provided
    if (config.database.caCertificate) {
      poolConfig.ssl = {
        rejectUnauthorized: true,
        ca: config.database.caCertificate,
      };
    }

    db = new Kysely<DB>({
      dialect: new PostgresDialect({
        pool: new Pool(poolConfig),
      }),
    });
  }

  return db;
};
