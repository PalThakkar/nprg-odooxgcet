import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

const PROTECTED_ROUTES = ['/employees', '/api/data', '/api/leaves', '/api/attendance'];
const ADMIN_ROUTES = ['/admin', '/api/leaves/admin', '/api/salary/admin', '/api/admin'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Check if route is protected
  const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route));

  if (!isProtected && !isAdminRoute) {
    return NextResponse.next();
  }

  // 2. Extract Token
  // Check Authorization header or Cookie (We'll use Authorization header for APIs, Cookies for pages usually)
  // For this generic setup, we'll check Authorization header first, then cookie 'token'
  let token = request.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    token = request.cookies.get('token')?.value;
  }

  if (!token) {
    if (pathname.startsWith('/api')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // 3. Verify Token
  const payload = await verifyToken(token);
  if (!payload) {
    if (pathname.startsWith('/api')) {
      return NextResponse.json({ error: 'Invalid Token' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // 4. RBAC Check (Admin)
  if (isAdminRoute && (payload as any).role?.toLowerCase() !== 'admin') {
    if (pathname.startsWith('/api')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.redirect(new URL('/employees', request.url)); // Redirect to user dashboard
  }

  // 5. Success - Attach user info via headers (optional, for Server Components)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', (payload as any).id);
  requestHeaders.set('x-user-role', (payload as any).role);
  if ((payload as any).companyId) {
    requestHeaders.set('x-user-company-id', (payload as any).companyId);
  }
  if ((payload as any).loginId) {
    requestHeaders.set('x-user-login-id', (payload as any).loginId);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/employees/:path*',
    '/api/data/:path*',
    '/api/leaves/:path*',
    '/api/salary/:path*',
    '/api/admin/:path*',
    '/api/attendance/:path*',
  ],
};
