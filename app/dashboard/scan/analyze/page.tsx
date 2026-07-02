"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";


export default function AnalyzingPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard/scan/result");
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="min-h-screen bg-[#edf3ea] ">
      <div className="mx-auto">
        <div className="flex justify-center">
          <section className="w-full border-black/5 bg-[#dfe9dd] shadow-[0_20px_80px_rgba(0,0,0,0.16)]">
            <div className="flex min-h-180 flex-col overflow-hidden rounded-[28px] sm:min-h-190 lg:min-h-205">
              <header className="flex items-center gap-2 px-5 pb-4 pt-5 sm:px-8 sm:pb-5 sm:pt-7 lg:px-10 lg:pt-8">
                <div className="flex items-center gap-2">
                  <img
                    src="/images/logo.png"
                      alt="EcoSmart AI Logo"
                      className="h-10 w-auto object-contain"
                  />
                </div>
              </header>

              <section className="flex flex-1 flex-col items-center justify-center px-6 pb-10 text-center sm:px-10 lg:px-16">
                <div className="relative mb-10 h-28 w-28 sm:h-32 sm:w-32 lg:h-36 lg:w-36">
                  <span className="absolute left-1/2 top-0 h-10 w-4 -translate-x-1/2 rounded-full bg-[#7ec242] animate-pulse" />
                  <span className="absolute right-4 top-4 h-10 w-4 rotate-45 rounded-full bg-[#369b3a] animate-pulse [animation-delay:120ms]" />
                  <span className="absolute right-0 top-1/2 h-4 w-10 -translate-y-1/2 rounded-full bg-[#7ec242] animate-pulse [animation-delay:240ms]" />
                  <span className="absolute bottom-4 right-4 h-10 w-4 -rotate-45 rounded-full bg-[#369b3a] animate-pulse [animation-delay:360ms]" />
                  <span className="absolute bottom-0 left-1/2 h-10 w-4 -translate-x-1/2 rounded-full bg-[#7ec242] animate-pulse [animation-delay:480ms]" />
                  <span className="absolute bottom-4 left-4 h-10 w-4 rotate-45 rounded-full bg-[#369b3a] animate-pulse [animation-delay:600ms]" />
                  <span className="absolute left-0 top-1/2 h-4 w-10 -translate-y-1/2 rounded-full bg-[#7ec242] animate-pulse [animation-delay:720ms]" />
                  <span className="absolute left-4 top-4 h-10 w-4 -rotate-45 rounded-full bg-[#369b3a] animate-pulse [animation-delay:840ms]" />
                </div>

                <h1 className="text-[2rem] font-bold tracking-tight text-[#172033] sm:text-[2.4rem] lg:text-[2.8rem]">
                  Analyzing Your Waste
                </h1>

                <p className="mt-4 max-w-xl text-base text-slate-600 sm:text-lg lg:text-xl">
                  Our AI is identifying the waste type...
                </p>

                <div className="mt-10 flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#90b97d]" />
                  <span className="h-3 w-3 rounded-full bg-[#90b97d]/80" />
                  <span className="h-3 w-3 rounded-full bg-[#90b97d]/55" />
                </div>
              </section>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}