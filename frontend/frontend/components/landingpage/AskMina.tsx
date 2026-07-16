import Image from 'next/image';

export function AskMina() {
  return (
    <section className="w-full max-w-5xl mx-auto px-6 mb-20 md:mb-28">
      <div className="bg-[#eaf4e7] rounded-3xl md:rounded-[2.5rem] p-6 md:p-12 flex flex-col md:flex-row items-center justify-center md:justify-start gap-6 md:gap-10 shadow-sm border border-[#549B45]/10">
        <div className="w-32 h-32 md:w-48 md:h-48 shrink-0 flex items-center justify-center">
          <Image
            src="/images/Frame 22.png"
            alt="Mina AI Assistant"
            width={192}
            height={192}
            className="w-full h-full object-contain drop-shadow-sm"
          />
        </div>
        <div className="text-center md:text-left">
          <p className="text-[11px] md:text-[13px] font-bold text-[#549B45] tracking-wider uppercase mb-2">24/7 AI Assistant</p>
          <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">Ask Mina</h3>
          <p className="text-[14px] md:text-[16px] text-gray-700 leading-relaxed md:max-w-2xl">
            Need help? Mina can answer questions, identify recyclables, guide pickups, explain pricing, and support your EcoSmart journey.
          </p>
        </div>
      </div>
    </section>
  );
}
