export interface Wallet {
    id: string;
    userId: string;
    availableBalance: number;
    lockedBalance: number;
    updatedAt: string;
  }
  
  export interface WalletTransaction {
    id: string;
    walletId: string;
    type: 'CREDIT' | 'DEBIT' | 'LOCK' | 'UNLOCK';
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    reference: string;
    description: string;
    createdAt: string;
  }