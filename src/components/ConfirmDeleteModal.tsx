'use client';

import { useTranslations } from 'next-intl';

interface ConfirmDeleteModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmDeleteModal({ onClose, onConfirm }: ConfirmDeleteModalProps) {
  const t = useTranslations('Dashboard');

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-lg animate-scale-in">
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
          {t('deleteConfirm', { defaultValue: 'Are you sure you want to delete this list?' })}
        </h2>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border text-gray-600 hover:bg-gray-100 text-sm cursor-pointer"
          >
            {t('cancel', { defaultValue: 'Cancel' })}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm cursor-pointer"
          >
            {t('delete', { defaultValue: 'Delete' })}
          </button>
        </div>
      </div>
    </div>
  );
}
