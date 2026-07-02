import { Home, Recycle, ChevronRight } from 'lucide-react';

export function FeatureCards() {
  return (
    <section className="w-full max-w-6xl mx-auto px-6 mb-20 md:mb-28">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-8 md:mb-12">
        Built for everyone
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem] p-5 md:p-8 flex items-center justify-between cursor-pointer hover:border-[#549B45] hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center gap-5 md:gap-6">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-[#f1f7ef] rounded-full flex items-center justify-center group-hover:bg-[#549B45] transition-colors">
              <Home className="w-6 h-6 md:w-8 md:h-8 text-[#549B45] group-hover:text-white" />
            </div>
            <div>
              <h4 className="font-bold text-[16px] md:text-xl text-gray-900 mb-1">For Households</h4>
              <p className="text-[13px] md:text-[15px] text-gray-500">Scan waste, earn rewards.</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-300 group-hover:text-[#549B45]" />
        </div>

        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem] p-5 md:p-8 flex items-center justify-between cursor-pointer hover:border-[#549B45] hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center gap-5 md:gap-6">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-[#f1f7ef] rounded-full flex items-center justify-center group-hover:bg-[#549B45] transition-colors">
              <Recycle className="w-6 h-6 md:w-8 md:h-8 text-[#549B45] group-hover:text-white" />
            </div>
            <div>
              <h4 className="font-bold text-[16px] md:text-xl text-gray-900 mb-1">For Recyclers</h4>
              <p className="text-[13px] md:text-[15px] text-gray-500">Manage pickups, grow your business.</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-300 group-hover:text-[#549B45]" />
        </div>
      </div>
    </section>
  );
}
