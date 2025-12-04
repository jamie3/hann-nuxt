import bcrypt from 'bcrypt';
import { Kysely, PostgresDialect, Generated } from 'kysely';
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
    password: string;
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

async function createUser() {
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

  // Add SSL configuration for test environment
  if (envName === 'test') {
    const caCertPath = join(process.cwd(), 'db', 'ca-certificate-test.crt');
    try {
      const ca = readFileSync(caCertPath, 'utf8');
      poolConfig.ssl = {
        rejectUnauthorized: true,
        ca: ca,
      };
      console.log('✓ Using SSL with CA certificate for test environment\n');
    } catch (error) {
      console.error('❌ Failed to read CA certificate:', error);
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
    const password = await question('Enter password: ');

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await db
      .insertInto('user')
      .values({
        username,
        password: hashedPassword,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    console.log('\n✓ User created successfully:');
    console.log(`  ID: ${result.id}`);
    console.log(`  Username: ${result.username}`);
    console.log(`  Created at: ${result.created_at}`);
  } catch (error: any) {
    if (error.code === '23505') {
      console.error('\n✗ Error: Username already exists');
    } else {
      console.error('\n✗ Error creating user:', error.message);
    }
  } finally {
    await db.destroy();
    rl.close();
  }
}

createUser();
