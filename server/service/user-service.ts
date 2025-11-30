import { UserRepository } from '../repository/user-repository';
import bcrypt from 'bcrypt';
import { Selectable } from 'kysely';
import type { Database } from '../types/database-types';

type User = Selectable<Database['user']>;

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async authenticateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return null;
    }

    // Update last login timestamp
    await this.userRepository.updateLastLogin(user.id);

    return user;
  }

  async findUserByUsername(username: string): Promise<User | undefined> {
    return await this.userRepository.findByUsername(username);
  }

  async findUserById(id: number): Promise<User | undefined> {
    return await this.userRepository.findById(id);
  }

  async createUser(username: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.userRepository.insert({
      username,
      password: hashedPassword,
    });
  }
}
