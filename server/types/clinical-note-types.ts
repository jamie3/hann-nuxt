export interface ClinicalNote {
  id: string;
  referral_id: string;
  session_date: Date;
  content: string;
  author_id: string | null;
  created_at: Date;
  updated_at: Date;
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
}
