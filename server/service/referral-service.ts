import {
  ReferralRepository,
  ReferralRow,
  ReferralInsert,
  ReferralUpdate,
  ReferralRowWithAssignedUser,
} from '../repository/referral-repository';
import { FileRepository } from '../repository/file-repository';
import { differenceInYears } from 'date-fns';
import type { Referral, NewReferral } from '../types/referral-types';
import { pdfService } from './pdf-service';
import { emailService } from './email-service';
import { determineReferralStatus } from '../utils/referral-status';
import { logger } from '../lib/logger';

export class ReferralService {
  private referralRepository: ReferralRepository;
  private fileRepository: FileRepository;

  constructor(referralRepository: ReferralRepository, fileRepository: FileRepository) {
    this.referralRepository = referralRepository;
    this.fileRepository = fileRepository;
  }

  // Calculate age from date of birth to a reference date
  private calculateAge(dateOfBirth: Date, referenceDate: Date = new Date()): string {
    const years = differenceInYears(referenceDate, dateOfBirth);
    return `${years} years`;
  }

  // Map database row to domain model
  private mapToReferral(row: ReferralRowWithAssignedUser): Referral {
    // Determine correct status based on dates using shared utility
    const status = determineReferralStatus(row.opened_at, row.closed_at);

    return {
      id: row.id.toString(),
      first_name: row.first_name,
      last_name: row.last_name,
      date_of_birth: row.date_of_birth ? row.date_of_birth.toISOString() : null,
      age: row.date_of_birth ? this.calculateAge(row.date_of_birth) : '-',
      age_at_referral:
        row.date_of_birth && row.referred_at
          ? this.calculateAge(row.date_of_birth, row.referred_at)
          : '-',
      gender: row.gender || null,
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
      referral_type: row.referral_type as 'professional' | 'self',
      status: status,
      assigned_to: row.assigned_to ? row.assigned_to.toString() : null,
      assigned_to_name: (row as any).assigned_to_name || (row as any).assigned_to_username || null,
      opened_at: row.opened_at ? row.opened_at.toISOString() : null,
      closed_at: row.closed_at ? row.closed_at.toISOString() : null,
      archived_at: null,
      referred_at: row.referred_at ? row.referred_at.toISOString() : null,
      created_at: row.created_at.toISOString(),
      updated_at: row.updated_at.toISOString(),
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
    const referral = this.mapToReferral(row);

    // Generate PDF and email in the background (don't block the response)
    this.generateAndEmailPDF(referral).catch((error) => {
      logger.error('Error generating/emailing PDF', { error, referralId: referral.id });
    });

    return referral;
  }

  private async generateAndEmailPDF(referral: Referral): Promise<void> {
    try {
      // Generate PDF
      const pdfBuffer = await pdfService.generateReferralPDF(referral);

      // Store PDF in file table
      const pdfFile = await this.fileRepository.create({
        referral_id: parseInt(referral.id),
        file_name: `referral-${referral.id}.pdf`,
        file_size: BigInt(pdfBuffer.length),
        mime_type: 'application/pdf',
        file_data: pdfBuffer,
        uploaded_by: null,
      });

      // Send email with PDF
      const referralTypeFormatted =
        referral.referral_type === 'professional' ? 'Professional' : 'Self';
      await emailService.sendReferralNotification(
        referral,
        referralTypeFormatted,
        pdfBuffer,
        pdfFile.id
      );
    } catch (error) {
      logger.error('Failed to generate/email PDF', { error });
      throw error;
    }
  }

  async generateReferralPDF(id: string): Promise<Buffer> {
    const referral = await this.getReferralById(id);
    if (!referral) {
      throw new Error(`Referral with id ${id} not found`);
    }
    return pdfService.generateReferralPDF(referral);
  }

  async getAllReferrals(
    page: number = 1,
    limit: number = 25,
    sortBy: string = 'updated_at',
    sortOrder: 'asc' | 'desc' = 'desc',
    search: string = '',
    type: string = '',
    status: string = '',
    assignedTo: string = ''
  ): Promise<{ referrals: Referral[]; total: number; page: number; limit: number }> {
    const offset = (page - 1) * limit;
    const rows = await this.referralRepository.findAllRows(
      limit,
      offset,
      sortBy,
      sortOrder,
      search,
      type,
      status,
      assignedTo
    );
    const total = await this.referralRepository.count(search, type, status, assignedTo);

    return {
      referrals: rows.map((row) => this.mapToReferral(row)),
      total,
      page,
      limit,
    };
  }

  async getReferralById(id: string): Promise<Referral | null> {
    const row = await this.referralRepository.findByIdWithAssignedUser(id);
    if (!row) return null;

    const referral = this.mapToReferral(row);
    // Add assigned user name from join
    if (row.assigned_to_name || row.assigned_to_username) {
      referral.assigned_to_name = row.assigned_to_name || row.assigned_to_username;
    }
    return referral;
  }

  async getReferralsByType(type: 'professional' | 'self'): Promise<Referral[]> {
    const rows = await this.referralRepository.findByType(type);
    return rows.map((row) => this.mapToReferral(row));
  }

  async getReferralsByEmail(email: string): Promise<Referral[]> {
    const rows = await this.referralRepository.findByEmail(email);
    return rows.map((row) => this.mapToReferral(row));
  }

  async openReferral(id: string): Promise<Referral> {
    const row = await this.referralRepository.findByIdRow(id);

    if (!row) {
      throw new Error(`Referral with id ${id} not found`);
    }

    // Validate that status is 'new' or 'closed'
    if (row.status !== 'new' && row.status !== 'closed') {
      throw new Error(
        `Cannot open referral with status '${row.status}'. Referral must be 'new' or 'closed' to be opened.`
      );
    }

    // Update the referral to opened status
    const updatedRow = await this.referralRepository.update(id, {
      status: 'opened',
      opened_at: new Date(),
    });

    return this.mapToReferral(updatedRow);
  }

  async closeReferral(id: string): Promise<Referral> {
    const row = await this.referralRepository.findByIdRow(id);

    if (!row) {
      throw new Error(`Referral with id ${id} not found`);
    }

    // Validate that status is 'new' or 'opened'
    if (row.status !== 'new' && row.status !== 'opened') {
      throw new Error(
        `Cannot close referral with status '${row.status}'. Referral must be 'new' or 'opened' to be closed.`
      );
    }

    // Update the referral to closed status
    const updatedRow = await this.referralRepository.update(id, {
      status: 'closed',
      closed_at: new Date(),
    });

    return this.mapToReferral(updatedRow);
  }

  async updateReferral(id: string, data: Partial<NewReferral>): Promise<Referral> {
    const row = await this.referralRepository.findByIdRow(id);

    if (!row) {
      throw new Error(`Referral with id ${id} not found`);
    }

    // Validate that status is not 'closed'
    if (row.status === 'closed') {
      throw new Error('Cannot update a closed referral');
    }

    // Prepare update data - only include fields that are provided
    const updateData: ReferralUpdate = {};

    if (data.first_name !== undefined) updateData.first_name = data.first_name;
    if (data.last_name !== undefined) updateData.last_name = data.last_name;
    if (data.date_of_birth !== undefined) {
      updateData.date_of_birth =
        typeof data.date_of_birth === 'string' ? new Date(data.date_of_birth) : data.date_of_birth;
    }
    if (data.gender !== undefined) updateData.gender = data.gender || null;
    if (data.referred_at !== undefined) {
      updateData.referred_at =
        typeof data.referred_at === 'string' ? new Date(data.referred_at) : data.referred_at;
    }
    if (data.parents_guardians !== undefined)
      updateData.parents_guardians = data.parents_guardians || null;
    if (data.primary_telephone !== undefined) updateData.primary_telephone = data.primary_telephone;
    if (data.secondary_telephone !== undefined)
      updateData.secondary_telephone = data.secondary_telephone || null;
    if (data.email !== undefined) updateData.email = data.email || null;
    if (data.mailing_address !== undefined)
      updateData.mailing_address = data.mailing_address || null;
    if (data.referrer_name !== undefined) updateData.referrer_name = data.referrer_name || null;
    if (data.referrer_relationship !== undefined)
      updateData.referrer_relationship = data.referrer_relationship || null;
    if (data.referrer_email !== undefined) updateData.referrer_email = data.referrer_email || null;
    if (data.requested_service !== undefined) updateData.requested_service = data.requested_service;
    if (data.presenting_issues !== undefined)
      updateData.presenting_issues = data.presenting_issues || null;
    if (data.method_of_payment !== undefined)
      updateData.method_of_payment = data.method_of_payment || null;
    if (data.referrer_prefers_contact !== undefined)
      updateData.referrer_prefers_contact = data.referrer_prefers_contact ?? null;
    if (data.referral_type !== undefined) updateData.referral_type = data.referral_type;
    if ((data as any).assigned_to !== undefined) {
      (updateData as any).assigned_to = (data as any).assigned_to;
    }

    // Update the referral
    const updatedRow = await this.referralRepository.update(id, updateData);

    return this.mapToReferral(updatedRow);
  }

  async deleteReferral(id: string): Promise<void> {
    const row = await this.referralRepository.findByIdRow(id);

    if (!row) {
      throw new Error(`Referral with id ${id} not found`);
    }

    // Soft delete by setting is_deleted to true
    await this.referralRepository.update(id, {
      is_deleted: true,
    });
  }
}
