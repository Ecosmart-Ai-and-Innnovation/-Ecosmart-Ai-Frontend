"use client";

import { useRouter } from "next/navigation";
import type { QuickAction } from "@/types/dashboard";

type QuickActionsProps = {
  quickActions: QuickAction[];
  handleQuickAction: (actionId: string) => void;
};

export default function QuickActions({
  quickActions,
  handleQuickAction,
}: QuickActionsProps) {
  const router = useRouter();

  return (
    <section>
      <h3 className="mb-4 text-xl font-semibold text-slate-900 sm:text-2xl">
        Quick Actions
      </h3>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {quickActions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.id}
              type="button"
              onClick={() => {
                if (action.id === "scan") {
                  router.push("/dashboard/scan");
                  return;
                }

                if (action.id === "upload") {
                  router.push("/dashboard/scan/upload");
                  return;
                }

                if (action.id === "type") {
                  router.push("/dashboard/scan/type");
                  return;
                }

                if (action.id === "history") {
                  router.push("/dashboard/activity");
                  return;
                }

              }}
              className="rounded-[22px] bg-white px-3 py-4 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-md sm:py-5"
            >
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf5e9] text-[#26703b]">
                <Icon className="h-6 w-6" />
              </span>

              <span className="mt-3 block text-sm font-semibold text-slate-800 sm:text-base">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}