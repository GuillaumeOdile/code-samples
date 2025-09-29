/**
 * useUsers hook tests
 * 
 * Basic tests for the custom hook for user data management
 */

import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { describe, it, expect, vi } from 'vitest';
import { useUsers } from './useUsers';

// Mock the API module
vi.mock('@/lib/api', () => ({
  userApi: {
    getUsers: vi.fn(),
    getUserById: vi.fn(),
    createUser: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
  },
}));

// Test wrapper with React Query
function TestWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

describe('useUsers', () => {
  it('should render hook without errors', () => {
    const { result } = renderHook(() => useUsers(), {
      wrapper: TestWrapper,
    });

    expect(result.current).toBeDefined();
  });
});