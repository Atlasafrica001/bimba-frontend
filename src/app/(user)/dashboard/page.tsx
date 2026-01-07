'use client';
import React, { useEffect, useState } from 'react';
import { WalletCard } from '@/components/user/WalletCard';
import { GiftCardGrid } from '@/components/user/GiftCardGrid';
import { Button } from '@/components/shared/Button';
import * as walletApi from '@/lib/api/wallet';
import * as giftCardApi from '@/lib/api/giftcards';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [wallet, setWallet] = useState<any>(null);
  const [giftCards, setGiftCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [walletData, cardsData] = await Promise.all([
        walletApi.getWallet(),
        giftCardApi.getGiftCards(),
      ]);
      setWallet(walletData);
      setGiftCards(cardsData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <WalletCard
            availableBalance={wallet?.availableBalance || 0}
            lockedBalance={wallet?.lockedBalance || 0}
            isLoading={isLoading}
          />
        </div>
        <div className="space-y-3">
          <Button variant="primary" className="w-full" onClick={() => router.push('/gift-cards')}>
            Sell Gift Card
          </Button>
          <Button variant="outline" className="w-full" onClick={() => router.push('/wallet')}>
            Withdraw Funds
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-6">Available Gift Cards</h2>
        <GiftCardGrid giftCards={giftCards} isLoading={isLoading} />
      </div>
    </div>
  );
}