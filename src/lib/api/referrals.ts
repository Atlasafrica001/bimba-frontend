import { apiClient } from './client';

export interface ReferralReward {
  id: string;
  referrerUserId: string;
  referredUserId: string;
  referredUser: {
    email: string;
  };
  cumulativeUsd: number;
  thresholdUsd: number;
  rewardAmount: number;
  status: 'PENDING' | 'ELIGIBLE' | 'CREDITED';
  creditedAt?: string;
  createdAt: string;
}

export const getMyReferrals = async (): Promise<{
  referralCode: string;
  rewards: ReferralReward[];
  totalRewarded: number;
}> => {
  return apiClient.get('/referrals/my-referrals');
};