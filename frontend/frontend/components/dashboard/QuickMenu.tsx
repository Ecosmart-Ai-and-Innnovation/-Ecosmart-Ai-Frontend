export default function QuickMenu() {
  return (
    <div className="mx-4 mb-3 rounded-2xl border border-[#dce7d9] bg-white p-4 text-sm text-slate-600 shadow-sm sm:mx-6">
      <p className="font-semibold text-slate-800">Quick Menu</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <button className="rounded-xl bg-[#f5f8f3] px-3 py-2 text-left hover:bg-[#edf5e9]">
          Notifications
        </button>
        <button className="rounded-xl bg-[#f5f8f3] px-3 py-2 text-left hover:bg-[#edf5e9]">
          Wallet
        </button>
        <button className="rounded-xl bg-[#f5f8f3] px-3 py-2 text-left hover:bg-[#edf5e9]">
          Rewards
        </button>
        <button className="rounded-xl bg-[#f5f8f3] px-3 py-2 text-left hover:bg-[#edf5e9]">
          Settings
        </button>
      </div>
    </div>
  );
}