import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import {
  User,
  CreateUserData,
  UpdateUserData,
  UserFilters,
  PaginatedResult,
} from '../../../common/types/user.types';

/**
 * In-memory implementation of UsersRepository
 *
 * Simple implementation for demonstration purposes.
 * In production, this would be replaced with a database implementation.
 *
 * Thread-safe operations using Map for O(1) lookups.
 */
@Injectable()
export class InMemoryUsersRepository extends UsersRepository {
  private readonly users = new Map<string, User>();
  private nextId = 1;

  async create(data: CreateUserData): Promise<User> {
    const now = new Date();
    const user: User = {
      id: this.nextId.toString(),
      email: data.email.toLowerCase().trim(),
      firstName: data.firstName?.trim() || '',
      lastName: data.lastName?.trim() || '',
      createdAt: now,
      updatedAt: now,
    };

    this.users.set(user.id, user);
    this.nextId++;
    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const normalizedEmail = email.toLowerCase().trim();

    for (const user of this.users.values()) {
      if (user.email === normalizedEmail) {
        return user;
      }
    }

    return null;
  }

  async update(id: string, data: UpdateUserData): Promise<User> {
    const existingUser = this.users.get(id);
    if (!existingUser) {
      throw new Error(`User with ID '${id}' not found`);
    }

    const updatedUser: User = {
      ...existingUser,
      ...(data.email && { email: data.email.toLowerCase().trim() }),
      ...(data.firstName && { firstName: data.firstName.trim() }),
      ...(data.lastName && { lastName: data.lastName.trim() }),
      updatedAt: new Date(),
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    if (!this.users.has(id)) {
      throw new Error(`User with ID '${id}' not found`);
    }

    this.users.delete(id);
  }

  async findMany(
    filters?: UserFilters,
    pagination?: { page: number; limit: number },
  ): Promise<PaginatedResult<User>> {
    let filteredUsers = Array.from(this.users.values());

    // Apply filters
    if (filters) {
      filteredUsers = filteredUsers.filter((user) => {
        if (
          filters.email &&
          !user.email.includes(filters.email.toLowerCase())
        ) {
          return false;
        }
        if (
          filters.firstName &&
          !user.firstName
            .toLowerCase()
            .includes(filters.firstName.toLowerCase())
        ) {
          return false;
        }
        if (
          filters.lastName &&
          !user.lastName.toLowerCase().includes(filters.lastName.toLowerCase())
        ) {
          return false;
        }
        return true;
      });
    }

    // Sort by creation date (newest first)
    filteredUsers.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const total = filteredUsers.length;
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const offset = (page - 1) * limit;

    // Apply pagination
    const paginatedUsers = filteredUsers.slice(offset, offset + limit);
    const totalPages = Math.ceil(total / limit);

    return {
      data: paginatedUsers,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async existsByEmail(email: string): Promise<boolean> {
    return (await this.findByEmail(email)) !== null;
  }
}
