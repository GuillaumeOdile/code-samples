/**
 * PaginationControls component
 * 
 * Provides pagination navigation with accessibility features.
 * Handles page changes and items per page selection.
 */

import React, { useCallback } from 'react';

interface PaginationControlsProps {
  /**
   * Current page number (1-based)
   */
  currentPage: number;
  
  /**
   * Total number of pages
   */
  totalPages: number;
  
  /**
   * Total number of items
   */
  totalItems: number;
  
  /**
   * Number of items per page
   */
  itemsPerPage: number;
  
  /**
   * Callback when page changes
   */
  onPageChange: (page: number) => void;
  
  /**
   * Callback when items per page changes
   */
  onItemsPerPageChange: (limit: number) => void;
}

/**
 * Pagination button component
 */
interface PaginationButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  ariaLabel: string;
  variant?: 'primary' | 'secondary';
}

function PaginationButton({ 
  onClick, 
  disabled = false, 
  children, 
  ariaLabel, 
  variant = 'secondary' 
}: PaginationButtonProps): JSX.Element {
  const variantClass = `pagination-button-${variant}`;
  
  return (
    <button
      className={`pagination-button ${variantClass}`}
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
 * Pagination controls component
 */
export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: PaginationControlsProps): JSX.Element {
  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  }, [currentPage, onPageChange]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, onPageChange]);

  const handlePageClick = useCallback((page: number) => {
    onPageChange(page);
  }, [onPageChange]);

  const handleItemsPerPageChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(event.target.value, 10);
    onItemsPerPageChange(newLimit);
  }, [onItemsPerPageChange]);

  // Calculate page range for display
  const getPageRange = (): number[] => {
    const delta = 2; // Number of pages to show on each side of current page
    const range: number[] = [];
    const rangeWithDots: number[] = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, -1); // -1 represents ellipsis
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push(-1, totalPages); // -1 represents ellipsis
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) {
    return (
      <div className="pagination-controls">
        <div className="pagination-info">
          Showing {totalItems} {totalItems === 1 ? 'user' : 'users'}
        </div>
        
        <div className="items-per-page">
          <label htmlFor="items-per-page-select">
            Items per page:
          </label>
          <select
            id="items-per-page-select"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            aria-label="Items per page"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
    );
  }

  return (
    <div className="pagination-controls">
      <div className="pagination-info">
        Showing {startItem}-{endItem} of {totalItems} users
      </div>

      <nav className="pagination-nav" aria-label="Pagination Navigation">
        <div className="pagination-buttons">
          <PaginationButton
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            ariaLabel="Go to previous page"
          >
            Previous
          </PaginationButton>

          {getPageRange().map((page, index) => {
            if (page === -1) {
              return (
                <span key={`ellipsis-${index}`} className="pagination-ellipsis" aria-hidden="true">
                  ...
                </span>
              );
            }

            const isCurrentPage = page === currentPage;
            
            return (
              <PaginationButton
                key={page}
                onClick={() => handlePageClick(page)}
                ariaLabel={`Go to page ${page}`}
                variant={isCurrentPage ? 'primary' : 'secondary'}
              >
                {page}
              </PaginationButton>
            );
          })}

          <PaginationButton
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            ariaLabel="Go to next page"
          >
            Next
          </PaginationButton>
        </div>
      </nav>

      <div className="items-per-page">
        <label htmlFor="items-per-page-select">
          Items per page:
        </label>
        <select
          id="items-per-page-select"
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          aria-label="Items per page"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  );
}
