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
    limit: number = 25,
    offset: number = 0,
    sortBy: string = 'updated_at',
    sortOrder: 'asc' | 'desc' = 'desc',
    search: string = '',
    type: string = '',
    status: string = ''
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

    let query = this.db.selectFrom('referral').selectAll().where('is_deleted', '=', false);

    // Add search filter
    if (search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      query = query.where((eb) =>
        eb.or([
          eb('first_name', 'ilike', searchTerm),
          eb('last_name', 'ilike', searchTerm),
          eb('email', 'ilike', searchTerm),
        ])
      );
    }

    // Add type filter
    if (type && type !== 'all') {
      query = query.where('referral_type', '=', type);
    }

    // Add status filter
    if (status && status !== 'all') {
      if (status === 'active') {
        // Exclude archived
        query = query.where('status', '!=', 'archived');
      } else {
        query = query.where('status', '=', status);
      }
    }

    return await query
      .orderBy(dbColumn as any, sortOrder)
      .limit(limit)
      .offset(offset)
      .execute();
  }

  async count(search: string = '', type: string = '', status: string = ''): Promise<number> {
    let query = this.db
      .selectFrom('referral')
      .select((eb) => eb.fn.count<number>('id').as('count'))
      .where('is_deleted', '=', false);

    // Add search filter
    if (search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      query = query.where((eb) =>
        eb.or([
          eb('first_name', 'ilike', searchTerm),
          eb('last_name', 'ilike', searchTerm),
          eb('email', 'ilike', searchTerm),
        ])
      );
    }

    // Add type filter
    if (type && type !== 'all') {
      query = query.where('referral_type', '=', type);
    }

    // Add status filter
    if (status && status !== 'all') {
      if (status === 'active') {
        // Exclude archived
        query = query.where('status', '!=', 'archived');
      } else {
        query = query.where('status', '=', status);
      }
    }

    const result = await query.executeTakeFirst();

    return result?.count ? Number(result.count) : 0;
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
