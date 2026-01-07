'use client';
import React from 'react';
import { Card } from '@/components/shared/Card';
import { formatCurrency } from '@/lib/utils/formatters';

interface WalletCardProps {
  availableBalance: number;
  lockedBalance: number;
  isLoading?: boolean;
}

export const WalletCard: React.FC<WalletCardProps> = ({
  availableBalance,
  lockedBalance,
  isLoading,
}) => {
  if (isLoading) {
    return <Card className="animate-pulse"><div className="h-24 bg-secondary-gray-200 rounded"></div></Card>;
  }

  const totalBalance = availableBalance + lockedBalance;

  return (
    <Card className="bg-gradient-to-br from-primary to-primary-700 text-white">
      <div className="space-y-4">
        <div>
          <p className="text-sm opacity-90">Total Balance</p>
          <h2 className="text-4xl font-bold mt-1">{formatCurrency(totalBalance)}</h2>
        </div>
        <div className="flex justify-between pt-4 border-t border-white border-opacity-20">
          <div>
            <p className="text-xs opacity-75">Available</p>
            <p className="text-lg font-semibold">{formatCurrency(availableBalance)}</p>
          </div>
          <div>
            <p className="text-xs opacity-75">Locked</p>
            <p className="text-lg font-semibold">{formatCurrency(lockedBalance)}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};