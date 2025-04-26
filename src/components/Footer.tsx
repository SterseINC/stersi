'use client';

import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="w-full bg-white border-t py-4 mt-auto">
      <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Stersi. {t('rights')}
      </div>
    </footer>
  );
}
