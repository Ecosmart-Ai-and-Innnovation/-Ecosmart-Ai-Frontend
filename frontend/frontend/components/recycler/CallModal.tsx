"use client";

import { Phone, X } from "lucide-react";

type RecyclerItem = {
  name: string;
  phone: string;
};

type CallModalProps = {
  open: boolean;
  onClose: () => void;
  recycler: RecyclerItem | null;
};

export default function CallModal({
  open,
  onClose,
  recycler,
}: CallModalProps) {
  if (!open || !recycler) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-95 rounded-[28px] bg-[#f6f7f4] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
        <div className="mb-4 flex justify-end">
          <button onClick={onClose} type="button">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <h2 className="text-center text-[2rem] font-semibold text-[#176c35]">
          Call Recycler
        </h2>

        <p className="mt-2 text-center text-base text-slate-500">
          Get in touch with {recycler.name}
        </p>

        <div className="mt-10 rounded-[28px] bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 rounded-full bg-[#dff0e2] px-5 py-4 text-[1.1rem] font-semibold text-[#176c35] shadow-[0_10px_25px_rgba(0,0,0,0.08)]">
              <Phone className="h-5 w-5" />
              {recycler.phone}
            </div>

            <a
              href={`tel:${recycler.phone.replace(/\s/g, "")}`}
              className="block rounded-full bg-[#5e9d2f] px-5 py-4 text-center text-[1.1rem] font-semibold text-white shadow"
            >
              Call Now
            </a>

            <button
              onClick={onClose}
              type="button"
              className="block w-full py-2 text-center text-[1.05rem] font-medium text-[#176c35]"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}