'use client';
import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/shared/Modal';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { useToast } from '@/lib/context/ToastContext';
import * as giftCardApi from '@/lib/api/giftcards';
import { formatCurrency } from '@/lib/utils/formatters';
import { GiftCard } from '@/lib/types/admin';

interface GiftCardPurchaseModalProps {
  giftCard: GiftCard;
  isOpen: boolean;
  onClose: () => void;
}

export const GiftCardPurchaseModal: React.FC<GiftCardPurchaseModalProps> = ({
  giftCard,
  isOpen,
  onClose,
}) => {
  const [amount, setAmount] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [preview, setPreview] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      fetchRatePreview();
    } else {
      setPreview(null);
    }
  }, [amount]);

  const fetchRatePreview = async () => {
    try {
      const data = await giftCardApi.getRatePreview({
        giftCardId: giftCard.id,
        amount: parseFloat(amount),
      });
      setPreview(data);
    } catch (error) {
      console.error('Failed to fetch rate preview:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (images.length + newFiles.length > 5) {
        showToast('Maximum 5 images allowed', 'error');
        return;
      }
      setImages([...images, ...newFiles]);
    }
  };

  const handleSubmit = async () => {
    if (!preview || images.length === 0) {
      showToast('Please upload at least one image', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('giftCardId', giftCard.id);
      formData.append('amount', amount);
      images.forEach((image) => formData.append('images', image));

      await giftCardApi.submitGiftCard(formData);
      showToast('Gift card submitted successfully!', 'success');
      onClose();
    } catch (error: any) {
      showToast(error.message || 'Failed to submit gift card', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Sell ${giftCard.name}`} size="lg">
      <div className="space-y-6">
        <Input
          label="Card Value (USD)"
          type="number"
          placeholder="100"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="1"
          step="0.01"
        />

        {preview && (
          <div className="bg-primary-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-secondary-gray-700">Gross Amount:</span>
              <span className="font-medium">{formatCurrency(preview.grossAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-secondary-gray-700">Fee ({giftCard.feePercentage}%):</span>
              <span className="font-medium text-error">-{formatCurrency(preview.feeAmount)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-2 border-t border-primary-200">
              <span>You'll Receive:</span>
              <span className="text-success">{formatCurrency(preview.netAmount)}</span>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-secondary-gray-700 mb-2">
            Upload Card Images (Max 5)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="block w-full text-sm text-secondary-gray-500
              file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
              file:text-sm file:font-medium file:bg-primary file:text-white
              hover:file:bg-primary-600"
          />
          {images.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative w-20 h-20">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                    className="absolute -top-2 -right-2 bg-error text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            disabled={!preview || images.length === 0}
            className="flex-1"
          >
            Submit for Review
          </Button>
        </div>
      </div>
    </Modal>
  );
};