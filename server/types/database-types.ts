import { Generated } from 'kysely';

export interface Database {
  user: {
    id: Generated<string>;
    username: string;
    password: string;
    last_login_at: Date | null;
    created_at: Generated<Date>;
    updated_at: Generated<Date>;
  };
  referral: {
    id: Generated<string>;
    first_name: string;
    last_name: string;
    date_of_birth: Date;
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
    status: Generated<'closed' | 'opened' | 'new'>;
    opened_at: Date | null;
    closed_at: Date | null;
    referred_at: Date | null;
    created_at: Generated<Date>;
    updated_at: Generated<Date>;
  };
  clinical_note: {
    id: Generated<string>;
    referral_id: string;
    note_date: Date;
    content: string;
    author_id: string | null;
    created_at: Generated<Date>;
    updated_at: Generated<Date>;
  };
}
