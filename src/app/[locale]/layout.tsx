import '../globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import SessionWrapper from '@/components/SessionWrapper';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getMessages } from '@/lib/getMessages';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin', 'greek'],
  display: 'swap',
  variable: '--font-inter',
});

const supportedLocales = ['en', 'el'];

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Stersi - Shopping List App',
  description: 'Manage your shopping lists effortlessly.',
};

// ✅ Manual typing because Next.js doesn't provide LayoutProps
type LocaleLayoutProps = {
  children: React.ReactNode;
  params: {
    locale: string;
  };
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = params;

  if (!supportedLocales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages(locale);

  if (!messages) {
    notFound();
  }

  return (
    <html lang={locale} className={inter.variable}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SessionWrapper>
            <Header />
            {children}
            <Footer />
          </SessionWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
