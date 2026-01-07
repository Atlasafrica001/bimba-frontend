import { UserRole } from "./auth";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  isEmailVerified: boolean;
  referralCode: string;
  updatedAt: string;
  createdAt?: string; // optional for auth context
}

export interface UserProfile extends User {
  wallet?: {
    availableBalance: number;
    lockedBalance: number;
  };
}
