import { TrendingUp } from "lucide-react";

type EarningsCardProps = {
  totalEarnings: number;
  ecoPoints: number;
};

export default function EarningsCard({
  totalEarnings,
  ecoPoints,
}: EarningsCardProps) {
  return (
    <section className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5 sm:rounded-[26px] sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef5fb] text-[#5c9d35]">
            <TrendingUp className="h-7 w-7" />
          </div>
          <div>
            <p className="text-base text-slate-500 sm:text-lg">Your Earnings</p>
            <h3 className="text-[1.9rem] font-bold tracking-tight text-slate-900 sm:text-[2.2rem]">
              {totalEarnings.toLocaleString("en-NG", {
                style: "currency",
                currency: "NGN",
                maximumFractionDigits: 0,
              })}
            </h3>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm text-slate-400">This month</p>
          <p className="text-xl font-bold text-[#22c55e] sm:text-2xl">+12%</p>
        </div>
      </div>

      <div className="my-5 h-px bg-[#dce8d8]" />

      <div className="flex items-center justify-between text-base sm:text-lg">
        <span className="text-slate-500">Eco Points</span>
        <span className="font-bold text-slate-900">
          {ecoPoints.toLocaleString()} pts
        </span>
      </div>
    </section>
  );
}