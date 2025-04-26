'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

interface ShareListModalProps {
  onClose: () => void;
  onShare: (email: string) => void;
}

export default function ShareListModal({ onClose, onShare }: ShareListModalProps) {
  const t = useTranslations('Dashboard');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    onShare(email);
    onClose();
  };

  // ✅ Close modal when pressing ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
          {t('shareList', { defaultValue: 'Share List' })}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('email', { defaultValue: 'User Email' })}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@email.com"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border text-gray-600 hover:bg-gray-100 text-sm cursor-pointer"
            >
              {t('cancel', { defaultValue: 'Cancel' })}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm cursor-pointer"
            >
              {t('share', { defaultValue: 'Share' })}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
