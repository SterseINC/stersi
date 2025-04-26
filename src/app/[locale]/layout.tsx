import '../globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import SessionWrapper from '@/components/SessionWrapper';
import Header from '@/components/Header';
import { getMessages } from '@/lib/getMessages';
import Footer from '@/components/Footer';
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

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;
  console.log('locale: ' + locale)
  // Now inside an async function, it's safe!
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
