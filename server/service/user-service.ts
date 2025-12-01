import { UserRepository } from '../repository/user-repository';
import type { UserRow } from '../repository/user-repository';
import type { User, NewUser } from '../types/user-types';
import bcrypt from 'bcrypt';

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  // Map database row to domain model
  private mapToUser(row: UserRow): User {
    return {
      id: row.id,
      username: row.username,
      password: row.password,
      name: row.name ?? null,
      locked: row.locked ?? false,
      disabled: row.disabled ?? false,
      failed_login_attempts: row.failed_login_attempts ?? 0,
      last_login_at: row.last_login_at ? new Date(row.last_login_at) : null,
      is_deleted: row.is_deleted,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    };
  }

  async authenticateUser(username: string, password: string): Promise<User | null> {
    const userRow = await this.userRepository.findByUsername(username);

    if (!userRow) {
      return null;
    }

    // Check if user is locked
    if (userRow.locked) {
      throw new Error(
        'Account is locked due to too many failed login attempts. Please contact an administrator.'
      );
    }

    // Check if user is disabled
    if (userRow.disabled) {
      throw new Error('Account is disabled. Please contact an administrator.');
    }

    const isValidPassword = await bcrypt.compare(password, userRow.password);

    if (!isValidPassword) {
      // Increment failed login attempts
      const newFailedAttempts = (userRow.failed_login_attempts ?? 0) + 1;

      // Lock account if 5 or more failed attempts
      if (newFailedAttempts >= 5) {
        await this.userRepository.update(userRow.id, {
          failed_login_attempts: newFailedAttempts,
          locked: true,
        });
        throw new Error(
          'Account has been locked due to too many failed login attempts. Please contact an administrator.'
        );
      } else {
        await this.userRepository.update(userRow.id, {
          failed_login_attempts: newFailedAttempts,
        });
      }

      return null;
    }

    // Successful login - reset failed attempts and update last login
    await this.userRepository.update(userRow.id, {
      failed_login_attempts: 0,
      last_login_at: new Date(),
    });

    return this.mapToUser(userRow);
  }

  async findUserByUsername(username: string): Promise<User | null> {
    const userRow = await this.userRepository.findByUsername(username);
    return userRow ? this.mapToUser(userRow) : null;
  }

  async findUserById(id: string): Promise<User | null> {
    const userRow = await this.userRepository.findById(id);
    return userRow ? this.mapToUser(userRow) : null;
  }

  async createUser(data: NewUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const userRow = await this.userRepository.insert({
      username: data.username,
      password: hashedPassword,
    });

    return this.mapToUser(userRow);
  }

  async getAllUsers(): Promise<User[]> {
    const userRows = await this.userRepository.findAll();
    return userRows.map((row) => this.mapToUser(row));
  }
}
