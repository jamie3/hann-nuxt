import { BaseRepository } from './base-repository';
import type { DB } from '../types/database-types';
import { Selectable, Insertable, Updateable } from 'kysely';

export interface ClinicalNoteRow extends Selectable<DB['clinical_note']> {}
export interface ClinicalNoteInsert extends Insertable<DB['clinical_note']> {}
export interface ClinicalNoteUpdate extends Updateable<DB['clinical_note']> {}

export class ClinicalNoteRepository extends BaseRepository<DB, 'clinical_note'> {
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

  async findAllWithReferralInfo(): Promise<
    Array<ClinicalNoteRow & { first_name: string; last_name: string }>
  > {
    return await this.db
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
      .where('clinical_note.is_deleted', '=', false)
      .orderBy('clinical_note.session_date', 'desc')
      .execute();
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
