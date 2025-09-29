// Main user table - handles all the CRUD operations
// Split into smaller components to keep this manageable

import { useState, useCallback } from 'react';
import { useUsers, useDeleteUser } from '@/hooks/useUsers';
import { UserFilters, PaginationOptions, SortOptions, SortField } from '@/types/user.types';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { TableHeader } from './UserTableHeader';
import { TableRow } from './UserTableRow';
import { Pagination } from './PaginationControls';
import { SearchFilters } from './SearchFilters';

interface UserTableProps {
  onEditUser?: (userId: string) => void;
  onViewUser?: (userId: string) => void;
}

// Main table component - added accessibility features after UX review
export function UserTable({ onEditUser, onViewUser }: UserTableProps): JSX.Element {
  // Local state for filters, pagination, etc.
  const [filters, setFilters] = useState<UserFilters>({});
  const [pagination, setPagination] = useState<PaginationOptions>({ page: 1, limit: 10 });
  const [sortOptions, setSortOptions] = useState<SortOptions>({ field: 'createdAt', direction: 'desc' });

  // Data hooks
  const { data, isLoading, error, refetch } = useUsers(filters, pagination, sortOptions);
  const deleteUserMutation = useDeleteUser();

  // Event handlers - using useCallback to prevent unnecessary re-renders
  const handleSort = useCallback((field: SortField) => {
    setSortOptions(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const handleLimitChange = useCallback((limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 })); // Reset to page 1 when changing limit
  }, []);

  const handleFiltersChange = useCallback((newFilters: UserFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset pagination when filtering
  }, []);

  const handleDeleteUser = useCallback(async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUserMutation.mutateAsync(userId);
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  }, [deleteUserMutation]);

  // Loading state
  if (isLoading) {
    return (
      <div className="user-table-container" role="status" aria-live="polite">
        <LoadingSpinner />
        <span className="sr-only">Loading users...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="user-table-container">
        <ErrorMessage 
          error={error as Error} 
          onRetry={refetch}
        />
      </div>
    );
  }

  // No data state
  if (!data || data.data.length === 0) {
    const hasActiveFilters = Object.keys(filters).length > 0;
    
    return (
      <div className="user-table-container">
        <div className="no-data-message" role="status">
          <h3>No users found</h3>
          <p>
            {hasActiveFilters 
              ? 'No users match your current search criteria.'
              : 'No users have been created yet.'
            }
          </p>
          
          {/* Action buttons */}
          <div className="no-data-actions">
            {hasActiveFilters && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => handleFiltersChange({})}
                aria-label="Clear all filters and show all users"
              >
                Clear Filters
              </button>
            )}
            
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => refetch()}
              aria-label="Refresh the user list"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-table-container">
      {/* Search and filters */}
      <SearchFilters 
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Table */}
      <div className="table-wrapper">
        <table 
          className="user-table"
          role="table"
          aria-label="Users table"
        >
        <TableHeader
          sortOptions={sortOptions}
          onSort={handleSort}
        />
          <tbody>
            {data.data.map((user, index) => (
              <TableRow
                key={user.id}
                user={user}
                index={index}
                onEdit={onEditUser}
                onView={onViewUser}
                onDelete={handleDeleteUser}
                isDeleting={deleteUserMutation.isLoading}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={data.page}
        totalPages={data.totalPages}
        totalItems={data.total}
        itemsPerPage={data.limit}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleLimitChange}
      />
    </div>
  );
}
