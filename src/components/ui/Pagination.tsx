'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages.map((page, index) => {
      if (page === '...') {
        return (
          <span key={`ellipsis-${index}`} className="px-3 py-1.5 text-sm text-gray-400">
            ...
          </span>
        );
      }

      const isCurrent = page === currentPage;
      return (
        <button
          key={`page-${page}`}
          onClick={() => onPageChange(page as number)}
          className={`min-w-9 h-9 px-3 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
            isCurrent
              ? 'bg-primary-600 text-white shadow-xs'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
          }`}
          aria-current={isCurrent ? 'page' : undefined}
        >
          {page}
        </button>
      );
    });
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex items-center gap-1 h-9 px-3 text-sm font-medium rounded-lg bg-white border border-gray-200 text-slate-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        aria-label="Previous Page"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Prev</span>
      </button>

      <div className="flex items-center gap-1.5">{renderPageNumbers()}</div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="flex items-center gap-1 h-9 px-3 text-sm font-medium rounded-lg bg-white border border-gray-200 text-slate-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        aria-label="Next Page"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
