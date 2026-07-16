// ── Waste Types ──
export type WasteCategory =
  | 'plastic'
  | 'paper'
  | 'metal'
  | 'ewaste'
  | 'organic'
  | 'glass'
  | 'rubber'
  | 'unknown';

export interface WasteScanInput {
  text?: string;
  imageBase64?: string;
}

export interface WasteClassificationResult {
  category: WasteCategory;
  confidence: number;
  wasteTitle: string;
  disposalGuidance: string;
  earningsEstimate: { min: number; max: number; unit: string };
  climateImpact: string;
  climateScore: number;
  recyclers: Recycler[];
}

// ── Recycler Types ──
export interface Recycler {
  id: string;
  name: string;
  location: string;
  wasteTypes: WasteCategory[];
  contact: string;
  verified: boolean;
}

// ── User Types ──
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalEarnings: number;
  scansCount: number;
  createdAt: string;
}

// ── API Response wrapper ──
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
