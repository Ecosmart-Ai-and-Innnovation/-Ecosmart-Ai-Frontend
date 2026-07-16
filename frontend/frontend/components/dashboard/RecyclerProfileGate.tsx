"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/auth";
import { recyclerProfileApi } from "@/lib/api";

/**
 * Enforces one-time recycler onboarding: a recycler cannot use the dashboard
 * until their profile is complete (the backend stamps `profileComplete: true`
 * on save). Runs once per dashboard-layout mount.
 *
 * - Individuals / unknown role: pass straight through, no API call.
 * - Recyclers with a complete profile: pass through (never prompted again).
 * - Recyclers without one: redirected to the build-profile wizard.
 * - On an API error we fail open (render the dashboard) so a transient backend
 *   issue can't lock a recycler out of the app.
 */
export default function RecyclerProfileGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const user = getUser();
    if (user?.role !== "recycler") return;

    let active = true;
    recyclerProfileApi
      .get()
      .then((profile) => {
        if (!active) return;
        if (!profile?.profileComplete) {
          setBlocked(true);
          router.replace("/auth/recycler/build-profile");
        }
      })
      .catch(() => {
        /* fail open — don't trap the user on a transient API error */
      });

    return () => {
      active = false;
    };
  }, [router]);

  if (blocked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#edf3ea]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#5d9d35] border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
