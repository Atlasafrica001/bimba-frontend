'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as authApi from '@/lib/api/auth';
import { User } from '@/lib/types/user';
import { setAuthToken, clearAuthToken } from '@/lib/api/client';


interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, referralCode?: string) => Promise<void>;
  logout: () => void;
  verifyEmail: (otp: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check for existing session on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('bimba_token');
      const savedUser = localStorage.getItem('bimba_user');
      
      if (token && savedUser) {
        // Restore user from localStorage
        setUser(JSON.parse(savedUser));
        
        // Optionally verify token with backend
        // const userData = await authApi.getProfile();
        // setUser(userData);
      }
    } catch (error) {
      // If verification fails, clear auth
      clearAuthToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    
    // Save token and user
    setAuthToken(response.token);
    localStorage.setItem('bimba_user', JSON.stringify(response.user));
    setUser(response.user);
    
    // Redirect based on role
    if (['SUPER_ADMIN', 'SUB_ADMIN', 'SUPPORT_AGENT'].includes(response.user.role)) {
      router.push('/admin/dashboard');
    } else {
      router.push('/dashboard');
    }
  };

  const signup = async (email: string, password: string, referralCode?: string) => {
    await authApi.signup({ email, password, referralCode });
    
    // Don't auto-login, redirect to email verification
    router.push('/verify-email?email=' + encodeURIComponent(email));
  };

  const logout = () => {
    clearAuthToken();
    setUser(null);
    router.push('/login');
  };

  const verifyEmail = async (otp: string) => {
    const response = await authApi.verifyEmail({ otp });
    
    // After verification, log user in
    setAuthToken(response.token);
    localStorage.setItem('bimba_user', JSON.stringify(response.user));
    setUser(response.user);
    
    router.push('/dashboard');
  };

  const refreshUser = async () => {
    try {
      const userData = await authApi.getProfile();
      localStorage.setItem('bimba_user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user && user.isEmailVerified,
        login,
        signup,
        logout,
        verifyEmail,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};