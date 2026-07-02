import { ScanLine, Sparkles, DollarSign } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    { num: 1, title: 'Scan or upload waste.', icon: ScanLine },
    { num: 2, title: 'Get instant analysis.', icon: Sparkles },
    { num: 3, title: 'Recycle and earn.', icon: DollarSign },
  ];

  return (
    <section className="w-full max-w-6xl mx-auto px-6 mb-20 md:mb-28 relative">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-10 md:mb-16">
        How it Works
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative pl-6 md:pl-0">
        <div className="md:hidden absolute left-[2.4rem] top-4 bottom-4 w-px bg-gray-200 z-0"></div>
        <div className="hidden md:block absolute top-[2.25rem] left-[10%] right-[10%] h-px bg-gray-200 z-0"></div>

        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={idx} className="relative z-10 flex md:flex-col items-center gap-4 md:gap-6 bg-white md:bg-transparent border border-gray-100 md:border-none rounded-2xl md:rounded-none p-3 md:p-0 shadow-sm md:shadow-none hover:shadow-md md:hover:shadow-none transition-shadow">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-[#549B45] text-white rounded-full flex items-center justify-center font-bold text-[13px] md:text-[15px] shrink-0 ml-[-1.5rem] md:ml-0 ring-4 ring-[#fcfdfc] z-10">
                {step.num}
              </div>
              <div className="flex md:flex-col items-center md:text-center gap-4 w-full md:bg-white md:border md:border-gray-100 md:shadow-sm md:rounded-[2rem] md:p-8 md:hover:shadow-xl md:transition-all">
                <div className="w-10 h-10 md:w-16 md:h-16 bg-[#f1f7ef] rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 md:w-8 md:h-8 text-[#549B45]" />
                </div>
                <h4 className="font-bold text-[14px] md:text-lg text-gray-800">{step.title}</h4>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
