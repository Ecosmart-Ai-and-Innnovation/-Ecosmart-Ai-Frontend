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
  const [error, setError] = useState("");

  useEffect(() => {
    const savedToken = getToken() || "";
    if (!savedToken) return;

    const fetchDashboard = async () => {
      try {
        setError("");

        const response = await getDashboardData(savedToken);

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
      }
    };

    fetchDashboard();
  }, []);

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

  const displayData = dashboardData || { user: { name: getUser()?.name || "User" }, stats: { totalEarnings: 0, itemsScanned: 0 }, recentActivity: [] };

  return (
    <main className="min-h-screen bg-[#edf3ea]">
      <div className="mx-auto w-full">
        <div className="grid">
          <section className="w-full border-black/5 bg-[#f6f7f4] shadow-[0_20px_80px_rgba(0,0,0,0.16)]">
            <div className="relative flex min-h-205 flex-col overflow-hidden rounded-[28px] sm:min-h-225">
              <DashboardHeader openSidebar={() => setIsNavSidebarOpen(true)} />

              <button
                type="button"
                onClick={() => setIsNavSidebarOpen(true)}
                className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-black/5 sm:hidden"
                aria-label="Open navigation"
              >
                <svg className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
              </button>

              <div className="flex-1 overflow-y-auto px-5 pb-6 pt-6 sm:px-6 sm:pt-8 lg:px-8">
                <div className="space-y-6">
                  <WelcomeSection
                    name={displayData.user.name}
                  />

                  <div className="grid gap-6 lg:grid-cols-2">
                    <EarningsCard
                      totalEarnings={displayData.stats.totalEarnings}
                      ecoPoints={displayData.stats.itemsScanned}
                    />
                    <EcoTipCard />
                  </div>

                  <RecentActivity activities={displayData.recentActivity} />
                </div>
              </div>

              <BottomNav
                activeTab={activeTab}
                onTabChange={(tab) => setActiveTab(tab)}
              />
            </div>
          </section>
        </div>
      </div>

      <NavigationSidebar
        navItems={navItems}
        quickActions={quickActions}
        activeTab={activeTab}
        isOpen={isNavSidebarOpen}
        onClose={() => setIsNavSidebarOpen(false)}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setIsNavSidebarOpen(false);
        }}
        onQuickAction={handleQuickAction}
      />
    </main>
  );
}
