import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get('auth_token')?.value;

  const { pathname } = request.nextUrl;

  // Allow access to API routes
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const isLoginPage = pathname === '/login';

  if (!isAuthenticated && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthenticated) {
    if (isLoginPage || pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
  
  if (!isAuthenticated && pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
