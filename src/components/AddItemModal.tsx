'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface AddItemModalProps {
  onClose: () => void;
  onAddItem: (item: { name: string; quantity: string }) => void;
}

export default function AddItemModal({ onClose, onAddItem }: AddItemModalProps) {
  const t = useTranslations('List');
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddItem({ name, quantity });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{t('addItem', { defaultValue: 'Add New Item' })}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('itemName', { defaultValue: 'Item Name' })}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full mt-1 border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder={t('itemNamePlaceholder', { defaultValue: 'e.g., Apples' })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('quantity', { defaultValue: 'Quantity (optional)' })}</label>
            <input
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full mt-1 border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder={t('quantityPlaceholder', { defaultValue: 'e.g., 2 kg' })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border text-gray-600 hover:bg-gray-100 text-sm"
            >
              {t('cancel', { defaultValue: 'Cancel' })}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
            >
              {t('create', { defaultValue: 'Create' })}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
