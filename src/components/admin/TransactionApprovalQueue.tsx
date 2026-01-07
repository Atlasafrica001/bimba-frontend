'use client';
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';
import { usePermissions } from '@/lib/hooks/usePermissions';
import * as adminApi from '@/lib/api/admin';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';

export const TransactionApprovalQueue: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { canApproveTransactions } = usePermissions();

  useEffect(() => {
    loadPendingTransactions();
  }, []);

  const loadPendingTransactions = async () => {
    try {
      const response = await adminApi.getPendingTransactions();
      setTransactions(response.transactions);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (transactionId: string) => {
    if (!canApproveTransactions()) {
      alert('You do not have permission to approve transactions');
      return;
    }
    try {
      await adminApi.approveTransaction(transactionId);
      await loadPendingTransactions();
    } catch (error) {
      console.error('Failed to approve transaction:', error);
    }
  };

  const handleReject = async (transactionId: string) => {
    if (!canApproveTransactions()) {
      alert('You do not have permission to reject transactions');
      return;
    }
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    
    try {
      await adminApi.rejectTransaction(transactionId, reason);
      await loadPendingTransactions();
    } catch (error) {
      console.error('Failed to reject transaction:', error);
    }
  };

  if (!canApproveTransactions()) {
    return (
      <Card>
        <p className="text-center text-secondary-gray-600">
          You do not have permission to view transaction approvals.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((tx) => (
        <Card key={tx.id}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="warning">{tx.type}</Badge>
                <span className="text-sm text-secondary-gray-600">{tx.userId}</span>
              </div>
              <p className="text-2xl font-bold text-secondary-gray-900">
                {formatCurrency(tx.grossAmount)}
              </p>
              <p className="text-sm text-secondary-gray-500">{formatDate(tx.createdAt)}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="primary" onClick={() => handleApprove(tx.id)}>
                Approve
              </Button>
              <Button variant="danger" onClick={() => handleReject(tx.id)}>
                Reject
              </Button>
            </div>
          </div>
        </Card>
      ))}
      {transactions.length === 0 && !isLoading && (
        <Card>
          <p className="text-center text-secondary-gray-600">No pending transactions</p>
        </Card>
      )}
    </div>
  );
};