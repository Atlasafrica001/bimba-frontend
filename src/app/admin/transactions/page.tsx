'use client';
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/shared/Card';
import { Table } from '@/components/shared/Table';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { usePermissions } from '@/lib/hooks/usePermissions';
import { useToast } from '@/lib/context/ToastContext';
import * as adminApi from '@/lib/api/admin';
import { Transaction } from '@/lib/types/transaction';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { TRANSACTION_STATUS_LABELS, TRANSACTION_TYPE_LABELS } from '@/lib/utils/constants';

export default function AdminTransactionsPage() {
  const { showToast } = useToast();
  const { canApproveTransactions } = usePermissions();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending'>('all');

  useEffect(() => {
    loadTransactions();
  }, [filter]);

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      const response =
        filter === 'pending'
          ? await adminApi.getPendingTransactions()
          : await adminApi.getAllTransactions();
      setTransactions(response.transactions);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (transactionId: string) => {
    if (!canApproveTransactions()) {
      showToast('You do not have permission to approve transactions', 'error');
      return;
    }

    try {
      await adminApi.approveTransaction(transactionId);
      showToast('Transaction approved successfully!', 'success');
      await loadTransactions();
    } catch (error: any) {
      showToast(error.message || 'Failed to approve transaction', 'error');
    }
  };

  const handleReject = async (transactionId: string) => {
    if (!canApproveTransactions()) {
      showToast('You do not have permission to reject transactions', 'error');
      return;
    }

    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      await adminApi.rejectTransaction(transactionId, reason);
      showToast('Transaction rejected', 'success');
      await loadTransactions();
    } catch (error: any) {
      showToast(error.message || 'Failed to reject transaction', 'error');
    }
  };

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

  const columns = [
    {
      key: 'reference',
      header: 'Reference',
      render: (tx: Transaction) => (
        <span className="font-mono text-xs">{tx.reference}</span>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (tx: Transaction) => (
        <Badge variant="info" size="sm">
          {TRANSACTION_TYPE_LABELS[tx.type] || tx.type}
        </Badge>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (tx: Transaction) => (
        <div>
          <p className="font-semibold">{formatCurrency(tx.netAmount)}</p>
          {tx.grossAmount !== tx.netAmount && (
            <p className="text-xs text-secondary-gray-500">
              Fee: {formatCurrency(tx.feeAmount)}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (tx: Transaction) => (
        <Badge variant={getStatusVariant(tx.status)} size="sm">
          {TRANSACTION_STATUS_LABELS[tx.status] || tx.status}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (tx: Transaction) => (
        <span className="text-sm">{formatDate(tx.createdAt)}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (tx: Transaction) => {
        if (tx.status !== 'PENDING_REVIEW' || !canApproveTransactions()) {
          return null;
        }
        return (
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleApprove(tx.id)}
            >
              Approve
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleReject(tx.id)}
            >
              Reject
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Transaction Management</h1>
        <p className="text-secondary-gray-600">
          View and manage all platform transactions
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === 'all' ? 'primary' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All Transactions
        </Button>
        <Button
          variant={filter === 'pending' ? 'primary' : 'outline'}
          onClick={() => setFilter('pending')}
        >
          Pending Review
        </Button>
      </div>

      {/* Transactions Table */}
      <Card>
        <Table
          data={transactions}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No transactions found"
        />
      </Card>
    </div>
  );
}