'use client';
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { useToast } from '@/lib/context/ToastContext';
import * as referralApi from '@/lib/api/referrals';
import { formatCurrency } from '@/lib/utils/formatters';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';

interface ReferralData {
  referralCode: string;
  rewards: any[];
  totalRewarded: number;
}

export const ReferralProgress: React.FC = () => {
  const [data, setData] = useState<ReferralData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadReferralData();
  }, []);

  const loadReferralData = async () => {
    try {
      const response = await referralApi.getMyReferrals();
      setData(response);
    } catch (error) {
      console.error('Failed to load referral data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyReferralCode = () => {
    if (data?.referralCode) {
      navigator.clipboard.writeText(data.referralCode);
      showToast('Referral code copied!', 'success');
    }
  };

  if (isLoading) {
    return <Card className="animate-pulse"><div className="h-48 bg-secondary-gray-200 rounded"></div></Card>;
  }

  if (!data) {
    return <Card><p className="text-center text-secondary-gray-500">Failed to load referral data</p></Card>;
  }

  // Calculate progress for first pending referral (if any)
  const pendingReward = data.rewards.find((r) => r.status === 'PENDING');
  const progressPercentage = pendingReward
    ? Math.min((pendingReward.cumulativeUsd / pendingReward.thresholdUsd) * 100, 100)
    : 0;

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'CREDITED':
        return 'success';
      case 'ELIGIBLE':
        return 'info';
      case 'PENDING':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Referral Code Card */}
      <Card className="bg-gradient-to-br from-primary to-primary-700 text-white">
        <h3 className="text-xl font-semibold mb-4">Your Referral Code</h3>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-white bg-opacity-20 rounded-lg px-4 py-3">
            <p className="text-2xl font-bold tracking-wider">{data.referralCode}</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={copyReferralCode}
          >
            <ClipboardDocumentIcon className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-sm mt-3 opacity-90">
          Share this code with friends and earn ₦5,000 when they trade $300 worth of gift cards!
        </p>
      </Card>

      {/* Progress Card */}
      {pendingReward && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">Referral Progress</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-secondary-gray-600">Referred User</span>
              <span className="font-medium">{pendingReward.referredUser.email}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-secondary-gray-600">Progress</span>
              <span className="font-medium">
                ${pendingReward.cumulativeUsd.toFixed(2)} / ${pendingReward.thresholdUsd.toFixed(2)}
              </span>
            </div>
            <div className="w-full bg-secondary-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-success h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <Badge variant={getStatusVariant(pendingReward.status)}>
                {pendingReward.status}
              </Badge>
              {pendingReward.status === 'ELIGIBLE' && (
                <span className="text-sm text-success font-medium">
                  Reward pending: {formatCurrency(pendingReward.rewardAmount)}
                </span>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Completed Rewards */}
      {data.rewards.filter((r) => r.status === 'CREDITED').length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">Completed Referrals</h3>
          <div className="space-y-3">
            {data.rewards
              .filter((r) => r.status === 'CREDITED')
              .map((reward) => (
                <div
                  key={reward.id}
                  className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-secondary-gray-900">
                      {reward.referredUser.email}
                    </p>
                    <p className="text-sm text-secondary-gray-600">
                      Rewarded on {new Date(reward.creditedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="success">{formatCurrency(reward.rewardAmount)}</Badge>
                </div>
              ))}
          </div>
        </Card>
      )}

      {/* Total Earned */}
      {data.totalRewarded > 0 && (
        <Card className="bg-success bg-opacity-10 border-2 border-success">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-gray-700">Total Referral Earnings</p>
              <p className="text-3xl font-bold text-success mt-1">
                {formatCurrency(data.totalRewarded)}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};