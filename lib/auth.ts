const TOKEN_KEY = 'ecosmart_token';
const USER_KEY = 'ecosmart_user';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export interface StoredUser {
  id: string;
  name: string;
  email: string;
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
