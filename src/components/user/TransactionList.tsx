'use client';
import React from 'react';
import { Badge } from '@/components/shared/Badge';
import { Transaction } from '@/lib/types/transaction';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { TRANSACTION_STATUS_LABELS, TRANSACTION_TYPE_LABELS } from '@/lib/utils/constants';

interface TransactionListProps {
  transactions: Transaction[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  isLoading,
  emptyMessage = 'No transactions yet',
}) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 bg-secondary-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-secondary-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'FAILED':
      case 'REJECTED':
      case 'CANCELLED':
        return 'error';
      case 'PENDING_REVIEW':
      case 'PROCESSING':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-3">
      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="bg-white p-4 rounded-lg shadow-card hover:shadow-card-hover transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="info" size="sm">
                  {TRANSACTION_TYPE_LABELS[tx.type] || tx.type}
                </Badge>
                <Badge variant={getStatusVariant(tx.status)} size="sm">
                  {TRANSACTION_STATUS_LABELS[tx.status] || tx.status}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-secondary-gray-900">
                    {formatCurrency(tx.netAmount)}
                  </p>
                  {tx.grossAmount !== tx.netAmount && (
                    <p className="text-xs text-secondary-gray-500">
                      Gross: {formatCurrency(tx.grossAmount)} | Fee: {formatCurrency(tx.feeAmount)}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-secondary-gray-600">{formatDate(tx.createdAt)}</p>
                  <p className="text-xs text-secondary-gray-500">Ref: {tx.reference}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};