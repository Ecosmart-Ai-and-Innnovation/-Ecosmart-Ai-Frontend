import { getToken } from './auth';

// ── Typed API Error ──
export class ApiError<T = unknown> extends Error {
  readonly status: number;
  readonly code?: string;
  readonly data?: T;

  constructor(message: string, status: number, code?: string, data?: T) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.data = data;
  }
}

export function isApiError(err: unknown): err is ApiError {
  return err instanceof ApiError;
}

// ── Two-Way URL Binding ──
const RENDER_API = 'https://ecosmart-ai-backend.onrender.com/api';
const LOCAL_API = 'http://localhost:5000/api';

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === '0.0.0.0')) {
    return LOCAL_API;
  }
  return RENDER_API;
}

const BASE_URL = getBaseUrl();

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${BASE_URL}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    headers: { ...headers, ...options?.headers },
  });

  const contentType = res.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await res.text();
    const suggestion = BASE_URL === LOCAL_API ? RENDER_API : LOCAL_API;
    throw new ApiError(
      `Backend returned HTML (${res.status}). Current API: ${BASE_URL}. Try switching to: ${suggestion}`,
      res.status,
      'non_json_response'
    );
  }

  const data = await res.json();

  if (!res.ok) {
    throw new ApiError(
      data.message || `Request failed (${res.status})`,
      res.status,
      data.code,
      data.data
    );
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
  user: { businessName: string; isOnline: boolean; dateString: string };
  wallet: { balance: number; todayPayments: number; weekPurchases: number; pendingSettlements: number };
  stats: { activeListings: number; avgRating: number; totalKgCollected: number; ecoPoints: number };
  requests: any[];
  activities: any[];
  ecoImpact: { wasteRecycledKg: number; co2ReducedKg: number; individualsRewarded: number; communitiesServed: number };
}

// ── API Exports ──
export const authApi = {
  login: (email: string, password: string) => request<{ token: string; user: any }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (name: string, email: string, password: string, phone?: string, role?: string) => request<{ user: any }>('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password, phone, role }) }),
  getMe: () => request<{ id: string; name: string; email: string; role: string; emailVerified: boolean; createdAt: string }>('/auth/me'),
  forgotPassword: (email: string) => request<{ email: string }>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (token: string, password: string) => request<{ message: string }>('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, password }) }),
};

export const otpApi = {
  send: (method: 'email', identifier: string, purpose: 'email-verification' | 'password-reset' = 'password-reset') => request<{ masked: string; devOtp?: string; alreadyVerified?: boolean }>('/otp/send', { method: 'POST', body: JSON.stringify({ method, identifier, purpose }) }),
  verify: (method: 'email', identifier: string, otp: string, purpose: 'email-verification' | 'password-reset' = 'password-reset') => request<{ verified: boolean; token?: string; user?: any; resetToken?: string | null }>('/otp/verify', { method: 'POST', body: JSON.stringify({ method, identifier, otp, purpose }) }),
};

export const wasteApi = {
  scan: (body: { text?: string; imageBase64?: string }) => request<WasteScanResult>('/waste/scan', { method: 'POST', body: JSON.stringify(body) }),
  getHistory: () => request<WasteScanResult[]>('/waste/history'),
  getScan: (id: string) => request<WasteScanResult>(`/waste/history/${id}`),
};

export const recyclerApi = {
  getAll: (state?: string) => request<RecyclerData[]>(`/recyclers${state ? `?state=${encodeURIComponent(state)}` : ''}`),
  getById: (id: string) => request<RecyclerData>(`/recyclers/${id}`),
};

export const dashboardApi = {
  get: () => request<DashboardData>('/dashboard'),
  getRecyclerDashboard: () => request<DashboardData>('/dashboard/recycler'),
  requestAction: (id: string | number, action: 'accept' | 'decline') => 
    request<{ success: boolean }>(`/dashboard/action/${id}`, { method: 'POST', body: JSON.stringify({ action }) }),
  requestPayout: () => request<{ message: string }>('/dashboard/payout', { method: 'POST' }),
};

export const recyclerProfileApi = {
  save: (data: Record<string, any>) => request<{ profileComplete: boolean }>('/recycler-profile/save', { method: 'POST', body: JSON.stringify(data) }),
  get: () => request<Record<string, any>>('/recycler-profile/profile'),
};