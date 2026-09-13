import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const nextParam = requestUrl.searchParams.get('next');

  // Only allow internal relative redirects. In particular, reject //host
  // values because new URL('//host', origin) would become an external URL.
  const next =
    nextParam && nextParam.startsWith('/') && !nextParam.startsWith('//')
      ? nextParam
      : '/';

  if (!code) {
    return NextResponse.redirect(
      new URL('/?auth=error&reason=missing_code', requestUrl.origin)
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('Supabase OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/?auth=error&reason=code_exchange', requestUrl.origin)
    );
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
