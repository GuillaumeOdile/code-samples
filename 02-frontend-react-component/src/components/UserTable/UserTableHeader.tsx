/**
 * UserTableHeader component
 * 
 * Table header with sortable columns and accessibility features.
 * Handles keyboard navigation and screen reader support.
 */

import React from 'react';
import { SortOptions, SortField } from '@/types/user.types';

interface UserTableHeaderProps {
  /**
   * Current sort configuration
   */
  sortOptions: SortOptions;
  
  /**
   * Callback when sort order changes
   */
  onSort: (field: SortField) => void;
}

interface SortableHeaderCellProps {
  field: SortField;
  label: string;
  sortOptions: SortOptions;
  onSort: (field: SortField) => void;
}

/**
 * Individual sortable header cell
 */
function SortableHeaderCell({ 
  field, 
  label, 
  sortOptions, 
  onSort 
}: SortableHeaderCellProps): JSX.Element {
  const isActive = sortOptions.field === field;
  const direction = isActive ? sortOptions.direction : 'none';
  
  const handleClick = (): void => {
    onSort(field);
  };
  
  const handleKeyDown = (event: React.KeyboardEvent): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSort(field);
    }
  };
  
  const getSortIcon = (): string => {
    if (!isActive) return '↕️';
    return direction === 'asc' ? '↑' : '↓';
  };
  
  const getAriaSort = (): 'ascending' | 'descending' | 'none' => {
    if (!isActive) return 'none';
    return direction === 'asc' ? 'ascending' : 'descending';
  };

  return (
    <th 
      className={`sortable-header ${isActive ? 'active' : ''}`}
      role="columnheader"
      tabIndex={0}
      aria-sort={getAriaSort()}
      aria-label={`Sort by ${label}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <span className="header-content">
        <span className="header-label">{label}</span>
        <span 
          className="sort-icon" 
          aria-hidden="true"
          role="presentation"
        >
          {getSortIcon()}
        </span>
      </span>
    </th>
  );
}

/**
 * Table header with sortable columns
 */
export function TableHeader({ sortOptions, onSort }: UserTableHeaderProps): JSX.Element {
  return (
    <thead>
      <tr role="row">
        <SortableHeaderCell
          field="firstName"
          label="First Name"
          sortOptions={sortOptions}
          onSort={onSort}
        />
        <SortableHeaderCell
          field="lastName"
          label="Last Name"
          sortOptions={sortOptions}
          onSort={onSort}
        />
        <SortableHeaderCell
          field="email"
          label="Email"
          sortOptions={sortOptions}
          onSort={onSort}
        />
        <SortableHeaderCell
          field="createdAt"
          label="Created"
          sortOptions={sortOptions}
          onSort={onSort}
        />
        <th className="actions-header" role="columnheader" scope="col">
          Actions
        </th>
      </tr>
    </thead>
  );
}
