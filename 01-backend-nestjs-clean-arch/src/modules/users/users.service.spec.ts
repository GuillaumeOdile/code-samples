import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './repositories/users.repository';
import {
  UserNotFoundError,
  UserEmailAlreadyExistsError,
  InvalidUserDataError,
} from '../../common/errors/domain-errors';
import {
  User,
  CreateUserData,
  UpdateUserData,
} from '../../common/types/user.types';

/**
 * Unit tests for UsersService
 *
 * Tests business logic in isolation from external dependencies.
 * Uses mocks to verify interactions with the repository layer.
 */
describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<UsersRepository>;

  const mockUser: User = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    createdAt: new Date('2024-01-15T10:30:00.000Z'),
    updatedAt: new Date('2024-01-15T10:30:00.000Z'),
  };

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
      existsByEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(UsersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    const createUserData: CreateUserData = {
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
    };

    it('should create a user successfully', async () => {
      // Arrange
      repository.findByEmail.mockResolvedValue(null);
      repository.create.mockResolvedValue(mockUser);

      // Act
      const result = await service.createUser(createUserData);

      // Assert
      expect(repository.findByEmail).toHaveBeenCalledWith(createUserData.email);
      expect(repository.create).toHaveBeenCalledWith(createUserData);
      expect(result).toEqual(mockUser);
    });

    it('should throw UserEmailAlreadyExistsError when email already exists', async () => {
      // Arrange
      repository.findByEmail.mockResolvedValue(mockUser);

      // Act & Assert
      await expect(service.createUser(createUserData)).rejects.toThrow(
        UserEmailAlreadyExistsError,
      );
      expect(repository.create).not.toHaveBeenCalled();
    });

    // Email validation is handled by DTO validation, not service logic

    // Note: Name validation is now handled by DTO validation, not service logic
  });

  describe('getUserById', () => {
    it('should return a user when found', async () => {
      // Arrange
      repository.findById.mockResolvedValue(mockUser);

      // Act
      const result = await service.getUserById(mockUser.id);

      // Assert
      expect(repository.findById).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(mockUser);
    });

    it('should throw UserNotFoundError when user not found', async () => {
      // Arrange
      repository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getUserById('non-existent-id')).rejects.toThrow(
        UserNotFoundError,
      );
    });
  });

  describe('updateUser', () => {
    const updateData: UpdateUserData = {
      firstName: 'Jane',
    };

    it('should update a user successfully', async () => {
      // Arrange
      const updatedUser = {
        ...mockUser,
        firstName: 'Jane',
        updatedAt: new Date(),
      };
      repository.findById.mockResolvedValue(mockUser);
      repository.update.mockResolvedValue(updatedUser);

      // Act
      const result = await service.updateUser(mockUser.id, updateData);

      // Assert
      expect(repository.findById).toHaveBeenCalledWith(mockUser.id);
      expect(repository.update).toHaveBeenCalledWith(mockUser.id, updateData);
      expect(result).toEqual(updatedUser);
    });

    it('should throw UserNotFoundError when user not found', async () => {
      // Arrange
      repository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.updateUser('non-existent-id', updateData),
      ).rejects.toThrow(UserNotFoundError);
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('should throw UserEmailAlreadyExistsError when email already exists', async () => {
      // Arrange
      const updateWithEmail = { ...updateData, email: 'existing@example.com' };
      repository.findById.mockResolvedValue(mockUser);
      repository.existsByEmail.mockResolvedValue(true);

      // Act & Assert
      await expect(
        service.updateUser(mockUser.id, updateWithEmail),
      ).rejects.toThrow(UserEmailAlreadyExistsError);
      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      // Arrange
      repository.findById.mockResolvedValue(mockUser);
      repository.delete.mockResolvedValue();

      // Act
      await service.deleteUser(mockUser.id);

      // Assert
      expect(repository.findById).toHaveBeenCalledWith(mockUser.id);
      expect(repository.delete).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw UserNotFoundError when user not found', async () => {
      // Arrange
      repository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.deleteUser('non-existent-id')).rejects.toThrow(
        UserNotFoundError,
      );
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });

  describe('getUsers', () => {
    it('should return paginated users', async () => {
      // Arrange
      const paginatedResult = {
        data: [mockUser],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };
      repository.findMany.mockResolvedValue(paginatedResult);

      // Act
      const result = await service.getUsers(undefined, { page: 1, limit: 10 });

      // Assert
      expect(repository.findMany).toHaveBeenCalledWith(undefined, {
        page: 1,
        limit: 10,
      });
      expect(result).toEqual(paginatedResult);
    });

    it('should throw InvalidUserDataError for invalid page', async () => {
      // Act & Assert
      await expect(
        service.getUsers(undefined, { page: 0, limit: 10 }),
      ).rejects.toThrow(InvalidUserDataError);
    });

    it('should throw InvalidUserDataError for invalid limit', async () => {
      // Act & Assert
      await expect(
        service.getUsers(undefined, { page: 1, limit: 101 }),
      ).rejects.toThrow(InvalidUserDataError);
    });
  });
});
