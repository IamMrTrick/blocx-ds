'use client';
import React from 'react';
import { Icon } from '@/components/ui/icon';
import './Pagination.scss';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'compact';
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  showPageInfo?: boolean;
  showJumpToPage?: boolean;
  siblingCount?: number;
  disabled?: boolean;
  labels?: {
    first?: string;
    previous?: string;
    next?: string;
    last?: string;
    page?: string;
    of?: string;
    jumpTo?: string;
  };
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  size = 'md',
  variant = 'default',
  showFirstLast = true,
  showPrevNext = true,
  showPageInfo = false,
  showJumpToPage = false,
  siblingCount = 1,
  disabled = false,
  labels = {
    first: 'First',
    previous: 'Previous',
    next: 'Next',
    last: 'Last',
    page: 'Page',
    of: 'of',
    jumpTo: 'Jump to page',
  },
}) => {
  // Generate page numbers to display
  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
      const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
      
      const shouldShowLeftDots = leftSiblingIndex > 2;
      const shouldShowRightDots = rightSiblingIndex < totalPages - 1;
      
      if (!shouldShowLeftDots && shouldShowRightDots) {
        // No left dots, show right dots
        const leftItemCount = 3 + 2 * siblingCount;
        for (let i = 2; i <= leftItemCount; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (shouldShowLeftDots && !shouldShowRightDots) {
        // Show left dots, no right dots
        const rightItemCount = 3 + 2 * siblingCount;
        pages.push('...');
        for (let i = totalPages - rightItemCount + 1; i <= totalPages - 1; i++) {
          pages.push(i);
        }
        pages.push(totalPages);
      } else if (shouldShowLeftDots && shouldShowRightDots) {
        // Show both dots
        pages.push('...');
        for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else {
        // Show all middle pages
        for (let i = 2; i <= totalPages - 1; i++) {
          pages.push(i);
        }
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handlePageChange = (page: number) => {
    if (disabled || page < 1 || page > totalPages || page === currentPage) {
      return;
    }
    onPageChange(page);
  };

  const handleJumpToPage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const page = parseInt(formData.get('jumpPage') as string, 10);
    if (!isNaN(page)) {
      handlePageChange(page);
    }
  };

  const renderPageButton = (page: number | string, index: number) => {
    if (page === '...') {
      return (
        <li key={`ellipsis-${index}`} className="pagination__item pagination__item--ellipsis">
          <span className="pagination__ellipsis" aria-label="More pages">
            <Icon name="more-horizontal" />
          </span>
        </li>
      );
    }

    const pageNumber = page as number;
    const isActive = pageNumber === currentPage;
    
    const itemClasses = [
      'pagination__item',
      isActive && 'pagination__item--active',
    ].filter(Boolean).join(' ');

    return (
      <li key={pageNumber} className={itemClasses}>
        <button
          className="pagination__button"
          onClick={() => handlePageChange(pageNumber)}
          disabled={disabled || isActive}
          aria-label={`${labels.page} ${pageNumber}`}
          aria-current={isActive ? 'page' : undefined}
        >
          {pageNumber}
        </button>
      </li>
    );
  };

  const renderNavButton = (
    type: 'first' | 'previous' | 'next' | 'last',
    targetPage: number,
    icon: string,
    label: string
  ) => {
    const isDisabled = disabled || 
      (type === 'first' && currentPage === 1) ||
      (type === 'previous' && currentPage === 1) ||
      (type === 'next' && currentPage === totalPages) ||
      (type === 'last' && currentPage === totalPages);

    const itemClasses = [
      'pagination__item',
      `pagination__item--${type}`,
      isDisabled && 'pagination__item--disabled',
    ].filter(Boolean).join(' ');

    return (
      <li className={itemClasses}>
        <button
          className="pagination__button pagination__button--nav"
          onClick={() => handlePageChange(targetPage)}
          disabled={isDisabled}
          aria-label={label}
        >
          <Icon name={icon} className="pagination__icon" />
          {variant !== 'compact' && <span className="pagination__label">{label}</span>}
        </button>
      </li>
    );
  };

  const paginationClasses = [
    'pagination',
    `pagination--${size}`,
    `pagination--${variant}`,
    disabled && 'pagination--disabled',
    className
  ].filter(Boolean).join(' ');

  const pages = generatePageNumbers();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className={paginationClasses} aria-label="Pagination navigation">
      <ul className="pagination__list">
        {/* First Page Button */}
        {showFirstLast && variant !== 'minimal' && 
          renderNavButton('first', 1, 'chevrons-left', labels.first!)
        }

        {/* Previous Page Button */}
        {showPrevNext && 
          renderNavButton('previous', currentPage - 1, 'chevron-left', labels.previous!)
        }

        {/* Page Numbers */}
        {variant !== 'minimal' && pages.map((page, index) => renderPageButton(page, index))}

        {/* Next Page Button */}
        {showPrevNext && 
          renderNavButton('next', currentPage + 1, 'chevron-right', labels.next!)
        }

        {/* Last Page Button */}
        {showFirstLast && variant !== 'minimal' && 
          renderNavButton('last', totalPages, 'chevrons-right', labels.last!)
        }
      </ul>

      {/* Page Info */}
      {showPageInfo && (
        <div className="pagination__info">
          <span className="pagination__info-text">
            {labels.page} {currentPage} {labels.of} {totalPages}
          </span>
        </div>
      )}

      {/* Jump to Page */}
      {showJumpToPage && variant !== 'minimal' && (
        <form className="pagination__jump" onSubmit={handleJumpToPage}>
          <label htmlFor="jumpPage" className="pagination__jump-label">
            {labels.jumpTo}:
          </label>
          <input
            id="jumpPage"
            name="jumpPage"
            type="number"
            min="1"
            max={totalPages}
            className="pagination__jump-input"
            placeholder="1"
            disabled={disabled}
          />
          <button
            type="submit"
            className="pagination__jump-button"
            disabled={disabled}
            aria-label="Go to page"
          >
            <Icon name="arrow-right" />
          </button>
        </form>
      )}
    </nav>
  );
};

export default Pagination;
