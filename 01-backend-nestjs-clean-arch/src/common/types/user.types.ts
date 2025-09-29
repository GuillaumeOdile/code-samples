/**
 * Domain types for User entity
 *
 * These types represent the core business concepts and are independent
 * of any external frameworks or infrastructure concerns.
 */

export interface User {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface CreateUserData {
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
}

export interface UpdateUserData {
  readonly email?: string;
  readonly firstName?: string;
  readonly lastName?: string;
}

export interface UserFilters {
  readonly email?: string;
  readonly firstName?: string;
  readonly lastName?: string;
}

export interface PaginationOptions {
  readonly page: number;
  readonly limit: number;
}

export interface PaginatedResult<T> {
  readonly data: T[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly totalPages: number;
}
