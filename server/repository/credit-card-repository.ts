import { BaseRepository } from './base-repository';
import type { DB } from '../types/database-types';
import { Selectable, Insertable, Updateable } from 'kysely';

export interface CreditCardRow extends Selectable<DB['credit_card']> {}
export interface CreditCardInsert extends Insertable<DB['credit_card']> {}
export interface CreditCardUpdate extends Updateable<DB['credit_card']> {}

export class CreditCardRepository extends BaseRepository<
  DB,
  'credit_card',
  CreditCardRow,
  CreditCardInsert,
  CreditCardUpdate
> {
  constructor(db: any) {
    super(db, 'credit_card');
  }

  async create(data: CreditCardInsert): Promise<CreditCardRow> {
    return await this.insert(data);
  }

  /**
   * Find credit card by referral ID
   */
  async findByReferralId(referralId: string): Promise<CreditCardRow | null> {
    const result = await this.db
      .selectFrom(this.tableName)
      .selectAll()
      .where('referral_id', '=', parseInt(referralId))
      .executeTakeFirst();

    return result || null;
  }

  /**
   * Delete credit card by referral ID
   */
  async deleteByReferralId(referralId: string): Promise<void> {
    await this.db
      .deleteFrom(this.tableName)
      .where('referral_id', '=', parseInt(referralId))
      .execute();
  }

  /**
   * Update or create credit card for a referral
   */
  async upsert(referralId: string, data: CreditCardInsert): Promise<CreditCardRow> {
    // Check if a card already exists for this referral
    const existing = await this.findByReferralId(referralId);

    if (existing) {
      // Update existing card
      const updated = await this.update(existing.id.toString(), {
        card_number_encrypted: data.card_number_encrypted,
        expiry_encrypted: data.expiry_encrypted,
        cvv_encrypted: data.cvv_encrypted,
      });
      return updated;
    } else {
      // Create new card
      return await this.create(data);
    }
  }
}

export type { CreditCardRow, CreditCardInsert, CreditCardUpdate };
