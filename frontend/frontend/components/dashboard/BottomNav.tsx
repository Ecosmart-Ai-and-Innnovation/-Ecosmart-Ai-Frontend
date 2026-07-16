"use client";

import { useRouter } from "next/navigation";
import type { NavItem } from "@/types/dashboard";

type BottomNavProps = {
  navItems: NavItem[];
  activeTab: "home" | "scan" | "activity" | "profile";
  setActiveTab: React.Dispatch<
    React.SetStateAction<"home" | "scan" | "activity" | "profile">
  >;
  openProfileSidebar: () => void;
};

export default function BottomNav({
  navItems,
  activeTab,
  setActiveTab,
  openProfileSidebar,
}: BottomNavProps) {
  const router = useRouter();

  return (
    <nav className="grid grid-cols-4 border-t border-black/5 bg-white px-3 py-3 sm:px-4 sm:py-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              if (item.id === "home") {
                setActiveTab("home");
                router.push("/dashboard");
                return;
              }

              if (item.id === "scan") {
                setActiveTab("scan");
                router.push("/dashboard/scan");
                return;
              }

              if (item.id === "activity") {
                setActiveTab("activity");
                router.push("/dashboard/activity");
                return;
              }

              if (item.id === "profile") {
                setActiveTab("profile");
                router.push("/dashboard/profile");
                return;
              }

              openProfileSidebar();
            }}
            className="flex flex-col items-center justify-center gap-2 rounded-2xl py-2 text-sm"
          >
            <Icon
              className={`h-6 w-6 ${
                isActive ? "text-[#5c9d35]" : "text-slate-400"
              }`}
            />
            <span
              className={`font-medium ${
                isActive ? "text-[#5c9d35]" : "text-slate-400"
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}