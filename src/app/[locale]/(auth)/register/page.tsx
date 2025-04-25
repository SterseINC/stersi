'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('Register');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      router.push(`/${locale}/signin`);
    } else {
      const data = await res.json();
      setError(data.message || t('error'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-green-600 mb-6">
          {t('title')}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('email')}</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">{t('password')}</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition"
          >
            {t('button')}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          {t('haveAccount')}{' '}
          <Link href={`/${locale}/signin`} className="text-green-600 hover:underline">
            {t('signinHere')}
          </Link>
        </p>
      </div>
    </div>
  );
}
