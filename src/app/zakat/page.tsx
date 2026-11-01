"use client";

import React, { useState } from "react";

export default function ZakatPage() {
  // Fiqh selection: Hanafi vs Ja'fari (Imam Ja'far Sadiq)
  const [fiqh, setFiqh] = useState<"hanafi" | "jafari">("hanafi");

  // Gold Purity selection (karat)
  const [selectedPurity, setSelectedPurity] = useState<number>(22);
  const [customPurity, setCustomPurity] = useState<string>("");
  const [isCustom, setIsCustom] = useState(false);

  // Weight mode & amount
  const [weightMode, setWeightMode] = useState<"grams" | "tolas">("grams");
  const [weightInput, setWeightInput] = useState<string>("100");

  // Accordion breakdown state
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Live gold spot rate (GBP per gram 24ct)
  const liveRate24k = 96.61;

  // Active karat
  const activeKarat = isCustom ? (parseFloat(customPurity) || 24) : selectedPurity;
  const purityFraction = Math.min(Math.max(activeKarat / 24, 0), 1);

  // Weight in grams calculation
  const rawWeight = parseFloat(weightInput) || 0;
  const weightInGrams = weightMode === "tolas" ? rawWeight * 11.6638 : rawWeight;

  // Fine pure 24K equivalent weight
  const fineGoldGrams = weightInGrams * purityFraction;
  const totalGoldValueGBP = fineGoldGrams * liveRate24k;

  // Nisab definitions
  // Fiqh Hanafi: 7.5 Tolas = 87.48 Grams of gold
  const hanafiNisabGrams = 87.48;
  const hanafiNisabGBP = hanafiNisabGrams * liveRate24k;

  // Fiqh Ja'fari: 15 Ordinary Mithqals ≈ 69.12 Grams of minted/bullion gold
  const jafariNisabGrams = 69.12;
  const jafariNisabGBP = jafariNisabGrams * liveRate24k;

  const currentNisabGrams = fiqh === "hanafi" ? hanafiNisabGrams : jafariNisabGrams;
  const currentNisabGBP = fiqh === "hanafi" ? hanafiNisabGBP : jafariNisabGBP;

  const isEligible = fineGoldGrams >= currentNisabGrams;
  const zakatDueGBP = isEligible ? totalGoldValueGBP * 0.025 : 0;

  const standardPurities = [24, 23, 22, 21, 20, 18, 14, 9];

  // Quran Ayah Carousel Slides
  const slides = [
    {
      arabic: "خُذْ مِنْ أَمْوَالِهِمْ صَدَقَةً تُطَهِّرُهُمْ وَتُزَكِّيهِم بِهَا",
      translation:
        "“Take from their wealth a charity by which you purify them and cause them to increase.”",
      reference: "Surah At-Tawbah 9:103",
    },
    {
      arabic: "وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ",
      translation:
        "“And establish prayer and give Zakat, and whatever good you put forward for yourselves – you will find it with Allah.”",
      reference: "Surah Al-Baqarah 2:110",
    },
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="min-h-screen bg-[#faf8f5]/60 font-sans text-slate-800 pb-20 sm:pb-28">
      
      {/* Background Soft Gold Glow (Desktop enhancement) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-b from-[#f5ede0]/40 to-transparent pointer-events-none -z-10" />

      <main className="max-w-3xl mx-auto px-3.5 sm:px-6 pt-6 sm:pt-14">
        
        {/* Main Title Header (Desktop & Mobile optimized) */}
        <div className="text-center space-y-1.5 sm:space-y-2">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#8b6914] bg-[#faf5ea] border border-[#dfcca6]/60 px-3 py-1 rounded-full inline-block">
            Islamic Wealth Obligation
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-stone-900 font-serif tracking-tight mt-1">
            Zakat Calculator
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-medium max-w-md mx-auto px-2">
            Calculate your estimated Zakat on gold using today&apos;s live spot rate.
          </p>
          <div className="flex items-center justify-center gap-2 text-stone-300 py-0.5 text-xs">
            <span>&lt;</span>
            <span className="w-10 sm:w-16 h-[1px] bg-stone-300" />
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full border border-stone-400" />
            <span className="w-10 sm:w-16 h-[1px] bg-stone-300" />
            <span>&gt;</span>
          </div>
        </div>

        {/* Fiqh Switcher (Hanafi vs Ja'fari) - Mobile full-width, Desktop inline */}
        <div className="mt-5 sm:mt-7 flex flex-col items-center">
          <div className="w-full sm:w-auto grid grid-cols-2 sm:flex p-1 bg-stone-200/60 border border-stone-300/60 rounded-[5px] text-xs font-semibold gap-1">
            <button
              onClick={() => setFiqh("hanafi")}
              className={`py-2 px-3 sm:px-6 rounded-[4px] transition-all cursor-pointer text-center ${
                fiqh === "hanafi"
                  ? "bg-[#8b6914] text-white shadow-xs font-bold"
                  : "text-stone-700 hover:text-stone-900"
              }`}
            >
              Fiqh Hanafi (حنفی)
            </button>
            <button
              onClick={() => setFiqh("jafari")}
              className={`py-2 px-3 sm:px-6 rounded-[4px] transition-all cursor-pointer text-center ${
                fiqh === "jafari"
                  ? "bg-[#8b6914] text-white shadow-xs font-bold"
                  : "text-stone-700 hover:text-stone-900"
              }`}
            >
              Fiqh Ja&apos;fari (جعفریہ)
            </button>
          </div>

          {/* Fiqh Rules Note */}
          <div className="mt-2.5 p-3 rounded-[5px] bg-white/80 border border-[#dfcca6]/50 text-[11px] sm:text-xs text-stone-600 text-center max-w-xl shadow-xs">
            {fiqh === "hanafi" ? (
              <span>
                <strong>Fiqh Hanafi:</strong> Zakat is wajib on <strong>all gold</strong> (personal worn jewellery + bullion/bars) meeting the Nisab of <strong>7.5 Tolas (87.48g)</strong>.
              </span>
            ) : (
              <span>
                <strong>Fiqh Ja&apos;fari:</strong> Zakat is wajib on <strong>minted gold currency/bullion</strong> meeting the Nisab of <strong>15 Mithqals (~69.12g)</strong>. Personal worn jewellery is Mustahab (recommended) / Khums applies on annual surplus.
              </span>
            )}
          </div>
        </div>

        {/* Quran Ayah Card Carousel (Responsive Padding & Fonts) */}
        <div className="mt-5 sm:mt-6 relative p-4 sm:p-7 rounded-[5px] border border-[#dfcca6] bg-[#fbf9f4] text-center shadow-xs">
          <div className="absolute top-2 left-2 text-[#caa771] text-xs font-mono select-none">┌</div>
          <div className="absolute top-2 right-2 text-[#caa771] text-xs font-mono select-none">┐</div>
          <div className="absolute bottom-2 left-2 text-[#caa771] text-xs font-mono select-none">└</div>
          <div className="absolute bottom-2 right-2 text-[#caa771] text-xs font-mono select-none">┘</div>

          <div className="text-lg sm:text-2xl font-serif text-stone-900 leading-relaxed font-bold px-1">
            {slides[currentSlide].arabic}
          </div>
          <p className="text-xs sm:text-sm text-stone-600 italic mt-2.5 sm:mt-3 font-medium max-w-md mx-auto leading-relaxed">
            {slides[currentSlide].translation}
          </p>
          <div className="text-[10px] sm:text-[11px] text-amber-800 font-semibold mt-1.5 sm:mt-2">
            {slides[currentSlide].reference}
          </div>

          {/* Dots navigation */}
          <div className="flex items-center justify-center gap-1.5 mt-3 sm:mt-4 text-[10px]">
            <button
              onClick={() => setCurrentSlide(0)}
              aria-label="Slide 1"
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                currentSlide === 0 ? "bg-[#8b6914] w-4" : "bg-stone-300 w-1.5"
              }`}
            />
            <button
              onClick={() => setCurrentSlide(1)}
              aria-label="Slide 2"
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                currentSlide === 1 ? "bg-[#8b6914] w-4" : "bg-stone-300 w-1.5"
              }`}
            />
          </div>
        </div>

        {/* Main Calculator Card (Dual Optimized Desktop & Mobile) */}
        <div className="mt-6 sm:mt-8 rounded-[5px] border border-[#dfcca6] bg-white p-4 sm:p-8 shadow-xs space-y-6 sm:space-y-7">
          
          {/* Top Live Rate Header */}
          <div className="flex items-center justify-between pb-3.5 sm:pb-4 border-b border-stone-200/70">
            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-stone-500">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8b6914] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span>LIVE 24CT GOLD RATE</span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-base sm:text-xl font-black text-stone-900 tracking-tight">
                £{liveRate24k.toFixed(2)}
              </span>
              <span className="text-[11px] sm:text-xs text-stone-400 font-normal">/ gram</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
            </div>
          </div>

          {/* Step 1: Gold Purity (Mobile grid-cols-4, Desktop flex-wrap) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#8b6914] text-white text-xs font-bold flex items-center justify-center shrink-0">
                1
              </span>
              <span className="text-xs sm:text-sm font-bold text-stone-900">
                Gold Purity
              </span>
            </div>

            {/* Purity Pills: 4 columns on mobile, row on desktop */}
            <div className="grid grid-cols-4 sm:flex sm:flex-wrap items-center gap-1.5 sm:gap-2 pt-1">
              {standardPurities.map((p) => {
                const isSelected = !isCustom && selectedPurity === p;
                return (
                  <button
                    key={p}
                    onClick={() => {
                      setSelectedPurity(p);
                      setIsCustom(false);
                    }}
                    className={`py-2 sm:px-3.5 sm:py-1.5 text-xs font-bold rounded-[4px] transition-all cursor-pointer text-center ${
                      isSelected
                        ? "bg-[#6d510c] text-white shadow-xs"
                        : "bg-[#f5f1e8] text-stone-700 hover:bg-[#ede5d6]"
                    }`}
                  >
                    {p}ct
                  </button>
                );
              })}

              {/* Custom ct Input */}
              <div
                onClick={() => setIsCustom(true)}
                className={`col-span-4 sm:col-auto flex items-center justify-center sm:justify-start border rounded-[4px] px-2.5 py-1.5 bg-white cursor-pointer ${
                  isCustom ? "border-[#8b6914] ring-1 ring-[#8b6914]" : "border-stone-200"
                }`}
              >
                <input
                  type="number"
                  min="1"
                  max="24"
                  placeholder="Custom"
                  value={customPurity}
                  onChange={(e) => {
                    setIsCustom(true);
                    setCustomPurity(e.target.value);
                  }}
                  className="w-16 text-xs font-bold text-stone-800 outline-none bg-transparent text-center sm:text-left"
                />
                <span className="text-xs text-stone-400 font-medium">ct</span>
              </div>
            </div>

            <p className="text-[10.5px] sm:text-[11px] text-stone-400 mt-1">
              Purity is used to calculate the fine-gold value of your jewellery.
            </p>
          </div>

          {/* Step 2: Weight Unit & Input */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#8b6914] text-white text-xs font-bold flex items-center justify-center shrink-0">
                2
              </span>
              <span className="text-xs sm:text-sm font-bold text-stone-900">
                Do you know your gold weight in grams or tolas?
              </span>
            </div>
            <p className="text-[10.5px] sm:text-[11px] text-stone-400 -mt-1">
              Select how your gold weight is measured.
            </p>

            {/* Weight Toggle Buttons */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                onClick={() => setWeightMode("grams")}
                className={`py-2 sm:py-2.5 text-xs font-bold rounded-[5px] transition-all cursor-pointer border ${
                  weightMode === "grams"
                    ? "bg-[#8b6914] text-white border-[#8b6914] shadow-xs"
                    : "bg-[#f5f1e8] text-stone-700 border-transparent hover:bg-[#ede5d6]"
                }`}
              >
                Weight in Grams
              </button>
              <button
                onClick={() => setWeightMode("tolas")}
                className={`py-2 sm:py-2.5 text-xs font-bold rounded-[5px] transition-all cursor-pointer border ${
                  weightMode === "tolas"
                    ? "bg-[#8b6914] text-white border-[#8b6914] shadow-xs"
                    : "bg-[#f5f1e8] text-stone-700 border-transparent hover:bg-[#ede5d6]"
                }`}
              >
                Weight in Tolas
              </button>
            </div>

            {/* Gold Weight Input Box */}
            <div className="mt-2.5 sm:mt-3">
              <label className="block text-[11px] font-bold text-stone-600 mb-1">
                Gold Weight
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  placeholder="e.g. 100"
                  className="w-full bg-white border border-[#dfcca6] rounded-[5px] px-3.5 py-2.5 text-sm font-semibold text-stone-900 focus:outline-none focus:border-[#8b6914] focus:ring-1 focus:ring-[#8b6914] pr-16"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 font-semibold uppercase">
                  {weightMode === "grams" ? "grams" : "tolas"}
                </span>
              </div>
            </div>
          </div>

          {/* Step 3: Estimated Zakat Box (Responsive Centerpiece) */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#8b6914] text-white text-xs font-bold flex items-center justify-center shrink-0">
                3
              </span>
              <span className="text-xs sm:text-sm font-bold text-stone-900">
                Estimated Zakat
              </span>
            </div>

            {/* Curved Highlight Output Box */}
            <div className="relative p-5 sm:p-8 rounded-[16px] sm:rounded-[20px] border-2 border-[#dfcca6] bg-[#faf8f5]/80 text-center shadow-xs">
              <div className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-stone-500">
                YOUR ESTIMATED ZAKAT
              </div>
              <div className="w-8 sm:w-12 h-[1.5px] bg-[#caa771] mx-auto my-1.5 sm:my-2" />

              <div className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight mt-1">
                {isEligible ? (
                  `£${zakatDueGBP.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                ) : (
                  <span className="text-stone-400 text-xl sm:text-2xl font-bold">Below Nisab</span>
                )}
              </div>

              <div className="text-[11px] sm:text-xs text-stone-500 font-medium mt-1.5 sm:mt-2">
                {isEligible
                  ? "2.5% of the calculated fine gold value"
                  : `Nisab requirement is ${currentNisabGrams.toFixed(2)}g fine gold (£${currentNisabGBP.toLocaleString("en-GB", { maximumFractionDigits: 2 })})`}
              </div>
            </div>

            {/* Accordion: View Calculation Breakdown */}
            <div className="pt-1.5">
              <button
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-[#8b6914] transition-colors cursor-pointer py-1"
              >
                <span>{showBreakdown ? "▲" : "▼"}</span>
                <span>{showBreakdown ? "Hide calculation breakdown" : "View calculation breakdown"}</span>
              </button>

              {showBreakdown && (
                <div className="mt-2.5 p-3.5 sm:p-4 rounded-[5px] bg-[#faf8f5] border border-stone-200 text-xs space-y-2 text-stone-700 animate-fadeIn">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Gross Weight:</span>
                    <span className="font-bold text-stone-900">{rawWeight} {weightMode} ({weightInGrams.toFixed(2)}g)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Purity:</span>
                    <span className="font-bold text-stone-900">{activeKarat}ct ({(purityFraction * 100).toFixed(1)}% pure gold)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Fine Pure 24K Equivalent:</span>
                    <span className="font-bold text-stone-900">{fineGoldGrams.toFixed(2)} grams</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Current 24K Live Rate:</span>
                    <span className="font-bold text-stone-900">£{liveRate24k.toFixed(2)} / gram</span>
                  </div>
                  <div className="flex justify-between border-t border-stone-200/70 pt-2">
                    <span className="text-stone-500">Total Gold Value:</span>
                    <span className="font-bold text-stone-900">£{totalGoldValueGBP.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Nisab ({fiqh === "hanafi" ? "Fiqh Hanafi" : "Fiqh Ja'fari"}):</span>
                    <span className="font-bold text-[#8b6914]">{currentNisabGrams.toFixed(2)}g (£{currentNisabGBP.toLocaleString("en-GB", { maximumFractionDigits: 2 })})</span>
                  </div>
                  <div className="flex justify-between border-t border-stone-200/70 pt-2 text-sm font-black text-stone-900">
                    <span>Zakat Due (2.5%):</span>
                    <span className="text-[#8b6914]">£{zakatDueGBP.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Footer Islamic Scholar Disclaimer */}
        <div className="mt-6 sm:mt-8 text-center text-[11px] text-stone-500 leading-relaxed max-w-xl mx-auto space-y-1.5 px-2">
          <div className="flex items-start justify-center gap-1.5 text-left sm:text-center">
            <svg className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth="1.8" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 8v4m0 4h.01" />
            </svg>
            <p>
              This calculator provides an estimated Zakat amount based on gold weight, purity and live gold spot rates. Individual circumstances and scholarly opinions may differ. Please consult a qualified Islamic scholar if you are unsure about your personal Zakat obligation.
            </p>
          </div>
          <div className="text-[10px] text-stone-400 pt-1">
            Live rate updated 28 October 2026 at UK time
          </div>
        </div>

      </main>
    </div>
  );
}
