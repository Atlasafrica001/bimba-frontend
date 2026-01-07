import { apiClient } from './client';
import { Wallet, WalletTransaction } from '@/lib/types/wallet';
import { Transaction } from '@/lib/types/transaction';

export const getWallet = async (): Promise<Wallet> => {
  return apiClient.get('/wallet');
};

export const getBalance = async (): Promise<{ availableBalance: number; lockedBalance: number }> => {
  return apiClient.get('/wallet/balance');
};

export const getTransactions = async (params?: {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
}): Promise<{
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
}> => {
  return apiClient.get('/wallet/transactions', { params });
};

export const getWalletTransactions = async (params?: {
  page?: number;
  limit?: number;
}): Promise<{
  transactions: WalletTransaction[];
  total: number;
}> => {
  return apiClient.get('/wallet/ledger', { params });
};