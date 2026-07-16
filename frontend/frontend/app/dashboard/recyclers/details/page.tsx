"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Leaf,
  ArrowLeft,
  Phone,
  MessageCircle,
  Home,
  ScanLine,
  BarChart3,
  UserCircle2,
  MapPin,
  Lightbulb,
} from "lucide-react";
import CallModal from "@/components/recycler/CallModal";
import ChatModal from "@/components/recycler/ChatModal";

import { recyclerApi } from "@/lib/api";
import type { RecyclerData } from "@/lib/api";

function RecyclerDetailsContent() {
  const searchParams = useSearchParams();
  const recyclerId = searchParams.get("id");

  const [recycler, setRecycler] = useState<RecyclerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCallModal, setShowCallModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  useEffect(() => {
    if (!recyclerId) {
      setError("No recycler selected.");
      setLoading(false);
      return;
    }

    recyclerApi
      .getById(recyclerId)
      .then((data) => setRecycler(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [recyclerId]);

  const mapSrc = useMemo(() => {
    if (!recycler?.mapQuery) return "";
    return `https://www.google.com/maps?q=${encodeURIComponent(recycler.mapQuery)}&z=13&output=embed`;
  }, [recycler]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#edf3ea]">
        <p className="text-slate-500">Loading...</p>
      </main>
    );
  }

  if (error || !recycler) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#edf3ea] px-4">
        <div className="text-center">
          <p className="text-slate-500">{error || "No recycler selected yet."}</p>
          <Link href="/dashboard/recyclers" className="mt-4 inline-block text-[#5d9d35] font-semibold">
            ← Back to recyclers
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#edf3ea]">
      <div className="mx-auto">
        <section className="overflow-hidden bg-[#f6f7f4] shadow-[0_20px_80px_rgba(0,0,0,0.16)]">
          <div className="flex min-h-screen flex-col">
            <header className="flex items-center justify-between border-b border-black/5 bg-[#f3f4f6] px-5 pb-4 pt-5 sm:px-6 sm:pb-5 sm:pt-6 lg:px-8">
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

            <div className="flex-1 px-5 py-6 sm:px-6 lg:px-8 lg:py-8">
              <Link
                href="/dashboard/recyclers"
                className="inline-flex items-center gap-2 text-base text-slate-600 transition hover:text-slate-900"
              >
                <ArrowLeft className="h-5 w-5" />
                Back
              </Link>

              <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start xl:gap-8">
                {/* Left column */}
                <div>
                  <section className="overflow-hidden rounded-[28px] bg-[#bce8e8]">
                    <div className="flex h-55 w-full items-center justify-center bg-[#d9eeee] text-slate-500 sm:h-75 lg:h-85">
                      <RecycleIcon />
                    </div>
                  </section>

                  <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                        {recycler.name}
                      </h1>
                      <p className="mt-1 text-slate-500 sm:text-base">
                        {recycler.distance}
                      </p>
                    </div>

                    <span className="w-fit rounded-full bg-[#dff0e2] px-3 py-1 text-sm font-medium text-[#2f7d32]">
                      {recycler.rating} rating
                    </span>
                  </div>

                  <h2 className="mt-8 text-lg font-semibold text-slate-900 sm:text-xl">
                    Accepted Materials
                  </h2>

                  <div className="mt-4 flex flex-wrap gap-3 text-slate-600">
                    {recycler.wasteTypes.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-white px-4 py-2 shadow-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                    <button
                      onClick={() => setShowCallModal(true)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#2f7d32] bg-white px-4 py-3 font-semibold text-[#2f7d32] transition hover:bg-[#f7fbf8]"
                    >
                      <Phone className="h-5 w-5" />
                      Call
                    </button>

                    <button
                      onClick={() => setShowChatModal(true)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#2f7d32] bg-white px-4 py-3 font-semibold text-[#2f7d32] transition hover:bg-[#f7fbf8]"
                    >
                      <MessageCircle className="h-5 w-5" />
                      Chat
                    </button>
                  </div>

                  <div className="mt-6 space-y-4">
                    {recycler.wasteTypes.slice(0, 4).map((material) => (
                      <div
                        key={material}
                        className="flex items-center justify-between rounded-[22px] bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)] sm:p-5"
                      >
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">
                            {material}
                          </h3>
                          <p className="text-sm text-slate-500">
                            Accepted for recycling
                          </p>
                        </div>
                        <p className="text-base font-bold text-[#24713d]">
                          {recycler.price}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right column */}
                <div className="space-y-6">
                  <section className="rounded-[22px] bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] sm:p-6">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f6ebbb] text-[#f5aa00]">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900 sm:text-2xl">Location</h3>
                        <p className="mt-2 text-base leading-7 text-slate-600">{recycler.address}</p>
                        <p className="mt-2 font-medium text-slate-800">{recycler.hours}</p>
                      </div>
                    </div>
                  </section>

                  <section className="overflow-hidden rounded-[22px] bg-[#eceae4]">
                    <iframe
                      title="Recycler location map"
                      src={mapSrc}
                      className="h-70 w-full border-0 sm:h-80 lg:h-90"
                      loading="lazy"
                    />
                  </section>

                  <section className="rounded-[22px] border border-[#cfe7e7] bg-[#dff0e2] p-5 sm:p-6">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#2f7d32]">
                        <Lightbulb className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900 sm:text-2xl">Eco Tip</h3>
                        <p className="mt-2 text-base leading-7 text-slate-600">You can earn more by sorting your waste properly.</p>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>

            <nav className="grid grid-cols-4 border-t border-black/5 bg-[#f3f4f6] px-3 py-3 sm:px-5 lg:px-8">
              <Link href="/dashboard" className="flex flex-col items-center gap-2 py-2 text-sm">
                <Home className="h-6 w-6 text-slate-400" /><span className="font-medium text-slate-400">Home</span>
              </Link>
              <Link href="/dashboard/scan" className="flex flex-col items-center gap-2 py-2 text-sm">
                <ScanLine className="h-6 w-6 text-slate-400" /><span className="font-medium text-slate-400">Scan</span>
              </Link>
              <Link href="/dashboard/activity" className="flex flex-col items-center gap-2 py-2 text-sm">
                <BarChart3 className="h-6 w-6 text-slate-400" /><span className="font-medium text-slate-400">Activity</span>
              </Link>
              <Link href="/dashboard/profile" className="flex flex-col items-center gap-2 py-2 text-sm">
                <UserCircle2 className="h-6 w-6 text-slate-400" /><span className="font-medium text-slate-400">Profile</span>
              </Link>
            </nav>
          </div>
        </section>
      </div>

      <CallModal
        open={showCallModal}
        onClose={() => setShowCallModal(false)}
        recycler={{ name: recycler.name, phone: recycler.phone }}
      />

      <ChatModal
        open={showChatModal}
        onClose={() => setShowChatModal(false)}
        recycler={{ name: recycler.name, chatNumber: recycler.chatNumber }}
      />
    </main>
  );
}

function RecycleIcon() {
  return (
    <svg className="h-16 w-16 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
  );
}

export default function RecyclerDetailsPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center bg-[#edf3ea]">
        <p className="text-slate-500">Loading...</p>
      </main>
    }>
      <RecyclerDetailsContent />
    </Suspense>
  );
}
