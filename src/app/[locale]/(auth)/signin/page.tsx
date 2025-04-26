'use client';

import { getProviders, signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ClientSafeProvider } from "next-auth/react"; 

export default function SignInPage() {
  const [providers, setProviders] = useState<Record<string, ClientSafeProvider> | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('SignIn');

  useEffect(() => {
    getProviders().then(setProviders);
  }, []);

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.ok) {
      router.push(`/${locale}/dashboard`);
    } else {
      setError(t('error'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-green-600 mb-6">{t('title')}</h1>

        <form onSubmit={handleCredentialsSignIn} className="space-y-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('email')}</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md placeholder-gray-400 text-gray-800 text-sm focus:outline-none focus:ring-0 focus:border-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">{t('password')}</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md placeholder-gray-400 text-gray-800 text-sm focus:outline-none focus:ring-0 focus:border-gray-400"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition cursor-pointer"
          >
            {t('button')}
          </button>
        </form>

        {providers &&
          Object.values(providers as Record<string, ClientSafeProvider>).map((provider) =>
            provider.id === 'google' ? (
              <div key={provider.name} className="mt-4">
                <button
                  onClick={() => signIn(provider.id, { callbackUrl: `/${locale}/dashboard` })}
                  className="flex items-center justify-center w-full gap-3 py-2 px-4 border border-gray-300 rounded-md bg-white text-gray-700 hover:shadow-sm transition cursor-pointer"
                >
                  <Image
                    src="/icons/google-logo.png"
                    alt="Google logo"
                    width={20}
                    height={20}
                  />
                  <span>{t('google')}</span>
                </button>
              </div>
            ) : null
          )}


        <p className="text-sm text-center text-gray-500 mt-6">
          {t('noAccount')}{' '}
          <Link
            href={`/${locale}/register`}
            className="text-green-600 hover:underline font-medium cursor-pointer"
          >
            {t('registerHere')}
          </Link>
        </p>
      </div>
    </div>
  );
}
