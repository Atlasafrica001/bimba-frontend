'use client';
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { ReferralProgress } from '@/components/user/ReferralProgress';
import { useAuth } from '@/lib/context/AuthContext';
import { formatDate } from '@/lib/utils/formatters';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <Badge variant="error">Super Admin</Badge>;
      case 'SUB_ADMIN':
        return <Badge variant="warning">Sub Admin</Badge>;
      case 'SUPPORT_AGENT':
        return <Badge variant="info">Support Agent</Badge>;
      default:
        return <Badge variant="default">User</Badge>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* User Info Card */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-secondary-gray-600">Email</p>
              <p className="font-medium text-secondary-gray-900">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-secondary-gray-600">Role</p>
              <div className="mt-1">{getRoleBadge(user.role)}</div>
            </div>
            <div>
              <p className="text-sm text-secondary-gray-600">Account Status</p>
              <Badge variant={user.isActive ? 'success' : 'error'}>
                {user.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-secondary-gray-600">Email Verification</p>
              <Badge variant={user.isEmailVerified ? 'success' : 'warning'}>
                {user.isEmailVerified ? 'Verified' : 'Not Verified'}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-secondary-gray-600">Member Since</p>
              <p className="font-medium text-secondary-gray-900">
                {formatDate(user.createdAt || new Date().toISOString())}
              </p>
            </div>
          </div>
        </Card>

        {/* Referral Code Card */}
        <Card className="bg-gradient-to-br from-primary to-primary-700 text-white">
          <h2 className="text-xl font-semibold mb-4">Your Referral Code</h2>
          <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-3">
            <p className="text-3xl font-bold tracking-wider text-center">
              {user.referralCode}
            </p>
          </div>
          <p className="text-sm opacity-90">
            Share this code with friends and earn ₦5,000 when they trade $300 worth of gift cards!
          </p>
        </Card>
      </div>

      {/* Referral Progress Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Referral Rewards</h2>
        <ReferralProgress />
      </div>
    </div>
  );
}