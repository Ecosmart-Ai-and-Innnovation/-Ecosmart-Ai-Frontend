import type { ReactNode } from "react";
import FloatingAssistant from "@/components/ai assistant/FloatingAssistant";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#edf3ea]">
      <div className="mx-auto w-full max-w-[1600px] px-3 py-4 sm:px-5 sm:py-6 lg:px-6 lg:py-8">
        {children}
      </div>

      <FloatingAssistant />
    </main>
  );
}