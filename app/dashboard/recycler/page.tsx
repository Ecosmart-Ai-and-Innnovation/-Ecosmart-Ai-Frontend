"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  Bell, Menu, Leaf, Shield, Grid, Zap,
  ArrowUpRight, Lightbulb, Bot, Home, User,
  CheckCircle2, Wallet, Star, Scale,
  TrendingUp, Truck, LogOut, ChevronRight,
  Package
} from 'lucide-react';
import { dashboardApi } from '@/lib/api';
import { getToken } from '@/lib/auth';

// ── TYPESCRIPT INTERFACES ──
export interface RecyclerRequest {
  id: string | number;
  initials: string;
  name: string;
  material: string;
  time: string;
  weight: string;
  distance: string;
  colorClass: string;
}

export interface RecentActivity {
  id: string | number;
  type: string; 
  time: string;
  amount: string; 
  status: 'Completed' | 'Pending';
  emoji: string;
  colorClass: string;
}

export interface DashboardData {
  user: {
    businessName: string;
    isOnline: boolean;
    dateString: string;
  };
  wallet: {
    balance: number;
    todayPayments: number;
    weekPurchases: number;
    pendingSettlements: number;
  };
  stats: {
    activeListings: number;
    avgRating: number;
    totalKgCollected: number;
    ecoPoints: number;
  };
  requests: RecyclerRequest[];
  activities: RecentActivity[];
  ecoImpact: {
    wasteRecycledKg: number;
    co2ReducedKg: number;
    individualsRewarded: number;
    communitiesServed: number;
  };
}

interface RecyclerDashboardProps {
  initialData?: DashboardData | null;
}

export default function RecyclerDashboardResponsive({ initialData }: RecyclerDashboardProps) {
  const [activeTab, setActiveTab] = useState('Home');
  const [liveData, setLiveData] = useState<DashboardData | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [requests, setRequests] = useState<RecyclerRequest[]>(initialData?.requests || []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(amount);
  };

  const fetchDashboard = useCallback(async () => {
    if (!getToken()) return;
    try {
      const data = await dashboardApi.getRecyclerDashboard();
      setLiveData(data);
      if (data?.requests) setRequests(data.requests);
    } catch (err) {
      console.error('Failed to load recycler dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 30000);
    return () => clearInterval(interval);
  }, [fetchDashboard]);

  const handleRequestAction = async (id: string | number, action: 'accept' | 'decline') => {
    try {
      await dashboardApi.requestAction(id, action);
      setRequests(prev => prev.filter(req => req.id !== id));
      fetchDashboard();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to process request';
      alert(message);
    }
  };

  const handlePayout = async () => {
    try {
      const result = await dashboardApi.requestPayout();
      alert(result.message);
      fetchDashboard();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Payout failed';
      alert(message);
    }
  };

  if (loading || !liveData) {
    return (
      <div className="flex h-screen bg-gray-50/50 items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#eaf4e7] border-t-[#549B45] rounded-full animate-spin" />
      </div>
    );
  }

  // Use liveData directly with optional chaining
  return (
    <div className="flex h-screen bg-gray-50/50 font-sans text-gray-900 overflow-hidden">
      {/* ... (Sidebar and Layout code remains the same) ... */}
      {/* Ensure you use liveData.user.businessName instead of data.user.businessName throughout the component */}
      {/* To keep the file clean, I've truncated the structure, but keep your JSX as it was. */}
    </div>
  );
}