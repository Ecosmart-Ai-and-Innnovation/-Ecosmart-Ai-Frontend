"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Globe, ChevronLeft, Check, Leaf, AlertCircle,
  ChevronDown, ChevronUp, CheckCircle2
} from 'lucide-react';
import { recyclerProfileApi } from '@/lib/api';
import { RECYCLER_MATERIALS, type RecyclerMaterial } from '../materials';

export default function ProfilePricingStep() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [hydrated, setHydrated] = useState(false);

  // Toggle State
  const [negotiateAll, setNegotiateAll] = useState(false);

  // Materials to price = whatever was selected in Step 3.
  const [pricedMaterials, setPricedMaterials] = useState<RecyclerMaterial[]>([]);

  // Price per material id (₦/kg). Blank = negotiable.
  const [prices, setPrices] = useState<Record<string, string>>({});

  // Payment Methods
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const availablePaymentMethods = ['Cash', 'Bank Transfer', 'EcoSmart Wallet', 'Mobile Money', 'Other'];

  // Optional Settings
  const [minPickupValue, setMinPickupValue] = useState('');
  const [minCollectionQty, setMinCollectionQty] = useState('');

  // Accordion State
  const [marketRatesOpen, setMarketRatesOpen] = useState(false);

  // Touched & Error States
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Load the materials selected in Step 3, and restore this step's own draft
  // so navigating back and forth keeps the pricing input.
  useEffect(() => {
    let selected: string[] = [];
    try {
      const cats = JSON.parse(localStorage.getItem('recycler_categories') || '{}');
      if (Array.isArray(cats.selectedMaterials)) selected = cats.selectedMaterials;
    } catch {
      /* ignore malformed draft */
    }
    setPricedMaterials(RECYCLER_MATERIALS.filter((m) => selected.includes(m.id)));

    try {
      const saved = JSON.parse(localStorage.getItem('recycler_pricing') || '{}');
      if (typeof saved.negotiateAll === 'boolean') setNegotiateAll(saved.negotiateAll);
      if (saved.prices && typeof saved.prices === 'object') setPrices(saved.prices);
      if (Array.isArray(saved.paymentMethods)) setPaymentMethods(saved.paymentMethods);
      if (saved.minPickupValue) setMinPickupValue(saved.minPickupValue);
      if (saved.minCollectionQty) setMinCollectionQty(saved.minCollectionQty);
    } catch {
      /* ignore malformed draft */
    }

    setHydrated(true);
  }, []);

  // Autosave this step's draft — guarded on `hydrated` so the initial empty
  // state never clobbers a restored draft.
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(
      'recycler_pricing',
      JSON.stringify({ negotiateAll, prices, paymentMethods, minPickupValue, minCollectionQty })
    );
  }, [hydrated, negotiateAll, prices, paymentMethods, minPickupValue, minCollectionQty]);

  // Validation Effect
  useEffect(() => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (touched.payment && paymentMethods.length === 0) {
      newErrors.payment = 'Please select at least one payment method.';
      isValid = false;
    } else if (paymentMethods.length === 0) {
      isValid = false;
    }

    const validateNumber = (val: string, fieldId: string, errorMsg: string) => {
      if (val.trim() !== '') {
        if (isNaN(Number(val)) || Number(val) < 0) {
          if (touched[fieldId]) newErrors[fieldId] = errorMsg;
          isValid = false;
        }
      }
    };

    // Per-material price must fall within the allowed range (blank = negotiable).
    // Skipped entirely when the recycler opts to negotiate all prices.
    if (!negotiateAll) {
      pricedMaterials.forEach((mat) => {
        const val = prices[mat.id] ?? '';
        if (val.trim() === '') return;
        const num = Number(val);
        const fieldId = `price_${mat.id}`;
        if (isNaN(num) || num < 0) {
          if (touched[fieldId]) newErrors[fieldId] = 'Enter a valid amount';
          isValid = false;
        } else if (num < mat.min) {
          if (touched[fieldId]) newErrors[fieldId] = `Min ₦${mat.min}`;
          isValid = false;
        } else if (num > mat.max) {
          if (touched[fieldId]) newErrors[fieldId] = `Max ₦${mat.max}`;
          isValid = false;
        }
      });
    }

    validateNumber(minPickupValue, 'minPickup', 'Must be a valid number');
    validateNumber(minCollectionQty, 'minQty', 'Must be a valid number');

    setErrors(newErrors);
    setIsFormValid(isValid);
  }, [prices, paymentMethods, minPickupValue, minCollectionQty, touched, negotiateAll, pricedMaterials]);

  // Handlers
  const handlePriceChange = (id: string, value: string) => {
    setPrices(prev => ({ ...prev, [id]: value }));
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const togglePaymentMethod = (method: string) => {
    setTouched(prev => ({ ...prev, payment: true }));
    setPaymentMethods(prev =>
      prev.includes(method) ? prev.filter(m => m !== method) : [...prev, method]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      const allTouched: Record<string, boolean> = { payment: true, minPickup: true, minQty: true };
      pricedMaterials.forEach((m) => (allTouched[`price_${m.id}`] = true));
      setTouched(allTouched);
      return;
    }

    setSaving(true);
    setSaveError('');

    // Collect data from localStorage (saved from steps 1-3) and current form
    const basicData = JSON.parse(localStorage.getItem('recycler_basic') || '{}');
    const locationData = JSON.parse(localStorage.getItem('recycler_location') || '{}');
    const categoriesData = JSON.parse(localStorage.getItem('recycler_categories') || '{}');

    try {
      await recyclerProfileApi.save({
        ...basicData,
        ...locationData,
        ...categoriesData,
        negotiateAll,
        prices,
        paymentMethods,
        minPickupValue,
        minCollectionQty,
      });

      // Clear the draft only after a confirmed save
      localStorage.removeItem('recycler_basic');
      localStorage.removeItem('recycler_location');
      localStorage.removeItem('recycler_categories');
      localStorage.removeItem('recycler_pricing');

      router.push('/auth/recycler/build-profile/success');
    } catch (err) {
      // Surface the failure instead of showing a false "Profile Ready!" screen.
      setSaveError(err instanceof Error ? err.message : 'Could not save your profile. Please try again.');
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdfc] font-sans text-gray-900 selection:bg-green-100 selection:text-green-900 flex flex-col relative pb-10 overflow-x-hidden">

      <div className="absolute top-0 left-0 w-full h-56 md:h-72 lg:h-80 bg-[#f6fcf4] z-0 pointer-events-none">
         <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 w-full h-12 md:h-20 lg:h-24 block" fill="#ffffff">
           <path d="M0,120 L1200,120 L1200,0 Q600,140 0,0 Z" />
         </svg>
      </div>

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

      <main className="relative z-10 flex-grow w-full max-w-5xl mx-auto px-6 md:px-12 pt-4 md:pt-8 flex flex-col">

        {/* Progress Navigation */}
        <div className="w-full mb-8">
          <div className="flex justify-between items-center mb-4">
            <Link href="/auth/recycler/build-profile/categories" className="flex items-center gap-1.5 text-[#1b5030] hover:text-[#549B45] font-semibold text-[14px] md:text-[15px] transition-colors cursor-pointer">
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
              Back
            </Link>
            <div className="flex items-center gap-1 text-[#549B45] font-medium text-[13px] md:text-[14px]">
              Saved <Check className="w-4 h-4" />
            </div>
          </div>

          <div className="flex gap-2 w-full mb-2">
            <div className="h-1.5 flex-1 bg-[#549B45] rounded-full"></div>
            <div className="h-1.5 flex-1 bg-[#549B45] rounded-full"></div>
            <div className="h-1.5 flex-1 bg-[#549B45] rounded-full"></div>
            <div className="h-1.5 flex-1 bg-[#549B45] rounded-full"></div>
          </div>
          <div className="flex justify-between text-[11px] md:text-[13px] text-gray-500 font-medium">
            <span>Step 4 of 4</span>
            <span>Pricing</span>
          </div>
        </div>

        {/* Title */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-[28px] md:text-4xl lg:text-[40px] leading-tight font-extrabold text-[#111827] mb-2 md:mb-3">
            Set Your Pricing.
          </h1>
          <p className="text-[14px] md:text-base text-gray-500 font-medium">
            Help households understand what to expect. You can update your pricing anytime.
          </p>
        </div>

        <div className="bg-[#eaf4e7] rounded-2xl p-4 md:p-5 flex items-start md:items-center gap-3 mb-8">
          <div className="mt-0.5 md:mt-0 shrink-0">
            <Leaf className="w-5 h-5 text-[#549B45]" />
          </div>
          <p className="text-[13px] md:text-[14px] text-[#1b5030] leading-snug">
            Competitive prices attract more customers. <span className="font-bold">You can update these anytime from your listings.</span>
          </p>
        </div>

        <form className="w-full flex flex-col gap-10 md:gap-12" onSubmit={handleSubmit}>

          <div className="bg-white border border-gray-100 rounded-3xl p-5 md:p-6 shadow-sm flex justify-between items-center">
            <div>
              <span className="block font-bold text-[15px] md:text-[16px] text-gray-900 mb-0.5">I prefer to negotiate prices</span>
              <span className="block text-[12px] md:text-[13px] text-gray-500">Pricing discussed during pickup confirmation</span>
            </div>
            <button type="button" onClick={() => setNegotiateAll(!negotiateAll)}
              className={`w-12 h-6 md:w-14 md:h-7 rounded-full transition-colors duration-300 relative flex items-center px-1 focus:outline-none focus:ring-2 focus:ring-[#549B45]/50 shrink-0 ${
                negotiateAll ? 'bg-[#549B45]' : 'bg-gray-200'}`}>
              <div className={`w-4 h-4 md:w-5 md:h-5 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${
                negotiateAll ? 'translate-x-6 md:translate-x-7' : 'translate-x-0'}`}></div>
            </button>
          </div>

          {/* Prices — one row per material selected in Step 3 */}
          {pricedMaterials.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-8 text-center">
              <p className="text-[14px] text-gray-600 font-medium">You haven&apos;t selected any materials yet.</p>
              <Link href="/auth/recycler/build-profile/categories" className="mt-2 inline-block text-[13px] font-bold text-[#549B45] hover:underline">
                ← Choose what you collect
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pricedMaterials.map((mat) => {
                const Icon = mat.icon;
                const error = errors[`price_${mat.id}`];
                const rawPrice = prices[mat.id] ?? '';
                const numPrice = Number(rawPrice);
                const isValidPrice =
                  !negotiateAll &&
                  rawPrice.trim() !== '' &&
                  !isNaN(numPrice) &&
                  numPrice >= mat.min &&
                  numPrice <= mat.max;
                return (
                  <div key={mat.id} className={`flex items-center justify-between p-4 border rounded-2xl bg-white shadow-sm transition-colors ${error ? 'border-red-400 bg-red-50/20' : 'border-gray-100 focus-within:border-[#549B45]'}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-[#eef5ea] rounded-full flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 md:w-6 md:h-6 text-[#549B45]" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[14px] md:text-[15px] text-gray-900">{mat.name}</h4>
                        <p className="text-[11px] md:text-[12px] text-gray-500">Range: ₦{mat.min} – ₦{mat.max}/kg</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#549B45] text-[15px] md:text-[16px]">₦</span>
                        <input type="text" value={rawPrice}
                          onChange={(e) => handlePriceChange(mat.id, e.target.value)}
                          onBlur={() => handleBlur(`price_${mat.id}`)}
                          placeholder="0" disabled={negotiateAll}
                          name={`price_${mat.id}`}
                          className="w-12 md:w-16 border-b border-gray-200 text-center outline-none text-[15px] md:text-[16px] font-semibold text-gray-900 focus:border-[#549B45] transition-colors disabled:opacity-50" />
                        <span className="text-[12px] md:text-[13px] text-gray-400">/kg</span>
                        {isValidPrice && <Check className="w-4 h-4 text-[#549B45] shrink-0" strokeWidth={3} />}
                      </div>
                      {error && <span className="text-[10px] text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {error}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <p className="text-[12px] md:text-[13px] text-gray-500 mt-4 text-center">Leave a price blank and it will show as &quot;negotiable&quot; to customers.</p>

          <div className={`bg-white border rounded-3xl p-5 md:p-8 shadow-sm transition-colors ${errors.payment ? 'border-red-300' : 'border-gray-100'}`}>
            <h3 className="font-bold text-[15px] md:text-[16px] text-gray-900 mb-4">Payment Methods Accepted</h3>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {availablePaymentMethods.map((method) => {
                const isSelected = paymentMethods.includes(method);
                return (
                  <button key={method} type="button" onClick={() => togglePaymentMethod(method)}
                    className={`px-4 py-2.5 rounded-full text-[13px] md:text-[14px] font-semibold transition-all duration-300 border ${
                      isSelected ? 'bg-[#eaf4e7] text-[#1b5030] border-[#549B45] shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:border-[#549B45]/50'}`}>
                    {method}
                  </button>
                );
              })}
            </div>
            {errors.payment && <p className="text-[12px] text-red-500 mt-3 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.payment}</p>}
          </div>

          <div className="bg-white border border-gray-100 rounded-3xl p-5 md:p-8 shadow-sm">
            <h3 className="font-bold text-[15px] md:text-[16px] text-gray-900 mb-4">Optional Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              <div>
                <label className="block text-[12px] md:text-[13px] font-medium text-gray-600 mb-2">Minimum Pickup Value (₦)</label>
                <div className={`relative flex items-center border rounded-xl px-4 py-3 transition-colors ${errors.minPickup ? 'border-red-400 focus-within:border-red-500' : 'border-gray-200 focus-within:border-[#549B45]'}`}>
                  <span className="font-bold text-[#549B45] mr-2">₦</span>
                  <input type="text" value={minPickupValue} onChange={(e) => setMinPickupValue(e.target.value)}
                    onBlur={() => handleBlur('minPickup')} name="minPickup"
                    placeholder="e.g. 500" className="w-full outline-none text-[14px] md:text-[15px] text-gray-900 placeholder:text-gray-400 bg-transparent" />
                  {errors.minPickup && <AlertCircle className="w-4 h-4 text-red-500 ml-2 animate-in zoom-in" />}
                </div>
                {errors.minPickup && <p className="text-[11px] text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.minPickup}</p>}
              </div>
              <div>
                <label className="block text-[12px] md:text-[13px] font-medium text-gray-600 mb-2">Minimum Collection Quantity (kg)</label>
                <div className={`relative flex items-center border rounded-xl px-4 py-3 transition-colors ${errors.minQty ? 'border-red-400 focus-within:border-red-500' : 'border-gray-200 focus-within:border-[#549B45]'}`}>
                  <input type="text" value={minCollectionQty} onChange={(e) => setMinCollectionQty(e.target.value)}
                    onBlur={() => handleBlur('minQty')} name="minQty"
                    placeholder="e.g. 5" className="w-full outline-none text-[14px] md:text-[15px] text-gray-900 placeholder:text-gray-400 bg-transparent" />
                  {errors.minQty && <AlertCircle className="w-4 h-4 text-red-500 ml-2 animate-in zoom-in" />}
                </div>
                {errors.minQty && <p className="text-[11px] text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.minQty}</p>}
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-3xl p-5 md:p-6 shadow-sm">
            <button type="button" onClick={() => setMarketRatesOpen(!marketRatesOpen)}
              className="w-full flex justify-between items-center text-left focus:outline-none">
              <h3 className="font-bold text-[14px] md:text-[15px] text-gray-900">Typical Market Rates in Nigeria</h3>
              {marketRatesOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>
            {marketRatesOpen && (
              <div className="mt-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
                {pricedMaterials.length === 0 ? (
                  <p className="text-[12px] text-gray-400 mb-4">Select materials to see their typical rates.</p>
                ) : (
                  <div className="flex flex-col gap-3 mb-4">
                    {pricedMaterials.map((mat) => {
                      const Icon = mat.icon;
                      return (
                        <div key={mat.id} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-gray-500" />
                            <span className="font-semibold text-[13px] md:text-[14px] text-gray-800">{mat.name}</span>
                          </div>
                          <span className="font-bold text-[#549B45] text-[13px] md:text-[14px]">₦{mat.min} – ₦{mat.max}/kg</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                <p className="text-[11px] md:text-[12px] text-gray-400 leading-snug">
                  Rates are updated periodically by EcoSmart AI to reflect current market conditions.
                </p>
              </div>
            )}
          </div>

          {saveError && (
            <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-[13px] md:text-sm text-red-600 font-medium">{saveError}</p>
            </div>
          )}

          <button type="submit" disabled={!isFormValid || saving}
            className={`w-full py-4 rounded-full font-bold text-[15px] md:text-[16px] flex items-center justify-center gap-2 transition-all duration-300 mt-2 ${
              isFormValid && !saving ? 'bg-[#549B45] text-white shadow-lg shadow-green-900/20 hover:bg-[#458237] hover:-translate-y-0.5 cursor-pointer' : 'bg-[#549B45]/50 text-white cursor-not-allowed'}`}>
            {saving ? 'Saving...' : 'Finish & Go Live'} {!saving && <CheckCircle2 className="w-5 h-5" />}
          </button>

        </form>

        <div className="flex justify-center gap-4 md:gap-8 mt-12 text-[12px] md:text-[14px]">
          <Link href="/auth/recycler/build-profile" className="font-medium text-gray-400 hover:text-[#549B45]">Basic Info</Link>
          <Link href="/auth/recycler/build-profile/location" className="font-medium text-gray-400 hover:text-[#549B45]">Location</Link>
          <Link href="/auth/recycler/build-profile/categories" className="font-medium text-gray-400 hover:text-[#549B45]">Categories</Link>
          <span className="font-bold text-gray-900">Pricing</span>
        </div>

      </main>
    </div>
  );
}
