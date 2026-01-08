'use client';
import React from 'react';
import { UserManagementTable } from '@/components/admin/UserManagementTable';

export default function AdminUsersPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">User Management</h1>
        <p className="text-secondary-gray-600">
          Manage user accounts, roles, and status
        </p>
      </div>

      <UserManagementTable />
    </div>
  );
}