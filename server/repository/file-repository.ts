import { BaseRepository } from './base-repository';
import type { DB } from '../types/database-types';
import { Selectable, Insertable, Updateable } from 'kysely';

export interface FileRow extends Selectable<DB['file']> {}
export interface FileInsert extends Insertable<DB['file']> {}
export interface FileUpdate extends Updateable<DB['file']> {}

export class FileRepository extends BaseRepository<DB, 'file', FileRow, FileInsert, FileUpdate> {
  constructor(db: any) {
    super(db, 'file');
  }

  async create(data: FileInsert): Promise<FileRow> {
    return await this.insert(data);
  }

  async findByIdRow(id: string): Promise<FileRow | undefined> {
    return await this.findById(id);
  }

  async findByReferralId(referralId: string): Promise<FileRow[]> {
    return await this.db
      .selectFrom('file')
      .selectAll()
      .where('referral_id', '=', referralId)
      .where('is_deleted', '=', false)
      .orderBy('created_at', 'desc')
      .execute();
  }

  async findMetadataByReferralId(referralId: string): Promise<Omit<FileRow, 'file_data'>[]> {
    return await this.db
      .selectFrom('file')
      .select([
        'id',
        'referral_id',
        'file_name',
        'file_size',
        'mime_type',
        'uploaded_by',
        'created_at',
        'updated_at',
      ])
      .where('referral_id', '=', referralId)
      .where('is_deleted', '=', false)
      .orderBy('created_at', 'desc')
      .execute();
  }

  async findAllRows(): Promise<Omit<FileRow, 'file_data'>[]> {
    return await this.db
      .selectFrom('file')
      .select([
        'id',
        'referral_id',
        'file_name',
        'file_size',
        'mime_type',
        'uploaded_by',
        'created_at',
        'updated_at',
      ])
      .where('is_deleted', '=', false)
      .orderBy('created_at', 'desc')
      .execute();
  }

  async deleteFile(id: string): Promise<void> {
    return await this.delete(id);
  }
}
