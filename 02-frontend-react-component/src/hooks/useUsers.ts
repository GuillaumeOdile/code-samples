// Custom hooks for user data - centralizing all the API logic here
// Makes components cleaner and easier to test

import { useQuery, useMutation, useQueryClient } from 'react-query';
import { userApi, ApiClientError } from '@/lib/api';
import { CreateUserData, UpdateUserData, UserFilters, PaginationOptions, SortOptions } from '@/types/user.types';

// Helper functions - might move these to a utils file later if needed

// Query keys for React Query cache - helps with invalidation
export const userQueryKeys = {
  all: ['users'] as const,
  lists: () => [...userQueryKeys.all, 'list'] as const,
  list: (filters?: UserFilters, pagination?: PaginationOptions) => 
    [...userQueryKeys.lists(), { filters, pagination }] as const,
  details: () => [...userQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...userQueryKeys.details(), id] as const,
};

// Main hook for fetching users - handles filtering and pagination
export function useUsers(
  filters?: UserFilters,
  pagination?: PaginationOptions,
  sortOptions?: SortOptions,
) {
  return useQuery(
    userQueryKeys.list(filters, pagination),
    () => userApi.getUsers(filters, pagination),
    {
      select: (data) => {
        if (!sortOptions) return data;
        
        // Client-side sorting for now - should move to backend eventually
        const sortedData = [...data.data].sort((a, b) => {
          const aValue = a[sortOptions.field];
          const bValue = b[sortOptions.field];
          
          if (aValue < bValue) return sortOptions.direction === 'asc' ? -1 : 1;
          if (aValue > bValue) return sortOptions.direction === 'asc' ? 1 : -1;
          return 0;
        });
        
        return {
          ...data,
          data: sortedData,
        };
      },
      staleTime: 5 * 60 * 1000, // 5 min - reasonable for user data
      cacheTime: 10 * 60 * 1000, // 10 min cache
    },
  );
}

// Hook for single user - used in detail views
export function useUser(id: string) {
  return useQuery(
    userQueryKeys.detail(id),
    () => userApi.getUserById(id),
    {
      enabled: !!id, // Only run if we have an ID
      staleTime: 5 * 60 * 1000,
    },
  );
}

// Hook for creating users - handles cache invalidation
export function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useMutation(
    (data: CreateUserData) => userApi.createUser(data),
    {
      onSuccess: () => {
        // Refresh the users list after creating
        queryClient.invalidateQueries(userQueryKeys.lists());
      },
      onError: (error: ApiClientError) => {
        console.error('Failed to create user:', error.message);
      },
    },
  );
}

/**
 * Hook for updating an existing user
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ id, data }: { id: string; data: UpdateUserData }) => 
      userApi.updateUser(id, data),
    {
      onSuccess: (updatedUser) => {
        // Update the specific user in cache
        queryClient.setQueryData(
          userQueryKeys.detail(updatedUser.id),
          updatedUser,
        );
        
        // Invalidate users list to ensure consistency
        queryClient.invalidateQueries(userQueryKeys.lists());
      },
      onError: (error: ApiClientError) => {
        console.error('Failed to update user:', error.message);
      },
    },
  );
}

/**
 * Hook for deleting a user
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation(
    (id: string) => userApi.deleteUser(id),
    {
      onSuccess: (_, deletedId) => {
        // Remove the user from cache
        queryClient.removeQueries(userQueryKeys.detail(deletedId));
        
        // Invalidate users list
        queryClient.invalidateQueries(userQueryKeys.lists());
      },
      onError: (error: ApiClientError) => {
        console.error('Failed to delete user:', error.message);
      },
    },
  );
}
