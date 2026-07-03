"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Leaf,
  User,
  Pencil,
  Award,
  TrendingUp,
  ChevronRight,
  BadgeCheck,
  Settings,
  Bell,
  CircleHelp,
  LogOut,
  Home,
  ScanLine,
  BarChart3,
  UserCircle2,
} from "lucide-react";

import BottomNav from "@/components/dashboard/BottomNav";
import { navItems } from "@/lib/dashboard-data";
import { authApi, wasteApi } from "@/lib/api";
import { getToken, removeToken, removeUser, getUser, type StoredUser } from "@/lib/auth";

type ProfileStats = {
  earnings: number;
  itemsRecycled: number;
  totalWeightKg: number;
  memberSince: string;
};

export default function ProfilePage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<
    "home" | "scan" | "activity" | "profile"
  >("profile");
  const [user, setUser] = useState<StoredUser | null>(null);
  const [stats, setStats] = useState<ProfileStats>({
    earnings: 0,
    itemsRecycled: 0,
    totalWeightKg: 0,
    memberSince: "",
  });
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const storedUser = getUser();
      setUser(storedUser);

      // Fetch real stats from backend
      const [meData, historyData] = await Promise.all([
        authApi.getMe(),
        wasteApi.getHistory().catch(() => []),
      ]);

      const totalEarnings = (historyData || []).reduce(
        (sum, scan) => sum + Math.round(((scan.estimatedValue?.min || 0) + (scan.estimatedValue?.max || 0)) / 2),
        0
      );

      setStats({
        earnings: totalEarnings,
        itemsRecycled: (historyData || []).filter((s) => s.recyclable).length,
        totalWeightKg: 0,
        memberSince: meData.createdAt
          ? new Date(meData.createdAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })
          : "",
      });
    } catch {
      // Fallback: just show user from local storage
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const initials = useMemo(() => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [user]);

  const displayName = user?.name || "User";
  const displayEmail = user?.email || "";

  const handleLogout = () => {
    removeToken();
    removeUser();
    router.push("/auth/individual/sign-in");
  };

  return (
    <main className="min-h-screen bg-[#edf3ea]">
      <div className="mx-auto">
        <div className="flex justify-center">
          <section className="w-full overflow-hidden border-black/5 bg-[#f6f7f4] shadow-[0_20px_80px_rgba(0,0,0,0.16)]">
            <div className="flex min-h-screen flex-col rounded-[28px]">
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
                    Profile
                  </h1>
                  <p className="mt-2 text-base text-slate-500 sm:text-lg">
                    Manage your account settings
                  </p>
                </div>

                {loading ? (
                  <div className="mt-8 text-center text-slate-500">Loading profile...</div>
                ) : (
                  <>
                    <section className="mt-8 overflow-hidden rounded-[30px] bg-linear-to-r from-[#5d9d35] to-[#24713d] px-6 py-6 text-white shadow-[0_18px_45px_rgba(90,140,90,0.18)]">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-4">
                          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-white/35 bg-white/10 text-2xl font-semibold">
                            {initials}
                          </div>

                          <div className="min-w-0">
                            <h2 className="truncate text-[1.6rem] font-semibold sm:text-[1.9rem]">
                              {displayName}
                            </h2>
                            <p className="mt-1 truncate text-base text-white/85 sm:text-lg">
                              {displayEmail}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white"
                        >
                          <Pencil className="h-6 w-6" />
                        </button>
                      </div>

                      <div className="mt-8 grid grid-cols-3 divide-x divide-white/15">
                        <div className="pr-3 text-center">
                          <div className="text-[2rem] font-bold sm:text-[2.2rem]">
                            ₦{stats.earnings.toLocaleString()}
                          </div>
                          <div className="text-sm text-white/80 sm:text-base">
                            Earnings
                          </div>
                        </div>

                        <div className="px-3 text-center">
                          <div className="text-[2rem] font-bold sm:text-[2.2rem]">
                            {stats.itemsRecycled}
                          </div>
                          <div className="text-sm text-white/80 sm:text-base">
                            Items Recycled
                          </div>
                        </div>

                        <div className="pl-3 text-center">
                          <div className="text-[2rem] font-bold sm:text-[2.2rem]">
                            {stats.totalWeightKg}kg
                          </div>
                          <div className="text-sm text-white/80 sm:text-base">
                            Total Weight
                          </div>
                        </div>
                      </div>
                    </section>

                    <section className="mt-8">
                      <h3 className="mb-4 text-base font-semibold uppercase tracking-wide text-slate-500">
                        Account
                      </h3>

                      <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
                        <ProfileRow
                          icon={<Pencil className="h-5 w-5" />}
                          label="Edit Profile"
                        />
                        <ProfileRow
                          icon={<Award className="h-5 w-5" />}
                          label="Achievements"
                        />
                        <ProfileRow
                          icon={<TrendingUp className="h-5 w-5" />}
                          label="Earnings History"
                        />
                      </div>
                    </section>

                    <section className="mt-8">
                      <div className="mb-4 flex items-center justify-between gap-4">
                        <div>
                          <h3 className="text-[1.6rem] font-semibold text-[#246c3b]">
                            Your Impact
                          </h3>
                          <p className="mt-1 text-base text-slate-700">
                            Keep up the great work!
                          </p>
                        </div>

                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#5d9d35] text-white">
                          <BadgeCheck className="h-7 w-7" />
                        </div>
                      </div>

                      <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
                        <ProfileRow
                          icon={<Settings className="h-5 w-5" />}
                          label="Settings"
                        />
                        <ProfileRow
                          icon={<Bell className="h-5 w-5" />}
                          label="Notifications"
                          badge="3"
                        />
                        <ProfileRow
                          icon={<CircleHelp className="h-5 w-5" />}
                          label="Help & Support"
                        />
                      </div>
                    </section>

                    <section className="mt-8">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center justify-center gap-3 rounded-[22px] bg-white px-6 py-5 text-center text-[1.3rem] font-semibold text-red-500 shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition hover:bg-red-50"
                      >
                        <LogOut className="h-6 w-6" />
                        Log Out
                      </button>

                      {stats.memberSince && (
                        <p className="mt-8 text-center text-base text-slate-400">
                          Member since {stats.memberSince}
                        </p>
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

function ProfileRow({
  icon,
  label,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  badge?: string;
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-between gap-4 border-b border-slate-100 px-5 py-5 text-left last:border-b-0"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf5ee] text-[#2f7d32]">
          {icon}
        </div>
        <span className="text-[1.2rem] font-medium text-slate-800">
          {label}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {badge ? (
          <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-red-500 px-2 text-sm font-semibold text-white">
            {badge}
          </span>
        ) : null}
        <ChevronRight className="h-5 w-5 text-slate-400" />
      </div>
    </button>
  );
}
