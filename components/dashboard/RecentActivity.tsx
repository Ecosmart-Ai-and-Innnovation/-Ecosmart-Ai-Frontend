import { Clock3 } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { ActivityItem } from "../../types/dashboard";

type RecentActivityProps = {
  activities: ActivityItem[];
  setActiveTab: Dispatch<
    SetStateAction<"home" | "scan" | "activity" | "profile">
  >;
  markPendingAsRecycled: (id: string) => void;
};

export default function RecentActivity({
  activities,
  setActiveTab,
  markPendingAsRecycled,
}: RecentActivityProps) {
  return (
    <section className="pb-2">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Recent Activity
        </h3>
        <button
          onClick={() => setActiveTab("activity")}
          className="text-lg font-semibold text-[#5c9d35] hover:underline"
        >
          View All
        </button>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {activities.map((item) => {
          const isRecycled = item.status === "Recycled";

          return (
            <div
              key={item._id}
              className="flex flex-col gap-3 rounded-[22px] bg-white px-4 py-4 shadow-sm ring-1 ring-black/5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                <div
                  className={`h-14 w-1 rounded-full ${
                    isRecycled ? "bg-[#22c55e]" : "bg-[#f59e0b]"
                  }`}
                />
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                    isRecycled
                      ? "bg-[#edf9ef] text-[#1f9d48]"
                      : "bg-[#fef6e7] text-[#d18a00]"
                  }`}
                >
                  <Clock3 className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <h4 className="truncate text-lg font-semibold text-slate-800 sm:text-xl">
                    {item.title}
                  </h4>
                  <p className="text-base text-slate-500">
                    {item.time || "Just now"}
                  </p>
                </div>
              </div>

              <div className="flex flex-row items-center justify-between gap-3 sm:flex-col sm:items-end">
                <span
                  className={`rounded-full px-4 py-1 text-sm font-medium ${
                    isRecycled
                      ? "bg-[#eefbf1] text-[#22c55e]"
                      : "bg-[#fff7e8] text-[#f59e0b]"
                  }`}
                >
                  {item.status}
                </span>

                {!isRecycled && (
                  <button
                    onClick={() => markPendingAsRecycled(item._id)}
                    className="text-sm font-medium text-[#5c9d35] hover:underline"
                  >
                    Mark done
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}