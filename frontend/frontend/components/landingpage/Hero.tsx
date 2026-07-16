'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, ChevronDown, ScanLine, CheckCircle2, ChevronRight, Check, Leaf } from 'lucide-react';

export function Hero() {
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);

  // Auto-advance carousel every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full max-w-7xl mx-auto px-6 pt-8 md:pt-16 lg:pt-24 pb-16 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
      {/* Left Text Content */}
      <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-1/2">
        <div className="inline-flex items-center gap-1.5 bg-[#eaf4e7] text-[#449339] px-3 py-1.5 rounded-full text-[11px] md:text-xs font-bold uppercase tracking-wider mb-6 lg:mb-8 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" />
          AI-Powered Recycling
        </div>

        <h1 className="text-[38px] md:text-5xl lg:text-[64px] font-extrabold text-[#111827] leading-[1.15] tracking-tight mb-4 lg:mb-6 max-w-lg lg:max-w-none mx-auto lg:mx-0">
          Your Waste Has a Price Tag.
        </h1>

        <p className="text-[15px] md:text-lg lg:text-xl text-gray-500 font-medium mb-8 lg:mb-10 max-w-md lg:max-w-xl mx-auto lg:mx-0 leading-relaxed">
          Scan it. Know its worth. Get paid by a recycler near you.
        </p>

        <div className="flex flex-col lg:flex-row items-center gap-6">
          <Link href="/account-selection" className="bg-[#549B45] hover:bg-[#458237] text-white px-8 py-4 rounded-full font-semibold text-[15px] md:text-[16px] flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-900/20 hover:-translate-y-0.5 cursor-pointer">
            Get Started <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
          </Link>

          <button className="text-[#549B45] text-[14px] font-bold flex items-center gap-1 hover:text-[#1b5030] transition-colors cursor-pointer">
            See how it works <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right Floating UI Mockup Carousel */}
      <div className="w-full lg:w-1/2 flex justify-center lg:justify-end mt-8 lg:mt-0 perspective-[1000px]">
        <div className="relative w-full max-w-[320px] md:max-w-[380px] lg:mr-8">
          <div className="absolute inset-0 bg-[#549B45]/20 blur-3xl rounded-[3rem] transform translate-y-6"></div>

          {/* Slide 0: UI Mockup */}
          {activeHeroSlide === 0 && (
            <div className="bg-white rounded-[2rem] p-5 md:p-6 shadow-[0_15px_50px_-12px_rgba(0,0,0,0.15)] border border-gray-100 relative z-10 transform hover:-translate-y-2 transition-transform duration-500 animate-in fade-in zoom-in-95 h-full">
              <div className="flex gap-1.5 mb-5 px-1">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <div className="ml-2 text-[10px] md:text-[11px] text-gray-300 font-medium font-mono tracking-wider uppercase">ecosmart.ai/scan-result</div>
              </div>
              <div className="flex justify-between items-center mb-5">
                <div className="flex items-center gap-1.5 text-[#449339] font-bold text-[14px]">
                  <ScanLine className="w-4 h-4 md:w-5 md:h-5" /> Scan Result
                </div>
                <div className="flex items-center gap-1 bg-[#eaf4e7] text-[#449339] px-2.5 py-1 rounded-md text-[11px] md:text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Identified
                </div>
              </div>
              <div className="bg-[#f1f7ef] rounded-2xl p-4 md:p-5 mb-5 flex items-center gap-4">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                  <ScanLine className="w-6 h-6 md:w-7 md:h-7 text-[#549B45] opacity-50" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-[16px] md:text-[17px] mb-1.5">Plastic Bottle</h3>
                  <div className="flex gap-2">
                    <span className="bg-white text-gray-600 text-[10px] md:text-[11px] font-bold px-2 py-0.5 rounded shadow-sm border border-gray-50">PET</span>
                    <span className="bg-white text-[#449339] text-[10px] md:text-[11px] font-bold px-2 py-0.5 rounded shadow-sm border border-gray-50">Recyclable</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6 px-1">
                <div><p className="text-[12px] md:text-[13px] text-gray-500 font-medium mb-1">Est. Value</p><p className="font-bold text-gray-900 text-[15px] md:text-[16px]">₦5.00/unit</p></div>
                <div><p className="text-[12px] md:text-[13px] text-gray-500 font-medium mb-1">Recyclers Near</p><p className="font-bold text-gray-900 text-[15px] md:text-[16px]">2 matched</p></div>
              </div>
              <button className="w-full bg-[#549B45] text-white rounded-xl py-3.5 md:py-4 text-[13px] md:text-[14px] font-bold flex justify-between items-center px-5 hover:bg-[#458237] transition-colors cursor-pointer">
                <span>Find a Recycler Nearby</span>
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          )}

          {/* Slide 1: Video Player */}
          {activeHeroSlide === 1 && (
            <div className="bg-white rounded-[2rem] p-3 md:p-4 shadow-[0_15px_50px_-12px_rgba(0,0,0,0.15)] border border-gray-100 relative z-10 transform hover:-translate-y-2 transition-transform duration-500 flex flex-col aspect-[4/5] animate-in fade-in zoom-in-95">
              <div className="flex gap-1.5 mb-3 px-2 pt-1">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <div className="ml-2 text-[10px] md:text-[11px] text-gray-300 font-medium font-mono tracking-wider uppercase">ecosmart.ai/demo</div>
              </div>
              <div className="flex-grow rounded-[1.25rem] overflow-hidden relative bg-gray-50">
                <video src="/videos/scan%20video.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
              </div>
            </div>
          )}

          {/* Slide 2: Floating Elements */}
          {activeHeroSlide === 2 && (
            <div className="bg-[#fcfdfc] rounded-[2rem] p-5 md:p-6 shadow-[0_15px_50px_-12px_rgba(0,0,0,0.15)] border border-gray-100 relative z-10 transform hover:-translate-y-2 transition-transform duration-500 w-full aspect-[4/5] flex flex-col items-center justify-center animate-in fade-in zoom-in-95">
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute w-[200px] h-[200px] md:w-[240px] md:h-[240px] bg-[#f1f7ef] rounded-full"></div>
                <div className="absolute w-[160px] h-[160px] md:w-[190px] md:h-[190px] bg-[#eaf4e7] rounded-full"></div>
                <div className="relative z-10 w-[100px] h-[100px] md:w-[115px] md:h-[115px] bg-[#549B45] rounded-full flex items-center justify-center shadow-lg">
                  <Leaf className="w-10 h-10 md:w-12 md:h-12 text-white" strokeWidth={1.5} />
                </div>
                <div className="absolute top-[12%] left-[-2%] md:left-[-8%] bg-white rounded-[1.25rem] shadow-[0_10px_30px_rgba(0,0,0,0.06)] px-4 py-3 flex items-center gap-3 z-20 animate-in slide-in-from-bottom-2 duration-700 whitespace-nowrap">
                  <div className="w-6 h-6 bg-[#eaf4e7] rounded-full flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-[#549B45]" strokeWidth={3} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13px] md:text-[14px] font-bold text-[#111827] leading-tight mb-0.5">Aluminium</span>
                    <span className="text-[11px] md:text-[12px] text-gray-500 font-medium leading-none">Recyclable</span>
                  </div>
                </div>
                <div className="absolute top-[15%] right-[5%] w-12 h-12 md:w-14 md:h-14 bg-[#549B45] rounded-full flex items-center justify-center shadow-lg z-20 animate-in slide-in-from-bottom-4 duration-700 delay-100">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 8V6a2 2 0 0 1 2-2h2M20 8V6a2 2 0 0 0-2-2h-2M4 16v2a2 2 0 0 0 2 2h2M20 16v2a2 2 0 0 1-2 2h-2"/>
                  </svg>
                </div>
                <div className="absolute bottom-[20%] left-[8%] md:left-[5%] w-12 h-12 md:w-14 md:h-14 bg-[#1b5030] rounded-full flex items-center justify-center shadow-lg z-20 animate-in slide-in-from-bottom-4 duration-700 delay-200">
                  <span className="text-white font-bold text-[20px] md:text-[24px] leading-none">₦</span>
                </div>
                <div className="absolute bottom-[12%] right-[0%] md:right-[-10%] bg-white rounded-[1.25rem] shadow-[0_10px_30px_rgba(0,0,0,0.06)] px-4 py-3 flex items-center gap-3 z-20 animate-in slide-in-from-bottom-2 duration-700 delay-300 whitespace-nowrap">
                  <div className="w-6 h-6 bg-[#fff4d2] rounded-full flex items-center justify-center shrink-0">
                    <span className="text-[#f5a623] font-bold text-[12px]">N</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] md:text-[11px] text-gray-500 font-medium leading-tight mb-0.5">Your Earnings</span>
                    <span className="text-[14px] md:text-[15px] font-bold text-[#549B45] leading-none">₦2,400</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Carousel Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {[0, 1, 2].map((slideIndex) => (
              <button
                key={slideIndex}
                onClick={() => setActiveHeroSlide(slideIndex)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  activeHeroSlide === slideIndex ? 'w-6 bg-[#549B45]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`View Hero Slide ${slideIndex + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
