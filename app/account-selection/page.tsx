"use client";

import { useRouter } from "next/navigation";
import { Globe, User, Recycle, ArrowRight } from "lucide-react";

export default function AccountSelection() {
  const router = useRouter();

  const handleSelect = (role: "individual" | "recycler") => {
    if (role === "individual") {
      router.push("/auth/individual/sign-up");
    } else {
      router.push("/auth/recycler/sign-up");
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">

      {/* Edge-to-Edge Header */}
      <header className="w-full flex justify-between items-center px-6 md:px-12 lg:px-24 pt-8 pb-4 shrink-0">
        <div className="flex items-center gap-1.5">
          <img
            src="/images/logo.png"
            alt="EcoSmart AI"
            className="h-8 w-auto object-contain"
          />
        </div>

        <button className="flex items-center gap-1.5 border border-gray-200 rounded-full px-3 py-1.5 hover:bg-gray-50 transition-colors cursor-pointer">
          <Globe className="w-3.5 h-3.5 text-gray-500" />
          <span className="text-xs md:text-sm font-medium text-gray-600">English</span>
        </button>
      </header>

      {/* Hero Video */}
      <div className="relative w-full h-[45vh] md:h-[70vh] lg:h-[80vh] shrink-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#d4ebd4] to-[#e3eedc] overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            disablePictureInPicture
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/hero-animation.mp4" type="video/mp4" />
          </video>
        </div>

        {/* SVG Curve */}
        <div className="absolute -bottom-[2px] left-0 w-full leading-[0] pointer-events-none z-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-8 md:h-16 lg:h-20 block"
            fill="#ffffff"
          >
            <path d="M0,120 L1200,120 L1200,0 Q600,140 0,0 Z" />
          </svg>
        </div>
      </div>

      {/* Content Area */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-24 pt-8 md:pt-16 pb-20 flex flex-col items-center justify-center">

        {/* Text Content */}
        <div className="text-center mb-10 md:mb-16">
          <h1 className="text-[26px] md:text-3xl lg:text-4xl font-bold text-[#1b5030] mb-2 md:mb-4 transition-all">
            Welcome to EcoSmart AI
          </h1>
          <p className="text-sm md:text-base text-gray-500 font-medium">
            Choose the option that best describes you
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center max-w-3xl mx-auto mb-10 md:mb-14 w-full">
          <div className="h-px bg-gray-200 flex-grow" />
          <span className="mx-4 text-xs md:text-sm font-bold tracking-widest text-[#449339] uppercase whitespace-nowrap">
            I am a...
          </span>
          <div className="h-px bg-gray-200 flex-grow" />
        </div>

        {/* Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 max-w-5xl mx-auto w-full">

          {/* Individual Card */}
          <div
            onClick={() => handleSelect("individual")}
            className="rounded-[24px] p-8 md:p-10 relative overflow-hidden flex flex-col cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl md:min-h-[260px] bg-white border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]"
          >
            <User className="absolute -bottom-8 -right-8 w-40 h-40 text-gray-200 opacity-[0.12]" strokeWidth={1} />

            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-8 relative z-10 bg-[#f1f7ef]">
              <User className="w-7 h-7 text-[#449339]" />
            </div>

            <div className="relative z-10 flex-grow">
              <h2 className="font-bold text-xl md:text-2xl mb-3 text-gray-900">
                Individual
              </h2>
              <p className="text-sm md:text-base leading-relaxed max-w-[85%] text-gray-500">
                Use the platform to identify, book pickups, and earn rewards.
              </p>
            </div>

            <div className="w-12 h-12 rounded-full flex items-center justify-center mt-8 relative z-10 self-start transition-colors bg-gray-50 hover:bg-gray-100">
              <ArrowRight className="w-6 h-6 text-gray-400" />
            </div>
          </div>

          {/* Recycler Card */}
          <div
            onClick={() => handleSelect("recycler")}
            className="rounded-[24px] p-8 md:p-10 relative overflow-hidden flex flex-col cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl md:min-h-[260px] bg-white border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]"
          >
            <Recycle className="absolute -bottom-8 -right-8 w-40 h-40 text-gray-200 opacity-[0.12]" strokeWidth={1} />

            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-8 transition-colors bg-[#f1f7ef]">
              <Recycle className="w-7 h-7 text-[#449339]" />
            </div>

            <div className="flex-grow">
              <h2 className="font-bold text-xl md:text-2xl mb-3 text-gray-900">
                Recycler
              </h2>
              <p className="text-sm md:text-base leading-relaxed max-w-[85%] text-gray-500">
                Manage collections, grow your business, and earn more.
              </p>
            </div>

            <div className="w-12 h-12 rounded-full flex items-center justify-center mt-8 self-start transition-colors bg-gray-50 hover:bg-gray-100">
              <ArrowRight className="w-6 h-6 text-gray-400" />
            </div>
          </div>

        </div>

        {/* Sign In Link */}
        <div className="mt-10 text-center">
          <p className="text-[13px] md:text-sm text-gray-500">
            Already have an account?{' '}
            <button onClick={() => router.push('/auth/individual/sign-in')} className="font-bold text-[#1b5030] hover:text-[#449339] transition-colors hover:underline underline-offset-2 cursor-pointer">
              Sign in
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
