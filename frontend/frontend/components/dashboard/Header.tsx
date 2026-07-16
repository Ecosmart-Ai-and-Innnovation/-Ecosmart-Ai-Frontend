"use client";

import { Menu } from "lucide-react";

type HeaderProps = {
  openSidebar: () => void;
};

export default function Header({ openSidebar }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 pb-4 pt-5 sm:px-6 sm:pt-6">
      
      {/* LOGO */}
      <div className="flex items-center gap-2">
                  <img
                    src="/images/logo.png"
                      alt="EcoSmart AI Logo"
                      className="h-10 w-auto object-contain"
                  />
                </div>

      {/* MENU BUTTON → NOW OPENS SIDEBAR */}
      <button
        onClick={openSidebar}
        className="rounded-xl p-2 text-slate-700 transition hover:bg-white"
        aria-label="Open navigation"
      >
        <Menu className="h-6 w-6" />
      </button>
    </header>
  );
}