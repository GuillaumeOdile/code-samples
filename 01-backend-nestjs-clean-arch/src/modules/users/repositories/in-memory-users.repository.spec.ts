import { InMemoryUsersRepository } from './in-memory-users.repository';
import {
  CreateUserData,
  UpdateUserData,
} from '../../../common/types/user.types';

/**
 * Unit tests for InMemoryUsersRepository
 *
 * Tests the repository implementation in isolation.
 * Verifies data persistence, filtering, and pagination logic.
 */
describe('InMemoryUsersRepository', () => {
  let repository: InMemoryUsersRepository;

  beforeEach(() => {
    repository = new InMemoryUsersRepository();
  });

  describe('create', () => {
    it('should create a user with generated ID and timestamps', async () => {
      // Arrange
      const userData: CreateUserData = {
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      // Act
      const result = await repository.create(userData);

      // Assert
      expect(result.id).toBeDefined();
      expect(result.email).toBe('john.doe@example.com');
      expect(result.firstName).toBe('John');
      expect(result.lastName).toBe('Doe');
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(result.createdAt).toEqual(result.updatedAt);
    });

    it('should normalize email to lowercase and trim whitespace', async () => {
      // Arrange
      const userData: CreateUserData = {
        email: '  JOHN.DOE@EXAMPLE.COM  ',
        firstName: 'John',
        lastName: 'Doe',
      };

      // Act
      const result = await repository.create(userData);

      // Assert
      expect(result.email).toBe('john.doe@example.com');
    });

    it('should trim whitespace from names', async () => {
      // Arrange
      const userData: CreateUserData = {
        email: 'john.doe@example.com',
        firstName: '  John  ',
        lastName: '  Doe  ',
      };

      // Act
      const result = await repository.create(userData);

      // Assert
      expect(result.firstName).toBe('John');
      expect(result.lastName).toBe('Doe');
    });
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      // Arrange
      const userData: CreateUserData = {
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };
      const createdUser = await repository.create(userData);

      // Act
      const result = await repository.findById(createdUser.id);

      // Assert
      expect(result).toEqual(createdUser);
    });

    it('should return null when user not found', async () => {
      // Act
      const result = await repository.findById('non-existent-id');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return user when found by email', async () => {
      // Arrange
      const userData: CreateUserData = {
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };
      const createdUser = await repository.create(userData);

      // Act
      const result = await repository.findByEmail('john.doe@example.com');

      // Assert
      expect(result).toEqual(createdUser);
    });

    it('should return user with case-insensitive email search', async () => {
      // Arrange
      const userData: CreateUserData = {
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };
      const createdUser = await repository.create(userData);

      // Act
      const result = await repository.findByEmail('JOHN.DOE@EXAMPLE.COM');

      // Assert
      expect(result).toEqual(createdUser);
    });

    it('should return null when user not found by email', async () => {
      // Act
      const result = await repository.findByEmail('non-existent@example.com');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update user successfully', async () => {
      // Arrange
      const userData: CreateUserData = {
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };
      const createdUser = await repository.create(userData);
      const updateData: UpdateUserData = {
        firstName: 'Jane',
        lastName: 'Smith',
      };

      // Act
      // Add small delay to ensure updatedAt is different
      await new Promise((resolve) => setTimeout(resolve, 1));
      const result = await repository.update(createdUser.id, updateData);

      // Assert
      expect(result.id).toBe(createdUser.id);
      expect(result.email).toBe(createdUser.email);
      expect(result.firstName).toBe('Jane');
      expect(result.lastName).toBe('Smith');
      expect(result.createdAt).toEqual(createdUser.createdAt);
      expect(result.updatedAt.getTime()).toBeGreaterThanOrEqual(
        createdUser.updatedAt.getTime(),
      );
    });

    it('should throw error when updating non-existent user', async () => {
      // Arrange
      const updateData: UpdateUserData = { firstName: 'Jane' };

      // Act & Assert
      await expect(
        repository.update('non-existent-id', updateData),
      ).rejects.toThrow("User with ID 'non-existent-id' not found");
    });
  });

  describe('delete', () => {
    it('should delete user successfully', async () => {
      // Arrange
      const userData: CreateUserData = {
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };
      const createdUser = await repository.create(userData);

      // Act
      await repository.delete(createdUser.id);

      // Assert
      const result = await repository.findById(createdUser.id);
      expect(result).toBeNull();
    });

    it('should throw error when deleting non-existent user', async () => {
      // Act & Assert
      await expect(repository.delete('non-existent-id')).rejects.toThrow(
        "User with ID 'non-existent-id' not found",
      );
    });
  });

  describe('findMany', () => {
    beforeEach(async () => {
      // Create test users
      await repository.create({
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
      });
      await repository.create({
        email: 'jane.smith@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
      });
      await repository.create({
        email: 'bob.johnson@example.com',
        firstName: 'Bob',
        lastName: 'Johnson',
      });
    });

    it('should return all users without filters', async () => {
      // Act
      const result = await repository.findMany();

      // Assert
      expect(result.data).toHaveLength(3);
      expect(result.total).toBe(3);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);
    });

    it('should filter users by email', async () => {
      // Act
      const result = await repository.findMany({ email: 'john' });

      // Assert
      expect(result.data).toHaveLength(2); // john.doe and bob.johnson
      expect(result.data.every((user) => user.email.includes('john'))).toBe(
        true,
      );
    });

    it('should filter users by first name', async () => {
      // Act
      const result = await repository.findMany({ firstName: 'jane' });

      // Assert
      expect(result.data).toHaveLength(1);
      expect(result.data[0].firstName).toBe('Jane');
    });

    it('should paginate results correctly', async () => {
      // Act
      const result = await repository.findMany(undefined, {
        page: 1,
        limit: 2,
      });

      // Assert
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(3);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(2);
      expect(result.totalPages).toBe(2);
    });

    it('should return second page correctly', async () => {
      // Act
      const result = await repository.findMany(undefined, {
        page: 2,
        limit: 2,
      });

      // Assert
      expect(result.data).toHaveLength(1);
      expect(result.page).toBe(2);
      expect(result.totalPages).toBe(2);
    });
  });

  describe('existsByEmail', () => {
    it('should return true when user exists', async () => {
      // Arrange
      const userData: CreateUserData = {
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };
      await repository.create(userData);

      // Act
      const result = await repository.existsByEmail('john.doe@example.com');

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when user does not exist', async () => {
      // Act
      const result = await repository.existsByEmail('non-existent@example.com');

      // Assert
      expect(result).toBe(false);
    });
  });
});
