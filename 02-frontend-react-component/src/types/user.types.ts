/**
 * Type definitions for User domain
 * 
 * These types represent the data structures used throughout the application.
 * They are shared between components, hooks, and API layer.
 */

export interface User {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly createdAt: string;
  readonly updatedAt: string;
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

export interface PaginatedUsersResponse {
  readonly data: User[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly totalPages: number;
}

export interface ApiError {
  readonly statusCode: number;
  readonly code: string;
  readonly message: string;
  readonly timestamp: string;
  readonly path: string;
  readonly details?: Record<string, unknown>;
}

export type SortField = 'firstName' | 'lastName' | 'email' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

export interface SortOptions {
  readonly field: SortField;
  readonly direction: SortDirection;
}


