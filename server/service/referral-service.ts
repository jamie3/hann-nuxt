import { ReferralRepository, ReferralRow, ReferralInsert } from '../repository/referral-repository';
import type { Referral, NewReferral } from '../types/referral-types';
import { differenceInYears } from 'date-fns';

export class ReferralService {
  private referralRepository: ReferralRepository;

  constructor(referralRepository: ReferralRepository) {
    this.referralRepository = referralRepository;
  }

  // Calculate age from date of birth to a reference date
  private calculateAge(dateOfBirth: Date, referenceDate: Date = new Date()): string {
    const years = differenceInYears(referenceDate, dateOfBirth);
    return `${years} years`;
  }

  // Map database row to domain model
  private mapToReferral(row: ReferralRow): Referral {
    return {
      id: row.id,
      first_name: row.first_name,
      last_name: row.last_name,
      date_of_birth: new Date(row.date_of_birth),
      age: this.calculateAge(new Date(row.date_of_birth)),
      age_at_referral: row.referred_at
        ? this.calculateAge(new Date(row.date_of_birth), new Date(row.referred_at))
        : 'N/A',
      parents_guardians: row.parents_guardians,
      primary_telephone: row.primary_telephone,
      secondary_telephone: row.secondary_telephone,
      email: row.email,
      mailing_address: row.mailing_address,
      referrer_name: row.referrer_name,
      referrer_relationship: row.referrer_relationship,
      referrer_email: row.referrer_email,
      requested_service: row.requested_service,
      presenting_issues: row.presenting_issues,
      method_of_payment: row.method_of_payment,
      referrer_prefers_contact: row.referrer_prefers_contact,
      referral_type: row.referral_type,
      status: row.status,
      opened_at: row.opened_at ? new Date(row.opened_at) : null,
      closed_at: row.closed_at ? new Date(row.closed_at) : null,
      referred_at: row.referred_at ? new Date(row.referred_at) : null,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    };
  }

  // Map domain model to database insert
  private mapToInsert(referral: NewReferral): ReferralInsert {
    return {
      first_name: referral.first_name,
      last_name: referral.last_name,
      date_of_birth:
        typeof referral.date_of_birth === 'string'
          ? new Date(referral.date_of_birth)
          : referral.date_of_birth,
      parents_guardians: referral.parents_guardians || null,
      primary_telephone: referral.primary_telephone,
      secondary_telephone: referral.secondary_telephone || null,
      email: referral.email || null,
      mailing_address: referral.mailing_address || null,
      referrer_name: referral.referrer_name || null,
      referrer_relationship: referral.referrer_relationship || null,
      referrer_email: referral.referrer_email || null,
      requested_service: referral.requested_service,
      presenting_issues: referral.presenting_issues || null,
      method_of_payment: referral.method_of_payment || null,
      referrer_prefers_contact: referral.referrer_prefers_contact ?? null,
      referral_type: referral.referral_type,
    };
  }

  async createReferral(data: NewReferral): Promise<Referral> {
    const insertData = this.mapToInsert(data);
    const row = await this.referralRepository.create(insertData);
    return this.mapToReferral(row);
  }

  async getAllReferrals(): Promise<Referral[]> {
    const rows = await this.referralRepository.findAllRows();
    return rows.map((row) => this.mapToReferral(row));
  }

  async getReferralById(id: string): Promise<Referral | null> {
    const row = await this.referralRepository.findByIdRow(id);
    return row ? this.mapToReferral(row) : null;
  }

  async getReferralsByType(type: 'professional' | 'self'): Promise<Referral[]> {
    const rows = await this.referralRepository.findByType(type);
    return rows.map((row) => this.mapToReferral(row));
  }

  async getReferralsByEmail(email: string): Promise<Referral[]> {
    const rows = await this.referralRepository.findByEmail(email);
    return rows.map((row) => this.mapToReferral(row));
  }
}
