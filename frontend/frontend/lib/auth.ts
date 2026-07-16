import Cookies from 'js-cookie';

const TOKEN_KEY = 'ecosmart_token';
const USER_KEY = 'ecosmart_user';

// The auth token lives in a cookie (not localStorage) so Next.js middleware can
// read it server-side to guard /dashboard routes. NOTE: this cookie is JS-readable
// — the backend uses a Bearer-token model, not HttpOnly cookies — so it is not
// XSS-proof; the win here is enabling server-side route protection. The token is
// still sent to the API as an Authorization: Bearer header (see lib/api.ts).
const TOKEN_COOKIE_OPTIONS: Cookies.CookieAttributes = {
  expires: 7, // matches the backend's 7-day JWT expiry
  sameSite: 'lax',
  secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
  path: '/',
};

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  const fromCookie = Cookies.get(TOKEN_KEY);
  if (fromCookie) return fromCookie;

  // One-time migration: move any pre-existing localStorage token into the cookie
  // so already-signed-in users aren't logged out by this change.
  const legacy = localStorage.getItem(TOKEN_KEY);
  if (legacy) {
    Cookies.set(TOKEN_KEY, legacy, TOKEN_COOKIE_OPTIONS);
    localStorage.removeItem(TOKEN_KEY);
    return legacy;
  }
  return null;
}

export function setToken(token: string): void {
  Cookies.set(TOKEN_KEY, token, TOKEN_COOKIE_OPTIONS);
}

export function removeToken(): void {
  Cookies.remove(TOKEN_KEY, { path: '/' });
  if (typeof window !== 'undefined') localStorage.removeItem(TOKEN_KEY);
}

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  role?: string;
  emailVerified?: boolean;
}

export function getUser(): StoredUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setUser(user: StoredUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function removeUser(): void {
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function logout(): void {
  removeToken();
  removeUser();
  if (typeof window !== 'undefined') {
    window.location.href = '/auth/individual/sign-in';
  }
}

// Clean up legacy mock data
export function clearMockData(): void {
  if (typeof window === 'undefined') return;
  const mockKeys = ['mockUsers', 'mockCurrentUser', 'mockResetData', 'scannedImage', 'scannedWasteImage', 'manualWasteType', 'scanSource'];
  mockKeys.forEach((key) => {
    try { localStorage.removeItem(key); } catch { /* ignore */ }
  });
}
