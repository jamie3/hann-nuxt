import { execSync } from 'child_process';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Construct DATABASE_URL from individual env vars
const databaseUrl = `postgresql://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`;

// Set DATABASE_URL for kysely-codegen
process.env.DATABASE_URL = databaseUrl;

console.log('Generating types from database...');
console.log(
  `Connecting to: ${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`
);

try {
  execSync('npx kysely-codegen --dialect postgres --out-file server/types/database-types.ts', {
    stdio: 'inherit',
    env: process.env,
  });
  console.log('\n✅ Types generated successfully!');
} catch (error) {
  console.error('\n❌ Failed to generate types');
  process.exit(1);
}
