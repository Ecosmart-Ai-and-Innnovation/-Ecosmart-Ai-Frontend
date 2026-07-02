import { Header } from '@/components/landingpage/Header';
import { Hero } from '@/components/landingpage/Hero';
import { Stats } from '@/components/landingpage/Stats';
import { FeatureCards } from '@/components/landingpage/FeatureCards';
import { HowItWorks } from '@/components/landingpage/HowItWorks';
import { PoweredByAI } from '@/components/landingpage/PoweredByAI';
import { AskMina } from '@/components/landingpage/AskMina';
import { Testimonials } from '@/components/landingpage/Testimonials';
import { CTASection } from '@/components/landingpage/CTASection';
import { Footer } from '@/components/landingpage/Footer';

export default function Page() {
  return (
    <div className="min-h-screen bg-[#fcfdfc] font-sans text-gray-900 selection:bg-green-100 selection:text-green-900 overflow-hidden">
      {/* Decorative Top Wave Background */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#f1f8ee] to-transparent z-0 pointer-events-none">
        <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="absolute top-0 w-full h-full opacity-40">
          <path d="M0,0 C30,15 70,15 100,0 L100,20 L0,20 Z" fill="#ffffff" />
        </svg>
      </div>

      <Header />

      <main className="relative z-10 w-full flex flex-col items-center pb-20">
        <Hero />
        <Stats />
        <FeatureCards />
        <HowItWorks />
        <PoweredByAI />
        <AskMina />
        <Testimonials />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
