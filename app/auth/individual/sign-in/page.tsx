"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Globe, Eye, EyeOff, CheckCircle2, Leaf
} from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();

  // Account Type State
  const [isIndividual, setIsIndividual] = useState(true);

  // Form State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // UI State
  const [showPassword, setShowPassword] = useState(false);

  // Validation State
  const [isFormValid, setIsFormValid] = useState(false);

  // Validation Effect
  useEffect(() => {
    // Basic validation: identifier must be at least 5 characters (could be email or phone)
    // and password must be at least 6 characters
    const isValid = identifier.trim().length >= 5 && password.length >= 6;
    setIsFormValid(isValid);
  }, [identifier, password]);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    // Navigate to individual dashboard
    router.push('/dashboard');
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
      <header className="relative z-20 w-full flex justify-between items-center px-6 md:px-12 lg:px-24 pt-6 pb-4">
        <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-full">
          <div className="bg-green-50 p-1.5 rounded-full">
            <Leaf className="w-5 h-5 text-[#449339]" />
          </div>
          <div className="text-lg md:text-xl tracking-tight">
            <span className="font-bold text-[#449339]">EcoSmart</span>
            <span className="font-bold text-gray-900 ml-1">AI</span>
          </div>
        </div>

        <button className="flex items-center gap-1.5 border border-gray-200 rounded-full px-4 py-2 bg-white/80 backdrop-blur-sm hover:bg-white transition-colors cursor-pointer shadow-sm">
          <Globe className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-600">English</span>
        </button>
      </header>

      {/* Main Content Area - Expands on desktop */}
      <main className="relative z-10 flex-grow w-full max-w-4xl mx-auto px-6 md:px-12 lg:px-16 pt-4 md:pt-16 pb-20 flex flex-col items-center">

        {/* Title Section */}
        <div className="text-center mb-8 md:mb-12 w-full">
          <h1 className="text-[32px] md:text-4xl lg:text-5xl leading-tight font-bold text-[#1b5030] mb-2 md:mb-4">
            Welcome Back
          </h1>
          <p className="text-[14px] md:text-lg text-gray-500 font-medium px-4">
            Sign in to continue
          </p>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-xl bg-white md:bg-gray-50/30 md:border md:border-gray-100 md:shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] md:p-10 lg:p-12 relative z-10">

          {/* Status Badge */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2 bg-[#eaf4e7] rounded-full px-4 py-1.5 md:py-2 md:px-5 transition-all">
              <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-[#449339]" />
              <span className="text-[13px] md:text-sm font-medium text-[#1b5030]">
                Signing in as {isIndividual ? 'an Individual' : 'a Recycler'}
              </span>
              <button
                onClick={() => setIsIndividual(!isIndividual)}
                type="button"
                className="text-[13px] md:text-sm font-medium text-gray-500 hover:text-gray-800 ml-2 transition-colors cursor-pointer"
              >
                Change
              </button>
            </div>
          </div>

          <form className="w-full flex flex-col gap-5 md:gap-6" onSubmit={handleLogin}>

            {/* Email or Phone Number */}
            <div className="w-full">
              <label className="block text-[13px] md:text-sm font-medium text-gray-800 mb-1.5 md:mb-2">Email or Phone Number</label>
              <div className="relative flex items-center border border-gray-200 rounded-2xl px-4 py-3.5 md:py-4 bg-white focus-within:border-[#449339] transition-colors shadow-sm">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter your email or phone number"
                  className="w-full outline-none text-[14px] md:text-[15px] text-gray-900 placeholder:text-gray-400 bg-transparent"
                />
              </div>
            </div>

            {/* Password */}
            <div className="w-full">
              <label className="block text-[13px] md:text-sm font-medium text-gray-800 mb-1.5 md:mb-2">Password</label>
              <div className="relative flex items-center border border-gray-200 rounded-2xl px-4 py-3.5 md:py-4 bg-white focus-within:border-[#449339] transition-colors shadow-sm">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full outline-none text-[14px] md:text-[15px] text-gray-900 placeholder:text-gray-400 bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer shrink-0"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end w-full mt-[-8px]">
              <Link href="/auth/individual/forgot-password" className="text-[13px] md:text-sm font-bold text-[#1b5030] hover:text-[#449339] transition-colors underline decoration-[#1b5030]/30 underline-offset-4">
                Forgot Password?
              </Link>
            </div>

            {/* Dynamic Submit Button */}
            <div className="mt-4 w-full">
              <button
                disabled={!isFormValid}
                className={`w-full py-4 md:py-4 rounded-full font-semibold text-[16px] md:text-[17px] transition-all duration-300 ${
                  isFormValid
                    ? 'bg-[#549B45] text-white shadow-lg shadow-green-900/20 hover:bg-[#458237] hover:-translate-y-0.5 cursor-pointer'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Login
              </button>
            </div>

            {/* Social Logins Divider */}
            <div className="w-full mt-6 mb-2 flex items-center">
              <div className="flex-grow h-px bg-gray-200"></div>
              <span className="px-4 text-[12px] md:text-sm text-gray-500 font-medium whitespace-nowrap">Or continue with</span>
              <div className="flex-grow h-px bg-gray-200"></div>
            </div>

            {/* Social Buttons */}
            <div className="w-full grid grid-cols-2 gap-4 mb-4">
              <button type="button" className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-full hover:bg-gray-50 hover:shadow-sm transition-all cursor-pointer bg-white">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="text-[14px] md:text-[15px] font-medium text-gray-700">Google</span>
              </button>

              <button type="button" className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-full hover:bg-gray-50 hover:shadow-sm transition-all cursor-pointer bg-white">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05 1.8-3.08 1.8-1.09 0-1.44-.65-2.73-.65-1.25 0-1.68.61-2.68.61-1.09 0-2.26-.95-3.26-2.04C3.12 17.51 1.7 13.9 3.12 11.02c.68-1.39 2.05-2.3 3.52-2.34 1.13-.04 2.21.78 2.87.78.68 0 1.96-.95 3.31-.83 1.41.04 2.68.65 3.41 1.74-2.95 1.7-2.45 6.09.43 7.22-.63 1.57-1.57 3.04-2.61 4.27v.04zm-1.87-14.73c.61-.78 1.04-1.91.87-3.04-1.04.04-2.17.65-2.87 1.48-.56.65-1.04 1.83-.87 2.91 1.13.09 2.26-.52 2.87-1.35z"/>
                </svg>
                <span className="text-[14px] md:text-[15px] font-medium text-gray-700">Apple</span>
              </button>
            </div>

            {/* Footer Link */}
            <div className="text-center w-full mt-2">
              <p className="text-[13px] md:text-[14px] text-gray-800 font-medium">
                Don't have an account? <Link href="/auth/individual/sign-up" className="font-bold text-[#1b5030] hover:text-[#449339] transition-colors hover:underline underline-offset-2">Sign Up</Link>
              </p>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}
