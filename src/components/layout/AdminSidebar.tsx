'use client';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { usePermissions } from '@/lib/hooks/usePermissions';
import {
  HomeIcon,
  UsersIcon,
  GiftIcon,
  BanknotesIcon,
  Cog6ToothIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
//   const { can, canApproveTransactions } = usePermissions();

  const menuItems = [
    { name: 'Dashboard', icon: HomeIcon, path: '/admin/dashboard', permission: 'view_dashboard' },
    { name: 'Users', icon: UsersIcon, path: '/admin/users', permission: 'view_users' },
    { name: 'Gift Cards', icon: GiftIcon, path: '/admin/gift-cards', permission: 'view_gift_cards' },
    { name: 'Transactions', icon: BanknotesIcon, path: '/admin/transactions', permission: 'view_transactions' },
    { name: 'Settings', icon: Cog6ToothIcon, path: '/admin/settings', permission: 'view_settings' },
    { name: 'Audit Logs', icon: ClipboardDocumentListIcon, path: '/admin/audit-logs', permission: 'view_audit_logs' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-secondary-gray-200 min-h-screen">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          // Check permissions (currently all admin roles can view these sections)
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-secondary-gray-700 hover:bg-secondary-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};