import mysql from 'mysql2/promise';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import type { DB } from '../server/types/database-types';
import * as dotenv from 'dotenv';
import * as readline from 'readline';
import * as path from 'path';
import { readFileSync } from 'fs';

// Parse command line arguments for environment
const args = process.argv.slice(2);
const envIndex = args.indexOf('--env');
const envName = envIndex !== -1 && args[envIndex + 1] ? args[envIndex + 1] : null;

// Load environment variables from specified file
if (envName) {
  const envFile = `.env.${envName}`;
  console.log(`Loading environment from: ${envFile}`);
  dotenv.config({ path: path.resolve(process.cwd(), envFile) });
} else {
  console.log('Loading environment from: .env');
  dotenv.config();
}

// Create readline interface for user prompts
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

interface MySQLClient {
  id: number;
  first_name: string;
  last_name: string;
  dob: string | null;
  phone: string | null;
  phone_2: string | null;
  email: string | null;
  address: string | null;
  referral_type: string;
  file_opened: string | null;
  file_closed: string | null;
  referral_date: string | null;
  referrer_name: string;
  referrer_relationship: string | null;
  referrer_email: string;
  therapy: string;
  notes: string | null;
  parents: string | null;
  last_updated: Date;
  clinical_notes: string | null;
  archived: number;
  closed: number;
  deleted: number;
}

interface MySQLClinicalNote {
  id: number;
  clinical_note: string;
  created: Date;
  updated: Date;
  client_id: number;
  version: number | null;
  session_date: string | null;
  deleted: number;
}

// Map to store MySQL ID to PostgreSQL ID mapping
const clientIdMap = new Map<number, number>();

// Database connections
let mysqlConnection: mysql.Connection | null = null;
let pgDb: Kysely<DB> | null = null;

async function getMySQLConnection(): Promise<mysql.Connection> {
  if (!mysqlConnection) {
    const config = {
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT || '3307'),
      user: process.env.MYSQL_USER || 'ghanndb',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'hanndb',
    };

    console.log(`Connecting to MySQL at ${config.host}:${config.port}...`);
    mysqlConnection = await mysql.createConnection(config);
    console.log('✅ MySQL connection established\n');
  }

  return mysqlConnection;
}

function getPostgresDB(): Kysely<DB> {
  if (!pgDb) {
    const poolConfig: any = {
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      user: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || '',
      database: process.env.DATABASE_NAME || 'hann',
      max: 10,
    };

    // Add SSL configuration for production environment
    if (envName === 'production') {
      const certPath = path.resolve(process.cwd(), 'db/ca-certificate-production.crt');
      try {
        const caCert = readFileSync(certPath, 'utf-8');
        poolConfig.ssl = {
          rejectUnauthorized: true,
          ca: caCert,
        };
        console.log('✅ Using SSL certificate for PostgreSQL connection\n');
      } catch (error) {
        console.warn('⚠️  Failed to load CA certificate, proceeding without SSL');
      }
    }

    pgDb = new Kysely<DB>({
      dialect: new PostgresDialect({
        pool: new Pool(poolConfig),
      }),
    });
  }

  return pgDb;
}

function parseDate(dateValue: string | Date | null): Date | null {
  if (!dateValue) return null;

  // If it's already a Date object
  if (dateValue instanceof Date) {
    return isNaN(dateValue.getTime()) ? null : dateValue;
  }

  // If it's a string
  if (typeof dateValue === 'string') {
    if (dateValue === '0000-00-00' || dateValue === '0000-00-00 00:00:00') {
      return null;
    }

    const date = new Date(dateValue);
    return isNaN(date.getTime()) ? null : date;
  }

  return null;
}

function determineStatus(closed: number, archived: number): string {
  if (archived) return 'archived';
  if (closed) return 'closed';
  return 'opened';
}

async function migrateReferrals(): Promise<void> {
  console.log('📥 Migrating referrals from MySQL to PostgreSQL...\n');

  const mysql = await getMySQLConnection();
  const pgDb = getPostgresDB();

  let insertedCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  try {
    // Query all clients from MySQL (READ-ONLY - no modifications to MySQL)
    const [rows] = await mysql.query<mysql.RowDataPacket[]>('SELECT * FROM clients ORDER BY id');

    console.log(`Found ${rows.length} clients in MySQL database\n`);

    for (const row of rows) {
      const client = row as unknown as MySQLClient;

      // Transform MySQL data to PostgreSQL schema (date_of_birth can be null)
      const createdAtDate = parseDate(client.referral_date) || new Date();
      const referralData = {
        id: client.id, // Preserve MySQL ID as primary key
        original_id: client.id,
        first_name: client.first_name || '',
        last_name: client.last_name || '',
        date_of_birth: parseDate(client.dob),
        parents_guardians: client.parents || null,
        primary_telephone: client.phone || '',
        secondary_telephone: client.phone_2 || null,
        email: client.email || null,
        mailing_address: client.address || null,
        referrer_name: client.referrer_name || null,
        referrer_relationship: client.referrer_relationship || null,
        referrer_email: client.referrer_email || null,
        requested_service: client.therapy || 'Unknown',
        presenting_issues: client.notes || null,
        method_of_payment: null,
        referrer_prefers_contact: false,
        referral_type: (client.referral_type?.toLowerCase() || 'self') as 'self' | 'professional',
        status: determineStatus(client.closed, client.archived) as
          | 'new'
          | 'open'
          | 'closed'
          | 'archived',
        opened_at: parseDate(client.file_opened),
        closed_at: parseDate(client.file_closed),
        archived_at: client.archived ? parseDate(client.last_updated) : null,
        referred_at: parseDate(client.referral_date) || new Date(),
        is_deleted: Boolean(client.deleted),
        created_at: createdAtDate,
        updated_at: parseDate(client.last_updated) || createdAtDate,
      };

      try {
        // Check if record with this original_id already exists (READ-ONLY check)
        const existing = await pgDb
          .selectFrom('referral')
          .select('id')
          .where('original_id', '=', client.id)
          .executeTakeFirst();

        let referralId: number;
        let wasUpdated = false;

        if (existing) {
          // Update existing record (NO DELETION - only updates fields)
          await pgDb
            .updateTable('referral')
            .set(referralData)
            .where('id', '=', existing.id)
            .execute();

          referralId = existing.id;
          wasUpdated = true;
          updatedCount++;
        } else {
          // Insert new record (NO DELETION - only creates new records)
          const result = await pgDb
            .insertInto('referral')
            .values(referralData)
            .returning('id')
            .executeTakeFirst();

          if (!result) {
            throw new Error('Failed to insert referral');
          }

          referralId = result.id;
          insertedCount++;
        }

        // Store mapping of MySQL ID to PostgreSQL ID
        clientIdMap.set(client.id, referralId);

        const totalProcessed = insertedCount + updatedCount;
        if (totalProcessed % 100 === 0) {
          console.log(
            `  ✓ Processed ${totalProcessed} referrals (${insertedCount} new, ${updatedCount} updated)...`
          );
        }
      } catch (error) {
        console.error(`❌ Error importing client ${client.id}:`, error);
        errorCount++;
      }
    }

    console.log(`\n✅ Referral migration complete:`);
    console.log(`   - Inserted: ${insertedCount}`);
    console.log(`   - Updated: ${updatedCount}`);
    console.log(`   - Skipped: ${skippedCount}`);
    console.log(`   - Errors: ${errorCount}`);
  } catch (error) {
    console.error('❌ Error migrating referrals:', error);
    throw error;
  }
}

async function migrateClinicalNotes(): Promise<void> {
  console.log('\n📥 Migrating clinical notes from MySQL to PostgreSQL...\n');

  const mysql = await getMySQLConnection();
  const pgDb = getPostgresDB();

  let insertedCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  try {
    // Query all clinical notes from MySQL (READ-ONLY - no modifications to MySQL)
    const [rows] = await mysql.query<mysql.RowDataPacket[]>(
      'SELECT * FROM clinical_note ORDER BY id'
    );

    console.log(`Found ${rows.length} clinical notes in MySQL database\n`);

    for (const row of rows) {
      const note = row as unknown as MySQLClinicalNote;

      // Skip if client_id is 0 or not mapped
      if (!note.client_id || !clientIdMap.has(note.client_id)) {
        console.warn(`⚠️  Skipping note ${note.id}: Client ${note.client_id} not found`);
        skippedCount++;
        continue;
      }

      const referralId = clientIdMap.get(note.client_id);
      if (!referralId) {
        skippedCount++;
        continue;
      }

      // Transform MySQL data to PostgreSQL schema
      const noteCreatedAt = parseDate(note.created) || new Date();
      const noteData = {
        id: note.id, // Preserve MySQL ID as primary key
        original_id: note.id,
        referral_id: referralId,
        session_date: parseDate(note.session_date) || parseDate(note.created) || new Date(),
        content: note.clinical_note || '',
        author_id: null, // No author mapping available
        is_deleted: Boolean(note.deleted),
        created_at: noteCreatedAt,
        updated_at: noteCreatedAt,
      };

      try {
        // Check if record with this original_id already exists (READ-ONLY check)
        const existing = await pgDb
          .selectFrom('clinical_note')
          .select('id')
          .where('original_id', '=', note.id)
          .executeTakeFirst();

        if (existing) {
          // Update existing record (NO DELETION - only updates fields)
          await pgDb
            .updateTable('clinical_note')
            .set(noteData)
            .where('id', '=', existing.id)
            .execute();

          updatedCount++;
        } else {
          // Insert new record (NO DELETION - only creates new records)
          await pgDb.insertInto('clinical_note').values(noteData).execute();

          insertedCount++;
        }

        const totalProcessed = insertedCount + updatedCount;
        if (totalProcessed % 100 === 0) {
          console.log(
            `  ✓ Processed ${totalProcessed} clinical notes (${insertedCount} new, ${updatedCount} updated)...`
          );
        }
      } catch (error) {
        console.error(`❌ Error importing note ${note.id}:`, error);
        errorCount++;
      }
    }

    console.log(`\n✅ Clinical notes migration complete:`);
    console.log(`   - Inserted: ${insertedCount}`);
    console.log(`   - Updated: ${updatedCount}`);
    console.log(`   - Skipped: ${skippedCount}`);
    console.log(`   - Errors: ${errorCount}`);
  } catch (error) {
    console.error('❌ Error migrating clinical notes:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('🚀 MySQL to PostgreSQL Migration Tool\n');
    console.log('This script will migrate data from your MySQL database to PostgreSQL.');
    console.log(
      'Records with matching original_id will be updated, new records will be inserted.\n'
    );

    // Show current configuration
    console.log('Current Configuration from .env:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`MySQL Source:`);
    console.log(`  Host: ${process.env.MYSQL_HOST || 'localhost'}`);
    console.log(`  Port: ${process.env.MYSQL_PORT || '3307'}`);
    console.log(`  Database: ${process.env.MYSQL_DATABASE || 'hanndb'}`);
    console.log(`  User: ${process.env.MYSQL_USER || 'ghanndb'}`);
    console.log('');
    console.log(`PostgreSQL Destination:`);
    console.log(`  Host: ${process.env.DATABASE_HOST || 'localhost'}`);
    console.log(`  Port: ${process.env.DATABASE_PORT || '5432'}`);
    console.log(`  Database: ${process.env.DATABASE_NAME || 'hann'}`);
    console.log(`  User: ${process.env.DATABASE_USER || 'postgres'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Prompt for confirmation
    const answer = await question('Do you want to proceed with this configuration? (yes/no): ');

    if (answer.toLowerCase() !== 'yes' && answer.toLowerCase() !== 'y') {
      console.log('\n❌ Migration cancelled by user.\n');
      rl.close();
      process.exit(0);
    }

    console.log('');

    // Test MySQL connection
    const mysql = await getMySQLConnection();
    const [result] = await mysql.query('SELECT COUNT(*) as count FROM clients');
    console.log(`MySQL clients table has ${(result as any)[0].count} records`);

    // Test PostgreSQL connection
    const pgDb = getPostgresDB();
    await pgDb.selectFrom('referral').select('id').limit(1).execute();
    console.log('✅ PostgreSQL connection successful\n');

    // Final confirmation before starting migration
    const finalAnswer = await question('Ready to start migration? (yes/no): ');

    if (finalAnswer.toLowerCase() !== 'yes' && finalAnswer.toLowerCase() !== 'y') {
      console.log('\n❌ Migration cancelled by user.\n');
      rl.close();
      if (mysqlConnection) {
        await mysqlConnection.end();
      }
      process.exit(0);
    }

    console.log('');
    rl.close();

    // Migrate referrals first (needed for ID mapping)
    await migrateReferrals();

    // Then migrate clinical notes
    await migrateClinicalNotes();

    console.log('\n🎉 Migration complete!\n');

    // Close connections
    if (mysqlConnection) {
      await mysqlConnection.end();
    }

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error);

    // Close connections on error
    rl.close();
    if (mysqlConnection) {
      await mysqlConnection.end();
    }

    process.exit(1);
  }
}

// Run the migration
main();
