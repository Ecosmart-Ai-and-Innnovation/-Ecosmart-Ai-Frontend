"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Globe, ChevronLeft, Check, Camera, Store, User, Building2,
  ArrowRight, Leaf, Bot, AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function BuildProfileStep1() {
  const router = useRouter();

  // Form State
  const [operationSize, setOperationSize] = useState<'Just me' | 'Small team' | 'I run a facility'>('Small team');
  const [primaryName, setPrimaryName] = useState('');
  const [description, setDescription] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  // Touched States
  const [touched, setTouched] = useState({
    primaryName: false,
    description: false,
    whatsapp: false,
  });

  // Validation States
  const [errors, setErrors] = useState({
    primaryName: '',
    description: '',
    whatsapp: '',
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Dynamic Content based on Operation Size
  const getFieldConfig = () => {
    switch (operationSize) {
      case 'Just me':
        return {
          nameLabel: 'Full Name',
          namePlaceholder: 'e.g. Musa Ibrahim',
          descLabel: 'Short Bio',
          descPlaceholder: 'e.g. Independent waste collector operating in Kubwa. Available weekends.',
          icon: User
        };
      case 'I run a facility':
        return {
          nameLabel: 'Facility Name',
          namePlaceholder: 'e.g. GreenCycle Plant Abuja',
          descLabel: 'Facility Description',
          descPlaceholder: 'e.g. Large scale sorting and processing facility handling PET and Aluminum.',
          icon: Building2
        };
      default:
        return {
          nameLabel: 'Business Name',
          namePlaceholder: 'e.g. Musa Waste Collection, GreenCycle Plant',
          descLabel: 'Short Description',
          descPlaceholder: 'e.g. We collect plastic and aluminium across Kubwa, Abuja. Available Monday to Saturday.',
          icon: Store
        };
    }
  };

  const config = getFieldConfig();

  // Validation
  useEffect(() => {
    const newErrors = { primaryName: '', description: '', whatsapp: '' };
    let valid = true;

    if (touched.primaryName && primaryName.trim().length < 3) {
      newErrors.primaryName = `${config.nameLabel} is required (min 3 chars).`;
      valid = false;
    } else if (primaryName.trim().length < 3) {
      valid = false;
    }

    if (touched.description && description.trim().length < 10) {
      newErrors.description = 'Please provide a description (min 10 chars).';
      valid = false;
    } else if (touched.description && description.length > 200) {
      newErrors.description = 'Description cannot exceed 200 characters.';
      valid = false;
    } else if (description.trim().length < 10 || description.length > 200) {
      valid = false;
    }

    if (whatsapp.length > 0) {
      const cleanWa = whatsapp.replace(/\D/g, '');
      if (touched.whatsapp && (cleanWa.length < 10 || cleanWa.length > 11)) {
        newErrors.whatsapp = 'Enter a valid 10 or 11-digit phone number.';
        valid = false;
      } else if (cleanWa.length < 10 || cleanWa.length > 11) {
        valid = false;
      }
    }

    setErrors(newErrors);
    setIsFormValid(valid);
  }, [primaryName, description, whatsapp, touched, config.nameLabel]);

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      localStorage.setItem("recycler_basic", JSON.stringify({ operationSize, primaryName, description, whatsapp }));
      router.push('/auth/recycler/build-profile/location');
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdfc] font-sans text-gray-900 selection:bg-green-100 selection:text-green-900 flex flex-col relative pb-10 overflow-x-hidden">

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto flex justify-between items-center px-6 md:px-12 pt-6 pb-4">
        <div className="flex items-center gap-1.5 cursor-pointer">
          <div className="bg-green-50 p-1.5 rounded-full">
            <Leaf className="w-5 h-5 md:w-6 md:h-6 text-[#449339]" />
          </div>
          <div className="text-[17px] md:text-xl tracking-tight">
            <span className="font-bold text-[#449339]">EcoSmart</span>
            <span className="font-bold text-gray-900 ml-0.5">AI</span>
          </div>
        </div>
        <button className="flex items-center gap-1.5 border border-gray-200 rounded-full px-4 py-2 bg-white hover:bg-gray-50 transition-colors shadow-sm cursor-pointer">
          <Globe className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-600">English</span>
        </button>
      </header>

      {/* Main Form Area */}
      <main className="flex-grow w-full max-w-3xl mx-auto px-6 md:px-12 pt-4 md:pt-8 flex flex-col">

        {/* Progress Navigation */}
        <div className="w-full mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-1.5 font-semibold text-[14px] md:text-[15px] text-gray-300 pointer-events-none">
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
              Back
            </div>
            <div className="flex items-center gap-1 text-[#549B45] font-medium text-[13px] md:text-[14px]">
              Saved <Check className="w-4 h-4" />
            </div>
          </div>

          {/* Progress Bars */}
          <div className="flex gap-2 w-full mb-2">
            <div className="h-1.5 flex-1 bg-[#549B45] rounded-full"></div>
            <div className="h-1.5 flex-1 bg-gray-200 rounded-full"></div>
            <div className="h-1.5 flex-1 bg-gray-200 rounded-full"></div>
            <div className="h-1.5 flex-1 bg-gray-200 rounded-full"></div>
          </div>
          <div className="flex justify-between text-[11px] md:text-[13px] text-gray-500 font-medium">
            <span>Step 1 of 4</span>
            <span>Build Your Profile</span>
          </div>
        </div>

        {/* Title */}
        <div className="mb-8 md:mb-10">
          <h1 className="text-[28px] md:text-4xl lg:text-[40px] leading-tight font-extrabold text-[#111827] mb-2 md:mb-3">
            Tell Us About Yourself.
          </h1>
          <p className="text-[14px] md:text-base text-gray-500 font-medium">
            This is how people will discover your business when looking for a recycler nearby.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-8 md:gap-10 relative">

          {/* Photo Upload */}
          <div className="flex flex-col items-center justify-center w-full">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
                  reader.readAsDataURL(file);
                }
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-colors group cursor-pointer overflow-hidden ${photoPreview ? "border-[#549B45] bg-[#f1f7ef]" : "border-gray-300 hover:border-[#549B45] hover:bg-[#f1f7ef]"}`}
            >
              {photoPreview ? (
                <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <><Camera className="w-6 h-6 md:w-7 md:h-7 text-[#549B45]" /><span className="text-[11px] md:text-[12px] font-medium text-gray-500 group-hover:text-[#549B45]">Add Photo</span></>
              )}
            </button>
            {photoPreview && <button type="button" onClick={() => setPhotoPreview(null)} className="mt-2 text-[11px] md:text-[12px] text-red-500 hover:underline font-medium">Remove photo</button>}
            <p className="text-[12px] md:text-[13px] text-gray-400 mt-4 font-medium text-center">
              Optional — profiles with photos get <span className="font-bold text-gray-500">3×</span> more requests.
            </p>
          </div>
          {/* Operation Size Toggle */}
          <div>
            <label className="block text-[15px] md:text-[16px] font-bold text-gray-900 mb-1">
              How big is your operation?
            </label>
            <p className="text-[13px] text-gray-500 mb-3">This helps us show you the right features.</p>
            <div className="flex flex-wrap gap-3">
              {(['Just me', 'Small team', 'I run a facility'] as const).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    setOperationSize(size);
                    setTouched(prev => ({...prev, primaryName: false, description: false}));
                  }}
                  className={`px-5 py-2.5 rounded-full text-[14px] font-semibold transition-all duration-300 border ${
                    operationSize === size
                      ? 'bg-[#549B45] text-white border-[#549B45] shadow-md'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-[#549B45] hover:bg-[#f1f7ef]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Name Field */}
          <div className="animate-in fade-in zoom-in-95 duration-300" key={`name-${operationSize}`}>
            <label className="block text-[13px] md:text-[14px] font-medium text-gray-700 mb-2">
              {config.nameLabel}
            </label>
            <div className={`relative flex items-center border rounded-[1rem] md:rounded-2xl px-4 py-3.5 bg-white transition-colors shadow-sm ${errors.primaryName ? 'border-red-400 focus-within:border-red-500' : 'border-gray-200 focus-within:border-[#549B45]'}`}>
              <config.icon className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
              <input
                type="text"
                value={primaryName}
                onChange={(e) => setPrimaryName(e.target.value)}
                onBlur={() => handleBlur('primaryName')}
                name="primaryName"
                placeholder={config.namePlaceholder}
                className="w-full outline-none text-[14px] md:text-[15px] text-gray-900 placeholder:text-gray-400 bg-transparent"
              />
              {errors.primaryName && <AlertCircle className="w-5 h-5 text-red-500 ml-2 shrink-0 animate-in zoom-in" />}
            </div>
            {errors.primaryName ? (
              <p className="text-[12px] text-red-500 mt-2 flex items-center gap-1 animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.primaryName}
              </p>
            ) : (
              <p className="text-[12px] text-gray-500 mt-2">This is how people search for your business.</p>
            )}
          </div>

          {/* Dynamic Description Field */}
          <div className="animate-in fade-in zoom-in-95 duration-300" key={`desc-${operationSize}`}>
            <label className="block text-[13px] md:text-[14px] font-medium text-gray-700 mb-2">
              {config.descLabel}
            </label>
            <div className={`relative flex flex-col border rounded-[1rem] md:rounded-2xl p-4 bg-white transition-colors shadow-sm ${errors.description ? 'border-red-400 focus-within:border-red-500' : 'border-gray-200 focus-within:border-[#549B45]'}`}>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => handleBlur('description')}
                name="description"
                placeholder={config.descPlaceholder}
                className="w-full outline-none text-[14px] md:text-[15px] text-gray-900 placeholder:text-gray-400 bg-transparent resize-none min-h-[100px]"
                maxLength={200}
              />
              <div className="flex justify-end w-full mt-2">
                <span className={`text-[11px] md:text-[12px] font-medium transition-colors ${description.length >= 200 ? 'text-red-500' : 'text-gray-400'}`}>
                  {description.length}/200
                </span>
              </div>
            </div>
            {errors.description && (
              <p className="text-[12px] text-red-500 mt-2 flex items-center gap-1 animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.description}
              </p>
            )}
          </div>

          {/* Promotion Banner */}
          <div className="bg-[#eaf4e7] rounded-2xl p-4 md:p-5 flex items-start md:items-center gap-4">
            <div className="mt-0.5 md:mt-0">
              <Leaf className="w-5 h-5 text-[#549B45]" />
            </div>
            <p className="text-[13px] md:text-[14px] text-[#1b5030] leading-snug">
              Recyclers with complete profiles receive <span className="font-bold">5× more pickup requests.</span>
            </p>
          </div>

          {/* WhatsApp Number Field */}
          <div className="mb-4">
            <label className="block text-[13px] md:text-[14px] font-medium text-gray-700 mb-2">
              WhatsApp Number <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <div className={`relative flex items-center border rounded-[1rem] md:rounded-2xl px-4 py-3.5 bg-white transition-colors shadow-sm ${errors.whatsapp ? 'border-red-400 focus-within:border-red-500' : 'border-gray-200 focus-within:border-[#549B45]'}`}>
              <svg className="w-5 h-5 text-[#25D366] mr-3 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                onBlur={() => handleBlur('whatsapp')}
                name="whatsapp"
                placeholder="WhatsApp number for household contact"
                className="w-full outline-none text-[14px] md:text-[15px] text-gray-900 placeholder:text-gray-400 bg-transparent"
              />
              {errors.whatsapp && <AlertCircle className="w-5 h-5 text-red-500 ml-2 shrink-0 animate-in zoom-in" />}
            </div>
            {errors.whatsapp ? (
              <p className="text-[12px] text-red-500 mt-2 flex items-center gap-1 animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.whatsapp}
              </p>
            ) : (
              <p className="text-[12px] text-gray-500 mt-2">Households may use this to confirm pickups.</p>
            )}
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
            Next: Location & Hours <ArrowRight className="w-5 h-5" />
          </button>

        </form>

        {/* Footer Navigation Tabs */}
        <div className="flex justify-center gap-4 md:gap-8 mt-12 text-[12px] md:text-[14px]">
          <span className="font-bold text-gray-900">Basic Info</span>
          <Link href="/auth/recycler/build-profile/location" className="font-medium text-gray-400 hover:text-[#549B45]">Location</Link>
          <Link href="/auth/recycler/build-profile/categories" className="font-medium text-gray-400 hover:text-[#549B45]">Categories</Link>
          <Link href="/auth/recycler/build-profile/pricing" className="font-medium text-gray-400 hover:text-[#549B45]">Pricing</Link>
        </div>

      </main>
    </div>
  );
}
