'use client';
import React, { useEffect, useState } from 'react';
import { GiftCardGrid } from '@/components/user/GiftCardGrid';
import * as giftCardApi from '@/lib/api/giftcards';

export default function GiftCardsPage() {
  const [giftCards, setGiftCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGiftCards();
  }, []);

  const loadGiftCards = async () => {
    try {
      const data = await giftCardApi.getGiftCards();
      setGiftCards(data);
    } catch (error) {
      console.error('Failed to load gift cards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Sell Gift Cards</h1>
        <p className="text-secondary-gray-600">
          Select a gift card to get started. We offer competitive rates for all major brands.
        </p>
      </div>

      <GiftCardGrid giftCards={giftCards} isLoading={isLoading} />
    </div>
  );
}