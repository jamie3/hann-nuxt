import { BaseRepository } from './base-repository';
import type { Database } from '../types/database-types';
import { Selectable } from 'kysely';

export interface UserRow extends Selectable<Database['user']> {}

export class UserRepository extends BaseRepository<Database, 'user'> {
  constructor(db: any) {
    super(db, 'user');
  }

  async findByUsername(username: string): Promise<UserRow | undefined> {
    return await this.db
      .selectFrom('user')
      .selectAll()
      .where('username', '=', username)
      .where('is_deleted', '=', false)
      .executeTakeFirst();
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.db
      .updateTable('user')
      .set({ last_login_at: new Date() })
      .where('id', '=', userId)
      .execute();
  }
}
