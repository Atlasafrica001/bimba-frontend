'use client';
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/shared/Card';
import { UserManagementTable } from '@/components/admin/UserManagementTable';
import { TransactionApprovalQueue } from '@/components/admin/TransactionApprovalQueue';
import * as adminApi from '@/lib/api/admin';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalTransactions: 0,
    pendingApprovals: 0,
  });

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      const data = await adminApi.getMetrics();
      setMetrics(data);
    } catch (error) {
      console.error('Failed to load metrics:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <p className="text-sm text-secondary-gray-600">Total Users</p>
          <p className="text-3xl font-bold text-primary">{metrics.totalUsers}</p>
        </Card>
        <Card>
          <p className="text-sm text-secondary-gray-600">Active Users</p>
          <p className="text-3xl font-bold text-success">{metrics.activeUsers}</p>
        </Card>
        <Card>
          <p className="text-sm text-secondary-gray-600">Transactions</p>
          <p className="text-3xl font-bold text-info">{metrics.totalTransactions}</p>
        </Card>
        <Card>
          <p className="text-sm text-secondary-gray-600">Pending Approvals</p>
          <p className="text-3xl font-bold text-warning">{metrics.pendingApprovals}</p>
        </Card>
      </div>

      {/* Approval Queue */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Pending Approvals</h2>
        <TransactionApprovalQueue />
      </div>

      {/* User Management */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">User Management</h2>
        <UserManagementTable />
      </div>
    </div>
  );
}