'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import * as adminApi from '@/lib/api/admin';

/**
 * Feature Flag Context
 * 
 * ASSUMPTION: Feature flags fetched on app load and stored in Context
 * CRYPTO FEATURE GATING: When FEATURE_SELL_CRYPTO=false:
 * - Hide all crypto-related UI components
 * - Do not call crypto API endpoints
 * - Hide admin crypto management section
 */

interface FeatureFlags {
  FEATURE_SELL_CRYPTO: boolean;
  FEATURE_REFERRALS: boolean;
  FEATURE_SUPPORT_TICKETS: boolean;
}

interface FeatureFlagContextType {
  flags: FeatureFlags;
  isLoading: boolean;
  refreshFlags: () => Promise<void>;
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

export function FeatureFlagProvider({ children }: { children: React.ReactNode }) {
  const [flags, setFlags] = useState<FeatureFlags>({
    FEATURE_SELL_CRYPTO: false,  // DISABLED FOR MVP
    FEATURE_REFERRALS: true,
    FEATURE_SUPPORT_TICKETS: true,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFlags();
  }, []);

  const loadFlags = async () => {
    try {
      // Attempt to fetch flags from backend
      const response = await adminApi.getFeatureFlags();
      setFlags(response);
    } catch (error) {
      // If fetch fails, use defaults (crypto disabled)
      console.error('Failed to load feature flags, using defaults:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshFlags = async () => {
    await loadFlags();
  };

  return (
    <FeatureFlagContext.Provider value={{ flags, isLoading, refreshFlags }}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    throw new Error('useFeatureFlags must be used within FeatureFlagProvider');
  }
  return context;
};