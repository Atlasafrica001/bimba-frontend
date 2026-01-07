'use client';
import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/shared/Modal';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { useToast } from '@/lib/context/ToastContext';
import { GiftCard } from '@/lib/types/admin';

interface GiftCardEditorProps {
  giftCard?: GiftCard | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<GiftCard>) => Promise<void>;
}

export const GiftCardEditor: React.FC<GiftCardEditorProps> = ({
  giftCard,
  isOpen,
  onClose,
  onSave,
}) => {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'gaming' as 'gaming' | 'retail' | 'cash_equivalent',
    cardType: 'both' as 'physical' | 'e_code' | 'both',
    feePercentage: '0',
    displayOrder: '0',
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (giftCard) {
      setFormData({
        name: giftCard.name,
        slug: giftCard.slug,
        category: giftCard.category,
        cardType: giftCard.cardType,
        feePercentage: giftCard.feePercentage.toString(),
        displayOrder: giftCard.displayOrder.toString(),
        isActive: giftCard.isActive,
      });
    } else {
      // Reset form for new gift card
      setFormData({
        name: '',
        slug: '',
        category: 'gaming',
        cardType: 'both',
        feePercentage: '0',
        displayOrder: '0',
        isActive: true,
      });
    }
  }, [giftCard, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug must be lowercase letters, numbers, and hyphens only';
    }

    const fee = parseFloat(formData.feePercentage);
    if (isNaN(fee) || fee < 0 || fee > 100) {
      newErrors.feePercentage = 'Fee must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSave({
        name: formData.name,
        slug: formData.slug,
        category: formData.category,
        cardType: formData.cardType,
        feePercentage: parseFloat(formData.feePercentage),
        displayOrder: parseInt(formData.displayOrder),
        isActive: formData.isActive,
      });

      showToast(
        giftCard ? 'Gift card updated successfully!' : 'Gift card created successfully!',
        'success'
      );
      onClose();
    } catch (error: any) {
      showToast(error.message || 'Failed to save gift card', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={giftCard ? 'Edit Gift Card' : 'Add New Gift Card'}
      size="lg"
    >
      <div className="space-y-4">
        <Input
          label="Gift Card Name"
          type="text"
          placeholder="iTunes/Apple"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
        />

        <Input
          label="Slug (URL-friendly identifier)"
          type="text"
          placeholder="itunes-apple"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase() })}
          error={errors.slug}
          helperText="Use lowercase letters, numbers, and hyphens only"
        />

        <div>
          <label className="block text-sm font-medium text-secondary-gray-700 mb-1">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({
                ...formData,
                category: e.target.value as 'gaming' | 'retail' | 'cash_equivalent',
              })
            }
            className="input-field"
          >
            <option value="gaming">Gaming</option>
            <option value="retail">Retail</option>
            <option value="cash_equivalent">Cash Equivalent</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-gray-700 mb-1">
            Card Type
          </label>
          <select
            value={formData.cardType}
            onChange={(e) =>
              setFormData({
                ...formData,
                cardType: e.target.value as 'physical' | 'e_code' | 'both',
              })
            }
            className="input-field"
          >
            <option value="physical">Physical Only</option>
            <option value="e_code">E-Code Only</option>
            <option value="both">Both</option>
          </select>
        </div>

        <Input
          label="Fee Percentage (%)"
          type="number"
          placeholder="2.5"
          value={formData.feePercentage}
          onChange={(e) => setFormData({ ...formData, feePercentage: e.target.value })}
          error={errors.feePercentage}
          min="0"
          max="100"
          step="0.1"
        />

        <Input
          label="Display Order"
          type="number"
          placeholder="0"
          value={formData.displayOrder}
          onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
          helperText="Lower numbers appear first"
          min="0"
        />

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="w-4 h-4 text-primary rounded focus:ring-primary"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-secondary-gray-700">
            Active (visible to users)
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            className="flex-1"
          >
            {giftCard ? 'Update' : 'Create'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};