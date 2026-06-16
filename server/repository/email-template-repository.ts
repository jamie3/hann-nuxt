import { BaseRepository } from './base-repository';
import type { DB } from '../types/database-types';
import { Selectable, Insertable, Updateable } from 'kysely';

export interface EmailTemplateRow extends Selectable<DB['email_template']> {}
export interface EmailTemplateInsert extends Insertable<DB['email_template']> {}
export interface EmailTemplateUpdate extends Updateable<DB['email_template']> {}

export class EmailTemplateRepository extends BaseRepository<
  DB,
  'email_template',
  EmailTemplateRow,
  EmailTemplateInsert,
  EmailTemplateUpdate
> {
  constructor(db: any) {
    super(db, 'email_template');
  }

  async create(data: EmailTemplateInsert): Promise<EmailTemplateRow> {
    return await this.insert(data);
  }

  /**
   * List all non-deleted templates, most recently updated first
   */
  async findAllTemplates(): Promise<EmailTemplateRow[]> {
    return await this.db
      .selectFrom(this.tableName)
      .selectAll()
      .where('is_deleted', '=', false)
      .orderBy('updated_at', 'desc')
      .execute();
  }
}
