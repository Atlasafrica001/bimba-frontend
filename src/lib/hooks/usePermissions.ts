// src/lib/hooks/usePermissions.ts (FRONTEND)

/**
 * WARNING: THIS IS UI-ONLY CONVENIENCE
 * DO NOT TREAT AS SECURITY
 * BACKEND ENFORCES ALL PERMISSIONS
 */

import { useAuth } from '@/lib/context/AuthContext';

export const usePermissions = () => {
  const { user } = useAuth();

  /**
   * UI-ONLY: Check if user can approve transactions
   * SECURITY: Backend enforces this with Permission.APPROVE_GIFT_CARD_TRANSACTION
   */
  const canApproveTransactions = (): boolean => {
    return user?.role === 'SUPER_ADMIN';
  };

  /**
   * UI-ONLY: Check if user can view financial dashboard
   * SECURITY: Backend enforces this with Permission.VIEW_FINANCIAL_DASHBOARD
   */
  const canViewFinancialDashboard = (): boolean => {
    return user?.role === 'SUPER_ADMIN';
  };

  /**
   * UI-ONLY: Check if user can edit users
   * SECURITY: Backend enforces this with Permission.UPDATE_USER_STATUS
   */
  const canEditUsers = (): boolean => {
    return ['SUPER_ADMIN', 'SUB_ADMIN'].includes(user?.role || '');
  };

  /**
   * UI-ONLY: Check if user can view single record
   * SECURITY: Backend enforces this with Permission.VIEW_SINGLE_TRANSACTION
   */
  const canViewSingleRecord = (): boolean => {
    return ['SUPER_ADMIN', 'SUB_ADMIN', 'SUPPORT_AGENT'].includes(user?.role || '');
  };

  return {
    canApproveTransactions,
    canViewFinancialDashboard,
    canEditUsers,
    canViewSingleRecord,
  };
};