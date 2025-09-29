/**
 * UserTableRow component
 * 
 * Individual table row with user data and action buttons.
 * Includes keyboard navigation and accessibility features.
 */

import React from 'react';
import { User } from '@/types/user.types';

interface UserTableRowProps {
  /**
   * User data to display
   */
  user: User;
  
  /**
   * Row index for accessibility
   */
  index: number;
  
  /**
   * Callback when edit action is triggered
   */
  onEdit?: (userId: string) => void;
  
  /**
   * Callback when view action is triggered
   */
  onView?: (userId: string) => void;
  
  /**
   * Callback when delete action is triggered
   */
  onDelete?: (userId: string) => void;
  
  /**
   * Whether delete operation is in progress
   */
  isDeleting?: boolean;
}

/**
 * Action button component with consistent styling and accessibility
 */
interface ActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  ariaLabel: string;
  variant?: 'primary' | 'secondary' | 'danger';
}

function ActionButton({ 
  onClick, 
  disabled = false, 
  children, 
  ariaLabel, 
  variant = 'secondary' 
}: ActionButtonProps): JSX.Element {
  const variantClass = `action-button-${variant}`;
  
  return (
    <button
      className={`action-button ${variantClass}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

/**
 * Format date for display
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Invalid date';
  }
}

/**
 * Table row component for user data
 */
export function TableRow({ 
  user, 
  index, 
  onEdit, 
  onView, 
  onDelete, 
  isDeleting = false 
}: UserTableRowProps): JSX.Element {
  const handleEdit = (): void => {
    onEdit?.(user.id);
  };
  
  const handleView = (): void => {
    onView?.(user.id);
  };
  
  const handleDelete = (): void => {
    onDelete?.(user.id);
  };
  
  const handleKeyDown = (event: React.KeyboardEvent): void => {
    // Allow keyboard navigation within the row
    if (event.key === 'Enter' || event.key === ' ') {
      const target = event.target as HTMLElement;
      if (target.tagName === 'TD' && onView) {
        event.preventDefault();
        handleView();
      }
    }
  };

  return (
    <tr 
      className={`user-row ${isDeleting ? 'deleting' : ''}`}
      role="row"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-rowindex={index + 2} // +2 because header is row 1
    >
      <td 
        className="user-cell first-name"
        role="gridcell"
        aria-label={`First name: ${user.firstName}`}
      >
        {user.firstName}
      </td>
      
      <td 
        className="user-cell last-name"
        role="gridcell"
        aria-label={`Last name: ${user.lastName}`}
      >
        {user.lastName}
      </td>
      
      <td 
        className="user-cell email"
        role="gridcell"
        aria-label={`Email: ${user.email}`}
      >
        <a 
          href={`mailto:${user.email}`}
          className="email-link"
          aria-label={`Send email to ${user.email}`}
        >
          {user.email}
        </a>
      </td>
      
      <td 
        className="user-cell created-at"
        role="gridcell"
        aria-label={`Created: ${formatDate(user.createdAt)}`}
      >
        {formatDate(user.createdAt)}
      </td>
      
      <td className="user-cell actions" role="gridcell">
        <div className="action-buttons" role="group" aria-label={`Actions for ${user.firstName} ${user.lastName}`}>
          {onView && (
            <ActionButton
              onClick={handleView}
              ariaLabel={`View details for ${user.firstName} ${user.lastName}`}
              variant="primary"
            >
              View
            </ActionButton>
          )}
          
          {onEdit && (
            <ActionButton
              onClick={handleEdit}
              ariaLabel={`Edit ${user.firstName} ${user.lastName}`}
              variant="secondary"
            >
              Edit
            </ActionButton>
          )}
          
          {onDelete && (
            <ActionButton
              onClick={handleDelete}
              disabled={isDeleting}
              ariaLabel={`Delete ${user.firstName} ${user.lastName}`}
              variant="danger"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </ActionButton>
          )}
        </div>
      </td>
    </tr>
  );
}
