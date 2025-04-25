import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from '@/i18n/routing';

const supportedLocales = ['en', 'el'];

export function middleware(request: NextRequest) {

  const { pathname } = request.nextUrl;

  if (/\.(.*)$/.test(pathname)) {
    return NextResponse.next();
  }

  const localeFromPath = pathname.split('/')[1];

  if (localeFromPath && !supportedLocales.includes(localeFromPath)) {
    const newUrl = new URL(`/en${pathname.slice(localeFromPath.length + 1)}`, request.url);
    return NextResponse.redirect(newUrl);
  }

  return createMiddleware(routing)(request);
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ],
};

