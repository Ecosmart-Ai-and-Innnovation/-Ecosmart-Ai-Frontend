"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Leaf,
  TrendingUp,
  Package,
  Recycle,
  CalendarDays,
  Filter,
  Clock3,
} from "lucide-react";

import BottomNav from "@/components/dashboard/BottomNav";
import { navItems } from "@/lib/dashboard-data";
import { wasteApi } from "@/lib/api";
import { getToken } from "@/lib/auth";
import type { WasteScanResult } from "@/lib/api";

type ActivityStatus = "Recycled" | "Pending";

type ActivityRecord = {
  id: string;
  title: string;
  dateLabel: string;
  relativeTime: string;
  amount: number;
  weightKg: number;
  status: ActivityStatus;
};

function getDateLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString();
}

function scanToActivity(scan: WasteScanResult): ActivityRecord {
  return {
    id: scan._id,
    title: scan.wasteType,
    dateLabel: getDateLabel(scan.createdAt),
    relativeTime: getRelativeTime(scan.createdAt),
    amount: Math.round(((scan.estimatedValue?.min || 0) + (scan.estimatedValue?.max || 0)) / 2),
    weightKg: 0, // Backend doesn't track weight yet
    status: scan.recyclable ? "Recycled" : "Pending",
  };
}

type FilterType = "All" | "Recycled" | "Pending";

export default function ActivityPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [activeTab, setActiveTab] = useState<
    "home" | "scan" | "activity" | "profile"
  >("activity");

  const [scans, setScans] = useState<WasteScanResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  if (typeof window === "undefined") return null;

  useEffect(() => {
    if (!getToken()) return;
    setLoading(true);
    wasteApi
      .getHistory()
      .then((data) => setScans(data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const activities: ActivityRecord[] = useMemo(
    () => scans.map(scanToActivity),
    [scans]
  );

  const filteredActivities = useMemo(() => {
    if (activeFilter === "All") return activities;
    return activities.filter((item) => item.status === activeFilter);
  }, [activities, activeFilter]);

  const totalEarned = activities.reduce((sum, item) => sum + item.amount, 0);
  const totalKg = activities.reduce((sum, item) => sum + item.weightKg, 0);
  const recycledCount = activities.filter(
    (item) => item.status === "Recycled"
  ).length;
  const thisWeekCount = activities.length;

  return (
    <main className="min-h-screen bg-[#edf3ea]">
      <div className="mx-auto">
        <div className="flex justify-center">
          <section className="w-full border-black/5 bg-[#f6f7f4] shadow-[0_20px_80px_rgba(0,0,0,0.16)]">
            <div className="flex min-h-215 flex-col rounded-[28px]">
              <header className="flex items-center justify-between bg-[#f3f4f6] px-5 pb-4 pt-5 sm:px-8 sm:pb-5 sm:pt-7 lg:px-10 lg:pt-8">
                <div className="flex items-center gap-2 font-semibold text-[#2f7d32]">
                  <div className="flex items-center gap-2">
                    <img
                      src="/images/logo.png"
                      alt="EcoSmart AI Logo"
                      className="h-10 w-auto object-contain"
                    />
                  </div>
                </div>
              </header>

              <div className="flex-1 px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
                <div>
                  <h1 className="text-[2rem] font-bold text-[#246c3b] sm:text-[2.3rem] lg:text-[2.7rem]">
                    Activity
                  </h1>
                  <p className="mt-2 text-base text-slate-500 sm:text-lg">
                    Track your recycling journey
                  </p>
                </div>

                <section className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                  <StatCard
                    icon={<TrendingUp className="h-5 w-5" />}
                    iconWrapClass="bg-[#ddebd6] text-[#5b9938]"
                    value={`₦${totalEarned.toLocaleString()}`}
                    label="Total Earned"
                  />
                  <StatCard
                    icon={<Package className="h-5 w-5" />}
                    iconWrapClass="bg-[#f8ebc7] text-[#d9a11b]"
                    value={`${totalKg}kg`}
                    label="Total kg"
                  />
                  <StatCard
                    icon={<Recycle className="h-5 w-5" />}
                    iconWrapClass="bg-[#dff4e6] text-[#22b455]"
                    value={`${recycledCount}`}
                    label="Items Recycled"
                  />
                  <StatCard
                    icon={<CalendarDays className="h-5 w-5" />}
                    iconWrapClass="bg-[#dfe9d9] text-[#2f7d32]"
                    value={`${thisWeekCount}`}
                    label="This Week"
                  />
                </section>

                {/* Loading / Error / Empty states */}
                {loading && (
                  <div className="mt-8 text-center text-slate-500">Loading activities...</div>
                )}
                {error && (
                  <div className="mt-8 rounded-2xl bg-red-50 p-4 text-center text-sm text-red-600">
                    {error}
                  </div>
                )}

                {!loading && !error && (
                  <>
                    <section className="mt-8">
                      <div className="flex gap-3 overflow-x-auto">
                        {(["All", "Recycled", "Pending"] as FilterType[]).map(
                          (filter) => (
                            <button
                              key={filter}
                              type="button"
                              onClick={() => setActiveFilter(filter)}
                              className={`whitespace-nowrap rounded-full px-5 py-3 text-sm font-medium transition sm:text-base ${
                                activeFilter === filter
                                  ? "bg-[#5d9d35] text-white shadow-[0_10px_20px_rgba(93,157,53,0.22)]"
                                  : "bg-white text-slate-600 hover:bg-[#eef7ea]"
                              }`}
                            >
                              {filter}
                            </button>
                          )
                        )}
                      </div>
                    </section>

                    <section className="mt-8">
                      <div className="mb-5 flex items-center justify-between gap-4">
                        <h2 className="text-[1.35rem] font-semibold text-[#246c3b] sm:text-[1.55rem]">
                          History ({filteredActivities.length})
                        </h2>
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 text-slate-600"
                        >
                          <Filter className="h-5 w-5" />
                          <span className="text-sm font-medium sm:text-base">
                            Filter
                          </span>
                        </button>
                      </div>

                      {filteredActivities.length === 0 ? (
                        <div className="rounded-3xl bg-white px-5 py-10 text-center text-slate-400 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                          <Recycle className="mx-auto mb-3 h-10 w-10 text-slate-300" />
                          <p className="text-lg font-medium">No activity yet</p>
                          <p className="mt-1 text-sm">Start scanning waste to build your history.</p>
                          <Link
                            href="/dashboard/scan"
                            className="mt-4 inline-block rounded-full bg-[#5d9d35] px-6 py-2 text-sm font-semibold text-white"
                          >
                            Scan Now
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {filteredActivities.map((item) => {
                            const isRecycled = item.status === "Recycled";

                            return (
                              <article
                                key={item.id}
                                className="rounded-3xl bg-white px-5 py-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex min-w-0 items-start gap-4">
                                    <div
                                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
                                        isRecycled
                                          ? "bg-[#e5f4e8] text-[#22b455]"
                                          : "bg-[#eef0f3] text-slate-500"
                                      }`}
                                    >
                                      {isRecycled ? (
                                        <Leaf className="h-7 w-7" />
                                      ) : (
                                        <Clock3 className="h-7 w-7" />
                                      )}
                                    </div>

                                    <div className="min-w-0">
                                      <h3 className="truncate text-xl font-semibold text-slate-900">
                                        {item.title}
                                      </h3>
                                      <p className="mt-1 text-base text-slate-500">
                                        {item.dateLabel}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="text-right">
                                    <p className="text-[1.8rem] font-bold text-[#24713d]">
                                      ₦{item.amount}
                                    </p>
                                    <span
                                      className={`mt-2 inline-flex rounded-full px-4 py-1 text-sm font-medium ${
                                        isRecycled
                                          ? "bg-[#e5f4e8] text-[#22b455]"
                                          : "bg-[#f1f2f5] text-slate-500"
                                      }`}
                                    >
                                      {item.status}
                                    </span>
                                  </div>
                                </div>

                                <div className="mt-4 border-t border-slate-200 pt-4">
                                  <div className="flex items-center justify-between text-sm text-slate-500 sm:text-base">
                                    <span>{item.relativeTime}</span>
                                    <span>{item.weightKg.toFixed(1)} kg</span>
                                  </div>
                                </div>
                              </article>
                            );
                          })}
                        </div>
                      )}
                    </section>
                  </>
                )}
              </div>

              <BottomNav
                navItems={navItems}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                openProfileSidebar={() => {}}
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  value,
  label,
  iconWrapClass,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  iconWrapClass: string;
}) {
  return (
    <div className="rounded-3xl bg-white px-5 py-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
      <div
        className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${iconWrapClass}`}
      >
        {icon}
      </div>
      <div className="text-[1.9rem] font-bold text-[#246c3b]">{value}</div>
      <div className="mt-1 text-base text-slate-500">{label}</div>
    </div>
  );
}
