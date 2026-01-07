'use client';
import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="text-center py-12">
      {icon && (
        <div className="flex justify-center mb-4 text-secondary-gray-400">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-secondary-gray-900 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-secondary-gray-600 mb-6 max-w-sm mx-auto">
          {description}
        </p>
      )}
      {action && (
        <Button variant="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};