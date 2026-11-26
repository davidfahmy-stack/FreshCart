import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_ROUTES = [
  '/cart',
  '/wishlist',
  '/checkout',
  '/allorders',
  '/addresses',
  '/profile',
  '/change-password',
];

const GUEST_ONLY_ROUTES = ['/login', '/register', '/signup', '/forgot-password'];

export function middleware(req: NextRequest) {
  const token = req.cookies.get('freshcart_token')?.value;
  const { pathname, search } = req.nextUrl;

  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isGuestOnly = GUEST_ONLY_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtected && !token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (isGuestOnly && token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/cart/:path*',
    '/wishlist/:path*',
    '/checkout/:path*',
    '/allorders/:path*',
    '/addresses/:path*',
    '/profile/:path*',
    '/change-password/:path*',
    '/login',
    '/register',
    '/signup',
    '/forgot-password',
  ],
};
