import { BaseRepository } from './base-repository';
import type { DB } from '../types/database-types';
import { Selectable, Insertable, Updateable } from 'kysely';

export interface ReferralRow extends Selectable<DB['referral']> {}
export interface ReferralInsert extends Insertable<DB['referral']> {}
export interface ReferralUpdate extends Updateable<DB['referral']> {}

export class ReferralRepository extends BaseRepository<
  DB,
  'referral',
  ReferralRow,
  ReferralInsert,
  ReferralUpdate
> {
  constructor(db: any) {
    super(db, 'referral');
  }

  async create(data: ReferralInsert): Promise<ReferralRow> {
    return await this.insert(data);
  }

  async findAllRows(
    sortBy: string = 'updated_at',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<ReferralRow[]> {
    // Map frontend column names to database column names
    const columnMap: Record<string, string> = {
      updated_at: 'updated_at',
      last_name: 'last_name',
      first_name: 'first_name',
      date_of_birth: 'date_of_birth',
      referred_at: 'referred_at',
      referral_type: 'referral_type',
      status: 'status',
      opened_at: 'opened_at',
    };

    const dbColumn = columnMap[sortBy] || 'updated_at';

    return await this.db
      .selectFrom('referral')
      .selectAll()
      .where('is_deleted', '=', false)
      .orderBy(dbColumn as any, sortOrder)
      .execute();
  }

  async findByIdRow(id: string): Promise<ReferralRow | undefined> {
    return await this.findById(id);
  }

  async findByType(referralType: 'professional' | 'self'): Promise<ReferralRow[]> {
    return await this.db
      .selectFrom('referral')
      .selectAll()
      .where('referral_type', '=', referralType)
      .where('is_deleted', '=', false)
      .orderBy('created_at', 'desc')
      .execute();
  }

  async findByEmail(email: string): Promise<ReferralRow[]> {
    return await this.db
      .selectFrom('referral')
      .selectAll()
      .where('email', '=', email)
      .where('is_deleted', '=', false)
      .orderBy('created_at', 'desc')
      .execute();
  }
}
