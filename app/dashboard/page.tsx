"use client";

import { useEffect, useState } from "react";

import DashboardHeader from "@/components/dashboard/Header";
import WelcomeSection from "@/components/dashboard/Welcome";
import ScanCard from "@/components/dashboard/Scan";
import QuickActions from "@/components/dashboard/QuickActions";
import EarningsCard from "@/components/dashboard/EarningCards";
import EcoTipCard from "@/components/dashboard/EcoTips";
import RecentActivity from "@/components/dashboard/RecentActivity";
import BottomNav from "@/components/dashboard/BottomNav";
import NavigationSidebar from "@/components/dashboard/NavigationSidebar";

import { navItems, quickActions } from "@/lib/dashboard-data";
import {
  getDashboardData,
  markActivityAsRecycled,
} from "@/services/dashboard";
import type { ActivityItem } from "@/types/dashboard";
import { getToken, getUser } from "@/lib/auth";

type DashboardData = {
  user: {
    name: string;
  };
  stats: {
    totalEarnings: number;
    itemsScanned: number;
  };
  recentActivity: ActivityItem[];
};

export default function EcoSmartDashboardPage() {
  const [activeTab, setActiveTab] = useState<
    "home" | "scan" | "activity" | "profile"
  >("home");
  const [isNavSidebarOpen, setIsNavSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Hydration-safe: wait for client render, then read localStorage + fetch dashboard
  useEffect(() => {
    if (!hydrated) {
      setHydrated(true);
      return;
    }
    const savedToken = getToken() || "";
n    // Check mock data for demo
    const mockRaw = localStorage.getItem("mock_dashboard");
    if (mockRaw) {
      try {
        const mockParsed = JSON.parse(mockRaw);
        setDashboardData(mockParsed);
        setLoading(false);
        localStorage.removeItem("mock_dashboard");
        return;
      } catch(e) {}
    }
    if (!savedToken) {
      setLoading(false);
      return;
    }
    setToken(savedToken);

    const fetchDashboard = async (t: string) => {
      try {
        setLoading(true);
        setError("");

        const response = await getDashboardData(t);

        const storedUser = getUser();

        const formattedData: DashboardData = {
          user: {
            name: storedUser?.name || response.user.name,
          },
          stats: response.stats,
          recentActivity: response.recentActivity.map((activity) => ({
            _id: activity.id,
            title: activity.item,
            time: "Just now",
            amount: activity.amount,
            status: activity.status === "Recycled" ? "Recycled" : "Pending",
          })),
        };

        setDashboardData(formattedData);
      } catch (error: any) {
        console.error("Dashboard error:", error);
        setError(error.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard(savedToken);
  }, [hydrated]);

  const handleQuickAction = async (actionId: string) => {
    try {
      if (actionId === "scan") {
        setActiveTab("scan");
      } else if (actionId === "history") {
        setActiveTab("activity");
      }
    } catch (error) {
      console.error("Quick action error:", error);
    }
  };

  const handleMarkPendingAsRecycled = async (_id: string) => {
    try {
      const t = getToken();
      if (!t) return;
      await markActivityAsRecycled(t, _id);
      // Re-fetch dashboard data
      const savedToken = getToken() || "";
      if (!savedToken) return;
      const response = await getDashboardData(savedToken);
      const storedUser = getUser();
      setDashboardData({
        user: {
          name: storedUser?.name || response.user.name,
        },
        stats: response.stats,
        recentActivity: response.recentActivity.map((activity) => ({
          _id: activity.id,
          title: activity.item,
          time: "Just now",
          amount: activity.amount,
          status: activity.status === "Recycled" ? "Recycled" : "Pending",
        })),
      });
    } catch (error) {
      console.error("Mark recycled error:", error);
    }
  };

  // Wait for hydration to read token from localStorage
  if (!hydrated) return null;

  if (!token) {
    return (
      <main className="min-h-screen bg-[#edf3ea]">
        <div className="flex min-h-screen items-center justify-center p-10">
          <div className="text-center">
            <p className="text-lg text-slate-500">Please sign in to view your dashboard.</p>
          </div>
        </div>
      </main>
    );
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-[#edf3ea] p-10 text-center text-lg text-slate-500">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#edf3ea] p-10 text-center">
        <p className="text-lg text-red-500">Failed to load dashboard</p>
        <p className="text-sm text-slate-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-full bg-[#5d9d35] px-6 py-2 text-sm font-semibold text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#edf3ea] p-10 text-center">
        <p className="text-lg text-slate-500">No dashboard data available. Start scanning!</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#edf3ea]">
      <div className="mx-auto w-full">
        <div className="grid">
          <section className="w-full border-black/5 bg-[#f6f7f4] shadow-[0_20px_80px_rgba(0,0,0,0.16)]">
            <div className="relative flex min-h-205 flex-col overflow-hidden rounded-[28px] sm:min-h-225">
              <DashboardHeader openSidebar={() => setIsNavSidebarOpen(true)} />

              <div className="flex-1 space-y-4 px-4 pb-4 sm:space-y-5 sm:px-6 sm:pb-5 lg:px-8 lg:pb-8">
                <WelcomeSection name={dashboardData.user.name} />

                <ScanCard handleQuickAction={handleQuickAction} />

                <QuickActions
                  quickActions={quickActions}
                  handleQuickAction={handleQuickAction}
                />

                <EarningsCard
                  totalEarnings={dashboardData.stats.totalEarnings}
                  ecoPoints={dashboardData.stats.itemsScanned}
                />

                <EcoTipCard />

                <RecentActivity
                  activities={dashboardData.recentActivity}
                  setActiveTab={setActiveTab}
                  markPendingAsRecycled={handleMarkPendingAsRecycled}
                />
              </div>

              {!isNavSidebarOpen && (
                <BottomNav
                  navItems={navItems}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  openProfileSidebar={() => {}}
                />
              )}

              <NavigationSidebar
                isOpen={isNavSidebarOpen}
                onClose={() => setIsNavSidebarOpen(false)}
                onNavigate={setActiveTab}
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
