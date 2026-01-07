'use client';
import React, { useState, useEffect } from 'react';
import { Table } from '@/components/shared/Table';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import * as adminApi from '@/lib/api/admin';
import { User } from '@/lib/types/user';

export const UserManagementTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await adminApi.getUsers();
      setUsers(response.users);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await adminApi.updateUserStatus(userId, !currentStatus);
      await loadUsers();
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  const columns = [
    { key: 'email', header: 'Email' },
    { 
      key: 'role', 
      header: 'Role',
      render: (user: User) => <Badge variant="info">{user.role}</Badge>
    },
    { 
      key: 'isActive', 
      header: 'Status',
      render: (user: User) => (
        <Badge variant={user.isActive ? 'success' : 'error'}>
          {user.isActive ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    { 
      key: 'isEmailVerified', 
      header: 'Verified',
      render: (user: User) => user.isEmailVerified ? '✓' : '✗'
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (user: User) => (
        <Button
          size="sm"
          variant={user.isActive ? 'danger' : 'primary'}
          onClick={() => toggleUserStatus(user.id, user.isActive)}
        >
          {user.isActive ? 'Deactivate' : 'Activate'}
        </Button>
      )
    }
  ];

  return <Table data={users} columns={columns} isLoading={isLoading} />;
};