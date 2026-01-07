'use client';
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/shared/Card';
import { Table } from '@/components/shared/Table';
import { Badge } from '@/components/shared/Badge';
import * as adminApi from '@/lib/api/admin';
import { formatDate } from '@/lib/utils/formatters';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    try {
      const response = await adminApi.getAuditLogs({ limit: 50 });
      setLogs(response.logs || []);
    } catch (error) {
      console.error('Failed to load audit logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      key: 'timestamp',
      header: 'Timestamp',
      render: (log: any) => (
        <span className="text-sm">{formatDate(log.createdAt || log.timestamp)}</span>
      ),
    },
    {
      key: 'user',
      header: 'User',
      render: (log: any) => (
        <span className="text-sm font-medium">{log.user?.email || log.userId}</span>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      render: (log: any) => (
        <Badge variant="info" size="sm">
          {log.action}
        </Badge>
      ),
    },
    {
      key: 'resource',
      header: 'Resource',
      render: (log: any) => (
        <span className="text-sm text-secondary-gray-600">
          {log.resourceType}: {log.resourceId}
        </span>
      ),
    },
    {
      key: 'details',
      header: 'Details',
      render: (log: any) => (
        <span className="text-xs text-secondary-gray-500">
          {log.details || log.metadata || '-'}
        </span>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Audit Logs</h1>
        <p className="text-secondary-gray-600">
          View system activity and administrative actions
        </p>
      </div>

      <Card>
        <Table
          data={logs}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No audit logs available"
        />
      </Card>
    </div>
  );
}