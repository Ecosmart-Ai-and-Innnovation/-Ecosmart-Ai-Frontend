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
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!hydrated) {
      setHydrated(true);
      return;
    }

    const storedUser = getUser();
    const savedToken = getToken() || "";

    // Show user name immediately from localStorage
    if (storedUser?.name) {
      setDashboardData({
        user: { name: storedUser.name },
        stats: { totalEarnings: 0, itemsScanned: 0 },
        recentActivity: [],
      });
    }

    if (!savedToken) return;

    // Fetch real data from API
    const fetchDashboard = async (t: string) => {
      try {
        const response = await getDashboardData(t);

        const formattedData: DashboardData = {
          user: {
            name: storedUser?.name || response.user.businessName,
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
        // Keep showing user name from localStorage even if API fails
      }
    };

    fetchDashboard(savedToken);
  }, [hydrated]);

  const handleQuickAction = async (actionId: string) => {
    try {
      if (actionId === "scan") setActiveTab("scan");
      else if (actionId === "history") setActiveTab("activity");
    } catch (error) {
      console.error("Quick action error:", error);
    }
  };

  const handleMarkPendingAsRecycled = async (_id: string) => {
    try {
      const t = getToken();
      if (!t) return;
      await markActivityAsRecycled(t, _id);
      const savedToken = getToken() || "";
      if (!savedToken) return;
      const response = await getDashboardData(savedToken);
      const storedUser = getUser();
      setDashboardData({
        user: { name: storedUser?.name || response.user.businessName },
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

  if (!hydrated) return null;

  const displayData = dashboardData || {
    user: { name: getUser()?.name || "User" },
    stats: { totalEarnings: 0, itemsScanned: 0 },
    recentActivity: [],
  };

  return (
    <main className="min-h-screen bg-[#edf3ea]">
      <div className="mx-auto w-full">
        <div className="grid">
          <section className="w-full border-black/5 bg-[#f6f7f4] shadow-[0_20px_80px_rgba(0,0,0,0.16)]">
            <div className="relative flex min-h-205 flex-col overflow-hidden rounded-[28px] sm:min-h-225">
              <DashboardHeader openSidebar={() => setIsNavSidebarOpen(true)} />

              <div className="flex-1 space-y-4 px-4 pb-4 sm:space-y-5 sm:px-6 sm:pb-5 lg:px-8 lg:pb-8">
                <WelcomeSection name={displayData.user.name} />
                <ScanCard handleQuickAction={handleQuickAction} />
                <QuickActions quickActions={quickActions} handleQuickAction={handleQuickAction} />
                <EarningsCard totalEarnings={displayData.stats.totalEarnings} ecoPoints={displayData.stats.itemsScanned} />
                <EcoTipCard />
                <RecentActivity activities={displayData.recentActivity} setActiveTab={setActiveTab} markPendingAsRecycled={handleMarkPendingAsRecycled} />
              </div>

              {!isNavSidebarOpen && (
                <BottomNav navItems={navItems} activeTab={activeTab} setActiveTab={setActiveTab} openProfileSidebar={() => {}} />
              )}

              <NavigationSidebar isOpen={isNavSidebarOpen} onClose={() => setIsNavSidebarOpen(false)} onNavigate={setActiveTab} />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
