import { getToken } from './auth';

// ── Two-Way URL Binding ──
// Locally: uses NEXT_PUBLIC_API_URL from .env.local (http://localhost:5000/api)
// Production: falls back to Render URL automatically
// Also tries to detect localhost from browser URL for seamless switching
const RENDER_API = 'https://ecosmart-ai-backend.onrender.com/api';
const LOCAL_API = 'http://localhost:5000/api';

function getBaseUrl(): string {
  // 1. If env var is explicitly set, use it (takes priority)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // 2. Auto-detect: if running in browser on localhost, use local API
  if (typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === '0.0.0.0')) {
    return LOCAL_API;
  }

  // 3. Default to Render (production / deployed)
  return RENDER_API;
}

const BASE_URL = getBaseUrl();

console.log(`[API] Connecting to: ${BASE_URL}`);

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

  // Handle non-JSON responses (like HTML errors from Render/Vercel)
  const contentType = res.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await res.text();
    console.error(`[API Error] Non-JSON response (${res.status}) from ${url}:`, text.slice(0, 200));

    // Suggest the correct URL to use
    const suggestion = BASE_URL === LOCAL_API ? RENDER_API : LOCAL_API;
    throw new Error(
      `Backend returned HTML (${res.status}). ` +
      `Current API: ${BASE_URL}. ` +
      `Try switching to: ${suggestion}`
    );
  }

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

// ═══════════════════════════════════════════════════
//  AUTH API — Sign up, login, password reset
// ═══════════════════════════════════════════════════
export const authApi = {
  /** POST /api/auth/login — Sign in with email/phone + password */
  login: (email: string, password: string) =>
    request<{ token: string; user: { id: string; name: string; email: string } }>(
      '/auth/login',
      { method: 'POST', body: JSON.stringify({ email, password }) }
    ),

  /** POST /api/auth/register — Create a new account */
  register: (name: string, email: string, password: string, phone?: string) =>
    request<{ token: string; user: { id: string; name: string; email: string } }>(
      '/auth/register',
      { method: 'POST', body: JSON.stringify({ name, email, password, phone }) }
    ),

  /** GET /api/auth/me — Get current logged-in user profile */
  getMe: () =>
    request<{ id: string; name: string; email: string; createdAt: string }>('/auth/me'),

  /** POST /api/auth/forgot-password — Request password reset email */
  forgotPassword: (email: string) =>
    request<{ resetToken: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  /** POST /api/auth/reset-password — Reset password with token */
  resetPassword: (token: string, password: string) =>
    request<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),
};

// ═══════════════════════════════════════════════════
//  OTP API — Email/Phone OTP verification
// ═══════════════════════════════════════════════════
export const otpApi = {
  /** POST /api/otp/send — Send OTP to email or phone */
  send: (method: 'email' | 'phone', identifier: string) =>
    request<{ masked: string; devOtp?: string }>('/otp/send', {
      method: 'POST',
      body: JSON.stringify({ method, identifier }),
    }),

  /** POST /api/otp/verify — Verify OTP code */
  verify: (method: 'email' | 'phone', identifier: string, otp: string) =>
    request<{ verified: boolean; resetToken?: string | null }>('/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ method, identifier, otp }),
    }),
};

// ═══════════════════════════════════════════════════
//  WASTE API — Scan, history, results
// ═══════════════════════════════════════════════════
export const wasteApi = {
  /** POST /api/waste/scan — AI-powered waste classification */
  scan: (body: { text?: string; imageBase64?: string }) =>
    request<WasteScanResult>('/waste/scan', { method: 'POST', body: JSON.stringify(body) }),

  /** GET /api/waste/history — Get all past scans */
  getHistory: () =>
    request<WasteScanResult[]>('/waste/history'),

  /** GET /api/waste/history/:id — Get single scan by ID */
  getScan: (id: string) =>
    request<WasteScanResult>(`/waste/history/${id}`),
};

// ═══════════════════════════════════════════════════
//  RECYCLER API — Browse and find recyclers
// ═══════════════════════════════════════════════════
export const recyclerApi = {
  /** GET /api/recyclers — List all recyclers (optional ?state= filter) */
  getAll: (state?: string) =>
    request<RecyclerData[]>(`/recyclers${state ? `?state=${encodeURIComponent(state)}` : ''}`),

  /** GET /api/recyclers/:id — Get single recycler details */
  getById: (id: string) =>
    request<RecyclerData>(`/recyclers/${id}`),
};

// ═══════════════════════════════════════════════════
//  DASHBOARD API — User stats and activity
// ═══════════════════════════════════════════════════
export const dashboardApi = {
  /** GET /api/dashboard — Get user dashboard data (name, earnings, activity) */
  get: () =>
    request<DashboardData>('/dashboard'),
};

// ═══════════════════════════════════════════════════
//  RECYCLER PROFILE API — Build profile wizard
// ═══════════════════════════════════════════════════
export const recyclerProfileApi = {
  /** POST /api/recycler-profile/save — Save full recycler profile */
  save: (data: Record<string, any>) =>
    request<{ profileComplete: boolean }>('/recycler-profile/save', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /** GET /api/recycler-profile/profile — Get saved recycler profile */
  get: () =>
    request<Record<string, any>>('/recycler-profile/profile'),
};
