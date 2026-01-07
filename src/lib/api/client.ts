/**
 * Axios API Client Configuration
 * 
 * ASSUMPTIONS:
 * - Backend runs on localhost:3000 in development
 * - JWT token stored in localStorage (NOTE: Security tradeoff for MVP)
 * - Backend returns 401 for unauthorized requests
 * - All Prisma Decimals are serialized to numbers by backend
 */

import axios from 'axios';
import { toast } from 'sonner';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add JWT token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response: { data: any; }) => response.data,
  (error: { response: { status: number; data: { error: any; }; }; }) => {
    // Handle authorization failures from backend
    if (error.response?.status === 403) {
      const errorCode = error.response?.data?.error;
      
      // Show user-friendly error message
      if (errorCode === 'INSUFFICIENT_PERMISSIONS') {
        // Toast notification or modal
        toast.error('You do not have permission to perform this action');
      } else if (errorCode === 'SUPER_ADMIN_REQUIRED') {
        toast.error('This action requires super admin access');
      }
      
      // DO NOT retry the request
      // DO NOT attempt to escalate permissions
      // ACCEPT the backend decision
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Helper function to set auth token
export const setAuthToken = (token: string) => {
  localStorage.setItem('bimba_token', token);
};

// Helper function to clear auth token
export const clearAuthToken = () => {
  localStorage.removeItem('bimba_token');
  localStorage.removeItem('bimba_user');
};