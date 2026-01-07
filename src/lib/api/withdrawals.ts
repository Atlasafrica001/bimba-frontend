import { apiClient } from './client';
import { Withdrawal } from '@/lib/types/transaction';

export interface CreateWithdrawalRequest {
  amount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export const createWithdrawal = async (data: CreateWithdrawalRequest): Promise<Withdrawal> => {
  return apiClient.post('/withdrawals', data);
};

export const getMyWithdrawals = async (params?: {
  page?: number;
  limit?: number;
}): Promise<{
  withdrawals: Withdrawal[];
  total: number;
}> => {
  return apiClient.get('/withdrawals/my-withdrawals', { params });
};

export const cancelWithdrawal = async (withdrawalId: string): Promise<void> => {
  return apiClient.post(`/withdrawals/${withdrawalId}/cancel`);
};

export const getWithdrawal = async (withdrawalId: string): Promise<Withdrawal> => {
  return apiClient.get(`/withdrawals/${withdrawalId}`);
};