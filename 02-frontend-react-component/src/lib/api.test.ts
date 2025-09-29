/**
 * API client tests
 * 
 * Tests the API client functionality including:
 * - Request/response handling
 * - Error handling and mapping
 * - Query string building
 * - Network error handling
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { userApi, ApiClientError } from './api';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('userApi', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getUsers', () => {
    it('fetches users without filters', async () => {
      const mockResponse = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockResponse }),
      });

      const result = await userApi.getUsers();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/users',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('fetches users with filters and pagination', async () => {
      const mockResponse = {
        data: [],
        total: 0,
        page: 1,
        limit: 5,
        totalPages: 0,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockResponse }),
      });

      const filters = { email: 'john' };
      const pagination = { page: 1, limit: 5 };

      const result = await userApi.getUsers(filters, pagination);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/users/search?email=john&page=1&limit=5',
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse);
    });

    it('handles API error responses', async () => {
      const errorResponse = {
        statusCode: 400,
        code: 'VALIDATION_ERROR',
        message: 'Invalid request',
        timestamp: '2024-01-18T10:00:00.000Z',
        path: '/users',
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve(errorResponse),
      });

      await expect(userApi.getUsers()).rejects.toThrow(ApiClientError);
      await expect(userApi.getUsers()).rejects.toThrow('Network error or server unavailable');
    });
  });

  describe('getUserById', () => {
    it('fetches a user by ID', async () => {
      const mockUser = {
        id: '1',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        createdAt: '2024-01-15T10:30:00.000Z',
        updatedAt: '2024-01-15T10:30:00.000Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockUser }),
      });

      const result = await userApi.getUserById('1');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/users/1',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockUser);
    });

    it('handles 404 error for non-existent user', async () => {
      const errorResponse = {
        statusCode: 404,
        code: 'USER_NOT_FOUND',
        message: 'User not found',
        timestamp: '2024-01-18T10:00:00.000Z',
        path: '/users/999',
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve(errorResponse),
      });

      await expect(userApi.getUserById('999')).rejects.toThrow(ApiClientError);
      await expect(userApi.getUserById('999')).rejects.toThrow('Network error or server unavailable');
    });
  });

  describe('createUser', () => {
    it('creates a new user', async () => {
      const userData = {
        email: 'new@example.com',
        firstName: 'New',
        lastName: 'User',
      };

      const createdUser = {
        id: '2',
        ...userData,
        createdAt: '2024-01-18T10:00:00.000Z',
        updatedAt: '2024-01-18T10:00:00.000Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: createdUser }),
      });

      const result = await userApi.createUser(userData);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/users',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(userData),
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual(createdUser);
    });

    it('handles validation errors', async () => {
      const invalidUserData = {
        email: 'invalid-email',
        firstName: '',
        lastName: '',
      };

      const errorResponse = {
        statusCode: 400,
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        errors: ['Email must be valid', 'First name is required'],
        timestamp: '2024-01-18T10:00:00.000Z',
        path: '/users',
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve(errorResponse),
      });

      await expect(userApi.createUser(invalidUserData)).rejects.toThrow(ApiClientError);
    });
  });

  describe('updateUser', () => {
    it('updates an existing user', async () => {
      const updateData = { firstName: 'Updated' };
      const updatedUser = {
        id: '1',
        email: 'john@example.com',
        firstName: 'Updated',
        lastName: 'Doe',
        createdAt: '2024-01-15T10:30:00.000Z',
        updatedAt: '2024-01-18T10:00:00.000Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: updatedUser }),
      });

      const result = await userApi.updateUser('1', updateData);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/users/1',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify(updateData),
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual(updatedUser);
    });
  });

  describe('deleteUser', () => {
    it('deletes a user', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
      });

      await userApi.deleteUser('1');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/users/1',
        expect.objectContaining({
          method: 'DELETE',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
    });
  });

  describe('error handling', () => {
    it('handles network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(userApi.getUsers()).rejects.toThrow(ApiClientError);
      await expect(userApi.getUsers()).rejects.toThrow('Network error or server unavailable');
    });

    it('handles malformed JSON responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error('Invalid JSON')),
      });

      await expect(userApi.getUsers()).rejects.toThrow(ApiClientError);
    });

    it('handles unknown error responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
      });

      await expect(userApi.getUsers()).rejects.toThrow(ApiClientError);
    });
  });
});

describe('ApiClientError', () => {
  it('creates error with proper properties', () => {
    const error = new ApiClientError('Test error', 400, 'TEST_ERROR', { field: 'email' });

    expect(error.message).toBe('Test error');
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe('TEST_ERROR');
    expect(error.details).toEqual({ field: 'email' });
    expect(error.name).toBe('ApiClientError');
  });
});
