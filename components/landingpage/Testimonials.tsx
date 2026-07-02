'use client';

import { useState, useEffect } from 'react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    quote: "\"I never knew my old bottles and newspapers were worth money. EcoSmart AI turned a Sunday clean-up into ₦6,400 in my wallet. I've told my entire street.\"",
    initial: "A",
    name: "Adaeze Okonkwo",
    role: "Household User - Lagos Island"
  },
  {
    quote: "\"My pickup volume doubled within the first month. The matching algorithm sends me requests I actually want — no more wasted trips across town.\"",
    initial: "E",
    name: "Emeka Nwosu",
    role: "Recycler · Abuja FCT"
  },
  {
    quote: "\"The voice feature is everything. My drivers log collections without stopping to type. We've cut admin time in half and our earnings are up 38%.\"",
    initial: "F",
    name: "Fatima Bello",
    role: "Recycling Business Owner · Kano"
  }
];

export function Testimonials() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const t = testimonials[activeTestimonial];

  return (
    <section className="w-full max-w-4xl mx-auto px-6 mb-20 md:mb-28">
      <div className="bg-white border border-gray-100 rounded-3xl md:rounded-[2.5rem] p-8 md:p-12 shadow-md hover:shadow-xl transition-shadow duration-300 relative overflow-hidden min-h-[300px] md:min-h-[280px] flex flex-col justify-center">
        <Quote className="w-8 h-8 md:w-10 md:h-10 text-[#549B45]/40 mb-4 md:mb-6 shrink-0" />

        <div key={activeTestimonial} className="animate-in fade-in slide-in-from-right-4 duration-500 flex-grow flex flex-col justify-between">
          <p className="text-[15px] md:text-xl lg:text-2xl italic text-gray-700 leading-relaxed md:leading-normal mb-8">
            {t.quote}
          </p>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mt-auto">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-[#eaf4e7] text-[#549B45] font-bold text-lg rounded-full flex items-center justify-center shrink-0">
                {t.initial}
              </div>
              <div>
                <h4 className="font-bold text-[15px] md:text-lg text-gray-900">{t.name}</h4>
                <p className="text-[12px] md:text-sm text-gray-500">{t.role}</p>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4 shrink-0">
              <div className="flex gap-1.5 mr-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTestimonial(idx)}
                    className={`h-1.5 md:h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      activeTestimonial === idx ? 'w-4 md:w-6 bg-[#549B45]' : 'w-1.5 md:w-2 bg-gray-200 hover:bg-gray-300'
                    }`}
                    aria-label={`Go to testimonial ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <button onClick={handlePrev} className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors" aria-label="Previous Testimonial">
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                <button onClick={handleNext} className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors" aria-label="Next Testimonial">
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
