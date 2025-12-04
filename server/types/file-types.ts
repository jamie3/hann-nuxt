// Domain types for File
export interface File {
  id: string;
  referral_id: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  file_data: Buffer;
  uploaded_by: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface NewFile {
  referral_id: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  file_data: Buffer;
  uploaded_by?: string;
}

export interface FileMetadata {
  id: string;
  referral_id: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  uploaded_by: string | null;
  created_at: string;
  updated_at: string;
}
