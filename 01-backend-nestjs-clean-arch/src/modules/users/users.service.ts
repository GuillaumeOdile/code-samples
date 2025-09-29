import { Injectable } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import {
  User,
  CreateUserData,
  UpdateUserData,
  UserFilters,
  PaginatedResult,
} from '../../common/types/user.types';
import {
  UserNotFoundError,
  UserEmailAlreadyExistsError,
  InvalidUserDataError,
} from '../../common/errors/domain-errors';

// Users service - handles all the business logic
// Keeps the controller thin by doing the heavy lifting here
@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  // Create user with validation
  async createUser(data: CreateUserData): Promise<User> {
    // Check if email already exists
    const existingUser = await this.usersRepository.findByEmail(data.email);
    if (existingUser) {
      throw new UserEmailAlreadyExistsError(data.email);
    }

    return this.usersRepository.create(data);
  }

  // Get user by ID
  async getUserById(id: string | number): Promise<User> {
    const user = await this.usersRepository.findById(String(id));
    if (!user) {
      throw new UserNotFoundError(String(id));
    }
    return user;
  }

  // Update user
  async updateUser(id: string | number, data: UpdateUserData): Promise<User> {
    const idStr = String(id);
    // Check if user exists
    const existingUser = await this.usersRepository.findById(idStr);
    if (!existingUser) {
      throw new UserNotFoundError(idStr);
    }

    // Validate email uniqueness if email is being updated
    if (data.email && data.email !== existingUser.email) {
      const emailExists = await this.usersRepository.existsByEmail(data.email);
      if (emailExists) {
        throw new UserEmailAlreadyExistsError(data.email);
      }
    }

    return this.usersRepository.update(idStr, data);
  }

  /**
   * Deletes a user
   */
  async deleteUser(id: string | number): Promise<void> {
    const idStr = String(id);
    const user = await this.usersRepository.findById(idStr);
    if (!user) {
      throw new UserNotFoundError(idStr);
    }

    await this.usersRepository.delete(idStr);
  }

  /**
   * Lists users with filtering and pagination
   */
  async getUsers(
    filters?: UserFilters,
    pagination?: { page: number; limit: number },
  ): Promise<PaginatedResult<User>> {
    // Validate pagination parameters
    if (pagination) {
      if (pagination.page < 1) {
        throw new InvalidUserDataError('Page must be greater than 0');
      }
      if (pagination.limit < 1 || pagination.limit > 100) {
        throw new InvalidUserDataError('Limit must be between 1 and 100');
      }
    }

    return this.usersRepository.findMany(filters, pagination);
  }

  // Generate username from email - not used yet but might be useful
  private generateUsername(email: string): string {
    const baseUsername = email.split('@')[0].toLowerCase();
    const timestamp = Date.now().toString().slice(-4);
    return `${baseUsername}_${timestamp}`;
  }
}
