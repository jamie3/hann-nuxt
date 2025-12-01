import { BaseRepository } from './base-repository';
import type { DB } from '../types/database-types';
import { Selectable } from 'kysely';

export interface UserRow extends Selectable<DB['user']> {}

export class UserRepository extends BaseRepository<DB, 'user'> {
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

  async findAll(): Promise<UserRow[]> {
    return await this.db
      .selectFrom('user')
      .selectAll()
      .where('is_deleted', '=', false)
      .orderBy('created_at', 'desc')
      .execute();
  }
}
