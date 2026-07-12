"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Home,
  ScanLine,
  BarChart3,
  UserCircle2,
  Recycle,
} from "lucide-react";

import { recyclerApi } from "@/lib/api";
import type { RecyclerData } from "@/lib/api";

function RecyclersContent() {
  const searchParams = useSearchParams();
  const wasteParam = searchParams.get("waste");

  const [recyclers, setRecyclers] = useState<RecyclerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const states = useMemo(() => {
    // 1. SAFEGUARD: Ensure recyclers is an array before mapping
    if (!Array.isArray(recyclers)) return ["Abuja", "Lagos", "Enugu", "Rivers", "Kano", "Oyo"];
    const unique = [...new Set(recyclers.map((r) => r?.state).filter(Boolean))];
    return unique.length > 0 ? unique : ["Abuja", "Lagos", "Enugu", "Rivers", "Kano", "Oyo"];
  }, [recyclers]);

  const [selectedState, setSelectedState] = useState(states[0] || "Abuja");

  useEffect(() => {
    setLoading(true);
    setError("");
    recyclerApi
      .getAll()
      .then((data) => {
        // 2. SAFEGUARD: Strictly check that the backend gave us an array
        const validData = Array.isArray(data) ? data : [];
        setRecyclers(validData);
        if (validData.length > 0 && validData[0]?.state) {
          setSelectedState(validData[0].state);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (states.length > 0 && !states.includes(selectedState)) {
      setSelectedState(states[0]);
    }
  }, [states, selectedState]);

  const currentLocation = useMemo(() => {
    if (!Array.isArray(recyclers)) return { state: selectedState, address: "", mapQuery: `${selectedState},Nigeria` };
    const found = recyclers.find((r) => r?.state === selectedState);
    return found
      ? { state: found.state, address: found.address, mapQuery: found.mapQuery || `${selectedState},Nigeria` }
      : { state: selectedState, address: "", mapQuery: `${selectedState},Nigeria` };
  }, [recyclers, selectedState]);

  const filteredRecyclers = useMemo(() => {
    if (!Array.isArray(recyclers)) return [];
    return recyclers.filter((r) => r?.state === selectedState);
  }, [recyclers, selectedState]);

  return (
    <main className="min-h-screen bg-[#edf3ea]">
      <div className="mx-auto flex justify-center">
        <section className="w-full min-h-screen bg-[#f6f7f4] shadow-[0_20px_80px_rgba(0,0,0,0.16)]">
          <div className="flex min-h-screen flex-col overflow-hidden rounded-[28px]">
            <header className="flex items-center justify-between bg-[#f3f4f6] px-5 pb-4 pt-5">
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

            <div className="flex-1 overflow-y-auto px-5 py-6">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-base text-slate-600"
              >
                <ArrowLeft className="h-5 w-5" />
                Back
              </Link>

              {wasteParam && (
                <div className="mt-4 rounded-2xl bg-[#eef7ea] px-4 py-3 text-sm text-[#2f7d32]">
                  Showing recyclers for: <strong>{wasteParam}</strong>
                </div>
              )}

              <div className="mt-6 flex items-center gap-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#dfeedd] px-4 py-3 text-base font-semibold text-[#2f7d32]">
                  <MapPin className="h-5 w-5 text-[#f5aa00]" />
                  Location
                </div>

                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="rounded-full border border-[#d7e6d4] bg-white px-4 py-3 text-base font-medium text-slate-700 outline-none"
                >
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}, Nigeria
                    </option>
                  ))}
                </select>
              </div>

              <p className="mt-4 text-base text-slate-500">
                {currentLocation.address || `${currentLocation.state}, Nigeria`}
              </p>

              <section className="mt-6 overflow-hidden rounded-[22px] bg-[#eceae4]">
                {/* 3. SAFEGUARD: Fixed string interpolation syntax from 0{ to ${ */}
                <iframe
                  title="Recycler map"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    currentLocation.mapQuery
                  )}&z=12&output=embed`}
                  className="h-65 w-full border-0"
                  loading="lazy"
                />
              </section>

              {loading ? (
                <div className="mt-6 text-center text-slate-500">Loading recyclers...</div>
              ) : error ? (
                <div className="mt-6 rounded-2xl bg-red-50 p-4 text-center text-sm text-red-600">{error}</div>
              ) : filteredRecyclers.length === 0 ? (
                <div className="mt-6 rounded-3xl bg-white px-5 py-10 text-center text-slate-400 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                  <Recycle className="mx-auto mb-3 h-10 w-10 text-slate-300" />
                  <p>No recyclers found in {selectedState} yet.</p>
                </div>
              ) : (
                <div className="mt-6 space-y-5">
                  {filteredRecyclers.map((item) => (
                    <article
                      key={item._id}
                      className="rounded-3xl bg-white px-5 py-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 gap-4">
                          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-[#eef5ea] text-[#5c9d35]">
                            <Recycle className="h-7 w-7" />
                          </div>

                          <div className="min-w-0">
                            <h3 className="truncate text-xl font-semibold text-slate-900">
                              {item.name || "Unknown Recycler"}
                            </h3>
                            <p className="mt-1 text-base text-slate-400">
                              {item.distance || "Distance unknown"}
                            </p>
                            <p className="mt-3 text-base text-slate-400">
                              {/* 4. SAFEGUARD: safely handle missing wasteTypes array */}
                              ♻ {Array.isArray(item.wasteTypes) ? item.wasteTypes.join(", ") : "Various Waste"}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="inline-flex rounded-full bg-[#e6f2e6] px-4 py-1 text-sm font-medium text-[#4e9155]">
                            {item.verified ? "Verified" : "Unverified"}
                          </span>
                          <p className="mt-3 text-sm text-slate-500">
                            {item.rating || "New"} rating
                          </p>
                          <p className="mt-2 text-xl font-bold text-[#24713d]">
                            {item.price || "Contact for price"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-4">
                        <Link
                          href={`/dashboard/recyclers/contact?recyclerId=${item._id}`}
                          className="rounded-full bg-[#6aa436] px-6 py-3 text-base font-semibold text-white shadow-md"
                        >
                          Contact Recycler
                        </Link>

                        <Link
                          href={`/dashboard/recyclers/details?id=${item._id}`}
                          className="rounded-full border border-[#2f7d32] px-8 py-3 text-base font-semibold text-[#2f7d32]"
                        >
                          View Details
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <nav className="grid grid-cols-4 border-t border-black/5 bg-[#f3f4f6] px-3 py-3">
              <Link href="/dashboard" className="flex flex-col items-center gap-2 py-2 text-sm">
                <Home className="h-6 w-6 text-slate-400" />
                <span className="font-medium text-slate-400">Home</span>
              </Link>
              <Link href="/dashboard/scan" className="flex flex-col items-center gap-2 py-2 text-sm">
                <ScanLine className="h-6 w-6 text-slate-400" />
                <span className="font-medium text-slate-400">Scan</span>
              </Link>
              <Link href="/dashboard/activity" className="flex flex-col items-center gap-2 py-2 text-sm">
                <BarChart3 className="h-6 w-6 text-slate-400" />
                <span className="font-medium text-slate-400">Activity</span>
              </Link>
              <Link href="/dashboard/profile" className="flex flex-col items-center gap-2 py-2 text-sm">
                <UserCircle2 className="h-6 w-6 text-slate-400" />
                <span className="font-medium text-slate-400">Profile</span>
              </Link>
            </nav>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function RecyclersPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center bg-[#edf3ea]">
        <p className="text-slate-500">Loading recyclers...</p>
      </main>
    }>
      <RecyclersContent />
    </Suspense>
  );
}