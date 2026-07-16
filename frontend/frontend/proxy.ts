import { NextRequest, NextResponse } from 'next/server';

// Server-side gate for authenticated areas. The token lives in a JS-set cookie
// (see lib/auth.ts). Middleware only checks for the cookie's presence — it does
// not verify the JWT signature (the secret isn't available at the edge). The API
// remains the source of truth and returns 401 for invalid/expired tokens; this
// guard just stops unauthenticated users from loading the dashboard shell.
const TOKEN_COOKIE = 'ecosmart_token';

export function proxy(req: NextRequest) {
  const token = req.cookies.get(TOKEN_COOKIE)?.value;

  if (!token) {
    const signInUrl = new URL('/auth/individual/sign-in', req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
