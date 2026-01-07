'use client';
import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage = 20,
}) => {
  const pages = [];
  const maxVisiblePages = 5;

  // Calculate page range to display
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems || 0);

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-secondary-gray-200 sm:px-6">
      {/* Info */}
      {totalItems && (
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <p className="text-sm text-secondary-gray-700">
            Showing <span className="font-medium">{startItem}</span> to{' '}
            <span className="font-medium">{endItem}</span> of{' '}
            <span className="font-medium">{totalItems}</span> results
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex flex-1 justify-between sm:justify-end gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-secondary-gray-300 bg-white text-secondary-gray-700 hover:bg-secondary-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeftIcon className="w-5 h-5 mr-1" />
          Previous
        </button>

        {/* Page Numbers */}
        <div className="hidden md:flex gap-1">
          {startPage > 1 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-secondary-gray-300 bg-white text-secondary-gray-700 hover:bg-secondary-gray-50"
              >
                1
              </button>
              {startPage > 2 && <span className="px-2 py-2 text-secondary-gray-500">...</span>}
            </>
          )}

          {pages.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-4 py-2 text-sm font-medium rounded-lg border ${
                page === currentPage
                  ? 'bg-primary text-white border-primary'
                  : 'border-secondary-gray-300 bg-white text-secondary-gray-700 hover:bg-secondary-gray-50'
              }`}
            >
              {page}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-2 py-2 text-secondary-gray-500">...</span>}
              <button
                onClick={() => onPageChange(totalPages)}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-secondary-gray-300 bg-white text-secondary-gray-700 hover:bg-secondary-gray-50"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-secondary-gray-300 bg-white text-secondary-gray-700 hover:bg-secondary-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRightIcon className="w-5 h-5 ml-1" />
        </button>
      </div>
    </div>
  );
};