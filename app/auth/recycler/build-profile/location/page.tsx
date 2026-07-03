"use client";

import React, { useState, useEffect } from 'react';
import {
  Globe, ChevronLeft, Check, MapPin, Building, ChevronDown,
  Clock, Bot, ArrowRight, AlertCircle, X, Leaf
} from 'lucide-react';
import Link from 'next/link';

export default function ProfileLocationStep() {
  // Form State
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [coverageInput, setCoverageInput] = useState('');
  const [coverageAreas, setCoverageAreas] = useState<string[]>(['Kubwa', 'Gwagwalada', 'Kuje']);

  // Availability State
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [openTime, setOpenTime] = useState('');
  const [closeTime, setCloseTime] = useState('');
  const [availableNow, setAvailableNow] = useState(false);

  // Touched States for Error Handling
  const [touched, setTouched] = useState({
    address: false,
    city: false,
    state: false,
    coverage: false,
    days: false,
    times: false,
  });

  // Validation States
  const [errors, setErrors] = useState({
    address: '',
    city: '',
    state: '',
    coverage: '',
    days: '',
    times: '',
  });

  const [isFormValid, setIsFormValid] = useState(false);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Validation Effect
  useEffect(() => {
    const newErrors = { address: '', city: '', state: '', coverage: '', days: '', times: '' };
    let isValid = true;

    // Address
    if (touched.address && address.trim().length < 5) {
      newErrors.address = 'Please enter your full street address.';
      isValid = false;
    } else if (address.trim().length < 5) isValid = false;

    // City
    if (touched.city && city.trim().length < 2) {
      newErrors.city = 'City is required.';
      isValid = false;
    } else if (city.trim().length < 2) isValid = false;

    // State
    if (touched.state && state === '') {
      newErrors.state = 'Please select a state.';
      isValid = false;
    } else if (state === '') isValid = false;

    // Coverage Areas
    if (touched.coverage && coverageAreas.length === 0) {
      newErrors.coverage = 'Add at least one coverage area.';
      isValid = false;
    } else if (coverageAreas.length === 0) isValid = false;

    // Availability Days
    if (touched.days && selectedDays.length === 0) {
      newErrors.days = 'Select at least one operating day.';
      isValid = false;
    } else if (selectedDays.length === 0) isValid = false;

    // Times
    if (selectedDays.length > 0) {
      if (touched.times && (!openTime || !closeTime)) {
        newErrors.times = 'Operating hours are required for selected days.';
        isValid = false;
      } else if (!openTime || !closeTime) {
        isValid = false;
      }
    }

    setErrors(newErrors);
    setIsFormValid(isValid);
  }, [address, city, state, coverageAreas, selectedDays, openTime, closeTime, touched]);

  // Handlers
  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleAddCoverage = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (coverageInput.trim() && coverageAreas.length < 10 && !coverageAreas.includes(coverageInput.trim())) {
      setCoverageAreas([...coverageAreas, coverageInput.trim()]);
      setCoverageInput('');
      setTouched(prev => ({ ...prev, coverage: true }));
    }
  };

  const handleRemoveCoverage = (areaToRemove: string) => {
    setCoverageAreas(coverageAreas.filter(area => area !== areaToRemove));
  };

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
    setTouched(prev => ({ ...prev, days: true }));
  };

  const selectAllWeekdays = () => {
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    setSelectedDays(Array.from(new Set([...selectedDays, ...weekdays])));
    setTouched(prev => ({ ...prev, days: true }));
  };

  return (
    <div className="min-h-screen bg-[#fcfdfc] font-sans text-gray-900 selection:bg-green-100 selection:text-green-900 flex flex-col relative pb-10 overflow-x-hidden">

      {/* Edge-to-Edge Decorative Top Wave */}
      <div className="absolute top-0 left-0 w-full h-56 md:h-72 lg:h-80 bg-[#f6fcf4] z-0">
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
            <Link href="/auth/recycler/build-profile" className="flex items-center gap-1.5 text-[#1b5030] hover:text-[#549B45] font-semibold text-[14px] md:text-[15px] transition-colors cursor-pointer">
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
              Back
            </Link>
            <div className="flex items-center gap-1 text-[#549B45] font-medium text-[13px] md:text-[14px]">
              Saved <Check className="w-4 h-4" />
            </div>
          </div>

          {/* Progress Bars (Step 2 of 4) */}
          <div className="flex gap-2 w-full mb-2">
            <div className="h-1.5 flex-1 bg-[#549B45] rounded-full"></div>
            <div className="h-1.5 flex-1 bg-[#549B45] rounded-full"></div>
            <div className="h-1.5 flex-1 bg-gray-200 rounded-full"></div>
            <div className="h-1.5 flex-1 bg-gray-200 rounded-full"></div>
          </div>
          <div className="flex justify-between text-[11px] md:text-[13px] text-gray-500 font-medium">
            <span>Step 2 of 4</span>
            <span>Where You Operate</span>
          </div>
        </div>

        {/* Title */}
        <div className="mb-8 md:mb-10">
          <h1 className="text-[28px] md:text-4xl lg:text-[40px] leading-tight font-extrabold text-[#111827] mb-2 md:mb-3">
            Where Do You Operate?
          </h1>
          <p className="text-[14px] md:text-base text-gray-500 font-medium">
            Households nearby will find you based on your location and availability.
          </p>
        </div>

        <form className="w-full flex flex-col gap-10 md:gap-12 relative" onSubmit={(e) => e.preventDefault()}>

          {/* --- SECTION 1: YOUR LOCATION --- */}
          <div className="flex flex-col gap-6">
            <h2 className="font-bold text-[16px] md:text-lg text-gray-900">Your Location</h2>

            {/* Pickup Address */}
            <div>
              <label className="block text-[13px] md:text-[14px] font-medium text-gray-700 mb-2">Pickup Address</label>
              <div className={`relative flex items-center border rounded-[1rem] md:rounded-2xl px-4 py-3.5 bg-white transition-colors shadow-sm ${errors.address ? 'border-red-400 focus-within:border-red-500' : 'border-gray-200 focus-within:border-[#549B45]'}`}>
                <MapPin className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onBlur={() => handleBlur('address')}
                  name="address"
                  placeholder="Street address or area name"
                  className="w-full outline-none text-[14px] md:text-[15px] text-gray-900 placeholder:text-gray-400 bg-transparent"
                />
                {errors.address && <AlertCircle className="w-5 h-5 text-red-500 ml-2 shrink-0 animate-in zoom-in" />}
              </div>
              {errors.address && (
                <p className="text-[12px] text-red-500 mt-2 flex items-center gap-1 animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.address}
                </p>
              )}
            </div>

            {/* Map Placeholder Box */}
            <div className="relative w-full h-[140px] md:h-[180px] bg-gradient-to-br from-[#e3eedc] to-[#f1f7ef] rounded-[1rem] md:rounded-2xl border border-[#549B45]/20 flex flex-col items-center justify-center cursor-pointer group hover:shadow-md transition-shadow">
              <MapPin className="w-8 h-8 text-[#549B45] mb-2 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-[13px] md:text-[14px] font-medium text-[#1b5030]">Tap to pick location on map</span>

              <button type="button" className="absolute bottom-3 right-3 bg-white text-[#1b5030] border border-gray-200 shadow-sm rounded-full px-3 py-1.5 text-[11px] md:text-xs font-bold flex items-center gap-1.5 hover:bg-gray-50 transition-colors">
                <MapPin className="w-3.5 h-3.5" /> Use GPS
              </button>
            </div>

            {/* City and State Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* City */}
              <div>
                <label className="block text-[13px] md:text-[14px] font-medium text-gray-700 mb-2">City</label>
                <div className={`relative flex items-center border rounded-[1rem] md:rounded-2xl px-4 py-3.5 bg-white transition-colors shadow-sm ${errors.city ? 'border-red-400 focus-within:border-red-500' : 'border-gray-200 focus-within:border-[#549B45]'}`}>
                  <Building className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onBlur={() => handleBlur('city')}
                    name="city"
                    placeholder="e.g. Abuja"
                    className="w-full outline-none text-[14px] md:text-[15px] text-gray-900 placeholder:text-gray-400 bg-transparent"
                  />
                  {errors.city && <AlertCircle className="w-5 h-5 text-red-500 ml-2 shrink-0 animate-in zoom-in" />}
                </div>
                {errors.city && (
                  <p className="text-[12px] text-red-500 mt-2 flex items-center gap-1 animate-in fade-in">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.city}
                  </p>
                )}
              </div>

              {/* State */}
              <div>
                <label className="block text-[13px] md:text-[14px] font-medium text-gray-700 mb-2">State <span className="text-red-500">*</span></label>
                <div className={`relative flex items-center border rounded-[1rem] md:rounded-2xl bg-white transition-colors shadow-sm ${errors.state ? 'border-red-400 focus-within:border-red-500' : 'border-gray-200 focus-within:border-[#549B45]'}`}>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    onBlur={() => handleBlur('state')}
                    name="state"
                    className="w-full appearance-none outline-none text-[14px] md:text-[15px] text-gray-900 bg-transparent px-4 py-3.5 cursor-pointer"
                  >
                    <option value="" disabled>Select State</option>
                    <option value="Lagos">Lagos</option>
                    <option value="FCT">Federal Capital Territory (FCT)</option>
                    <option value="Kano">Kano</option>
                    <option value="Rivers">Rivers</option>
                  </select>
                  <div className="absolute right-4 pointer-events-none flex items-center gap-2">
                    {errors.state && <AlertCircle className="w-5 h-5 text-red-500 shrink-0 animate-in zoom-in" />}
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                {errors.state && (
                  <p className="text-[12px] text-red-500 mt-2 flex items-center gap-1 animate-in fade-in">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.state}
                  </p>
                )}
              </div>
            </div>

            {/* Coverage Areas */}
            <div>
              <label className="block text-[13px] md:text-[14px] font-medium text-gray-700 mb-2">Coverage Areas</label>
              <div className="flex gap-2 mb-3">
                <div className={`flex-grow relative flex items-center border rounded-[1rem] md:rounded-2xl px-4 py-3 bg-white transition-colors shadow-sm ${errors.coverage ? 'border-red-400 focus-within:border-red-500' : 'border-gray-200 focus-within:border-[#549B45]'}`}>
                  <input
                    type="text"
                    value={coverageInput}
                    onChange={(e) => setCoverageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCoverage(e)}
                    onBlur={() => handleBlur('coverage')}
                    name="coverageInput"
                    placeholder="Add neighborhoods you cover"
                    className="w-full outline-none text-[14px] md:text-[15px] text-gray-900 placeholder:text-gray-400 bg-transparent"
                    disabled={coverageAreas.length >= 10}
                  />
                  {errors.coverage && coverageAreas.length === 0 && <AlertCircle className="w-5 h-5 text-red-500 ml-2 shrink-0 animate-in zoom-in" />}
                </div>
                <button
                  type="button"
                  onClick={handleAddCoverage}
                  disabled={!coverageInput.trim() || coverageAreas.length >= 10}
                  className="bg-[#549B45] text-white px-5 py-3 rounded-[1rem] md:rounded-2xl font-semibold text-[13px] md:text-[14px] hover:bg-[#458237] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shrink-0"
                >
                  Add +
                </button>
              </div>

              {/* Area Chips */}
              <div className="flex flex-wrap gap-2 mb-2">
                {coverageAreas.map(area => (
                  <div key={area} className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-[12px] md:text-[13px] font-medium flex items-center gap-1.5 animate-in zoom-in">
                    {area}
                    <button type="button" onClick={() => handleRemoveCoverage(area)} className="text-gray-400 hover:text-gray-600 focus:outline-none">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {errors.coverage && coverageAreas.length === 0 ? (
                <p className="text-[12px] text-red-500 flex items-center gap-1 animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.coverage}
                </p>
              ) : (
                <p className={`text-[12px] ${coverageAreas.length >= 10 ? 'text-orange-500 font-bold' : 'text-gray-500'}`}>
                  Add all areas you're willing to travel to for pickups. Max 10.
                </p>
              )}
            </div>
          </div>

          {/* --- SECTION 2: YOUR AVAILABILITY --- */}
          <div className="flex flex-col gap-6">
            <h2 className="font-bold text-[16px] md:text-lg text-gray-900">Your Availability</h2>

            <div className="bg-white border border-gray-100 rounded-3xl p-5 md:p-8 shadow-sm">

              {/* Day Selector */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 md:gap-3 mb-3">
                  {daysOfWeek.map(day => {
                    const isSelected = selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`w-11 h-11 md:w-12 md:h-12 rounded-full border flex items-center justify-center text-[13px] md:text-[14px] font-semibold transition-all duration-300 ${
                          isSelected
                            ? 'bg-[#eaf4e7] border-[#549B45] text-[#1b5030] shadow-sm'
                            : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
                <div className="flex justify-between items-center">
                  {errors.days ? (
                    <p className="text-[12px] text-red-500 flex items-center gap-1 animate-in fade-in">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.days}
                    </p>
                  ) : <div></div>}
                  <button type="button" onClick={selectAllWeekdays} className="text-[#1b5030] font-bold text-[12px] md:text-[13px] hover:text-[#549B45] transition-colors ml-auto">
                    Select All Weekdays
                  </button>
                </div>
              </div>

              {/* Time Inputs */}
              <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3 md:gap-6 mb-8">
                <div className="w-full">
                  <label className="block text-[12px] md:text-[13px] font-medium text-gray-500 mb-1.5">Opens</label>
                  <div className={`relative flex items-center border rounded-[1rem] px-4 py-3 bg-white transition-colors ${errors.times ? 'border-red-400 focus-within:border-red-500' : 'border-gray-200 focus-within:border-[#549B45]'}`}>
                    <Clock className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                    <input
                      type="time"
                      value={openTime}
                      onChange={(e) => setOpenTime(e.target.value)}
                      onBlur={() => handleBlur('times')}
                      name="openTime"
                      className="w-full outline-none text-[14px] text-gray-900 bg-transparent"
                    />
                  </div>
                </div>

                <div className="text-[13px] text-gray-400 font-medium pb-4">to</div>

                <div className="w-full">
                  <label className="block text-[12px] md:text-[13px] font-medium text-gray-500 mb-1.5">Closes</label>
                  <div className={`relative flex items-center border rounded-[1rem] px-4 py-3 bg-white transition-colors ${errors.times ? 'border-red-400 focus-within:border-red-500' : 'border-gray-200 focus-within:border-[#549B45]'}`}>
                    <Clock className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                    <input
                      type="time"
                      value={closeTime}
                      onChange={(e) => setCloseTime(e.target.value)}
                      onBlur={() => handleBlur('times')}
                      name="closeTime"
                      className="w-full outline-none text-[14px] text-gray-900 bg-transparent"
                    />
                  </div>
                </div>
              </div>

              {errors.times && (
                 <p className="text-[12px] text-red-500 flex items-center gap-1 mb-6 mt-[-1rem] animate-in fade-in">
                   <AlertCircle className="w-3.5 h-3.5" /> {errors.times}
                 </p>
              )}

              {/* Available Now Toggle */}
              <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-4">
                <span className="font-bold text-[14px] md:text-[15px] text-gray-900">Available for pickups now</span>
                <button
                  type="button"
                  onClick={() => setAvailableNow(!availableNow)}
                  className={`w-12 h-6 md:w-14 md:h-7 rounded-full transition-colors duration-300 relative flex items-center px-1 focus:outline-none focus:ring-2 focus:ring-[#549B45]/50 ${
                    availableNow ? 'bg-[#549B45]' : 'bg-gray-200'
                  }`}
                  aria-pressed={availableNow}
                >
                  <div className={`w-4 h-4 md:w-5 md:h-5 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${
                    availableNow ? 'translate-x-6 md:translate-x-7' : 'translate-x-0'
                  }`}></div>
                </button>
              </div>

            </div>
          </div>

          {/* Ask Mina Prompt */}
          <div className="flex items-center gap-4 bg-[#fcfdfc] md:bg-white rounded-full">
            <div className="w-10 h-10 bg-[#eaf4e7] rounded-full flex items-center justify-center relative shadow-sm shrink-0">
               <Bot className="w-6 h-6 text-[#549B45]" />
            </div>
            <div className="flex items-center bg-[#f1f8ee] rounded-full px-4 py-2">
              <span className="text-[13px] md:text-[14px] text-gray-700 font-medium mr-2">Need help filling this in?</span>
              <button type="button" className="text-[13px] md:text-[14px] font-bold text-[#1b5030] hover:text-[#549B45] flex items-center gap-1 transition-colors">
                Ask Mina <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-4 rounded-full font-bold text-[15px] md:text-[16px] flex items-center justify-center transition-all duration-300 ${
              isFormValid
                ? 'bg-[#549B45] text-white shadow-lg shadow-green-900/20 hover:bg-[#458237] hover:-translate-y-0.5 cursor-pointer'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Next: Materials Accepted
          </button>

        </form>

        {/* Footer Navigation Tabs */}
        <div className="flex justify-center gap-4 md:gap-8 mt-12 text-[12px] md:text-[14px]">
          <Link href="/auth/recycler/build-profile" className="font-bold text-[#549B45]">Basic Info</Link>
          <span className="font-bold text-gray-900">Location</span>
          <span className="text-gray-400 font-medium">Categories</span>
          <span className="text-gray-400 font-medium">Pricing</span>
        </div>

      </main>
    </div>
  );
}
