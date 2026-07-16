"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Menu,
  Phone,
  MessageCircle,
  Home,
  ScanLine,
  BarChart3,
  UserCircle2,
} from "lucide-react";
import CallModal from "@/components/recycler/CallModal";
import ChatModal from "@/components/recycler/ChatModal";

import { recyclerApi } from "@/lib/api";
import type { RecyclerData } from "@/lib/api";

type DeliveryType = "Pickup" | "Drop off";

function ContactRecyclerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const recyclerId = searchParams.get("recyclerId");

  const [recycler, setRecycler] = useState<RecyclerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("Pickup");
  const [weight, setWeight] = useState("1.00");
  const [details, setDetails] = useState("");
  const [showCallModal, setShowCallModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  useEffect(() => {
    if (!recyclerId) {
      setLoading(false);
      return;
    }

    recyclerApi
      .getById(recyclerId)
      .then((data) => setRecycler(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [recyclerId]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#edf3ea]">
        <p className="text-slate-500">Loading...</p>
      </main>
    );
  }

  if (!recycler) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#edf3ea] px-4">
        <div className="text-center">
          <p className="text-slate-500">No recycler selected.</p>
          <Link href="/dashboard/recyclers" className="mt-4 inline-block text-[#5d9d35] font-semibold">
            ← Browse Recyclers
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#edf3ea]">
      <div className="mx-auto">
        <div className="flex justify-center">
          <section className="w-full overflow-hidden bg-[#f6f7f4] shadow-[0_20px_80px_rgba(0,0,0,0.16)]">
            <div className="flex min-h-screen flex-col lg:min-h-212.5">
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

                <button
                  type="button"
                  className="rounded-full p-2 transition hover:bg-black/5"
                >
                  <Menu className="h-6 w-6 text-slate-600" />
                </button>
              </header>

              <div className="flex-1 px-5 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
                <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
                  {/* Left section */}
                  <div>
                    <div className="overflow-hidden rounded-[26px] bg-[#b9ecec]">
                      <img
                        src="/images/recycler-banner.png"
                        alt="Recycler banner"
                        className="h-35 w-full object-cover sm:h-45 lg:h-55"
                      />
                    </div>

                    <div className="mt-6">
                      <h1 className="text-[1.9rem] font-semibold leading-tight text-[#111827] sm:text-[2.3rem] lg:text-[2.6rem]">
                        {recycler.name}
                      </h1>
                      <p className="mt-2 text-[1rem] text-slate-400 sm:text-[1.05rem]">
                        {recycler.distance}
                      </p>
                    </div>

                    <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                      <button
                        type="button"
                        onClick={() => setShowCallModal(true)}
                        className="flex w-full items-center justify-center gap-2 rounded-full border border-[#2d8b47] bg-white px-7 py-3.5 text-[1rem] font-medium text-[#202938] shadow-sm transition hover:shadow-md sm:w-auto sm:min-w-42.5 sm:text-[1.05rem]"
                      >
                        <Phone className="h-5 w-5 text-slate-600" />
                        Call
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowChatModal(true)}
                        className="flex w-full items-center justify-center gap-2 rounded-full border border-[#2d8b47] bg-white px-7 py-3.5 text-[1rem] font-medium text-[#202938] shadow-sm transition hover:shadow-md sm:w-auto sm:min-w-42.5 sm:text-[1.05rem]"
                      >
                        <MessageCircle className="h-5 w-5 text-slate-600" />
                        Chat
                      </button>
                    </div>
                  </div>

                  {/* Right section */}
                  <div className="lg:flex lg:flex-col lg:justify-center">
                    <div className="rounded-3xl bg-white px-4 py-4 shadow-[0_10px_25px_rgba(0,0,0,0.05)] sm:px-5 sm:py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 overflow-hidden rounded-xl bg-[#eef5ea] sm:h-12 sm:w-12">
                          <img
                            src="/images/plastic-thumb.png"
                            alt="Plastic waste"
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-[0.95rem] text-slate-500 sm:text-[1rem]">
                            Enter Estimated weight
                          </p>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="mt-1 w-full bg-transparent text-[1.15rem] font-semibold text-[#111827] outline-none sm:text-[1.3rem]"
                          />
                        </div>

                        <span className="text-[1rem] font-semibold text-[#2f7d32] sm:text-[1.05rem]">
                          kg
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                      {(["Pickup", "Drop off"] as DeliveryType[]).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setDeliveryType(type)}
                          className={
                            deliveryType === type
                              ? "w-full rounded-full border border-[#2d8b47] bg-[#dff0e2] px-8 py-3.5 text-[1rem] font-medium text-[#202938] sm:w-auto sm:min-w-35 sm:text-[1.05rem]"
                              : "w-full rounded-full bg-white px-8 py-3.5 text-[1rem] font-medium text-slate-500 shadow-sm sm:w-auto sm:min-w-35 sm:text-[1.05rem]"
                          }
                        >
                          {type}
                        </button>
                      ))}
                    </div>

                    <div className="mt-6">
                      <textarea
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        placeholder="Provide additional details or landmarks..."
                        className="h-32.5 w-full rounded-3xl border-0 bg-[#f2f2f2] px-5 py-5 text-[1rem] text-slate-700 outline-none placeholder:text-slate-400 sm:h-37.5"
                      />
                    </div>

                    <button
                      type="button"
                      className="mt-6 w-full rounded-[20px] bg-[#5e9d2f] px-6 py-4 text-center text-[1.1rem] font-semibold text-white shadow-[0_10px_25px_rgba(94,157,47,0.28)] transition hover:opacity-95 sm:text-[1.2rem]"
                    >
                      Send Request
                    </button>

                    <Link
                      href={`/dashboard/recyclers/details?id=${recycler._id}`}
                      className="mt-4 block text-center text-[1rem] font-medium text-[#176c35]"
                    >
                      View Recycler Details
                    </Link>
                  </div>
                </div>
              </div>

              <nav className="grid grid-cols-4 border-t border-black/5 bg-[#f3f4f6] px-3 py-3 sm:px-5 lg:px-8">
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
      </div>
    </main>
  );
}

export default function ContactRecyclerPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center bg-[#edf3ea]">
        <p className="text-slate-500">Loading...</p>
      </main>
    }>
      <ContactRecyclerContent />
    </Suspense>
  );
}
