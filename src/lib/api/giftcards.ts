import { apiClient } from './client';
import { GiftCardTransaction } from '@/lib/types/transaction';
import { GiftCard } from '@/lib/types/admin';

export const getGiftCards = async (): Promise<GiftCard[]> => {
  return apiClient.get('/gift-cards');
};

export const getGiftCard = async (id: string): Promise<GiftCard> => {
  return apiClient.get(`/gift-cards/${id}`);
};

export interface RatePreviewRequest {
  giftCardId: string;
  amount: number;
}

export interface RatePreviewResponse {
  cardValue: number;
  cardCurrency: string;
  exchangeRate: number;
  grossAmount: number;
  feePercentage: number;
  feeAmount: number;
  netAmount: number;
  rateExpiresAt: string;
}

export const getRatePreview = async (data: RatePreviewRequest): Promise<RatePreviewResponse> => {
  return apiClient.post('/gift-cards/rate-preview', data);
};

export const submitGiftCard = async (formData: FormData): Promise<{ transactionId: string }> => {
  return apiClient.post('/gift-cards/submit', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getMyGiftCardTransactions = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<{
  transactions: GiftCardTransaction[];
  total: number;
}> => {
  return apiClient.get('/gift-cards/my-transactions', { params });
};