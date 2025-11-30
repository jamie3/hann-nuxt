import { BaseRepository } from './base-repository';
import type { Database } from '../types/database-types';
import { Selectable, Insertable } from 'kysely';

export type ReferralRow = Selectable<Database['referral']>;
export type ReferralInsert = Insertable<Database['referral']>;

export class ReferralRepository extends BaseRepository<Database, 'referral'> {
  constructor(db: any) {
    super(db, 'referral');
  }

  async create(data: ReferralInsert): Promise<ReferralRow> {
    return await this.insert(data);
  }

  async findAllRows(): Promise<ReferralRow[]> {
    return await this.findAll();
  }

  async findByIdRow(id: string): Promise<ReferralRow | undefined> {
    return await this.findById(id);
  }

  async findByType(referralType: 'professional' | 'self'): Promise<ReferralRow[]> {
    return await this.db
      .selectFrom('referral')
      .selectAll()
      .where('referral_type', '=', referralType)
      .orderBy('created_at', 'desc')
      .execute();
  }

  async findByEmail(email: string): Promise<ReferralRow[]> {
    return await this.db
      .selectFrom('referral')
      .selectAll()
      .where('email', '=', email)
      .orderBy('created_at', 'desc')
      .execute();
  }
}
