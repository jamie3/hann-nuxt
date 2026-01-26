import { BaseRepository } from './base-repository';
import type { DB } from '../types/database-types';
import { Selectable, Insertable, Updateable } from 'kysely';

export interface ReferralRow extends Selectable<DB['referral']> {}
export interface ReferralInsert extends Insertable<DB['referral']> {}
export interface ReferralUpdate extends Updateable<DB['referral']> {}

// Extended type for referral with assigned user info from JOIN
export interface ReferralRowWithAssignedUser extends ReferralRow {
  assigned_to_username?: string | null;
  assigned_to_name?: string | null;
}

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
    status: string = '',
    assignedTo: string = '',
    startDate?: string | null,
    endDate?: string | null
  ): Promise<ReferralRowWithAssignedUser[]> {
    // Map frontend column names to database column names
    const columnMap: Record<string, string> = {
      updated_at: 'referral.updated_at',
      last_name: 'referral.last_name',
      first_name: 'referral.first_name',
      date_of_birth: 'referral.date_of_birth',
      referred_at: 'referral.referred_at',
      referral_type: 'referral.referral_type',
      status: 'referral.status',
      opened_at: 'referral.opened_at',
    };

    const dbColumn = columnMap[sortBy] || 'referral.updated_at';

    let query = this.db
      .selectFrom('referral')
      .leftJoin('user', 'user.id', 'referral.assigned_to')
      .selectAll('referral')
      .select(['user.username as assigned_to_username', 'user.name as assigned_to_name'])
      .where('referral.is_deleted', '=', false);

    // Add search filter
    if (search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      query = query.where((eb) =>
        eb.or([
          eb('referral.first_name', 'ilike', searchTerm),
          eb('referral.last_name', 'ilike', searchTerm),
          eb('referral.email', 'ilike', searchTerm),
        ])
      );
    }

    // Add type filter
    if (type && type !== 'all') {
      query = query.where('referral.referral_type', '=', type);
    }

    // Add status filter
    if (status && status !== 'all') {
      if (status === 'active') {
        // Exclude archived
        query = query.where('referral.status', '!=', 'archived');
      } else {
        query = query.where('referral.status', '=', status);
      }
    }

    // Add assigned_to filter
    if (assignedTo && assignedTo !== 'all') {
      if (assignedTo === 'unassigned') {
        query = query.where('referral.assigned_to', 'is', null);
      } else {
        query = query.where('referral.assigned_to', '=', parseInt(assignedTo));
      }
    }

    // Add date range filter (based on referred_at field)
    if (startDate) {
      query = query.where('referral.referred_at', '>=', new Date(startDate));
    }
    if (endDate) {
      query = query.where('referral.referred_at', '<=', new Date(endDate));
    }

    return await query
      .orderBy(dbColumn as any, sortOrder)
      .limit(limit)
      .offset(offset)
      .execute();
  }

  async count(
    search: string = '',
    type: string = '',
    status: string = '',
    assignedTo: string = '',
    startDate?: string | null,
    endDate?: string | null
  ): Promise<number> {
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

    // Add assigned_to filter
    if (assignedTo && assignedTo !== 'all') {
      if (assignedTo === 'unassigned') {
        query = query.where('assigned_to', 'is', null);
      } else {
        query = query.where('assigned_to', '=', parseInt(assignedTo));
      }
    }

    // Add date range filter (based on referred_at field)
    if (startDate) {
      query = query.where('referred_at', '>=', new Date(startDate));
    }
    if (endDate) {
      query = query.where('referred_at', '<=', new Date(endDate));
    }

    const result = await query.executeTakeFirst();

    return result?.count ? Number(result.count) : 0;
  }

  async findByIdRow(id: string): Promise<ReferralRow | undefined> {
    return await this.findById(id);
  }

  /**
   * Find referral by ID with assigned user info
   */
  async findByIdWithAssignedUser(id: string): Promise<ReferralRowWithAssignedUser | undefined> {
    return await this.db
      .selectFrom('referral')
      .leftJoin('user', 'user.id', 'referral.assigned_to')
      .selectAll('referral')
      .select(['user.username as assigned_to_username', 'user.name as assigned_to_name'])
      .where('referral.id', '=', parseInt(id))
      .where('referral.is_deleted', '=', false)
      .executeTakeFirst();
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

  /**
   * Get statistics counts directly from database
   * Much more efficient than fetching all rows and counting in application
   */
  async getStats(): Promise<{
    totalProfessional: number;
    totalSelf: number;
    totalUnassigned: number;
    totalNew: number;
    totalOpened: number;
    totalClosed: number;
    totalArchived: number;
  }> {
    // Count by referral type
    const typeCounts = await this.db
      .selectFrom('referral')
      .select(['referral_type', (eb) => eb.fn.count<number>('id').as('count')])
      .where('is_deleted', '=', false)
      .groupBy('referral_type')
      .execute();

    // Count by status
    const statusCounts = await this.db
      .selectFrom('referral')
      .select(['status', (eb) => eb.fn.count<number>('id').as('count')])
      .where('is_deleted', '=', false)
      .groupBy('status')
      .execute();

    // Map results to stats object
    const stats = {
      totalProfessional: 0,
      totalSelf: 0,
      totalUnassigned: 0,
      totalNew: 0,
      totalOpened: 0,
      totalClosed: 0,
      totalArchived: 0,
    };

    // Process type counts
    typeCounts.forEach((row) => {
      const count = Number(row.count);
      if (row.referral_type === 'professional') {
        stats.totalProfessional = count;
      } else if (row.referral_type === 'self') {
        stats.totalSelf = count;
      }
    });

    // Process status counts
    statusCounts.forEach((row) => {
      const count = Number(row.count);
      if (row.status === 'unassigned') {
        stats.totalUnassigned = count;
      } else if (row.status === 'new') {
        stats.totalNew = count;
      } else if (row.status === 'opened') {
        stats.totalOpened = count;
      } else if (row.status === 'closed') {
        stats.totalClosed = count;
      } else if (row.status === 'archived') {
        stats.totalArchived = count;
      }
    });

    return stats;
  }

  /**
   * Merge data from secondary referral into primary referral
   * Moves all related data (clinical notes, files, emails, credit card) to primary
   */
  async mergeReferralData(primaryId: number, secondaryId: number): Promise<void> {
    // Move clinical notes from secondary to primary
    await this.db
      .updateTable('clinical_note')
      .set({ referral_id: primaryId })
      .where('referral_id', '=', secondaryId)
      .where('is_deleted', '=', false)
      .execute();

    // Move files from secondary to primary
    await this.db
      .updateTable('file')
      .set({ referral_id: primaryId })
      .where('referral_id', '=', secondaryId)
      .where('is_deleted', '=', false)
      .execute();

    // Move referral emails from secondary to primary
    await this.db
      .updateTable('referral_email')
      .set({ referral_id: primaryId })
      .where('referral_id', '=', secondaryId)
      .execute();

    // Handle credit card - check if primary already has one
    const primaryCreditCard = await this.db
      .selectFrom('credit_card')
      .selectAll()
      .where('referral_id', '=', primaryId)
      .executeTakeFirst();

    if (primaryCreditCard) {
      // Primary has a credit card, delete secondary's
      await this.db.deleteFrom('credit_card').where('referral_id', '=', secondaryId).execute();
    } else {
      // Primary doesn't have a credit card, move secondary's to primary
      await this.db
        .updateTable('credit_card')
        .set({ referral_id: primaryId })
        .where('referral_id', '=', secondaryId)
        .execute();
    }
  }
}
