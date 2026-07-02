'use client';

import Link from 'next/link';
import { Leaf } from 'lucide-react';

export function Header() {
  return (
    <header className="relative z-20 w-full max-w-7xl mx-auto flex justify-between items-center px-6 md:px-12 pt-6 pb-4">
      <Link href="/" className="flex items-center gap-1.5 cursor-pointer">
        <div className="bg-green-50 p-1.5 rounded-full">
          <Leaf className="w-5 h-5 md:w-6 md:h-6 text-[#449339]" />
        </div>
        <div className="text-[18px] md:text-xl tracking-tight">
          <span className="font-bold text-[#449339]">EcoSmart</span>
          <span className="font-bold text-gray-900 ml-0.5">AI</span>
        </div>
      </Link>
      <Link href="/account-selection" className="text-sm md:text-base font-bold text-[#1b5030] hover:text-[#449339] transition-colors">
        Sign In
      </Link>
    </header>
  );
}
