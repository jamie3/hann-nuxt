import { BaseRepository } from './base-repository';
import type { DB } from '../types/database-types';
import { Selectable, Insertable, Updateable } from 'kysely';

export interface ReferralEmailRow extends Selectable<DB['referral_email']> {}
export interface ReferralEmailInsert extends Insertable<DB['referral_email']> {}
export interface ReferralEmailUpdate extends Updateable<DB['referral_email']> {}

export class ReferralEmailRepository extends BaseRepository<
  DB,
  'referral_email',
  ReferralEmailRow,
  ReferralEmailInsert,
  ReferralEmailUpdate
> {
  constructor(db: any) {
    super(db, 'referral_email');
  }

  async create(data: ReferralEmailInsert): Promise<ReferralEmailRow> {
    return await this.insert(data);
  }

  /**
   * Find email record by Postmark MessageID
   */
  async findByMessageId(messageId: string): Promise<ReferralEmailRow | null> {
    const result = await this.db
      .selectFrom(this.tableName)
      .selectAll()
      .where('message_id', '=', messageId)
      .executeTakeFirst();

    return result || null;
  }

  /**
   * Find all emails for a referral
   */
  async findByReferralId(referralId: string): Promise<ReferralEmailRow[]> {
    return await this.db
      .selectFrom(this.tableName)
      .selectAll()
      .where('referral_id', '=', parseInt(referralId))
      .orderBy('created_at', 'desc')
      .execute();
  }

  /**
   * Find all emails for a referral, including the name of the template used
   * (null when the email was composed manually). Soft-deleted templates still
   * resolve their name so historical activity stays meaningful.
   */
  async findByReferralIdWithTemplate(referralId: string): Promise<any[]> {
    return await this.db
      .selectFrom(this.tableName)
      .leftJoin('email_template', 'email_template.id', 'referral_email.template_id')
      .selectAll('referral_email')
      .select('email_template.name as template_name')
      .where('referral_email.referral_id', '=', parseInt(referralId))
      .orderBy('referral_email.created_at', 'desc')
      .execute();
  }

  /**
   * Find all emails ordered by created_at
   */
  async findAllEmails(): Promise<ReferralEmailRow[]> {
    return await this.db
      .selectFrom(this.tableName)
      .selectAll()
      .orderBy('created_at', 'desc')
      .execute();
  }

  /**
   * Find all emails with referral info (first_name, last_name)
   */
  async findAllEmailsWithReferralInfo(): Promise<any[]> {
    return await this.db
      .selectFrom(this.tableName)
      .leftJoin('referral', 'referral.id', 'referral_email.referral_id')
      .leftJoin('email_template', 'email_template.id', 'referral_email.template_id')
      .selectAll('referral_email')
      .select(['referral.first_name', 'referral.last_name', 'email_template.name as template_name'])
      .orderBy('referral_email.created_at', 'desc')
      .execute();
  }

  /**
   * Find email by ID (doesn't check is_deleted since referral_email doesn't have that column)
   */
  async findEmailById(id: string): Promise<ReferralEmailRow | null> {
    const result = await this.db
      .selectFrom(this.tableName)
      .selectAll()
      .where('id', '=', parseInt(id))
      .executeTakeFirst();

    return result || null;
  }

  /**
   * Find scheduled emails that are due to be sent (scheduled_at <= now).
   *
   * Locks the returned rows with FOR UPDATE SKIP LOCKED so that concurrent
   * workers/cron invocations don't pick up the same email twice. Run this
   * inside a transaction and flip the status to 'sending' before releasing.
   */
  async findDueScheduled(now: Date, limit = 50): Promise<ReferralEmailRow[]> {
    return await this.db
      .selectFrom(this.tableName)
      .selectAll()
      .where('status', '=', 'scheduled')
      .where('scheduled_at', '<=', now)
      .orderBy('scheduled_at', 'asc')
      .limit(limit)
      .forUpdate()
      .skipLocked()
      .execute();
  }

  /**
   * Update email status based on webhook event
   */
  async updateFromWebhook(
    messageId: string,
    data: ReferralEmailUpdate
  ): Promise<ReferralEmailRow | null> {
    const existing = await this.findByMessageId(messageId);

    if (!existing) {
      return null;
    }

    return await this.update(existing.id.toString(), data);
  }
}
