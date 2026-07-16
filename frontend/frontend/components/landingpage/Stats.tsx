'use client';

import { useEffect, useRef, useState } from 'react';

function AnimatedStat({ target, suffix, label, prefix }: { target: number; suffix?: string; label: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    let start = 0;
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16);
    let animationId: number;

    const animate = () => {
      start += increment;
      if (start < target) {
        setCount(Math.floor(start));
        animationId = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [hasAnimated, target]);

  const displayCount = count.toLocaleString();

  // For the ₦2M+ stat, abbreviate on mobile
  const isEarningsStat = target >= 1000000;
  const mobileDisplay = isEarningsStat
    ? `₦${Math.floor(count / 1000000)}M+`
    : `${prefix || ''}${displayCount}${suffix || ''}`;
  const desktopDisplay = `${prefix || ''}${displayCount}${suffix || ''}`;

  return (
    <div ref={ref}>
      <h3 className="text-3xl md:text-4xl font-extrabold text-[#1b5030] mb-2">
        {isEarningsStat ? (
          <>
            <span className="md:hidden">{mobileDisplay}</span>
            <span className="hidden md:inline">{desktopDisplay}</span>
          </>
        ) : (
          <>{prefix}{displayCount}{suffix}</>
        )}
      </h3>
      <p className="text-[13px] md:text-base text-gray-500 font-medium">{label}</p>
    </div>
  );
}

export function Stats() {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 mb-16 md:mb-24">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center bg-white md:bg-transparent rounded-3xl md:rounded-none shadow-sm md:shadow-none p-8 md:p-0 border md:border-none border-gray-100">
        <AnimatedStat target={5000} suffix="+" label="Households" />
        <AnimatedStat target={1200} suffix="+" label="Verified Recyclers" />
        <AnimatedStat target={95} suffix="%" label="AI Accuracy" />
        <AnimatedStat target={2000000} prefix="₦" suffix="+" label="Earned by Users" />
      </div>
    </section>
  );
}
