import React from 'react';
import { Header } from '@/components/layout/Header';
import { UserSidebar } from '@/components/layout/UserSidebar';

export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="min-h-screen bg-secondary-gray-50">
        <Header />
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar hidden on mobile, shown on desktop */}
          <div className="hidden lg:block">
            <UserSidebar />
          </div>
          {/* Main content with responsive padding */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    );
  }