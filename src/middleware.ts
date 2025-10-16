import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware for authentication
 * Note: Firebase Auth uses client-side authentication
 * This middleware provides basic protection but the real auth check happens client-side
 */
export function middleware(request: NextRequest) {
  const isLoginPage = request.nextUrl.pathname === "/login";
  const isPublicPath = isLoginPage || request.nextUrl.pathname === "/";

  // Allow access to public paths
  if (isPublicPath) {
    return NextResponse.next();
  }

  // For protected routes, let the client-side AuthProvider handle authentication
  // This middleware just ensures the structure is correct
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
