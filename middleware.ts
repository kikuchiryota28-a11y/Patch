import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/proxy';

const locales = ['en', 'ja'] as const;
export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  const existing = request.cookies.get('patch-locale')?.value;
  if (!existing || !locales.includes(existing as (typeof locales)[number])) {
    const accept = request.headers.get('accept-language')?.toLowerCase() ?? '';
    response.cookies.set('patch-locale', accept.startsWith('ja') ? 'ja' : 'en', { path: '/', maxAge: 31536000, sameSite: 'lax' });
  }
  return response;
}
export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'] };
