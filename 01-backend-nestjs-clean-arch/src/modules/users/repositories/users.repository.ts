import {
  User,
  CreateUserData,
  UpdateUserData,
  UserFilters,
  PaginatedResult,
} from '../../../common/types/user.types';

/**
 * Repository interface for User persistence
 *
 * Defines the contract for user data access operations.
 * This abstraction allows switching between different storage implementations
 * (in-memory, database, etc.) without changing business logic.
 */
export abstract class UsersRepository {
  /**
   * Creates a new user
   */
  abstract create(data: CreateUserData): Promise<User>;

  /**
   * Finds a user by ID
   */
  abstract findById(id: string): Promise<User | null>;

  /**
   * Finds a user by email
   */
  abstract findByEmail(email: string): Promise<User | null>;

  /**
   * Updates an existing user
   */
  abstract update(id: string, data: UpdateUserData): Promise<User>;

  /**
   * Deletes a user by ID
   */
  abstract delete(id: string): Promise<void>;

  /**
   * Lists users with optional filtering and pagination
   */
  abstract findMany(
    filters?: UserFilters,
    pagination?: { page: number; limit: number },
  ): Promise<PaginatedResult<User>>;

  /**
   * Checks if a user exists by email
   */
  abstract existsByEmail(email: string): Promise<boolean>;
}
