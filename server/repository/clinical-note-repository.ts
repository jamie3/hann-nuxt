import { BaseRepository } from './base-repository';
import type { DB } from '../types/database-types';
import { Selectable, Insertable, Updateable } from 'kysely';

export interface ClinicalNoteRow extends Selectable<DB['clinical_note']> {}
export interface ClinicalNoteInsert extends Insertable<DB['clinical_note']> {}
export interface ClinicalNoteUpdate extends Updateable<DB['clinical_note']> {}

export class ClinicalNoteRepository extends BaseRepository<
  DB,
  'clinical_note',
  ClinicalNoteRow,
  ClinicalNoteInsert,
  ClinicalNoteUpdate
> {
  constructor(db: any) {
    super(db, 'clinical_note');
  }

  async create(data: ClinicalNoteInsert): Promise<ClinicalNoteRow> {
    return await this.insert(data);
  }

  async findAllRows(): Promise<ClinicalNoteRow[]> {
    return await this.db
      .selectFrom('clinical_note')
      .selectAll()
      .where('is_deleted', '=', false)
      .orderBy('session_date', 'desc')
      .execute();
  }

  async findAllWithReferralInfo(
    limit: number = 25,
    offset: number = 0,
    sortBy: string = 'session_date',
    sortOrder: 'asc' | 'desc' = 'desc',
    search: string = ''
  ): Promise<Array<ClinicalNoteRow & { first_name: string; last_name: string }>> {
    // Map sort column to full column name
    const sortColumn =
      sortBy === 'created_at' ? 'clinical_note.created_at' : 'clinical_note.session_date';

    let query = this.db
      .selectFrom('clinical_note')
      .innerJoin('referral', 'referral.id', 'clinical_note.referral_id')
      .select([
        'clinical_note.id',
        'clinical_note.referral_id',
        'clinical_note.session_date',
        'clinical_note.content',
        'clinical_note.author_id',
        'clinical_note.is_deleted',
        'clinical_note.created_at',
        'clinical_note.updated_at',
        'referral.first_name',
        'referral.last_name',
      ])
      .where('clinical_note.is_deleted', '=', false);

    // Add search filter if provided
    if (search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      query = query.where((eb) =>
        eb.or([
          eb('clinical_note.content', 'ilike', searchTerm),
          eb('referral.first_name', 'ilike', searchTerm),
          eb('referral.last_name', 'ilike', searchTerm),
        ])
      );
    }

    return await query.orderBy(sortColumn, sortOrder).limit(limit).offset(offset).execute();
  }

  async count(search: string = ''): Promise<number> {
    let query = this.db
      .selectFrom('clinical_note')
      .innerJoin('referral', 'referral.id', 'clinical_note.referral_id')
      .select((eb) => eb.fn.count<number>('clinical_note.id').as('count'))
      .where('clinical_note.is_deleted', '=', false);

    // Add search filter if provided
    if (search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      query = query.where((eb) =>
        eb.or([
          eb('clinical_note.content', 'ilike', searchTerm),
          eb('referral.first_name', 'ilike', searchTerm),
          eb('referral.last_name', 'ilike', searchTerm),
        ])
      );
    }

    const result = await query.executeTakeFirst();

    return result?.count ? Number(result.count) : 0;
  }

  async findByIdRow(id: string): Promise<ClinicalNoteRow | undefined> {
    return await this.findById(id);
  }

  async findByReferralId(referralId: string): Promise<ClinicalNoteRow[]> {
    return await this.db
      .selectFrom('clinical_note')
      .selectAll()
      .where('referral_id', '=', referralId)
      .where('is_deleted', '=', false)
      .orderBy('session_date', 'desc')
      .execute();
  }

  async findByAuthorId(authorId: string): Promise<ClinicalNoteRow[]> {
    return await this.db
      .selectFrom('clinical_note')
      .selectAll()
      .where('author_id', '=', authorId)
      .where('is_deleted', '=', false)
      .orderBy('session_date', 'desc')
      .execute();
  }

  async updateNote(id: string, data: ClinicalNoteUpdate): Promise<ClinicalNoteRow> {
    return await this.update(id, data);
  }

  async deleteNote(id: string): Promise<void> {
    return await this.delete(id);
  }
}
