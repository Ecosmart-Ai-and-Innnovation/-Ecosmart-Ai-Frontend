import { getToken } from './auth';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: { ...headers, ...options?.headers },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }

  return data.data ?? data;
}

// ── Types ──
export interface WasteScanResult {
  _id: string;
  wasteType: string;
  category: string;
  recyclable: boolean;
  confidence: number;
  estimatedValue: { min: number; max: number; currency: string };
  disposalGuidance: string;
  ecoTip: string;
  createdAt: string;
  imageBase64?: string;
}

export interface RecyclerData {
  _id: string;
  name: string;
  distance: string;
  wasteTypes: string[];
  price: string;
  phone: string;
  chatNumber: string;
  rating: string;
  verified: boolean;
  state: string;
  address: string;
  mapQuery: string;
  hours: string;
}

export interface DashboardData {
  user: { name: string };
  stats: { totalEarnings: number; itemsScanned: number };
  recentActivity: Array<{ id: string; item: string; amount: number; status: string }>;
}

// ── Auth API ──
export const authApi = {
  login: (email: string, password: string) =>
    request<{ token: string; user: { id: string; name: string; email: string } }>(
      '/auth/login',
      { method: 'POST', body: JSON.stringify({ email, password }) }
    ),

  register: (name: string, email: string, password: string) =>
    request<{ token: string; user: { id: string; name: string; email: string } }>(
      '/auth/register',
      { method: 'POST', body: JSON.stringify({ name, email, password }) }
    ),

  getMe: () =>
    request<{ id: string; name: string; email: string; createdAt: string }>('/auth/me'),

  forgotPassword: (email: string) =>
    request<{ resetToken: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, password: string) =>
    request<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),
};

// ── OTP API ──
export const otpApi = {
  send: (method: 'email' | 'phone', identifier: string) =>
    request<{ masked: string; devOtp?: string }>('/otp/send', {
      method: 'POST',
      body: JSON.stringify({ method, identifier }),
    }),

  verify: (method: 'email' | 'phone', identifier: string, otp: string) =>
    request<{ verified: boolean; resetToken?: string | null }>('/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ method, identifier, otp }),
    }),
};

// ── Waste API ──
export const wasteApi = {
  scan: (body: { text?: string; imageBase64?: string }) =>
    request<WasteScanResult>('/waste/scan', { method: 'POST', body: JSON.stringify(body) }),

  getHistory: () =>
    request<WasteScanResult[]>('/waste/history'),

  getScan: (id: string) =>
    request<WasteScanResult>(`/waste/history/${id}`),
};

// ── Recycler API ──
export const recyclerApi = {
  getAll: (state?: string) =>
    request<RecyclerData[]>(`/recyclers${state ? `?state=${encodeURIComponent(state)}` : ''}`),

  getById: (id: string) =>
    request<RecyclerData>(`/recyclers/${id}`),
};

// ── Dashboard API ──
export const dashboardApi = {
  get: () =>
    request<DashboardData>('/dashboard'),
};
