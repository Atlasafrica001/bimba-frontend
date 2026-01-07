'use client';
import React, { useState, useEffect } from 'react';
import { Table } from './Table';
import { Pagination } from './Pagination';
import { SearchFilter } from './SearchFilter';
import { EmptyState } from './EmptyState';
import { TableSkeleton } from './LoadingSkeleton';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  width?: string;
}

interface EnhancedTableProps<T> {
  columns: Column<T>[];
  fetchData: (params: {
    page: number;
    limit: number;
    search?: string;
    filters?: Record<string, any>;
  }) => Promise<{ data: T[]; total: number }>;
  filters?: Array<{
    key: string;
    label: string;
    options: Array<{ value: string; label: string }>;
  }>;
  searchPlaceholder?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  itemsPerPage?: number;
}

export function EnhancedTable<T extends { id: string }>({
  columns,
  fetchData,
  filters,
  searchPlaceholder,
  emptyTitle = 'No data available',
  emptyDescription,
  itemsPerPage = 20,
}: EnhancedTableProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({});

  useEffect(() => {
    loadData();
  }, [currentPage, searchQuery, selectedFilters]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const result = await fetchData({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery,
        filters: selectedFilters,
      });
      setData(result.data);
      setTotalItems(result.total);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page
  };

  const handleFilterChange = (filters: Record<string, any>) => {
    setSelectedFilters(filters);
    setCurrentPage(1); // Reset to first page
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <SearchFilter
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        filters={filters}
        placeholder={searchPlaceholder}
      />

      {/* Table */}
      {isLoading ? (
        <TableSkeleton rows={itemsPerPage} />
      ) : data.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <>
          <Table data={data} columns={columns} />
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
            />
          )}
        </>
      )}
    </div>
  );
}