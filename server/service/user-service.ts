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

    const isValidPassword = await bcrypt.compare(password, userRow.password);

    if (!isValidPassword) {
      return null;
    }

    // Update last login timestamp
    await this.userRepository.updateLastLogin(userRow.id);

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
}
