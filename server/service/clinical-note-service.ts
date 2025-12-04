import {
  ClinicalNoteRepository,
  ClinicalNoteRow,
  ClinicalNoteInsert,
  ClinicalNoteUpdate,
} from '../repository/clinical-note-repository';
import type {
  ClinicalNote,
  NewClinicalNote,
  UpdateClinicalNote,
} from '../types/clinical-note-types';

export class ClinicalNoteService {
  private clinicalNoteRepository: ClinicalNoteRepository;

  constructor(clinicalNoteRepository: ClinicalNoteRepository) {
    this.clinicalNoteRepository = clinicalNoteRepository;
  }

  // Map database row to domain model
  private mapToClinicalNote(row: ClinicalNoteRow): ClinicalNote {
    return {
      id: row.id,
      referral_id: row.referral_id,
      session_date: new Date(row.session_date),
      content: row.content,
      author_id: row.author_id,
      is_deleted: row.is_deleted,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    };
  }

  // Map database row with referral info to domain model
  private mapToClinicalNoteWithReferral(
    row: ClinicalNoteRow & { first_name: string; last_name: string }
  ): ClinicalNote {
    return {
      id: row.id,
      referral_id: row.referral_id,
      session_date: new Date(row.session_date),
      content: row.content,
      author_id: row.author_id,
      is_deleted: row.is_deleted,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
      first_name: row.first_name,
      last_name: row.last_name,
    };
  }

  // Map domain model to database insert
  private mapToInsert(note: NewClinicalNote): ClinicalNoteInsert {
    return {
      referral_id: note.referral_id,
      session_date:
        typeof note.session_date === 'string' ? new Date(note.session_date) : note.session_date,
      content: note.content,
      author_id: note.author_id || null,
    };
  }

  // Map domain model to database update
  private mapToUpdate(note: UpdateClinicalNote): ClinicalNoteUpdate {
    const update: ClinicalNoteUpdate = {};

    if (note.session_date !== undefined) {
      update.session_date =
        typeof note.session_date === 'string' ? new Date(note.session_date) : note.session_date;
    }

    if (note.content !== undefined) {
      update.content = note.content;
    }

    if (note.author_id !== undefined) {
      update.author_id = note.author_id;
    }

    return update;
  }

  async createClinicalNote(data: NewClinicalNote): Promise<ClinicalNote> {
    const insertData = this.mapToInsert(data);
    const row = await this.clinicalNoteRepository.create(insertData);
    return this.mapToClinicalNote(row);
  }

  async getAllClinicalNotes(): Promise<ClinicalNote[]> {
    const rows = await this.clinicalNoteRepository.findAllWithReferralInfo();
    return rows.map((row) => this.mapToClinicalNoteWithReferral(row));
  }

  async getClinicalNoteById(id: string): Promise<ClinicalNote | null> {
    const row = await this.clinicalNoteRepository.findByIdRow(id);
    return row ? this.mapToClinicalNote(row) : null;
  }

  async getClinicalNotesByReferralId(referralId: string): Promise<ClinicalNote[]> {
    const rows = await this.clinicalNoteRepository.findByReferralId(referralId);
    return rows.map((row) => this.mapToClinicalNote(row));
  }

  async getClinicalNotesByAuthorId(authorId: string): Promise<ClinicalNote[]> {
    const rows = await this.clinicalNoteRepository.findByAuthorId(authorId);
    return rows.map((row) => this.mapToClinicalNote(row));
  }

  async updateClinicalNote(id: string, data: UpdateClinicalNote): Promise<ClinicalNote> {
    const updateData = this.mapToUpdate(data);
    const row = await this.clinicalNoteRepository.updateNote(id, updateData);
    return this.mapToClinicalNote(row);
  }

  async deleteClinicalNote(id: string): Promise<void> {
    await this.clinicalNoteRepository.deleteNote(id);
  }
}
