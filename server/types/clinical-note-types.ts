export interface ClinicalNote {
  id: string;
  referral_id: string;
  note_date: Date;
  content: string;
  author_id: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface NewClinicalNote {
  referral_id: string;
  note_date: Date | string;
  content: string;
  author_id?: string;
}

export interface UpdateClinicalNote {
  note_date?: Date | string;
  content?: string;
  author_id?: string;
}
