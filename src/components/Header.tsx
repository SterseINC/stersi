'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Header() {
  const { data: session } = useSession();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('Header');

  const [menuOpen, setMenuOpen] = useState(false);

  const switchLang = (selectedLocale: 'en' | 'el') => {
    if (selectedLocale === locale) return;
    const segments = pathname.split('/');
    segments[1] = selectedLocale;
    const newPath = segments.join('/');
    router.push(newPath);
  };

  const handleLogoClick = () => {
    if (session) {
      router.push(`/${locale}/dashboard`);
    } else {
      router.push(`/${locale}`);
    }
  };

  const handleMenuClick = (href: string) => {
    setMenuOpen(false); // ✅ Close the menu first
    router.push(href);  // ✅ Then navigate
  };

  return (
    <header className="w-full bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <button onClick={handleLogoClick} className="text-xl font-bold text-green-600 cursor-pointer">
          <Image src="/logo.png" alt="Stersi Logo" width={100} height={80} />
        </button>

        <div className="flex items-center gap-4 relative">
          {/* Auth links */}
          {!session ? (
            <>
              <Link
                href={`/${locale}/signin`}
                className="text-sm text-gray-700 hover:text-green-600 transition font-medium"
              >
                {t('signIn')}
              </Link>
              <Link
                href={`/${locale}/register`}
                className="text-sm text-gray-700 hover:text-green-600 transition font-medium"
              >
                {t('register')}
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(prev => !prev)}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:ring-2 hover:ring-green-500 transition cursor-pointer"
              >
                {/* Simple SVG user icon */}
                <svg width="32px" height="32px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="6" r="4" stroke="#1C274C" strokeWidth="1.5"/>
                  <path d="M15 20.6151C14.0907 20.8619 13.0736 21 12 21C8.13401 21 5 19.2091 5 17C5 14.7909 8.13401 13 12 13C15.866 13 19 14.7909 19 17C19 17.3453 18.9234 17.6804 18.7795 18" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>

              {/* Mini dropdown menu */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-md border z-50 cursor-pointer">
                  <button
                    onClick={() => handleMenuClick(`/${locale}/profile`)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    {t('profile', { defaultValue: 'Profile' })}
                  </button>
                  <button
                    onClick={() => handleMenuClick(`/${locale}/dashboard`)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    {t('dashboard', { defaultValue: 'Dashboard' })}
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      signOut({ callbackUrl: `/${locale}/signin` });
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    {t('signOut', { defaultValue: 'Sign Out' })}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Language Switcher */}
          <div className="flex gap-2 ml-2">
            {locale !== 'en' && (
              <button
                onClick={() => switchLang('en')}
                className="w-8 h-8 rounded-full overflow-hidden border-2 border-transparent hover:border-green-500 cursor-pointer"
              >
                <Image src="/flags/en.png" alt="English" width={32} height={32} />
              </button>
            )}
            {locale !== 'el' && (
              <button
                onClick={() => switchLang('el')}
                className="w-8 h-8 rounded-full overflow-hidden border-2 border-transparent hover:border-green-500 cursor-pointer"
              >
                <Image src="/flags/el.png" alt="Greek" width={32} height={32} />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
