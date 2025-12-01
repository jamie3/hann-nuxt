import { FileRepository, FileRow, FileInsert } from '../repository/file-repository';
import type { File, NewFile, FileMetadata } from '../types/file-types';

export class FileService {
  private fileRepository: FileRepository;

  constructor(fileRepository: FileRepository) {
    this.fileRepository = fileRepository;
  }

  // Map database row to domain model
  private mapToFile(row: FileRow): File {
    return {
      id: row.id,
      referral_id: row.referral_id,
      file_name: row.file_name,
      file_size: Number(row.file_size),
      mime_type: row.mime_type,
      file_data: row.file_data,
      uploaded_by: row.uploaded_by,
      is_deleted: row.is_deleted,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    };
  }

  // Map database row to file metadata (without blob data)
  private mapToFileMetadata(row: Omit<FileRow, 'file_data'>): FileMetadata {
    return {
      id: row.id,
      referral_id: row.referral_id,
      file_name: row.file_name,
      file_size: Number(row.file_size),
      mime_type: row.mime_type,
      uploaded_by: row.uploaded_by,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    };
  }

  // Map domain model to database insert
  private mapToInsert(file: NewFile): FileInsert {
    return {
      referral_id: file.referral_id,
      file_name: file.file_name,
      file_size: BigInt(file.file_size),
      mime_type: file.mime_type,
      file_data: file.file_data,
      uploaded_by: file.uploaded_by || null,
    };
  }

  async createFile(data: NewFile): Promise<File> {
    const insertData = this.mapToInsert(data);
    const row = await this.fileRepository.create(insertData);
    return this.mapToFile(row);
  }

  async getFileById(id: string): Promise<File | null> {
    const row = await this.fileRepository.findByIdRow(id);
    return row ? this.mapToFile(row) : null;
  }

  async getFilesByReferralId(referralId: string): Promise<File[]> {
    const rows = await this.fileRepository.findByReferralId(referralId);
    return rows.map((row) => this.mapToFile(row));
  }

  async getFileMetadataByReferralId(referralId: string): Promise<FileMetadata[]> {
    const rows = await this.fileRepository.findMetadataByReferralId(referralId);
    return rows.map((row) => this.mapToFileMetadata(row));
  }

  async getAllFiles(): Promise<FileMetadata[]> {
    const rows = await this.fileRepository.findAllRows();
    return rows.map((row) => this.mapToFileMetadata(row));
  }

  async deleteFile(id: string): Promise<void> {
    await this.fileRepository.deleteFile(id);
  }
}
