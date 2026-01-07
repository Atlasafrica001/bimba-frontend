import { apiClient } from './client';
import { GiftCard, AdminMetrics, FeeConfig, SystemSetting } from '@/lib/types/admin';
import { User } from '@/lib/types/user';
import { Transaction } from '@/lib/types/transaction'

/**
 * Admin API Module
 * 
 * NOTE: All admin endpoints require authentication
 * Role-based access enforced on backend
 */

// ============================================
// USER MANAGEMENT
// ============================================

export const getUsers = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
}): Promise<{
  users: User[];
  total: number;
}> => {
  return apiClient.get('/admin/users', { params });
};

export const getUser = async (userId: string): Promise<User> => {
  return apiClient.get(`/admin/users/${userId}`);
};

export const updateUserStatus = async (userId: string, isActive: boolean): Promise<void> => {
  return apiClient.patch(`/admin/users/${userId}/status`, { isActive });
};

export const updateUserRole = async (userId: string, role: string): Promise<void> => {
  return apiClient.patch(`/admin/users/${userId}/role`, { role });
};

// ============================================
// TRANSACTION MANAGEMENT
// ============================================

export const getPendingTransactions = async (params?: {
  type?: string;
  page?: number;
  limit?: number;
}): Promise<{
  transactions: Transaction[];
  total: number;
}> => {
  return apiClient.get('/admin/transactions/pending', { params });
};

export const getAllTransactions = async (params?: {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
  userId?: string;
}): Promise<{
  transactions: Transaction[];
  total: number;
}> => {
  return apiClient.get('/admin/transactions', { params });
};

export const approveTransaction = async (
  transactionId: string,
  notes?: string
): Promise<void> => {
  return apiClient.post(`/admin/transactions/${transactionId}/approve`, { notes });
};

export const rejectTransaction = async (
  transactionId: string,
  reason: string
): Promise<void> => {
  return apiClient.post(`/admin/transactions/${transactionId}/reject`, { reason });
};

// ============================================
// GIFT CARD MANAGEMENT
// ============================================

export const getAdminGiftCards = async (): Promise<GiftCard[]> => {
  return apiClient.get('/admin/gift-cards');
};

export const createGiftCard = async (data: Partial<GiftCard>): Promise<GiftCard> => {
  return apiClient.post('/admin/gift-cards', data);
};

export const updateGiftCard = async (
  giftCardId: string,
  data: Partial<GiftCard>
): Promise<GiftCard> => {
  return apiClient.put(`/admin/gift-cards/${giftCardId}`, data);
};

export const deleteGiftCard = async (giftCardId: string): Promise<void> => {
  return apiClient.delete(`/admin/gift-cards/${giftCardId}`);
};

export const toggleGiftCardStatus = async (
  giftCardId: string,
  isActive: boolean
): Promise<void> => {
  return apiClient.patch(`/admin/gift-cards/${giftCardId}/status`, { isActive });
};

// ============================================
// SYSTEM SETTINGS
// ============================================

export const getSystemSettings = async (): Promise<Record<string, any>> => {
  return apiClient.get('/admin/settings');
};

export const updateSystemSetting = async (
  key: string,
  value: string | number | boolean
): Promise<void> => {
  return apiClient.put('/admin/settings', { key, value });
};

export const updateSystemSettings = async (settings: Record<string, any>): Promise<void> => {
  return apiClient.put('/admin/settings/bulk', settings);
};

// ============================================
// FEE CONFIGURATION
// ============================================

export const getFeeConfigs = async (): Promise<FeeConfig[]> => {
  return apiClient.get('/admin/fees');
};

export const updateFeeConfig = async (
  feeId: string,
  data: Partial<FeeConfig>
): Promise<FeeConfig> => {
  return apiClient.put(`/admin/fees/${feeId}`, data);
};

// ============================================
// FEATURE FLAGS
// ============================================

export const getFeatureFlags = async (): Promise<{
  FEATURE_SELL_CRYPTO: boolean;
  FEATURE_REFERRALS: boolean;
  FEATURE_SUPPORT_TICKETS: boolean;
}> => {
  return apiClient.get('/admin/feature-flags');
};

export const updateFeatureFlag = async (
  flagName: string,
  enabled: boolean
): Promise<void> => {
  return apiClient.put('/admin/feature-flags', { flagName, enabled });
};

// ============================================
// METRICS & ANALYTICS
// ============================================

export const getMetrics = async (params?: {
  startDate?: string;
  endDate?: string;
}): Promise<AdminMetrics> => {
  return apiClient.get('/admin/metrics', { params });
};

export const getTransactionMetrics = async (params?: {
  startDate?: string;
  endDate?: string;
  groupBy?: 'day' | 'week' | 'month';
}): Promise<any> => {
  return apiClient.get('/admin/metrics/transactions', { params });
};

// ============================================
// AUDIT LOGS
// ============================================

export const getAuditLogs = async (params?: {
  page?: number;
  limit?: number;
  userId?: string;
  action?: string;
}): Promise<any> => {
  return apiClient.get('/admin/audit-logs', { params });
};