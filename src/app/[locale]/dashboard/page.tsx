'use client';

import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const t = useTranslations('Dashboard');

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 px-4">
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <p className="text-center mt-10">Loading...</p>
        </div>
      </div>
    );


  }

  if (!session) {
    return <p className="text-center mt-10 text-red-600">{t('notSignedIn')}</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 px-4">
      <div className="bg-white p-6 rounded-xl shadow-md text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          {t('hello')}, {session.user?.email}
        </h1>
      </div>
    </div>
  );
}
