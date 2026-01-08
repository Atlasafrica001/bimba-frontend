'use client';
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';
import { GiftCardEditor } from '@/components/admin/GiftCardEditor';
import { useToast } from '@/lib/context/ToastContext';
import * as adminApi from '@/lib/api/admin';
import { GiftCard } from '@/lib/types/admin';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function AdminGiftCardsPage() {
  const { showToast } = useToast();
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<GiftCard | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    loadGiftCards();
  }, []);

  const loadGiftCards = async () => {
    try {
      const data = await adminApi.getAdminGiftCards();
      setGiftCards(data);
    } catch (error) {
      console.error('Failed to load gift cards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (data: Partial<GiftCard>) => {
    if (selectedCard) {
      // Update existing
      await adminApi.updateGiftCard(selectedCard.id, data);
    } else {
      // Create new
      await adminApi.createGiftCard(data);
    }
    await loadGiftCards();
  };

  const handleDelete = async (giftCardId: string) => {
    if (!confirm('Are you sure you want to delete this gift card?')) return;

    try {
      await adminApi.deleteGiftCard(giftCardId);
      showToast('Gift card deleted successfully!', 'success');
      await loadGiftCards();
    } catch (error: any) {
      showToast(error.message || 'Failed to delete gift card', 'error');
    }
  };

  const handleToggleStatus = async (giftCardId: string, currentStatus: boolean) => {
    try {
      await adminApi.toggleGiftCardStatus(giftCardId, !currentStatus);
      showToast('Status updated successfully!', 'success');
      await loadGiftCards();
    } catch (error: any) {
      showToast(error.message || 'Failed to update status', 'error');
    }
  };

  const openEditor = (card?: GiftCard) => {
    setSelectedCard(card || null);
    setShowEditor(true);
  };

  const closeEditor = () => {
    setSelectedCard(null);
    setShowEditor(false);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gift Card Management</h1>
          <p className="text-secondary-gray-600">
            Configure available gift cards, fees, and settings
          </p>
        </div>
        <Button variant="primary" onClick={() => openEditor()}>
          Add New Gift Card
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {giftCards.map((card) => (
          <Card key={card.id}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-secondary-gray-900">{card.name}</h3>
                <p className="text-xs text-secondary-gray-500">{card.slug}</p>
              </div>
              <Badge variant={card.isActive ? 'success' : 'error'}>
                {card.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-secondary-gray-600">Category:</span>
                <span className="font-medium">{card.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-gray-600">Type:</span>
                <span className="font-medium">{card.cardType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-gray-600">Fee:</span>
                <span className="font-medium">{card.feePercentage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-gray-600">Display Order:</span>
                <span className="font-medium">{card.displayOrder}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openEditor(card)}
                className="flex-1"
              >
                <PencilIcon className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                variant={card.isActive ? 'danger' : 'primary'}
                size="sm"
                onClick={() => handleToggleStatus(card.id, card.isActive)}
                className="flex-1"
              >
                {card.isActive ? 'Deactivate' : 'Activate'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Editor Modal */}
      <GiftCardEditor
        giftCard={selectedCard}
        isOpen={showEditor}
        onClose={closeEditor}
        onSave={handleSave}
      />
    </div>
  );
}