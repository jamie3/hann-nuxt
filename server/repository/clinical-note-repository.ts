import { BaseRepository } from './base-repository';
import type { Database } from '../types/database-types';
import { Selectable, Insertable, Updateable } from 'kysely';

export interface ClinicalNoteRow extends Selectable<Database['clinical_note']> {}
export interface ClinicalNoteInsert extends Insertable<Database['clinical_note']> {}
export interface ClinicalNoteUpdate extends Updateable<Database['clinical_note']> {}

export class ClinicalNoteRepository extends BaseRepository<Database, 'clinical_note'> {
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
      .orderBy('note_date', 'desc')
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
      .orderBy('note_date', 'desc')
      .execute();
  }

  async findByAuthorId(authorId: string): Promise<ClinicalNoteRow[]> {
    return await this.db
      .selectFrom('clinical_note')
      .selectAll()
      .where('author_id', '=', authorId)
      .where('is_deleted', '=', false)
      .orderBy('note_date', 'desc')
      .execute();
  }

  async updateNote(id: string, data: ClinicalNoteUpdate): Promise<ClinicalNoteRow> {
    return await this.update(id, data);
  }

  async deleteNote(id: string): Promise<void> {
    return await this.delete(id);
  }
}
