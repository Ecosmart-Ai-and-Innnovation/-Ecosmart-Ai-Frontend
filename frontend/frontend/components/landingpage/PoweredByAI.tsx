import { ScanLine, Layers, DollarSign, MapPin, Calendar, Sparkles } from 'lucide-react';

export function PoweredByAI() {
  const features = [
    { label: 'Waste ID', icon: ScanLine },
    { label: 'Material Class', icon: Layers },
    { label: 'Value Estimate', icon: DollarSign },
    { label: 'Recycler Match', icon: MapPin },
    { label: 'Pickup Scheduling', icon: Calendar },
    { label: 'AI Assistant', icon: Sparkles },
  ];

  return (
    <section className="w-full max-w-6xl mx-auto px-6 mb-20 md:mb-28">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-8 md:mb-12">
        Powered by AI
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-5">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div key={idx} className="bg-white border border-gray-100 rounded-2xl md:rounded-[1.5rem] p-4 md:p-6 flex flex-col items-center md:justify-center gap-3 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-[#f1f7ef] rounded-xl flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 md:w-6 md:h-6 text-[#549B45]" />
              </div>
              <span className="font-bold text-[13px] md:text-[14px] text-gray-800">{feature.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
