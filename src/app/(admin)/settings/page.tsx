'use client';
import React from 'react';
import { SystemSettingsForm } from '@/components/admin/SystemSettingsForm';

export default function AdminSettingsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">System Settings</h1>
        <p className="text-secondary-gray-600">
          Configure platform-wide settings and limits
        </p>
      </div>

      <SystemSettingsForm />
    </div>
  );
}