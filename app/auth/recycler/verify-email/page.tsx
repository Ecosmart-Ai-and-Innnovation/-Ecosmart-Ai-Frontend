"use client";

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Check, Leaf } from 'lucide-react';
import { otpApi } from '@/lib/api';
import { Toast, useToast } from '@/components/ui/Toast';

function EmailVerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const { toast, showToast, hideToast } = useToast();

  // OTP State
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer State
  const [timeLeft, setTimeLeft] = useState(57);

  // Validation State
  const [isValid, setIsValid] = useState(false);

  // Loading State
  const [loading, setLoading] = useState(false);

  // Timer Effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  // Validation Effect
  useEffect(() => {
    const allFilled = otp.every((digit) => digit.length === 1);
    setIsValid(allFilled);
  }, [otp]);

  // Handle OTP Input Change
  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '' && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Backspace for Auto-focus previous
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle Verify
  const handleVerify = async () => {
    if (!isValid || !email) return;
    setLoading(true);

    try {
      const otpCode = otp.join('');
      const result = await otpApi.verify('email', email, otpCode);
      if (result.verified) {
        showToast('Verified successfully', 'success');
        // Brief delay to show the toast before navigating
        setTimeout(() => {
          if (result.resetToken) {
            router.push(`/auth/recycler/reset-password?token=${result.resetToken}`);
          } else {
            router.push(`/auth/recycler/reset-password?email=${encodeURIComponent(email)}`);
          }
        }, 1500);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      if (message.toLowerCase().includes('expired')) {
        showToast('Expired code', 'warning');
      } else {
        showToast('Wrong OTP', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Resend
  const handleResend = async () => {
    setTimeLeft(57);
    try {
      await otpApi.send('email', email);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to resend OTP', 'error');
    }
  };

  // Mask email for display
  const maskEmail = (emailStr: string) => {
    if (!emailStr.includes('@')) return emailStr;
    const [local, domain] = emailStr.split('@');
    if (local.length <= 2) return local[0] + '*'.repeat(local.length - 1) + '@' + domain;
    return local[0] + '*'.repeat(Math.min(local.length - 2, 4)) + local.slice(-1) + '@' + domain;
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col relative">

      {/* Toast */}
      {toast && <Toast key={toast.key} message={toast.message} type={toast.type} onClose={hideToast} />}

      {/* Header - Full Width Spread */}
      <header className="w-full flex justify-between items-center px-6 md:px-12 lg:px-24 pt-8 pb-4">
        <Link href="/auth/recycler/forgot-password" className="flex items-center gap-1 text-[#1b5030] hover:text-[#549B45] transition-colors font-medium text-[15px] cursor-pointer">
          <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
          <span>Back</span>
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-4xl mx-auto px-6 md:px-12 lg:px-16 pt-6 md:pt-12 pb-16 flex flex-col items-center">

        {/* Logo */}
        <div className="flex items-center gap-1.5 mb-8 md:mb-10">
          <div className="bg-green-50 p-1 rounded-full">
            <Leaf className="w-5 h-5 text-[#449339]" />
          </div>
          <div className="text-[17px] tracking-tight">
            <span className="font-bold text-[#449339]">EcoSmart</span>
            <span className="font-bold text-gray-900 ml-0.5">AI</span>
          </div>
        </div>

        {/* Success Check Icon */}
        <div className="w-16 h-16 md:w-20 md:h-20 bg-[#eaf4e7] rounded-full flex items-center justify-center mb-6 md:mb-8">
          <Check className="w-8 h-8 md:w-10 md:h-10 text-[#549B45]" strokeWidth={2.5} />
        </div>

        {/* Title Section */}
        <div className="text-center mb-8 md:mb-10 w-full">
          <h1 className="text-[26px] md:text-3xl lg:text-4xl leading-tight font-bold text-[#111827] mb-4">
            Check Your Email
          </h1>
          <p className="text-[14px] md:text-base text-gray-500 font-medium leading-relaxed">
            Enter the code sent to<br />
            <span className="text-gray-900 font-bold tracking-wider">{maskEmail(email)}</span><br />
            <span className="inline-block mt-2">Enter the code below to continue.</span>
          </p>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-[440px] flex flex-col items-center">

          {/* OTP Input Boxes */}
          <div className="flex justify-between w-full gap-2 md:gap-3 mb-8 md:mb-10">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 md:w-16 md:h-20 bg-[#f1f7ef] rounded-xl text-center text-2xl md:text-3xl font-bold text-[#1b5030] outline-none focus:ring-2 focus:ring-[#549B45] transition-all"
              />
            ))}
          </div>

          {/* Dynamic Submit Button */}
          <button
            onClick={handleVerify}
            disabled={!isValid || loading}
            className={`w-full py-4 rounded-full font-semibold text-[15px] md:text-[16px] transition-all duration-300 ${
              isValid && !loading
                ? 'bg-[#549B45] text-white shadow-lg shadow-green-900/20 hover:bg-[#458237] hover:-translate-y-0.5 cursor-pointer'
                : 'bg-[#e5e7eb] text-[#9ca3af] cursor-not-allowed'
            }`}
          >
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>

          {/* Resend Timer */}
          <div className="mt-8 text-center">
            <p className="text-[14px] md:text-[15px] text-gray-800 font-medium">
              Didn't receive the code?{' '}
              {timeLeft > 0 ? (
                <span className="text-gray-500">
                  Resend available in <span className="text-[#1b5030] font-bold">{timeLeft}s</span>
                </span>
              ) : (
                <button onClick={handleResend} className="text-[#549B45] font-bold hover:underline underline-offset-2 cursor-pointer">
                  Resend Now
                </button>
              )}
            </p>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#f1f7ef] py-8 md:py-10 mt-auto">
        <div className="text-center">
          <p className="text-[14px] md:text-[15px] text-gray-600 font-medium">
            Remember password? <Link href="/auth/recycler/sign-in" className="font-bold text-[#1b5030] hover:text-[#549B45] transition-colors hover:underline underline-offset-2">Login</Link>
          </p>
        </div>
      </footer>

    </div>
  );
}

export default function EmailVerificationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 font-medium">Loading...</div>
      </div>
    }>
      <EmailVerificationContent />
    </Suspense>
  );
}
