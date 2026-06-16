import { Kysely, PostgresDialect } from 'kysely';
import type { Generated } from 'kysely';
import { Pool } from 'pg';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as readline from 'readline';

// Parse command line arguments
const args = process.argv.slice(2);
const envIndex = args.indexOf('--env');
const envName = envIndex !== -1 && args[envIndex + 1] ? args[envIndex + 1] : 'development';

// Load environment variables from appropriate .env file
const envFile = envName === 'development' ? '.env' : `.env.${envName}`;
config({ path: envFile });

console.log(`Loading environment from: ${envFile}\n`);

interface Database {
  user: {
    id: Generated<number>;
    username: string;
  };
  user_role: {
    id: Generated<number>;
    user_id: number;
    role: string;
    created_at: Generated<Date>;
    updated_at: Generated<Date>;
  };
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function grantRole() {
  const host = process.env.DATABASE_HOST || 'localhost';
  const port = parseInt(process.env.DATABASE_PORT || '5432');
  const database = process.env.DATABASE_NAME || 'hann';

  console.log('=== Database Connection ===');
  console.log(`Database Host: ${host}:${port}`);
  console.log(`Database Name: ${database}`);
  console.log('===========================\n');

  // Configure database connection
  const poolConfig: any = {
    host,
    port,
    user: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || '',
    database,
  };

  // Add SSL configuration for test and production environments
  if (envName === 'test' || envName === 'production') {
    const certFileName =
      envName === 'test' ? 'ca-certificate-test.crt' : 'ca-certificate-production.crt';
    const caCertPath = join(process.cwd(), 'db', certFileName);
    try {
      const ca = readFileSync(caCertPath, 'utf8');
      poolConfig.ssl = {
        rejectUnauthorized: true,
        ca: ca,
      };
      console.log(`✓ Using SSL with CA certificate for ${envName} environment\n`);
    } catch (error) {
      console.error(`❌ Failed to read CA certificate from ${caCertPath}:`, error);
      process.exit(1);
    }
  }

  const db = new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool(poolConfig),
    }),
  });

  try {
    const username = await question('Enter username: ');
    const roleInput = await question('Enter role [admin]: ');
    const role = roleInput.trim() || 'admin';

    // Look up the user
    const user = await db
      .selectFrom('user')
      .select(['id', 'username'])
      .where('username', '=', username)
      .executeTakeFirst();

    if (!user) {
      console.error(`\n✗ Error: No user found with username "${username}"`);
      return;
    }

    // Insert the role (unique constraint on user_id + role prevents duplicates)
    const result = await db
      .insertInto('user_role')
      .values({
        user_id: user.id,
        role,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    console.log('\n✓ Role granted successfully:');
    console.log(`  User: ${user.username} (ID: ${user.id})`);
    console.log(`  Role: ${result.role}`);
  } catch (error: any) {
    if (error.code === '23505') {
      console.error('\n✗ Error: User already has this role');
    } else {
      console.error('\n✗ Error granting role:', error.message);
    }
  } finally {
    await db.destroy();
    rl.close();
  }
}

grantRole();
