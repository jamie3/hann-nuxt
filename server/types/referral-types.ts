export interface Referral {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: Date;
  age: string;
  age_at_referral: string;
  parents_guardians: string | null;
  primary_telephone: string;
  secondary_telephone: string | null;
  email: string | null;
  mailing_address: string | null;
  referrer_name: string | null;
  referrer_relationship: string | null;
  referrer_email: string | null;
  requested_service: string;
  presenting_issues: string | null;
  method_of_payment: string | null;
  referrer_prefers_contact: boolean | null;
  referral_type: 'professional' | 'self';
  status: 'closed' | 'opened' | 'new' | 'archived';
  opened_at: Date | null;
  closed_at: Date | null;
  archived_at: Date | null;
  referred_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface NewReferral {
  first_name: string;
  last_name: string;
  date_of_birth: string | Date;
  parents_guardians?: string;
  primary_telephone: string;
  secondary_telephone?: string;
  email?: string;
  mailing_address?: string;
  referrer_name?: string;
  referrer_relationship?: string;
  referrer_email?: string;
  requested_service: string;
  presenting_issues?: string;
  method_of_payment?: string;
  referrer_prefers_contact?: boolean;
  referral_type: 'professional' | 'self';
}
