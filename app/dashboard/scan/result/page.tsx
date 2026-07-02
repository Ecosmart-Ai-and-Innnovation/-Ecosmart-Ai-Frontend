"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ResultRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // The new single-page scanner handles results inline,
    // so redirect to the scanner page
    router.replace("/dashboard/scan");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#edf3ea]">
      <p className="text-slate-500">Redirecting to scanner...</p>
    </div>
  );
}
