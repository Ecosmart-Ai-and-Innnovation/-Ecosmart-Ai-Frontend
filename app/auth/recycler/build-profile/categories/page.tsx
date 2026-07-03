"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Globe, ChevronLeft, Check, AlertCircle, ArrowRight, Bot,
  Milk, Wine, FileText, Package, Cylinder, Cog, Laptop,
  Battery, Shirt, Disc, Leaf, TreePine, Home, MapPin, Truck,
  Briefcase, PartyPopper, AlertTriangle
} from 'lucide-react';

export default function ProfileCategoriesStep() {
  const router = useRouter();

  // Form State
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(['Cardboard', 'Aluminium', 'Textiles', 'Organic Waste', 'Wood']);
  const [selectedMethods, setSelectedMethods] = useState<string[]>(['Home Pickup', 'Drop-off at My Location']);
  const [sameDayPickup, setSameDayPickup] = useState(false);
  const [scheduledBookings, setScheduledBookings] = useState(true);
  const [minQuantity, setMinQuantity] = useState('');

  // Touched States
  const [touched, setTouched] = useState({
    materials: false,
    methods: false,
    quantity: false,
  });

  // Validation States
  const [errors, setErrors] = useState({
    materials: '',
    methods: '',
    quantity: '',
  });
  const [isFormValid, setIsFormValid] = useState(false);

  // Data Arrays
  const materials = [
    { id: 'Plastic', desc: 'PET, HDPE, LDPE', icon: Milk },
    { id: 'Glass', desc: 'Bottles & jars', icon: Wine },
    { id: 'Paper', desc: 'Newspapers, office', icon: FileText },
    { id: 'Cardboard', desc: 'Boxes & packaging', icon: Package },
    { id: 'Aluminium', desc: 'Cans & foil', icon: Cylinder },
    { id: 'Steel', desc: 'Scrap metal', icon: Cog },
    { id: 'Electronics', desc: 'E-waste', icon: Laptop },
    { id: 'Batteries', desc: 'All types', icon: Battery },
    { id: 'Textiles', desc: 'Clothing & fabric', icon: Shirt },
    { id: 'Rubber', desc: 'Tyres & hoses', icon: Disc },
    { id: 'Organic Waste', desc: 'Food & garden', icon: Leaf },
    { id: 'Wood', desc: 'Timbers, woods', icon: TreePine },
  ];

  const methods = [
    { id: 'Home Pickup', icon: Home },
    { id: 'Drop-off at My Location', icon: MapPin },
    { id: 'Bulk Collection', icon: Truck },
    { id: 'Business Collections', icon: Briefcase },
    { id: 'Event Waste Collection', icon: PartyPopper },
  ];

  // Validation Effect
  useEffect(() => {
    const newErrors = { materials: '', methods: '', quantity: '' };
    let isValid = true;

    if (touched.materials && selectedMaterials.length === 0) {
      newErrors.materials = 'Please select at least one material you collect.';
      isValid = false;
    } else if (selectedMaterials.length === 0) {
      isValid = false;
    }

    if (touched.methods && selectedMethods.length === 0) {
      newErrors.methods = 'Please select at least one collection method.';
      isValid = false;
    } else if (selectedMethods.length === 0) {
      isValid = false;
    }

    if (minQuantity.trim() !== '') {
      if (isNaN(Number(minQuantity)) || Number(minQuantity) < 0) {
        newErrors.quantity = 'Minimum quantity must be a valid positive number.';
        isValid = false;
      }
    }

    setErrors(newErrors);
    setIsFormValid(isValid);
  }, [selectedMaterials, selectedMethods, minQuantity, touched]);

  const toggleMaterial = (id: string) => {
    setTouched(prev => ({ ...prev, materials: true }));
    setSelectedMaterials(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const toggleMethod = (id: string) => {
    setTouched(prev => ({ ...prev, methods: true }));
    setSelectedMethods(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleBlurQuantity = () => setTouched(prev => ({ ...prev, quantity: true }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      setTouched({ materials: true, methods: true, quantity: true });
    } else {
      localStorage.setItem("recycler_categories", JSON.stringify({ selectedMaterials, selectedMethods, sameDayPickup, scheduledBookings, minQuantity }));
      router.push('/auth/recycler/build-profile/pricing');
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdfc] font-sans text-gray-900 selection:bg-green-100 selection:text-green-900 flex flex-col relative pb-10 overflow-x-hidden">

      {/* Decorative Top Wave */}
      <div className="absolute top-0 left-0 w-full h-56 md:h-72 lg:h-80 bg-[#f6fcf4] z-0 pointer-events-none">
         <svg
           viewBox="0 0 1200 120"
           preserveAspectRatio="none"
           className="absolute bottom-0 w-full h-12 md:h-20 lg:h-24 block"
           fill="#ffffff"
         >
           <path d="M0,120 L1200,120 L1200,0 Q600,140 0,0 Z" />
         </svg>
      </div>

      {/* Header */}
      <header className="relative z-20 w-full max-w-7xl mx-auto flex justify-between items-center px-6 md:px-12 pt-6 pb-4">
        <div className="flex items-center gap-1.5 cursor-pointer">
          <div className="bg-green-50 p-1.5 rounded-full">
            <Leaf className="w-5 h-5 md:w-6 md:h-6 text-[#449339]" />
          </div>
          <div className="text-[17px] md:text-xl tracking-tight">
            <span className="font-bold text-[#449339]">EcoSmart</span>
            <span className="font-bold text-gray-900 ml-0.5">AI</span>
          </div>
        </div>
        <button className="flex items-center gap-1.5 border border-gray-200 rounded-full px-4 py-2 bg-white/80 backdrop-blur-sm hover:bg-white transition-colors cursor-pointer shadow-sm">
          <Globe className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-600">English</span>
        </button>
      </header>

      {/* Main Form Area */}
      <main className="relative z-10 flex-grow w-full max-w-4xl mx-auto px-6 md:px-12 pt-4 md:pt-8 flex flex-col">

        {/* Progress Navigation */}
        <div className="w-full mb-8">
          <div className="flex justify-between items-center mb-4">
            <Link href="/auth/recycler/build-profile/location" className="flex items-center gap-1.5 text-[#1b5030] hover:text-[#549B45] font-semibold text-[14px] md:text-[15px] transition-colors cursor-pointer">
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
              Back
            </Link>
            <div className="flex items-center gap-1 text-[#549B45] font-medium text-[13px] md:text-[14px]">
              Saved <Check className="w-4 h-4" />
            </div>
          </div>

          {/* Progress Bars (Step 3 of 4) */}
          <div className="flex gap-2 w-full mb-2">
            <div className="h-1.5 flex-1 bg-[#549B45] rounded-full"></div>
            <div className="h-1.5 flex-1 bg-[#549B45] rounded-full"></div>
            <div className="h-1.5 flex-1 bg-[#549B45] rounded-full"></div>
            <div className="h-1.5 flex-1 bg-gray-200 rounded-full"></div>
          </div>
          <div className="flex justify-between text-[11px] md:text-[13px] text-gray-500 font-medium">
            <span>Step 3 of 4</span>
            <span>Materials You Accept</span>
          </div>
        </div>

        {/* Title & Selection Badge */}
        <div className="mb-8 md:mb-10 relative">
          <h1 className="text-[28px] md:text-4xl lg:text-[40px] leading-tight font-extrabold text-[#111827] mb-2 md:mb-3 pr-24">
            What do you collect?
          </h1>
          <p className="text-[14px] md:text-base text-gray-500 font-medium md:max-w-2xl">
            Choose all recyclable materials you currently accept. You can always update these later.
          </p>

          <div className="mt-4 inline-flex items-center bg-[#549B45] text-white px-3 py-1.5 rounded-full text-[12px] font-bold shadow-sm md:absolute md:top-2 md:right-0 md:mt-0">
            {selectedMaterials.length} selected
          </div>
        </div>

        <form className="w-full flex flex-col gap-10 md:gap-12 relative" onSubmit={handleSubmit}>

          {/* MATERIALS GRID */}
          <div>
            <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 ${errors.materials ? 'p-3 border border-red-200 rounded-3xl bg-red-50/30' : ''}`}>
              {materials.map((mat) => {
                const Icon = mat.icon;
                const isSelected = selectedMaterials.includes(mat.id);
                return (
                  <button
                    key={mat.id}
                    type="button"
                    onClick={() => toggleMaterial(mat.id)}
                    className={`relative flex flex-col items-center justify-center p-4 border rounded-2xl md:rounded-[1.25rem] cursor-pointer text-center transition-all duration-300 min-h-[110px] group ${
                      isSelected
                        ? 'bg-[#f1f8ee] border-[#549B45] shadow-sm'
                        : 'bg-white border-gray-200 hover:border-[#549B45]/50 hover:shadow-sm'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-[#549B45] rounded-full flex items-center justify-center shadow-sm animate-in zoom-in-75">
                          <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                        </div>
                    )}
                    <Icon className={`w-8 h-8 mb-2 transition-colors ${isSelected ? 'text-[#549B45]' : 'text-gray-400 group-hover:text-[#549B45]/70'}`} strokeWidth={1.5} />
                    <span className={`font-bold text-[13px] md:text-[14px] leading-tight mb-0.5 ${isSelected ? 'text-[#1b5030]' : 'text-gray-800'}`}>{mat.id}</span>
                    <span className="text-[10px] md:text-[11px] text-gray-500 font-medium">{mat.desc}</span>
                  </button>
                );
              })}
            </div>
            {errors.materials && (
              <p className="text-[13px] text-red-500 mt-3 flex items-center gap-1.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4" /> {errors.materials}
              </p>
            )}
          </div>

          {/* COLLECTION METHODS */}
          <div>
            <h3 className="font-bold text-[15px] md:text-[16px] text-gray-900 mb-4">
              How do you collect recyclable materials?
            </h3>
            <div className={`flex flex-col gap-3 md:grid md:grid-cols-2 md:gap-4 ${errors.methods ? 'p-3 border border-red-200 rounded-3xl bg-red-50/30' : ''}`}>
              {methods.map((method) => {
                const Icon = method.icon;
                const isSelected = selectedMethods.includes(method.id);
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => toggleMethod(method.id)}
                    className={`flex items-center px-4 py-4 md:py-5 border rounded-[1rem] transition-all duration-300 group ${
                      isSelected
                        ? 'bg-[#f1f8ee] border-[#549B45] shadow-sm'
                        : 'bg-white border-gray-200 hover:border-[#549B45]/50 hover:shadow-sm'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mr-4 bg-gray-50 group-hover:bg-[#eaf4e7] transition-colors">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-[#549B45]' : 'text-gray-500 group-hover:text-[#549B45]'}`} />
                    </div>
                    <span className={`font-semibold text-[14px] md:text-[15px] ${isSelected ? 'text-[#1b5030]' : 'text-gray-800'}`}>
                      {method.id}
                    </span>
                    {isSelected && (
                      <div className="ml-auto w-5 h-5 bg-[#549B45] rounded-full flex items-center justify-center shadow-sm animate-in zoom-in">
                        <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            {errors.methods && (
              <p className="text-[13px] text-red-500 mt-3 flex items-center gap-1.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4" /> {errors.methods}
              </p>
            )}
          </div>

          {/* TOGGLES & QUANTITY */}
          <div className="flex flex-col gap-6 md:gap-8 bg-white border border-gray-100 rounded-[1.5rem] p-5 md:p-8 shadow-sm">

            <div className="flex justify-between items-center">
              <span className="font-bold text-[14px] md:text-[15px] text-gray-900">Offer Same-Day Pickup</span>
              <button
                type="button"
                onClick={() => setSameDayPickup(!sameDayPickup)}
                className={`w-12 h-6 md:w-14 md:h-7 rounded-full transition-colors duration-300 relative flex items-center px-1 focus:outline-none focus:ring-2 focus:ring-[#549B45]/50 ${
                  sameDayPickup ? 'bg-[#549B45]' : 'bg-gray-200'
                }`}
              >
                <div className={`w-4 h-4 md:w-5 md:h-5 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${
                  sameDayPickup ? 'translate-x-6 md:translate-x-7' : 'translate-x-0'
                }`}></div>
              </button>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-bold text-[14px] md:text-[15px] text-gray-900">Accept Scheduled Bookings</span>
              <button
                type="button"
                onClick={() => setScheduledBookings(!scheduledBookings)}
                className={`w-12 h-6 md:w-14 md:h-7 rounded-full transition-colors duration-300 relative flex items-center px-1 focus:outline-none focus:ring-2 focus:ring-[#549B45]/50 ${
                  scheduledBookings ? 'bg-[#549B45]' : 'bg-gray-200'
                }`}
              >
                <div className={`w-4 h-4 md:w-5 md:h-5 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${
                  scheduledBookings ? 'translate-x-6 md:translate-x-7' : 'translate-x-0'
                }`}></div>
              </button>
            </div>

            <div className="pt-2">
              <label className="block text-[13px] md:text-[14px] font-bold text-gray-900 mb-2">
                Minimum Pickup Quantity (kg) — <span className="font-normal text-gray-400">Optional</span>
              </label>
              <div className={`relative flex items-center border rounded-[1rem] md:rounded-2xl px-4 py-3.5 transition-colors shadow-sm ${errors.quantity ? 'border-red-400 focus-within:border-red-500 bg-red-50/10' : 'border-gray-200 focus-within:border-[#549B45] bg-white'}`}>
                <input
                  type="text"
                  value={minQuantity}
                  onChange={(e) => setMinQuantity(e.target.value)}
                  onBlur={handleBlurQuantity}
                  name="minQuantity"
                  placeholder="e.g. 5"
                  className="w-full outline-none text-[14px] md:text-[15px] text-gray-900 placeholder:text-gray-400 bg-transparent"
                />
                {errors.quantity && <AlertCircle className="w-5 h-5 text-red-500 mr-2 shrink-0 animate-in zoom-in" />}
                <span className="text-gray-500 font-medium text-[14px] shrink-0">kg</span>
              </div>
              {errors.quantity && (
                <p className="text-[12px] text-red-500 mt-2 flex items-center gap-1 animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.quantity}
                </p>
              )}
            </div>
          </div>

          {/* INFO BANNERS */}
          <div className="flex flex-col gap-3">
            <div className="bg-[#fef9e8] rounded-2xl p-4 md:p-5 flex items-start md:items-center gap-4 border border-[#f5a623]/20">
              <div className="mt-0.5 md:mt-0 shrink-0">
                <AlertTriangle className="w-5 h-5 text-[#f5a623]" />
              </div>
              <p className="text-[13px] md:text-[14px] text-gray-800 leading-snug">
                Only list categories you are genuinely able to collect. <span className="text-gray-500">Misrepresenting your services may result in account review.</span>
              </p>
            </div>
            <div className="bg-[#eaf4e7] rounded-2xl p-4 md:p-5 flex items-start md:items-center gap-4">
              <div className="mt-0.5 md:mt-0 shrink-0">
                <Leaf className="w-5 h-5 text-[#549B45]" />
              </div>
              <p className="text-[13px] md:text-[14px] text-[#1b5030] leading-snug">
                Recyclers offering <span className="font-bold">multiple collection services</span> receive significantly more requests.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-4 rounded-full font-bold text-[15px] md:text-[16px] flex items-center justify-center gap-2 transition-all duration-300 mt-2 ${
              isFormValid
                ? 'bg-[#549B45] text-white shadow-lg shadow-green-900/20 hover:bg-[#458237] hover:-translate-y-0.5 cursor-pointer'
                : 'bg-[#549B45]/50 text-white cursor-not-allowed'
            }`}
          >
            Next: Pricing <ArrowRight className="w-5 h-5" />
          </button>

        </form>

        {/* Footer Navigation Tabs */}
        <div className="flex justify-center gap-4 md:gap-8 mt-12 text-[12px] md:text-[14px]">
          <Link href="/auth/recycler/build-profile" className="font-medium text-[#549B45] hover:text-gray-900">Basic Info</Link>
          <Link href="/auth/recycler/build-profile/location" className="font-medium text-gray-400 hover:text-[#549B45]">Location</Link>
          <span className="font-bold text-gray-900">Categories</span>
          <Link href="/auth/recycler/build-profile/pricing" className="font-medium text-gray-400 hover:text-[#549B45]">Pricing</Link>
        </div>

      </main>
    </div>
  );
}
