"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Globe, Eye, EyeOff, AlertCircle
} from 'lucide-react';
import { authApi, isApiError } from '@/lib/api';
import { setToken, setUser } from '@/lib/auth';

export default function SignInPage() {
  const router = useRouter();

  // Form State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // UI State
  const [showPassword, setShowPassword] = useState(false);

  // Validation State
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unverifiedEmail, setUnverifiedEmail] = useState('');

  // Validation Effect
  useEffect(() => {
    const isValid = identifier.trim().length >= 5 && password.length >= 6;
    setIsFormValid(isValid);
  }, [identifier, password]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || loading) return;

    setLoading(true);
    setError('');
    setUnverifiedEmail('');

    try {
      const result = await authApi.login(identifier, password);
      if (result.token) {
        if (result.user.role === 'recycler') {
          setError('This account is registered as a Recycler. Please use the Recycler login portal.');
          return;
        }
        setToken(result.token);
        if (result.user) setUser(result.user);
        // Redirect based on user role
        if (result.user.role === 'recycler') {
          router.push('/dashboard/recyclers');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (err) {
      // Unverified email → backend returns 403 with code "email_not_verified"
      // and data { email, role }. Send them to finish verifying instead of erroring.
      if (isApiError(err) && err.code === 'email_not_verified') {
        const data = err.data as { email?: string } | undefined;
        const targetEmail = data?.email || identifier;
        router.push(`/auth/individual/verify-email?email=${encodeURIComponent(targetEmail)}&mode=verify`);
        return;
      }

      const message = err instanceof Error ? err.message : 'Login failed';
      if (err instanceof ApiError && err.code === 'email_not_verified') {
        const data = err.data as { email?: string; role?: string } | undefined;
        setUnverifiedEmail(data?.email || identifier.trim());
        setError('Please verify your email before signing in.');
        return;
      }

      if (message.toLowerCase().includes('invalid email')) {
        setError('Invalid email');
      } else if (message.toLowerCase().includes('phone')) {
        setError('Phone number does not exist');
      } else {
        setError(message || 'Invalid email or password');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!unverifiedEmail) return;
    setLoading(true);
    setError('');
    try {
      await otpApi.send('email', unverifiedEmail, 'email-verification');
      router.push(`/auth/individual/verify-email?email=${encodeURIComponent(unverifiedEmail)}&purpose=signup`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend verification code.');
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
      <header className="relative z-20 w-full flex justify-between items-center px-6 md:px-12 lg:px-24 pt-6 pb-4">
        <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-full">
          <Image
            src="/images/logo.png"
            alt="EcoSmart AI"
            width={130}
            height={38}
            className="h-8 w-auto md:h-9 object-contain"
          />
        </div>

        <button className="flex items-center gap-1.5 border border-gray-200 rounded-full px-4 py-2 bg-white/80 backdrop-blur-sm hover:bg-white transition-colors cursor-pointer shadow-sm">
          <Globe className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-600">English</span>
        </button>
      </header>

      {/* Main Content Area */}
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
              <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-[#449339] flex items-center justify-center">
                <svg className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
              </div>
              <span className="text-[13px] md:text-sm font-medium text-[#1b5030]">
                Signing in as an Individual
              </span>
              <Link
                href="/auth/recycler/sign-in"
                className="text-[13px] md:text-sm font-medium text-gray-500 hover:text-gray-800 ml-2 transition-colors underline-offset-2 hover:underline"
              >
                Change
              </Link>
            </div>
          </div>

          <form className="w-full flex flex-col gap-5 md:gap-6" onSubmit={handleLogin}>

            {/* Error Banner */}
            {error && (
              <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <div className="flex-1">
                  <p className="text-[13px] md:text-sm text-red-600 font-medium">{error}</p>
                  {unverifiedEmail && (
                    <button type="button" onClick={handleResendVerification} className="mt-2 text-[13px] font-bold text-[#1b5030] hover:underline">
                      Send verification code
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Email or Phone Number */}
            <div className="w-full">
              <label className="block text-[13px] md:text-sm font-medium text-gray-800 mb-1.5 md:mb-2">Email or Phone Number</label>
              <div className={`relative flex items-center border rounded-2xl px-4 py-3.5 md:py-4 bg-white transition-colors shadow-sm ${error ? 'border-red-400' : 'border-gray-200 focus-within:border-[#449339]'}`}>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => { setIdentifier(e.target.value); setError(''); }}
                  name="identifier" placeholder="Enter your email or phone number"
                  className="w-full outline-none text-[14px] md:text-[15px] text-gray-900 placeholder:text-gray-400 bg-transparent"
                />
              </div>
            </div>

            {/* Password */}
            <div className="w-full">
              <label className="block text-[13px] md:text-sm font-medium text-gray-800 mb-1.5 md:mb-2">Password</label>
              <div className={`relative flex items-center border rounded-2xl px-4 py-3.5 md:py-4 bg-white transition-colors shadow-sm ${error ? 'border-red-400' : 'border-gray-200 focus-within:border-[#449339]'}`}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  name="password" placeholder="Enter your password"
                  className="w-full outline-none text-[14px] md:text-[15px] text-gray-900 placeholder:text-gray-400 bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  title={showPassword ? "Hide password" : "Show password"}
                  className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer shrink-0"
                >
                  {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
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
                disabled={!isFormValid || loading}
                className={`w-full py-4 md:py-4 rounded-full font-semibold text-[16px] md:text-[17px] transition-all duration-300 ${
                  isFormValid && !loading
                    ? 'bg-[#549B45] text-white shadow-lg shadow-green-900/20 hover:bg-[#458237] hover:-translate-y-0.5 cursor-pointer'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {loading ? 'Signing in...' : 'Login'}
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
