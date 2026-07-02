"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Menu,
  ArrowLeft,
  Search,
  ChevronDown,
  Home,
  ScanLine,
  BarChart3,
  UserCircle2,
} from "lucide-react";

const wasteOptions = [
  "Plastic Bottle",
  "Plastic Bag",
  "Plastic Container",
  "Aluminium Can",
  "Metal Scrap",
  "Glass Bottle",
  "Paper",
  "Cardboard",
  "Cables",
  "Battery",
];

type typeprops = {
  openSidebar: () => void;
};

export default function ManualTypePage({ openSidebar }: typeprops) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredOptions = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return wasteOptions;
    return wasteOptions.filter((item) =>
      item.toLowerCase().includes(value)
    );
  }, [query]);

  const handleSelectOption = (value: string) => {
    setSelectedOption(value);
    setQuery(value);
    setIsDropdownOpen(false);
  };

  const handleContinue = () => {
    if (!query.trim()) return;

    localStorage.setItem("manualWasteType", query.trim());
    localStorage.setItem("scanSource", "manual");
    router.push("/dashboard/scan/analyze");
  };

  return (
    <main className="min-h-screen bg-[#edf3ea]">
      <div className="mx-auto">
        <div className="flex justify-center">
          <section className="mx-auto w-full border-black/5 bg-[#f6f7f4] shadow-[0_20px_80px_rgba(0,0,0,0.16)]">
            <div className="flex min-h-205 flex-col overflow-hidden rounded-[28px]">
              <header className="flex items-center justify-between bg-[#f3f4f6] px-5 pb-4 pt-5 sm:px-8 sm:pb-5 sm:pt-7 lg:px-10 lg:pt-8">
                <div className="flex items-center gap-2">
                  <img
                    src="/images/logo.png"
                      alt="EcoSmart AI Logo"
                      className="h-10 w-auto object-contain"
                  />
                </div>

                <button
                  onClick={openSidebar}
                  className="rounded-xl p-2 text-slate-700 transition hover:bg-white"
                  aria-label="Open navigation"
                  >
                  <Menu className="h-6 w-6" />
                </button>
              </header>

              <div className="flex-1 px-5 py-6 sm:px-6">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 text-base text-slate-600"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Back
                </Link>

                <div className="mt-8">
                  <h1 className="text-[2rem] font-bold text-slate-900">
                    Type Your Waste
                  </h1>
                  <p className="mt-2 text-lg text-slate-500">
                    Select or type the waste item to continue analysis.
                  </p>
                </div>

                <div className="mt-8 space-y-5">
                  <div className="relative">
                    <label className="mb-3 block text-base font-semibold text-slate-700">
                      Waste Item
                    </label>

                    <div className="flex items-center gap-3 rounded-[22px] border border-[#d9e5d4] bg-white px-4 py-4 shadow-sm">
                      <Search className="h-5 w-5 text-slate-400" />
                      <input
                        type="text"
                        value={query}
                        onChange={(e) => {
                          setQuery(e.target.value);
                          setIsDropdownOpen(true);
                        }}
                        onFocus={() => setIsDropdownOpen(true)}
                        placeholder="e.g. Plastic Bottle"
                        className="w-full bg-transparent text-lg text-slate-900 outline-none placeholder:text-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => setIsDropdownOpen((prev) => !prev)}
                        className="text-slate-400"
                        aria-label="Toggle options"
                      >
                        <ChevronDown className="h-5 w-5" />
                      </button>
                    </div>

                    {isDropdownOpen && (
                      <div className="mt-3 max-h-72 overflow-y-auto rounded-[22px] border border-[#d9e5d4] bg-white p-2 shadow-[0_14px_30px_rgba(0,0,0,0.08)]">
                        {filteredOptions.length > 0 ? (
                          filteredOptions.map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => handleSelectOption(option)}
                              className={`w-full rounded-2xl px-4 py-3 text-left text-base transition ${
                                query === option
                                  ? "bg-[#edf7e8] font-semibold text-[#2f7d32]"
                                  : "text-slate-700 hover:bg-slate-50"
                              }`}
                            >
                              {option}
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-base text-slate-400">
                            No matching item found
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="rounded-3xl bg-[#eef6ea] px-5 py-4 text-base text-[#2f7d32]">
                    Selected:{" "}
                    <span className="font-semibold">
                      {selectedOption || query || "None"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleContinue}
                    disabled={!query.trim()}
                    className="w-full rounded-[22px] bg-[#5d9d35] px-6 py-5 text-center text-xl font-semibold text-white shadow-[0_16px_35px_rgba(93,157,53,0.25)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Analyze Waste
                  </button>
                </div>
              </div>

              <nav className="grid grid-cols-4 border-t border-black/5 bg-[#f3f4f6] px-3 py-3 sm:px-4 sm:py-4">
                <Link
                  href="/dashboard"
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl py-2 text-sm"
                >
                  <Home className="h-6 w-6 text-slate-400" />
                  <span className="font-medium text-slate-400">Home</span>
                </Link>

                <Link
                  href="/dashboard/scan"
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl py-2 text-sm"
                >
                  <ScanLine className="h-6 w-6 text-[#5c9d35]" />
                  <span className="font-medium text-[#5c9d35]">Scan</span>
                </Link>

                <Link
                  href="/dashboard"
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl py-2 text-sm"
                >
                  <BarChart3 className="h-6 w-6 text-slate-400" />
                  <span className="font-medium text-slate-400">Activity</span>
                </Link>

                <Link
                  href="/dashboard"
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl py-2 text-sm"
                >
                  <UserCircle2 className="h-6 w-6 text-slate-400" />
                  <span className="font-medium text-slate-400">Profile</span>
                </Link>
              </nav>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}