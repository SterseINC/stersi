import { type AbstractIntlMessages } from 'next-intl';

const supportedLocales = ['en', 'el']; // Your supported languages

export async function getMessages(locale: string): Promise<AbstractIntlMessages | null> {
  if (!supportedLocales.includes(locale)) {
    console.warn(`Unsupported locale "${locale}" requested`);
    return null;
  }

  try {
    return (await import(`../messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Missing messages for locale "${locale}"`, error);
    return null;
  }
}
