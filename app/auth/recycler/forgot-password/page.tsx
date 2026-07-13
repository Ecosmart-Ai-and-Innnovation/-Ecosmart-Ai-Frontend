"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Globe, Lock } from 'lucide-react';
import { otpApi } from '@/lib/api';

export default function ForgotPasswordPage() {
  const router = useRouter();

  // Input State
  const [inputValue, setInputValue] = useState('');

  // Validation State
  const [isValid, setIsValid] = useState(false);

  // Loading / Error State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Real-time Validation Effect (email-only — the backend sends reset codes by email)
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValid(emailRegex.test(inputValue));
  }, [inputValue]);

  // Handle Continue — send OTP and navigate to verification page
  const handleContinue = async () => {
    if (!isValid) return;
    setLoading(true);
    setError('');

    try {
      const identifier = inputValue.trim();

      // Send the password-reset OTP by email
      await otpApi.send('email', identifier);

      router.push(`/auth/recycler/verify-email?email=${encodeURIComponent(identifier)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col relative overflow-hidden">

      {/* Edge-to-Edge Decorative Top Wave */}
      <div className="absolute top-0 left-0 w-full h-48 md:h-64 lg:h-72 bg-[#f6fcf4] z-0">
         <svg
           viewBox="0 0 1200 120"
           preserveAspectRatio="none"
           className="absolute bottom-0 w-full h-12 md:h-20 lg:h-24 block"
           fill="#ffffff"
         >
           <path d="M0,120 L1200,120 L1200,0 Q600,140 0,0 Z" />
         </svg>
      </div>

      {/* Header - Full Width Spread */}
      <header className="relative z-20 w-full flex justify-end items-center px-6 md:px-12 lg:px-24 pt-6 pb-4">

        {/* Language Selector */}
        <button className="flex items-center gap-1.5 border border-gray-200 rounded-full px-4 py-2 bg-white/80 backdrop-blur-sm hover:bg-white transition-colors cursor-pointer shadow-sm">
          <Globe className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-600">English</span>
        </button>

      </header>

      {/* Main Content Area - Expands on desktop */}
      <main className="relative z-10 flex-grow w-full max-w-3xl mx-auto px-6 md:px-12 lg:px-16 pt-10 md:pt-20 pb-20 flex flex-col items-center">

        {/* Icon */}
        <div className="w-16 h-16 md:w-20 md:h-20 bg-[#eaf4e7] rounded-full flex items-center justify-center mb-6 md:mb-8">
          <Lock className="w-7 h-7 md:w-8 md:h-8 text-[#549B45]" strokeWidth={2} />
        </div>

        {/* Title Section */}
        <div className="text-center mb-8 md:mb-10 w-full">
          <h1 className="text-[28px] md:text-3xl lg:text-4xl leading-tight font-bold text-[#1b5030] mb-2 md:mb-3">
            Forgot Password?
          </h1>
          <p className="text-[14px] md:text-base text-gray-500 font-medium px-4">
            No worries, we'll send you reset instructions
          </p>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-[480px]">

          {/* Form Box */}
          <form
            className="w-full bg-[#fcfdfc] md:bg-gray-50/40 md:border md:border-gray-100 rounded-3xl p-6 md:p-8"
            onSubmit={(e) => { e.preventDefault(); handleContinue(); }}
          >
            {/* Input Field */}
            <div className="w-full mb-6">
              <label className="block text-[13px] md:text-sm font-medium text-gray-800 mb-2">
                Email Address
              </label>
              <div className="relative flex items-center border border-gray-200 rounded-2xl px-4 py-3.5 bg-white focus-within:border-[#549B45] transition-colors shadow-sm">
                <input
                  type="email"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full outline-none text-[14px] md:text-[15px] text-gray-900 placeholder:text-gray-400 bg-transparent"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="w-full mb-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600 text-center">
                {error}
              </div>
            )}

            {/* Dynamic Submit Button */}
            <div className="w-full">
              <button
                type="submit"
                disabled={!isValid || loading}
                className={`w-full py-4 rounded-full font-semibold text-[15px] md:text-[16px] transition-all duration-300 ${
                  isValid && !loading
                    ? 'bg-[#549B45] text-white shadow-lg shadow-green-900/20 hover:bg-[#458237] hover:-translate-y-0.5 cursor-pointer'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {loading ? 'Sending...' : 'Continue'}
              </button>
            </div>
          </form>

          {/* Footer Link */}
          <div className="text-center w-full mt-8 md:mt-10">
            <p className="text-[13px] md:text-[14px] text-gray-600 font-medium">
              Remember password? <Link href="/auth/recycler/sign-in" className="font-bold text-[#1b5030] hover:text-[#549B45] transition-colors hover:underline underline-offset-2">Login</Link>
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
