export interface GiftCard {
    id: string;
    name: string;
    slug: string;
    category: 'gaming' | 'retail' | 'cash_equivalent';
    cardType: 'physical' | 'e_code' | 'both';
    logoUrl?: string;
    isActive: boolean;
    feePercentage: number;
    displayOrder: number;
    requiredUploadFields: string[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface FeeConfig {
    id: string;
    name: string;
    feeType: 'PERCENTAGE' | 'FLAT';
    feeValue: number;
    appliesTo: string;
    isActive: boolean;
  }
  
  export interface SystemSetting {
    key: string;
    value: string;
    description?: string;
  }
  
  export interface AdminMetrics {
    totalUsers: number;
    activeUsers: number;
    totalTransactions: number;
    pendingApprovals: number;
    totalVolume: number;
    todayVolume: number;
  }