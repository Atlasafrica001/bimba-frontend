'use client';
import React, { useState } from 'react';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { GiftCardPurchaseModal } from './GiftCardPurchaseModal';
import { GiftCard } from '@/lib/types/admin';

interface GiftCardGridProps {
  giftCards: GiftCard[];
  isLoading?: boolean;
}

export const GiftCardGrid: React.FC<GiftCardGridProps> = ({ giftCards, isLoading }) => {
  const [selectedCard, setSelectedCard] = useState<GiftCard | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(giftCards.map((card) => card.category)))];
  const filteredCards = selectedCategory === 'all'
    ? giftCards
    : giftCards.filter((card) => card.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-48 bg-secondary-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? 'bg-primary text-white'
                : 'bg-white text-secondary-gray-700 border border-secondary-gray-300 hover:bg-secondary-gray-50'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Gift Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards.map((card) => (
          <Card key={card.id} hoverable onClick={() => setSelectedCard(card)} className="relative">
            <div className="w-full h-32 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-3xl font-bold text-primary">{card.name.substring(0, 2)}</span>
            </div>
            <h3 className="font-semibold text-lg text-secondary-gray-900 mb-2">{card.name}</h3>
            <div className="flex items-center justify-between">
              <Badge variant="info" size="sm">{card.category}</Badge>
              {card.feePercentage > 0 && (
                <span className="text-xs text-secondary-gray-600">{card.feePercentage}% fee</span>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Purchase Modal */}
      {selectedCard && (
        <GiftCardPurchaseModal
          giftCard={selectedCard}
          isOpen={!!selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </>
  );
};