/**
 * Application Constants
 */

export const APP_NAME = 'Bimba';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  VERIFY_EMAIL: '/verify-email',
  DASHBOARD: '/dashboard',
  GIFT_CARDS: '/gift-cards',
  WALLET: '/wallet',
  PROFILE: '/profile',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_GIFT_CARDS: '/admin/gift-cards',
  ADMIN_TRANSACTIONS: '/admin/transactions',
  ADMIN_SETTINGS: '/admin/settings',
} as const;

export const TRANSACTION_STATUS_LABELS: Record<string, string> = {
  CREATED: 'Created',
  PENDING_REVIEW: 'Pending Review',
  APPROVED: 'Approved',
  PROCESSING: 'Processing',
  COMPLETED: 'Completed',
  REJECTED: 'Rejected',
  FAILED: 'Failed',
  CANCELLED: 'Cancelled',
};

export const TRANSACTION_TYPE_LABELS: Record<string, string> = {
  GIFT_CARD_SALE: 'Gift Card Sale',
  WITHDRAWAL: 'Withdrawal',
  REFERRAL_REWARD: 'Referral Reward',
};

export const GIFT_CARD_CATEGORIES = [
  { value: 'gaming', label: 'Gaming' },
  { value: 'retail', label: 'Retail' },
  { value: 'cash_equivalent', label: 'Cash Equivalent' },
];

export const PAGINATION_LIMIT = 20;

export const IMAGE_UPLOAD_CONFIG = {
  MAX_FILES: 5,
  MAX_SIZE_MB: 10,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
};