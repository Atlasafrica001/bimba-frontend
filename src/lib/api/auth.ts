import { apiClient } from './client';
import { User } from '@/lib/types/user';


export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface VerifyEmailResponse {
  token: string;
  user: User;
}


export interface SignupRequest {
  email: string;
  password: string;
  referralCode?: string;
}

export interface VerifyEmailRequest {
  otp: string;
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  return apiClient.post('/auth/login', data);
};

export const signup = async (data: SignupRequest): Promise<void> => {
  return apiClient.post('/auth/signup', data);
};

export const verifyEmail = async (data: VerifyEmailRequest): Promise<LoginResponse> => {
  return apiClient.post('/auth/verify-email', data);
};

export const resendOTP = async (): Promise<void> => {
  return apiClient.post('/auth/resend-otp');
};

export const getProfile = async (): Promise<any> => {
  return apiClient.get('/auth/profile');
};

export const requestPasswordReset = async (email: string): Promise<void> => {
  return apiClient.post('/auth/request-password-reset', { email });
};

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  return apiClient.post('/auth/reset-password', { token, newPassword });
};