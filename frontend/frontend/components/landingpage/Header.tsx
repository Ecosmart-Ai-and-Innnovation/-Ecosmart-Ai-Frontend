'use client';

import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  return (
    <header className="relative z-20 w-full bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-12 py-3.5 md:py-4">
        <Link href="/" className="flex items-center gap-1.5 cursor-pointer">
          <Image
            src="/images/logo.png"
            alt="EcoSmart AI"
            width={130}
            height={38}
            className="h-8 w-auto md:h-9 object-contain"
          />
        </Link>
        {/* The link below now tells the selection page to route to Login */}
        <Link href="/account-selection?mode=login" className="text-sm md:text-base font-bold text-[#1b5030] hover:text-[#449339] transition-colors">
          Sign In
        </Link>
      </div>
    </header>
  );
}
