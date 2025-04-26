'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface EditListModalProps {
  onClose: () => void;
  onSave: (title: string, description: string) => void;
  initialTitle: string;
  initialDescription: string;
}

export default function EditListModal({ onClose, onSave, initialTitle, initialDescription }: EditListModalProps) {
  const t = useTranslations('Dashboard');
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError(t('titleRequired', { defaultValue: 'Title is required.' }));
      return;
    }
    setError('');
    onSave(title, description);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-lg animate-scale-in">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('editList', { defaultValue: 'Edit List' })}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">{t('listTitle', { defaultValue: 'List Title' })}</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder={t('listTitlePlaceholder', { defaultValue: 'e.g., Weekly Shopping' })}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">{t('listDescription', { defaultValue: 'Description (optional)' })}</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder={t('listDescriptionPlaceholder', { defaultValue: 'e.g., Essentials for the week' })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border text-gray-600 hover:bg-gray-100 text-sm font-medium cursor-pointer"
            >
              {t('cancel', { defaultValue: 'Cancel' })}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-semibold cursor-pointer"
            >
              {t('save', { defaultValue: 'Save Changes' })}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
