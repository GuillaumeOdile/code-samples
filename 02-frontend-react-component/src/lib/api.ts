/**
 * API client for user management
 * 
 * Provides a clean interface for communicating with the backend API.
 * Handles request/response transformation and error handling.
 */

import { User, CreateUserData, UpdateUserData, UserFilters, PaginationOptions, PaginatedUsersResponse, ApiError } from '@/types/user.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Custom error class for API errors
 */
export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

/**
 * Generic API request function with error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        statusCode: response.status,
        code: 'UNKNOWN_ERROR',
        message: 'An unknown error occurred',
        timestamp: new Date().toISOString(),
        path: endpoint,
      }));
      
      throw new ApiClientError(
        errorData.message,
        errorData.statusCode,
        errorData.code,
        errorData.details,
      );
    }

    // Handle 204 No Content responses
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    
    // Network or other errors
    throw new ApiClientError(
      'Network error or server unavailable',
      0,
      'NETWORK_ERROR',
    );
  }
}

/**
 * Build query string from parameters
 */
function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * User API client
 */
export const userApi = {
  /**
   * Get all users with optional filtering and pagination
   */
  async getUsers(
    filters?: UserFilters,
    pagination?: PaginationOptions,
  ): Promise<PaginatedUsersResponse> {
    const params = {
      ...filters,
      ...pagination,
    };
    
    const queryString = buildQueryString(params);
    
    // Use /users/search endpoint when there are filters, otherwise use /users
    const hasFilters = filters && Object.keys(filters).some(key => filters[key as keyof UserFilters]);
    const endpoint = hasFilters ? `/users/search${queryString}` : `/users${queryString}`;
    
    // The API now returns { success: true, data: { data: [...], total: ... } }
    // We need to extract the inner data structure
    const response = await apiRequest<{ success: boolean; data: PaginatedUsersResponse }>(endpoint);
    return response.data;
  },

  /**
   * Get a user by ID
   */
  async getUserById(id: string): Promise<User> {
    const response = await apiRequest<{ success: boolean; data: User }>(`/users/${id}`);
    return response.data;
  },

  /**
   * Create a new user
   */
  async createUser(data: CreateUserData): Promise<User> {
    const response = await apiRequest<{ success: boolean; data: User }>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  /**
   * Update an existing user
   */
  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    const response = await apiRequest<{ success: boolean; data: User }>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  /**
   * Delete a user
   */
  async deleteUser(id: string): Promise<void> {
    return apiRequest<void>(`/users/${id}`, {
      method: 'DELETE',
    });
  },
};


