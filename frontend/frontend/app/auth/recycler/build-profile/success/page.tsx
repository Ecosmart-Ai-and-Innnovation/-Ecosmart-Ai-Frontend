"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';

export default function ProfileSuccessModal() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showChecklist, setShowChecklist] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const progressTimer = setTimeout(() => {
      setProgress(100);
    }, 400);

    const checklistTimer = setTimeout(() => {
      setShowChecklist(true);
    }, 800);

    return () => {
      clearTimeout(progressTimer);
      clearTimeout(checklistTimer);
    };
  }, []);

  const checklistItems = [
    "Basic Information",
    "Service Area",
    "Materials Accepted",
    "Pricing"
  ];

  return (
    <div className="min-h-screen bg-[#f4f7f4] flex items-center justify-center p-4 font-sans selection:bg-green-100">

      <div
        className={`w-full max-w-[420px] bg-[#fcfdfc] rounded-[2rem] p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] transform transition-all duration-700 ease-out ${
          isMounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >

        <div className="flex flex-col items-center text-center">
          <div
            className={`w-20 h-20 bg-[#eaf4e7] rounded-full flex items-center justify-center transform transition-transform duration-700 delay-300 ${
              isMounted ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
            }`}
          >
            <Check className="w-10 h-10 text-[#549B45]" strokeWidth={3} />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mt-6 mb-2">
            Profile Ready! 🎉
          </h1>
          <p className="text-[14.5px] text-gray-500 font-medium leading-relaxed max-w-[280px]">
            Your recycler profile is live. Users in your area can now find you.
          </p>
        </div>

        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 mt-8 mb-8">

          <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-[15px] text-gray-900">Profile Complete</span>
            <span className="font-bold text-[15px] text-[#549B45]">{progress}%</span>
          </div>

          <div className="w-full h-2.5 bg-gray-100 rounded-full mb-6 overflow-hidden">
            <div
              className="h-full bg-[#549B45] rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex flex-col gap-3.5">
            {checklistItems.map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 transform transition-all duration-500 ease-out ${
                  showChecklist
                    ? 'translate-x-0 opacity-100'
                    : '-translate-x-4 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="w-5 h-5 bg-[#eaf4e7] rounded-full flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-[#549B45]" strokeWidth={3} />
                </div>
                <span className="text-[14px] text-gray-600 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => router.push('/dashboard/recycler')}
            className="w-full py-4 bg-[#549B45] hover:bg-[#458237] text-white rounded-full font-bold text-[15px] shadow-lg shadow-green-900/10 transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            Go to Dashboard
          </button>

          <button
            type="button"
            className="w-full py-4 bg-transparent border-[1.5px] border-[#1b5030] text-[#1b5030] hover:bg-[#1b5030] hover:text-white rounded-full font-bold text-[15px] transition-all cursor-pointer"
          >
            Preview My Profile
          </button>
        </div>

      </div>
    </div>
  );
}
