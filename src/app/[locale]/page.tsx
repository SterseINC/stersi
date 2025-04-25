'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const t = useTranslations('Home');
  const locale = useLocale();

  const handleStart = () => {
    if (session) {
      router.push(`${locale}'/dashboard'`);
    } else {
      router.push(`/${locale}/signin`);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 px-4">
      <div className="max-w-xl text-center bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          {t('headline')} <span className="text-green-600">Stersi</span>
        </h1>
        <p className="text-lg text-gray-600 mb-6">{t('description')}</p>
        <button
          onClick={handleStart}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-full transition cursor-pointer"
        >
          {session ? t('button.dashboard') : t('button.start')}
        </button>
      </div>

      <footer className="text-sm text-gray-500 mt-8">
        &copy; {new Date().getFullYear()} Stersi. {t('footer.rights')}
      </footer>
    </main>
  );
}
