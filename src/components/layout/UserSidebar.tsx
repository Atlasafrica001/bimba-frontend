'use client';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  HomeIcon,
  GiftIcon,
  WalletIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

const menuItems = [
  { name: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
  { name: 'Gift Cards', icon: GiftIcon, path: '/gift-cards' },
  { name: 'Wallet', icon: WalletIcon, path: '/wallet' },
  { name: 'Profile', icon: UserCircleIcon, path: '/profile' },
];

export const UserSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="w-64 bg-white border-r border-secondary-gray-200 min-h-screen">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
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