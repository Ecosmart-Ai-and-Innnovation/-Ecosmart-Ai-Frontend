"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Globe, User, Mail, Lock, Eye, EyeOff,
  AlertCircle, Check, CheckCircle2
} from 'lucide-react';
import { authApi } from '@/lib/api';
import { setToken, setUser } from '@/lib/auth';

export default function IndividualSignUpPage() {
  const router = useRouter();
  const isIndividual = true;

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Touched State
  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);

  // Validation State
  const [isNameValid, setIsNameValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isConfirmValid, setIsConfirmValid] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // Validation Effects
  useEffect(() => {
    const nameValid = name.trim().length >= 3;
    setIsNameValid(nameValid);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailValid = emailRegex.test(email);
    setIsEmailValid(emailValid);

    const phoneRegex = /^\d{10}$/;
    const cleanPhone = phone.replace(/\s/g, '');
    setIsPhoneValid(phoneRegex.test(cleanPhone));

    const passValid = password.length >= 6;
    setIsPasswordValid(passValid);

    const confirmMatch = password === confirmPassword && confirmPassword.length > 0;
    setIsConfirmValid(confirmMatch);

    setIsFormValid(nameValid && emailValid && phoneRegex.test(cleanPhone) && passValid && confirmMatch && agreed);
  }, [name, email, phone, password, confirmPassword, agreed]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    try {
      const result = await authApi.register(name, email, password);
      if (result.token) {
        setToken(result.token);
        if (result.user) setUser(result.user);
      }
    } catch {}
    router.push('/dashboard');
  };

  // Determine which error to show (first invalid touched field)
  const getFieldError = () => {
    if (nameTouched && !isNameValid) return { field: 'name', message: 'Name is required' };
    if (emailTouched && !isEmailValid) return { field: 'email', message: email.length > 0 ? 'Invalid email' : 'Email is required' };
    if (phoneTouched && !isPhoneValid) return { field: 'phone', message: phone.length > 0 ? 'Enter a valid 10-digit number' : 'Phone is required' };
    if (passwordTouched && !isPasswordValid) return { field: 'password', message: 'Password must be at least 6 characters' };
    if (confirmTouched && !isConfirmValid) return { field: 'confirm', message: password.length === 0 ? 'Confirm your password' : 'Passwords do not match' };
    return null;
  };

  const fieldError = getFieldError();

  const getFieldClass = (field: string, isValid: boolean) => {
    if (fieldError?.field === field) return 'border-red-400 focus-within:border-red-500';
    if (isValid) return 'border-gray-200 focus-within:border-[#449339]';
    return 'border-gray-200 focus-within:border-[#449339]';
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col relative overflow-hidden">

      {/* Edge-to-Edge Decorative Top Wave */}
      <div className="absolute top-0 left-0 w-full h-56 md:h-72 lg:h-80 bg-[#f6fcf4] z-0">
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
      <header className="relative z-20 w-full flex justify-end px-6 md:px-12 lg:px-24 pt-6 pb-4">
        <button className="flex items-center gap-1.5 border border-gray-200 rounded-full px-4 py-2 bg-white/80 backdrop-blur-sm hover:bg-white transition-colors cursor-pointer shadow-sm">
          <Globe className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-600">English</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow w-full max-w-5xl mx-auto px-6 md:px-12 lg:px-20 pt-4 md:pt-12 pb-20 flex flex-col items-center">

        {/* Title Section */}
        <div className="text-center mb-8 md:mb-12 w-full max-w-2xl">
          <h1 className="text-[28px] md:text-4xl lg:text-5xl leading-tight font-bold text-[#1b5030] mb-3 md:mb-5 transition-all">
            Create Your Individual Account.
          </h1>
          <p className="text-[13px] md:text-base text-gray-500 font-medium leading-relaxed px-4">
            Start identifying waste, earning rewards, and helping the environment.
          </p>
        </div>

        {/* Form Container */}
        <div className="w-full bg-white md:bg-gray-50/30 md:border md:border-gray-100 md:shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] md:p-10 lg:p-12">

          {/* Status Badge */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2 bg-[#eaf4e7] rounded-full px-4 py-1.5 md:py-2 md:px-5 transition-all">
              <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-[#449339]" />
              <span className="text-[13px] md:text-sm font-medium text-[#449339]">
                Signing up as an Individual
              </span>
              <Link
                href="/auth/recycler/sign-up"
                className="text-[13px] md:text-sm font-medium text-gray-500 hover:text-gray-800 ml-2 transition-colors underline-offset-2 hover:underline"
              >
                Change
              </Link>
            </div>
          </div>

          <form className="w-full" onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">

              {/* Full Name */}
              <div>
                <label className="block text-[13px] md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">Full Name</label>
                <div className={`relative flex items-center border rounded-2xl px-3 py-3 md:py-3.5 bg-white transition-colors ${fieldError?.field === 'name' ? 'border-red-400' : isNameValid && nameTouched ? 'border-green-500' : 'border-gray-200 focus-within:border-[#449339]'}`}>
                  <User className={`w-5 h-5 mr-3 ${fieldError?.field === 'name' ? 'text-red-400' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => setNameTouched(true)}
                    placeholder="Maryam Abdulkarim"
                    className="w-full outline-none text-[14px] md:text-[15px] text-gray-900 placeholder:text-gray-400 bg-transparent"
                  />
                  {isNameValid && nameTouched && <Check className="w-5 h-5 text-[#449339] ml-2 shrink-0" />}
                </div>
                {fieldError?.field === 'name' && (
                  <p className="text-[11px] md:text-[12px] text-red-500 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {fieldError.message}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-[13px] md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">Email Address</label>
                <div className={`relative flex items-center border rounded-2xl px-3 py-3 md:py-3.5 bg-white transition-colors ${fieldError?.field === 'email' ? 'border-red-400' : isEmailValid && emailTouched ? 'border-green-500' : 'border-gray-200 focus-within:border-[#449339]'}`}>
                  <Mail className={`w-5 h-5 mr-3 ${fieldError?.field === 'email' ? 'text-red-400' : 'text-gray-400'}`} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setEmailTouched(true)}
                    placeholder="mh@gmail.com"
                    className="w-full outline-none text-[14px] md:text-[15px] text-gray-900 placeholder:text-gray-400 bg-transparent"
                  />
                  {isEmailValid && emailTouched && <Check className="w-5 h-5 text-[#449339] ml-2 shrink-0" />}
                </div>
                {fieldError?.field === 'email' && (
                  <p className="text-[11px] md:text-[12px] text-red-500 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {fieldError.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-[13px] md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">Password</label>
                <div className={`relative flex items-center border rounded-2xl px-3 py-3 md:py-3.5 bg-white transition-colors ${fieldError?.field === 'password' ? 'border-red-400' : isPasswordValid && passwordTouched ? 'border-green-500' : 'border-gray-200 focus-within:border-[#449339]'}`}>
                  <Lock className={`w-5 h-5 mr-3 ${fieldError?.field === 'password' ? 'text-red-400' : 'text-gray-400'}`} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setPasswordTouched(true)}
                    placeholder="Create a password"
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
                {fieldError?.field === 'password' && (
                  <p className="text-[11px] md:text-[12px] text-red-500 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {fieldError.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-[13px] md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">Confirm Password</label>
                <div className={`relative flex items-center border rounded-2xl px-3 py-3 md:py-3.5 bg-white transition-colors ${fieldError?.field === 'confirm' ? 'border-red-400' : isConfirmValid && confirmTouched ? 'border-green-500' : 'border-gray-200 focus-within:border-[#449339]'}`}>
                  <Lock className={`w-5 h-5 mr-3 ${fieldError?.field === 'confirm' ? 'text-red-400' : 'text-gray-400'}`} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={() => setConfirmTouched(true)}
                    placeholder="Confirm your password"
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
                {fieldError?.field === 'confirm' && (
                  <p className="text-[11px] md:text-[12px] text-red-500 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {fieldError.message}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="md:col-span-2 md:max-w-xl md:mx-auto w-full">
                <label className="block text-[13px] md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">Phone Number</label>
                <div className={`relative flex items-center border rounded-2xl bg-white overflow-hidden transition-colors ${fieldError?.field === 'phone' ? 'border-red-400' : isPhoneValid && phoneTouched ? 'border-green-500' : 'border-gray-200 focus-within:border-[#449339]'}`}>
                  <div className="flex items-center gap-2 px-3 py-3 md:py-3.5 bg-white border-r border-gray-200 shrink-0">
                    <div className="w-5 h-3.5 bg-green-600 rounded-[2px] relative overflow-hidden flex">
                      <div className="w-1/3 h-full bg-green-600"></div>
                      <div className="w-1/3 h-full bg-white"></div>
                      <div className="w-1/3 h-full bg-green-600"></div>
                    </div>
                    <span className="text-[14px] md:text-[15px] font-medium text-gray-700">+234</span>
                  </div>

                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setPhoneTouched(true);
                    }}
                    placeholder="901 234 5678"
                    className="w-full px-3 py-3 md:py-3.5 outline-none text-[14px] md:text-[15px] text-gray-900 bg-transparent"
                  />
                  {isPhoneValid && phoneTouched && <Check className="w-5 h-5 text-[#449339] mr-3 shrink-0" />}
                  {fieldError?.field === 'phone' && <AlertCircle className="w-5 h-5 text-red-500 mr-3 shrink-0" />}
                </div>
                {fieldError?.field === 'phone' && (
                  <p className="text-[11px] md:text-[12px] text-red-500 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {fieldError.message}
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Section */}
            <div className="mt-8 md:mt-10 max-w-xl mx-auto w-full flex flex-col items-center">

              {/* Terms Checkbox */}
              <div className="flex items-start md:items-center justify-center gap-3 mb-6 w-full">
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center cursor-pointer mt-0.5 md:mt-0 shrink-0 transition-colors ${agreed ? 'bg-[#449339] border-[#449339]' : 'border-gray-300'}`}
                  onClick={() => setAgreed(!agreed)}
                >
                  {agreed && <Check className="w-3 h-3 text-white" />}
                </div>
                <p className="text-[13px] md:text-sm text-gray-700 leading-snug">
                  I agree to the <a href="#" className="font-semibold text-[#1b5030] hover:text-[#449339] transition-colors underline decoration-[#1b5030]/30 underline-offset-2">Terms & Conditions</a> and <a href="#" className="font-semibold text-[#1b5030] hover:text-[#449339] transition-colors underline decoration-[#1b5030]/30 underline-offset-2">Privacy Policy</a>
                </p>
              </div>

              {/* Submit Button */}
              <button
                disabled={!isFormValid}
                className={`w-full py-4 rounded-3xl font-semibold text-[15px] md:text-base transition-all duration-300 ${
                  isFormValid
                    ? 'bg-[#449339] text-white shadow-lg shadow-green-900/20 hover:bg-[#3a7d31] hover:-translate-y-0.5 cursor-pointer'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Create Account
              </button>

              {/* Social Logins Divider */}
              <div className="w-full mt-8 mb-6 flex items-center">
                <div className="flex-grow h-px bg-gray-200"></div>
                <span className="px-4 text-[12px] md:text-sm text-gray-400 font-medium whitespace-nowrap">Or continue with</span>
                <div className="flex-grow h-px bg-gray-200"></div>
              </div>

              {/* Social Buttons */}
              <div className="w-full grid grid-cols-2 gap-4 mb-8">
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
              <div className="text-center w-full">
                <p className="text-[13px] md:text-sm text-gray-600">
                  Already have an account? <Link href="/auth/individual/sign-in" className="font-bold text-[#1b5030] hover:text-[#449339] transition-colors hover:underline underline-offset-2">Sign in</Link>
                </p>
              </div>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}
