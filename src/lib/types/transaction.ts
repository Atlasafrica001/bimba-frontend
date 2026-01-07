export type TransactionType = 'GIFT_CARD_SALE' | 'WITHDRAWAL' | 'REFERRAL_REWARD';

export type TransactionStatus = 
  | 'CREATED'
  | 'PENDING_REVIEW'
  | 'APPROVED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'REJECTED'
  | 'FAILED'
  | 'CANCELLED';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  status: TransactionStatus;
  direction: 'INBOUND' | 'OUTBOUND';
  grossAmount: number;
  feeAmount: number;
  netAmount: number;
  usdEquivalentAmount?: number;
  reference: string;
  createdAt: string;
  updatedAt: string;
}

export interface GiftCardTransaction {
  id: string;
  userId: string;
  parentTransactionId: string;
  giftCardId: string;
  giftCard: {
    name: string;
    category: string;
  };
  cardType: 'PHYSICAL' | 'E_CODE';
  cardValue: number;
  cardCurrency: string;
  rateNgnPerUsd: number;
  imageUrls: string[];
  createdAt: string;
  parentTransaction: Transaction;
}

export interface Withdrawal {
  id: string;
  userId: string;
  parentTransactionId: string;
  amount: number;
  fee: number;
  totalAmount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  requestedAt: string;
  releaseAt: string;
  cancelledAt?: string;
  parentTransaction: Transaction;
}