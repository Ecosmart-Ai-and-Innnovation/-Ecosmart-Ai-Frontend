'use client';

import Link from 'next/link';

export function CTASection() {
  return (
    <section className="w-full max-w-5xl mx-auto px-6 mb-10">
      <div className="bg-gradient-to-b from-[#449339] to-[#1b5030] rounded-3xl md:rounded-[3rem] p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-white opacity-[0.03] rounded-full blur-3xl transform scale-150 pointer-events-none"></div>

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 relative z-10 leading-tight">
          Ready to Turn Waste <br className="hidden md:block" /> Into Value?
        </h2>
        <p className="text-[14px] md:text-lg text-green-100/90 mb-10 relative z-10 px-4">
          Join thousands of Nigerians building a cleaner future.
        </p>

        <div className="flex flex-col md:flex-row justify-center items-center gap-4 relative z-10 max-w-md mx-auto md:max-w-none">
          {/* Updated Get Started Link */}
          <Link href="/account-selection?mode=register" className="w-full md:w-auto md:px-12 bg-white text-[#1b5030] font-bold py-4 rounded-full hover:bg-green-50 transition-all shadow-xl hover:-translate-y-1 cursor-pointer text-center">
            Get Started
          </Link>
          
          {/* Updated Sign In Link */}
          <Link href="/account-selection?mode=login" className="w-full md:w-auto md:px-12 bg-transparent border-2 border-white/40 text-white font-bold py-4 rounded-full hover:bg-white/10 transition-colors cursor-pointer text-center">
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
}