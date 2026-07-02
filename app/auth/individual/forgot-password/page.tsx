"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Globe, Lock } from 'lucide-react';
import { otpApi } from '@/lib/api';

export default function ForgotPasswordPage() {
  const router = useRouter();

  // Method State (Email vs Phone)
  const [method, setMethod] = useState<'email' | 'phone'>('email');

  // Input State
  const [inputValue, setInputValue] = useState('');

  // Validation State
  const [isValid, setIsValid] = useState(false);

  // Loading / Error State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Nigeria country code
  const countryCode = '+234';

  // Real-time Validation Effect
  useEffect(() => {
    if (method === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsValid(emailRegex.test(inputValue));
    } else {
      // NG phone validation: expect 10 digits after +234
      const cleanPhone = inputValue.replace(/\D/g, '');
      const normalized = cleanPhone.startsWith('0') ? cleanPhone.slice(1) : cleanPhone;
      setIsValid(normalized.length === 10);
    }
  }, [inputValue, method]);

  // Handle method change and clear input
  const handleMethodChange = (newMethod: 'email' | 'phone') => {
    setMethod(newMethod);
    setInputValue('');
    setError('');
  };

  // Handle Continue — send OTP and navigate to verification page
  const handleContinue = async () => {
    if (!isValid) return;
    setLoading(true);
    setError('');

    try {
      // Build the full identifier
      let identifier: string;
      if (method === 'email') {
        identifier = inputValue.trim();
      } else {
        const cleanPhone = inputValue.replace(/\D/g, '');
        const normalized = cleanPhone.startsWith('0') ? cleanPhone.slice(1) : cleanPhone;
        identifier = countryCode + normalized;
      }

      // Send OTP
      await otpApi.send(method, identifier);

      // Navigate to the appropriate OTP verification page
      const queryParam = encodeURIComponent(identifier);
      if (method === 'email') {
        router.push(`/auth/individual/verify-email?email=${queryParam}`);
      } else {
        router.push(`/auth/individual/verify-sms?phone=${queryParam}`);
      }
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

          {/* Email / Phone Toggle */}
          <div className="flex bg-white border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] rounded-full p-1.5 mb-8 md:mb-10 w-full max-w-[320px] mx-auto">
            <button
              onClick={() => handleMethodChange('email')}
              className={`flex-1 py-2.5 rounded-full text-[14px] font-semibold transition-all duration-300 ${
                method === 'email'
                  ? 'bg-[#549B45] text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              Email
            </button>
            <button
              onClick={() => handleMethodChange('phone')}
              className={`flex-1 py-2.5 rounded-full text-[14px] font-semibold transition-all duration-300 ${
                method === 'phone'
                  ? 'bg-[#549B45] text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              Phone
            </button>
          </div>

          {/* Form Box */}
          <form
            className="w-full bg-[#fcfdfc] md:bg-gray-50/40 md:border md:border-gray-100 rounded-3xl p-6 md:p-8"
            onSubmit={(e) => { e.preventDefault(); handleContinue(); }}
          >
            {/* Input Field */}
            <div className="w-full mb-6">
              <label className="block text-[13px] md:text-sm font-medium text-gray-800 mb-2">
                {method === 'email' ? 'Email Address' : 'Phone Number'}
              </label>
              <div className="relative flex items-center border border-gray-200 rounded-2xl px-4 py-3.5 bg-white focus-within:border-[#549B45] transition-colors shadow-sm">
                {method === 'phone' && (
                  <>
                    <span className="flex items-center gap-1.5 text-[15px] font-semibold text-gray-900 mr-3 whitespace-nowrap">
                      <span className="text-lg leading-none">🇳🇬</span>
                      {countryCode}
                    </span>
                    <div className="h-6 w-px bg-gray-300 mr-3"></div>
                  </>
                )}
                <input
                  type={method === 'email' ? 'email' : 'tel'}
                  value={inputValue}
                  onChange={(e) => {
                    if (method === 'phone') {
                      const val = e.target.value.replace(/\D/g, '');
                      setInputValue(val);
                    } else {
                      setInputValue(e.target.value);
                    }
                  }}
                  placeholder={method === 'email' ? 'Enter your email' : 'Enter your phone number'}
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
              Remember password? <Link href="/auth/individual/sign-in" className="font-bold text-[#1b5030] hover:text-[#549B45] transition-colors hover:underline underline-offset-2">Login</Link>
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}