"use client";

import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import EcoChatAssistant from "./EcoChatAssistant";

export default function FloatingAssistant() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      {open && (
        <button
          aria-label="Close assistant overlay"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
        />
      )}

      {/* Chat panel */}
      <div
        className={`fixed z-50 transition-all duration-300 ease-out ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        {/* Mobile: bottom sheet */}
        <div
          className={`fixed bottom-24 left-3 right-3 h-[70vh] rounded-[28px] border border-black/5 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.18)] transition-all duration-300 sm:left-6 sm:right-6 md:hidden ${
            open ? "translate-y-0" : "translate-y-8"
          }`}
        >
          <div className="flex h-full flex-col overflow-hidden rounded-[28px]">
            <div className="flex items-center justify-between border-b border-slate-200 bg-[#1f6f33] px-4 py-4 text-white">
              <div>
                <h2 className="text-sm font-semibold">EcoSmart Assistant</h2>
                <p className="text-xs text-green-100">
                  Recycling help and eco tips
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-2 hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <EcoChatAssistant />
          </div>
        </div>

        {/* Tablet/Desktop: floating side card */}
        <div
          className={`hidden md:block fixed bottom-24 right-6 h-[600px] w-[360px] lg:w-[380px] rounded-[28px] border border-black/5 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.18)] transition-all duration-300 ${
            open
              ? "translate-y-0 scale-100"
              : "translate-y-4 scale-95"
          }`}
        >
          <div className="flex h-full flex-col overflow-hidden rounded-[28px]">
            <div className="flex items-center justify-between border-b border-slate-200 bg-[#1f6f33] px-4 py-4 text-white">
              <div>
                <h2 className="text-sm font-semibold">EcoSmart Assistant</h2>
                <p className="text-xs text-green-100">
                  Recycling help and eco tips
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-2 hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <EcoChatAssistant />
          </div>
        </div>
      </div>

      {/* Floating button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close assistant" : "Open assistant"}
        className="fixed bottom-24 right-4 z-[60] flex h-16 w-16 items-center justify-center rounded-full border border-black/10 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition hover:scale-105 sm:bottom-6 sm:right-6 sm:h-18 sm:w-18"
      >
        {open ? (
          <X className="h-6 w-6 text-slate-800" />
        ) : (
          <MessageCircle className="h-7 w-7 text-slate-900" />
        )}
      </button>
    </>
  );
}