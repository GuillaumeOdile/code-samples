/**
 * API mocks for testing
 * 
 * Provides mock implementations of the API client for isolated testing.
 */

import { vi } from 'vitest';
import { User, CreateUserData, UpdateUserData, UserFilters, PaginationOptions, PaginatedUsersResponse } from '@/types/user.types';

// Mock user data
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    createdAt: '2024-01-15T10:30:00.000Z',
    updatedAt: '2024-01-15T10:30:00.000Z',
  },
  {
    id: '2',
    email: 'jane.smith@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    createdAt: '2024-01-16T14:20:00.000Z',
    updatedAt: '2024-01-16T14:20:00.000Z',
  },
  {
    id: '3',
    email: 'bob.johnson@example.com',
    firstName: 'Bob',
    lastName: 'Johnson',
    createdAt: '2024-01-17T09:15:00.000Z',
    updatedAt: '2024-01-17T09:15:00.000Z',
  },
];

// Mock API responses
export const mockPaginatedResponse: PaginatedUsersResponse = {
  data: mockUsers,
  total: mockUsers.length,
  page: 1,
  limit: 10,
  totalPages: 1,
};

// Mock API client
export const mockUserApi = {
  getUsers: vi.fn().mockResolvedValue(mockPaginatedResponse),
  getUserById: vi.fn().mockImplementation((id: string) => {
    const user = mockUsers.find(u => u.id === id);
    if (!user) {
      throw new Error('User not found');
    }
    return Promise.resolve(user);
  }),
  createUser: vi.fn().mockImplementation((data: CreateUserData) => {
    const newUser: User = {
      id: String(mockUsers.length + 1),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockUsers.push(newUser);
    return Promise.resolve(newUser);
  }),
  updateUser: vi.fn().mockImplementation((id: string, data: UpdateUserData) => {
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    const updatedUser = {
      ...mockUsers[userIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    mockUsers[userIndex] = updatedUser;
    return Promise.resolve(updatedUser);
  }),
  deleteUser: vi.fn().mockImplementation((id: string) => {
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    mockUsers.splice(userIndex, 1);
    return Promise.resolve();
  }),
};

// Reset mocks helper
export function resetApiMocks(): void {
  Object.values(mockUserApi).forEach(mock => {
    if (typeof mock === 'function' && 'mockReset' in mock) {
      mock.mockReset();
    }
  });
}
