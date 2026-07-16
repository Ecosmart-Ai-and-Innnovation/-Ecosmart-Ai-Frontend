"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// SMS OTP is not supported by the backend — OTP codes are email-only.
// This route is kept as a redirect so any old links land on the email reset flow.
// Restore the previous SMS UI here if/when the backend adds phone OTP support.
export default function SmsVerificationPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/auth/recycler/forgot-password");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <p className="text-gray-500 font-medium">Redirecting…</p>
    </div>
  );
}
