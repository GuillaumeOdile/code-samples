/**
 * SearchFilters component
 * 
 * Provides search and filtering functionality for the user table.
 * Includes debounced input and accessibility features.
 */

import { useState, useEffect, useCallback } from 'react';
import { UserFilters } from '@/types/user.types';

interface SearchFiltersProps {
  /**
   * Current filter values
   */
  filters: UserFilters;
  
  /**
   * Callback when filters change
   */
  onFiltersChange: (filters: UserFilters) => void;
}

/**
 * Debounced input hook
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Search filters component
 */
export function SearchFilters({ filters, onFiltersChange }: SearchFiltersProps): JSX.Element {
  const [localFilters, setLocalFilters] = useState<UserFilters>(filters);
  
  // Debounce filter changes to avoid excessive API calls
  const debouncedFilters = useDebounce(localFilters, 300);

  // Update parent when debounced filters change
  useEffect(() => {
    onFiltersChange(debouncedFilters);
  }, [debouncedFilters, onFiltersChange]);

  // Update local state when parent filters change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleInputChange = useCallback((field: keyof UserFilters, value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value.trim() || undefined,
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    const clearedFilters: UserFilters = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  }, [onFiltersChange]);

  const hasActiveFilters = Object.values(filters).some(value => value && value.trim() !== '');

  return (
    <div className="search-filters" role="search" aria-label="User search and filters">
      <div className="filters-grid">
        <div className="filter-group">
          <label htmlFor="email-filter" className="filter-label">
            Email
          </label>
          <input
            id="email-filter"
            type="text"
            className="filter-input"
            placeholder="Search by email..."
            value={localFilters.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
            aria-describedby="email-filter-help"
          />
          <small id="email-filter-help" className="filter-help">
            Partial matches are supported
          </small>
        </div>

        <div className="filter-group">
          <label htmlFor="firstName-filter" className="filter-label">
            First Name
          </label>
          <input
            id="firstName-filter"
            type="text"
            className="filter-input"
            placeholder="Search by first name..."
            value={localFilters.firstName || ''}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            aria-describedby="firstName-filter-help"
          />
          <small id="firstName-filter-help" className="filter-help">
            Partial matches are supported
          </small>
        </div>

        <div className="filter-group">
          <label htmlFor="lastName-filter" className="filter-label">
            Last Name
          </label>
          <input
            id="lastName-filter"
            type="text"
            className="filter-input"
            placeholder="Search by last name..."
            value={localFilters.lastName || ''}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            aria-describedby="lastName-filter-help"
          />
          <small id="lastName-filter-help" className="filter-help">
            Partial matches are supported
          </small>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="filter-actions">
          <button
            type="button"
            className="clear-filters-button"
            onClick={handleClearFilters}
            aria-label="Clear all filters"
          >
            Clear Filters
          </button>
        </div>
      )}

      {hasActiveFilters && (
        <div className="active-filters" role="status" aria-live="polite">
          <span className="active-filters-label">Active filters:</span>
          <div className="active-filter-tags">
            {filters.email && (
              <span className="filter-tag">
                Email: {filters.email}
                <button
                  type="button"
                  className="filter-tag-remove"
                  onClick={() => handleInputChange('email', '')}
                  aria-label={`Remove email filter: ${filters.email}`}
                >
                  ×
                </button>
              </span>
            )}
            {filters.firstName && (
              <span className="filter-tag">
                First Name: {filters.firstName}
                <button
                  type="button"
                  className="filter-tag-remove"
                  onClick={() => handleInputChange('firstName', '')}
                  aria-label={`Remove first name filter: ${filters.firstName}`}
                >
                  ×
                </button>
              </span>
            )}
            {filters.lastName && (
              <span className="filter-tag">
                Last Name: {filters.lastName}
                <button
                  type="button"
                  className="filter-tag-remove"
                  onClick={() => handleInputChange('lastName', '')}
                  aria-label={`Remove last name filter: ${filters.lastName}`}
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
