'use client';
import React from 'react';

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="space-y-3 animate-pulse">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="h-16 bg-secondary-gray-200 rounded-lg" />
      ))}
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-card p-6 animate-pulse">
      <div className="h-4 bg-secondary-gray-200 rounded w-1/3 mb-4" />
      <div className="h-8 bg-secondary-gray-200 rounded w-2/3 mb-2" />
      <div className="h-4 bg-secondary-gray-200 rounded w-1/2" />
    </div>
  );
};

export const GridSkeleton: React.FC<{ items?: number }> = ({ items = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(items)].map((_, i) => (
        <div key={i} className="h-48 bg-secondary-gray-200 rounded-lg animate-pulse" />
      ))}
    </div>
  );
};