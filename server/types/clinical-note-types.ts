export interface ClinicalNote {
  id: string;
  referral_id: string;
  session_date: string;
  content: string;
  author_id: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  first_name?: string;
  last_name?: string;
}

export interface NewClinicalNote {
  referral_id: string;
  session_date: string | Date;
  content: string;
  author_id?: string;
}

export interface UpdateClinicalNote {
  session_date?: string | Date;
  content?: string;
  author_id?: string | null;
  is_deleted?: boolean;
}
