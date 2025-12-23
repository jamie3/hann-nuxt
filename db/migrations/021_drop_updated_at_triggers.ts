import { Kysely } from 'kysely';
import { dropUpdatedAtTrigger, dropUpdatedAtFunction } from '../helpers/triggers';

export async function up(db: Kysely<any>): Promise<void> {
  // Drop updated_at triggers from all tables
  const tables = [
    'user',
    'referral',
    'clinical_note',
    'file',
    'credit_card',
    'referral_email',
    'user_role',
  ];

  for (const table of tables) {
    await dropUpdatedAtTrigger(db, table);
  }

  // Drop the shared trigger function
  await dropUpdatedAtFunction(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  // Import the createUpdatedAtTrigger function to recreate triggers
  const { createUpdatedAtTrigger } = await import('../helpers/triggers');

  // Recreate updated_at triggers for all tables
  const tables = [
    'user',
    'referral',
    'clinical_note',
    'file',
    'credit_card',
    'referral_email',
    'user_role',
  ];

  for (const table of tables) {
    await createUpdatedAtTrigger(db, table);
  }
}
