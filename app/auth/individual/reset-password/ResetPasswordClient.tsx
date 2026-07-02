"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Globe, ArrowLeft, Lock, Eye, EyeOff, CheckCircle2, Circle } from 'lucide-react';
import { authApi } from '@/lib/api';
import { Toast, useToast } from '@/components/ui/Toast';

function SetNewPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { toast, showToast, hideToast } = useToast();

  // Form State
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation States
  const [hasLength, setHasLength] = useState(false);
  const [hasUpper, setHasUpper] = useState(false);
  const [hasNumberOrSpecial, setHasNumberOrSpecial] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  // Overall form validity
  const [isFormValid, setIsFormValid] = useState(false);

  // Loading / Success
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Real-time Validation Effect
  useEffect(() => {
    const lengthValid = password.length >= 8;
    setHasLength(lengthValid);

    const upperValid = /[A-Z]/.test(password);
    setHasUpper(upperValid);

    const numOrSpecialValid = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password);
    setHasNumberOrSpecial(numOrSpecialValid);

    const matchValid = password === confirmPassword && password.length > 0;
    setPasswordsMatch(matchValid);

    setIsFormValid(lengthValid && upperValid && numOrSpecialValid && matchValid);
  }, [password, confirmPassword]);

  // Password Strength Score (0 to 4)
  const getStrengthScore = () => {
    if (password.length === 0) return 0;
    let score = 1;
    if (hasLength) score += 1;
    if (hasUpper) score += 1;
    if (hasNumberOrSpecial) score += 1;
    return score;
  };

  const score = getStrengthScore();

  const getStrengthDisplay = () => {
    switch (score) {
      case 1: return { text: 'Weak', color: 'bg-red-500', textColor: 'text-red-500' };
      case 2: return { text: 'Fair', color: 'bg-orange-400', textColor: 'text-orange-500' };
      case 3: return { text: 'Strong', color: 'bg-[#85c977]', textColor: 'text-[#85c977]' };
      case 4: return { text: 'Strong', color: 'bg-[#549B45]', textColor: 'text-[#549B45]' };
      default: return { text: '', color: 'bg-gray-200', textColor: 'text-gray-400' };
    }
  };

  const strength = getStrengthDisplay();

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      showToast('Missing reset token. Please request a new password reset.', 'error');
      return;
    }

    if (!isFormValid) return;

    setLoading(true);

    try {
      await authApi.resetPassword(token, password);
      setShowSuccess(true);
      // Redirect to sign-in after video plays
      setTimeout(() => {
        router.push('/auth/individual/sign-in');
      }, 4000);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Something went wrong.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  // No token state
  if (!token) {
    return (
      <div className="min-h-screen bg-white font-sans flex flex-col relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-48 md:h-64 lg:h-72 bg-[#f6fcf4] z-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 w-full h-12 md:h-20 lg:h-24 block" fill="#ffffff">
            <path d="M0,120 L1200,120 L1200,0 Q600,140 0,0 Z" />
          </svg>
        </div>
        <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-6">
          <div className="bg-red-50 rounded-2xl px-6 py-4 text-red-600 font-medium text-center max-w-md">
            Missing reset token. Please request a new password reset.
          </div>
          <Link href="/auth/individual/forgot-password" className="mt-6 bg-[#549B45] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#458237] transition-all">
            Request Reset Link
          </Link>
        </main>
      </div>
    );
  }

  // Success screen with video
  if (showSuccess) {
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

        <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-md mx-auto rounded-[2rem] overflow-hidden shadow-[0_20px_60px_-12px_rgba(0,0,0,0.2)] border border-gray-100">
            <video
              src="/videos/Password%20Reset%20Successful.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto"
            />
          </div>
          <p className="mt-6 text-center text-gray-500 font-medium">
            Redirecting to sign in...
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col relative overflow-hidden">

      {/* Toast */}
      {toast && <Toast key={toast.key} message={toast.message} type={toast.type} onClose={hideToast} />}

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

      {/* Header */}
      <header className="relative z-20 w-full flex justify-between items-center px-6 md:px-12 lg:px-24 pt-6 pb-4">

        {/* Back Button */}
        <Link href="/auth/individual/sign-in" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium text-sm md:text-base z-10">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Sign In</span>
        </Link>

        {/* Language Selector */}
        <button className="flex items-center gap-1.5 border border-gray-200 rounded-full px-4 py-2 bg-white/80 backdrop-blur-sm hover:bg-white transition-colors cursor-pointer shadow-sm">
          <Globe className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-600">English</span>
        </button>

      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow w-full max-w-4xl mx-auto px-6 md:px-12 lg:px-16 pt-6 md:pt-12 pb-20 flex flex-col items-center">

        {/* Icon */}
        <div className="w-16 h-16 md:w-20 md:h-20 bg-[#eaf4e7] rounded-full flex items-center justify-center mb-6 md:mb-8">
          <Lock className="w-7 h-7 md:w-8 md:h-8 text-[#549B45]" strokeWidth={2} />
        </div>

        {/* Title Section */}
        <div className="text-center mb-8 md:mb-10 w-full">
          <h1 className="text-[28px] md:text-3xl lg:text-4xl leading-tight font-bold text-[#1b5030] mb-2 md:mb-3">
            Set New Password
          </h1>
          <p className="text-[14px] md:text-base text-gray-500 font-medium px-4">
            Create a strong password for your account
          </p>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-[480px]">
          <form
            className="w-full bg-[#fcfdfc] md:bg-gray-50/40 md:border md:border-gray-100 rounded-3xl p-6 md:p-8 shadow-[0_2px_20px_rgb(0,0,0,0.02)]"
            onSubmit={handleSubmit}
          >

            {/* Password Input */}
            <div className="w-full mb-2">
              <label className="block text-[13px] md:text-sm font-medium text-gray-800 mb-2">
                Password
              </label>
              <div className="relative flex items-center border border-gray-200 rounded-2xl px-4 py-3.5 bg-white focus-within:border-[#549B45] transition-colors shadow-sm">
                <Lock className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
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

            {/* Password Strength Indicator */}
            <div className="w-full mb-6">
              <div className="flex gap-1.5 mb-1.5 h-1.5 md:h-2">
                {[1, 2, 3, 4].map((bar) => (
                  <div
                    key={bar}
                    className={`flex-1 rounded-full transition-colors duration-300 ${
                      score >= bar ? strength.color : 'bg-gray-200'
                    }`}
                  ></div>
                ))}
              </div>
              <p className={`text-[12px] md:text-[13px] font-medium transition-colors ${strength.textColor}`}>
                {strength.text}
              </p>
            </div>

            {/* Confirm Password Input */}
            <div className="w-full mb-8">
              <label className="block text-[13px] md:text-sm font-medium text-gray-800 mb-2">
                Confirm Password
              </label>
              <div className={`relative flex items-center border rounded-2xl px-4 py-3.5 bg-white transition-colors shadow-sm ${
                confirmPassword.length > 0 && !passwordsMatch
                  ? 'border-red-300 focus-within:border-red-500'
                  : 'border-gray-200 focus-within:border-[#549B45]'
              }`}>
                <Lock className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full outline-none text-[14px] md:text-[15px] text-gray-900 placeholder:text-gray-400 bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer shrink-0"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Validation Criteria Box */}
            <div className="w-full bg-[#eaf4e7] rounded-2xl p-5 mb-8 flex flex-col gap-3">

              {/* Rule 1 */}
              <div className="flex items-center gap-3">
                {hasLength ? (
                  <CheckCircle2 className="w-5 h-5 text-white fill-[#549B45] shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-[#549B45]/40 shrink-0" strokeWidth={2} />
                )}
                <span className={`text-[13px] md:text-[14px] font-medium transition-colors ${hasLength ? 'text-[#1b5030]' : 'text-[#1b5030]/60'}`}>
                  At least 8 characters
                </span>
              </div>

              {/* Rule 2 */}
              <div className="flex items-center gap-3">
                {hasUpper ? (
                  <CheckCircle2 className="w-5 h-5 text-white fill-[#549B45] shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-[#549B45]/40 shrink-0" strokeWidth={2} />
                )}
                <span className={`text-[13px] md:text-[14px] font-medium transition-colors ${hasUpper ? 'text-[#1b5030]' : 'text-[#1b5030]/60'}`}>
                  One uppercase letter
                </span>
              </div>

              {/* Rule 3 */}
              <div className="flex items-center gap-3">
                {hasNumberOrSpecial ? (
                  <CheckCircle2 className="w-5 h-5 text-white fill-[#549B45] shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-[#549B45]/40 shrink-0" strokeWidth={2} />
                )}
                <span className={`text-[13px] md:text-[14px] font-medium transition-colors ${hasNumberOrSpecial ? 'text-[#1b5030]' : 'text-[#1b5030]/60'}`}>
                  One number or special character
                </span>
              </div>

            </div>

            {/*Submit Button */}
            <div className="w-full">
              <button
                type="submit"
                disabled={!isFormValid || loading}
                className={`w-full py-4 rounded-full font-semibold text-[15px] md:text-[16px] transition-all duration-300 ${
                  isFormValid && !loading
                    ? 'bg-[#549B45] text-white shadow-lg shadow-green-900/20 hover:bg-[#458237] hover:-translate-y-0.5 cursor-pointer'
                    : 'bg-[#e5e7eb] text-[#9ca3af] cursor-not-allowed'
                }`}
              >
                {loading ? 'Resetting...' : 'Set Password'}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}

export default function SetNewPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 font-medium">Loading...</div>
      </div>
    }>
      <SetNewPasswordContent />
    </Suspense>
  );
}
