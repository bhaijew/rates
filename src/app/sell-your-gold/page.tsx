"use client";

import React, { useState, useEffect } from "react";

interface PurityRange {
  karat: string;
  low: number;
  high: number;
  purityDecimal: number;
}

export default function SellYourGoldPage() {
  const [mounted, setMounted] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Live 24ct spot price per gram
  const liveSpot24ct = 97.74;

  // Form State
  const [selectedPurity, setSelectedPurity] = useState<string>("22ct");
  const [totalWeight, setTotalWeight] = useState<string>("30");
  const [stonesWeight, setStonesWeight] = useState<string>("0");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // 8 Karat Purity Cards matching the reference screenshot exactly
  const purityList: PurityRange[] = [
    { karat: "9ct", low: 33.15, high: 35.72, purityDecimal: 0.375 },
    { karat: "14ct", low: 51.58, high: 55.55, purityDecimal: 0.585 },
    { karat: "18ct", low: 66.30, high: 71.43, purityDecimal: 0.750 },
    { karat: "19ct", low: 69.76, high: 75.18, purityDecimal: 0.792 },
    { karat: "20ct", low: 73.66, high: 79.40, purityDecimal: 0.833 },
    { karat: "21ct", low: 77.40, high: 83.67, purityDecimal: 0.875 },
    { karat: "22ct", low: 81.15, high: 87.42, purityDecimal: 0.916 },
    { karat: "24ct", low: 88.40, high: 96.17, purityDecimal: 0.999 },
  ];

  // Calculation Logic
  const total = parseFloat(totalWeight) || 0;
  const stones = parseFloat(stonesWeight) || 0;
  const netGoldWeight = Math.max(0, total - stones);

  const activePurityObj = purityList.find((p) => p.karat === selectedPurity) || purityList[6];

  const estimatedLow = netGoldWeight > 0 ? netGoldWeight * activePurityObj.low : null;
  const estimatedHigh = netGoldWeight > 0 ? netGoldWeight * activePurityObj.high : null;

  return (
    <div className="relative min-h-screen bg-[#faf7f2] font-sans text-stone-800 pb-20 sm:pb-32 overflow-x-hidden">
      
      {/* Warm Golden Bokeh Background Atmosphere */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-10 -left-10 w-96 h-96 rounded-full bg-amber-100/60 blur-3xl opacity-70" />
        <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] rounded-full bg-[#faecd6]/80 blur-3xl opacity-60" />
        <div className="absolute bottom-20 left-1/4 w-[600px] h-[600px] rounded-full bg-[#fcefe2]/70 blur-3xl opacity-50" />
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-10">
        
        {/* ======================================================== */}
        {/* TOP HEADER CARD (Matching Reference Screenshot)          */}
        {/* ======================================================== */}
        <div className="rounded-[12px] border border-[#dfcca6] bg-white shadow-xs p-6 sm:p-8 text-center space-y-2">
          
          <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-[#8c6d26] font-serif">
            SELL YOUR SCRAP GOLD
          </h1>

          <p className="text-xs sm:text-sm font-medium text-stone-700">
            Get an estimated value for your unwanted, broken or scrap gold jewellery
          </p>

          <p className="text-xs text-stone-500">
            Rings, chains, bracelets, bangles, necklaces, earrings and broken jewellery
          </p>

          {/* Live Spot Pill in Center */}
          <div className="pt-2 flex justify-center">
            <div className="inline-flex items-center gap-2 bg-[#faf8f5] border border-[#dfcca6] rounded-full px-4 py-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-xs font-bold text-stone-800 tracking-wide">
                LIVE 24CT SPOT: <span className="text-[#8c6d26]">£{liveSpot24ct.toFixed(2)} /g</span>
              </span>
            </div>
          </div>

          {/* Refresh & Timestamp */}
          <div className="flex items-center justify-center gap-3 text-[11px] text-stone-400 pt-1">
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-1 hover:text-[#8c6d26] font-semibold text-stone-500 transition-colors cursor-pointer"
            >
              <svg
                className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
            <span>•</span>
            <span className="font-mono">
              {mounted ? "28 October 2026 at 09:40am BST" : ""}
            </span>
          </div>

        </div>

        {/* ======================================================== */}
        {/* TODAY'S ESTIMATED BUYING RANGES (8 PURITY CARDS)         */}
        {/* ======================================================== */}
        <section className="space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-widest text-[#8c6d26]">
              TODAY&apos;S ESTIMATED BUYING RANGES
            </h2>
            <p className="text-xs text-stone-500">
              Estimated price per gram based on live bullion spot rate. Not a guaranteed offer.
            </p>
          </div>

          {/* 8-Card Grid (4 cols desktop, 2 cols mobile) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {purityList.map((p) => {
              const isSelected = p.karat === selectedPurity;
              return (
                <button
                  key={p.karat}
                  type="button"
                  onClick={() => setSelectedPurity(p.karat)}
                  className={`p-3.5 rounded-[8px] border text-center transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#faf6ee] border-[#8c6d26] ring-1 ring-[#8c6d26]/40 shadow-xs"
                      : "bg-white border-[#dfcca6] hover:bg-[#faf8f5]"
                  }`}
                >
                  <div className="text-sm font-bold text-stone-900 font-serif">
                    {p.karat}
                  </div>
                  <div className="text-xs sm:text-[13px] font-extrabold text-[#8c6d26] mt-1">
                    £{p.low.toFixed(2)} - £{p.high.toFixed(2)}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-stone-400 font-medium mt-0.5">
                    / PER GRAM
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ======================================================== */}
        {/* VALUE YOUR GOLD (INTERACTIVE CALCULATOR BOX)             */}
        {/* ======================================================== */}
        <section className="space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#8c6d26]">
              Value Your Gold
            </h2>
            <p className="text-xs sm:text-[13px] text-stone-500 font-medium">
              Get an instant estimated buying range.
            </p>
            <p className="text-[11.5px] text-stone-500 max-w-xl mx-auto leading-relaxed pt-0.5">
              Enter the purity and the weight of your scrap or unwanted gold to see an estimated buying range based on today&apos;s live gold rate. If your item contains stones or non-gold parts, enter their approximate weight.
            </p>
          </div>

          <div className="rounded-[10px] border border-[#dfcca6] bg-[#faf8f5]/80 p-5 sm:p-7 shadow-xs space-y-5">
            
            {/* Row 1: Gold Purity & Total Weight */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Purity Select */}
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1.5 uppercase tracking-wider">
                  Gold Purity
                </label>
                <div className="relative">
                  <select
                    value={selectedPurity}
                    onChange={(e) => setSelectedPurity(e.target.value)}
                    className="w-full bg-white border border-[#dfcca6] rounded-[5px] py-2 px-3 text-xs font-semibold text-stone-800 appearance-none focus:outline-none focus:ring-1 focus:ring-[#8c6d26]"
                  >
                    {purityList.map((p) => (
                      <option key={p.karat} value={p.karat}>
                        {p.karat} ({Math.round(p.purityDecimal * 1000)} Hallmark)
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 text-xs">
                    ▼
                  </div>
                </div>
              </div>

              {/* Total Item Weight (g) */}
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1.5 uppercase tracking-wider">
                  Total Item Weight (g)
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={totalWeight}
                  onChange={(e) => setTotalWeight(e.target.value)}
                  placeholder="eg. 30"
                  className="w-full bg-white border border-[#dfcca6] rounded-[5px] py-2 px-3 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#8c6d26]"
                />
              </div>

            </div>

            {/* Row 2: Stones / Non-Gold Weight */}
            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1.5 uppercase tracking-wider">
                Stones / Non-Gold Weight (g)
              </label>
              <input
                type="number"
                step="any"
                min="0"
                value={stonesWeight}
                onChange={(e) => setStonesWeight(e.target.value)}
                placeholder="0"
                className="w-full bg-white border border-[#dfcca6] rounded-[5px] py-2 px-3 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#8c6d26]"
              />
              <p className="text-[10.5px] text-stone-500 mt-1 leading-relaxed">
                If your item contains stones or other non-gold parts, enter their approximate weight. If you are unsure of their exact size, leave this at 0.
              </p>
            </div>

            {/* ESTIMATED BUYING RANGE RESULT BOX */}
            <div className="p-5 rounded-[8px] bg-[#faecd6]/50 border border-[#dfcca6] text-center space-y-1.5">
              <div className="text-[10.5px] font-bold uppercase tracking-widest text-stone-600">
                YOUR ESTIMATED BUYING RANGE
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#8c6d26] tracking-tight">
                {estimatedLow !== null && estimatedHigh !== null
                  ? `£${estimatedLow.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} - £${estimatedHigh.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : "—"}
              </div>
              <div className="text-[11px] text-stone-500 font-medium">
                {netGoldWeight > 0
                  ? `Based on ${netGoldWeight.toFixed(2)}g net ${selectedPurity} gold weight.`
                  : "Enter a purity and weight to see your estimate."}
              </div>
            </div>

            {/* Fineprint inside card */}
            <p className="text-[10px] text-stone-400 text-center leading-relaxed">
              *This is an estimated price range and is not a guaranteed offer. The final price will depend on verification of the item&apos;s weight, purity, stones, non-gold components and other relevant factors at the time of assessment. Gold prices can change with the market.
            </p>

          </div>
        </section>

        {/* ======================================================== */}
        {/* HOW IT WORKS (3 STEP CARDS)                              */}
        {/* ======================================================== */}
        <section className="space-y-3 pt-2">
          <div className="text-center text-[10.5px] font-bold uppercase tracking-widest text-[#8c6d26]">
            HOW IT WORKS
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Card 01 */}
            <div className="p-4 rounded-[8px] bg-white border border-[#dfcca6] shadow-2xs space-y-1">
              <div className="text-sm font-black text-[#8c6d26]">01</div>
              <h3 className="text-xs font-bold text-stone-900">Bring Your Gold</h3>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Bring your unwanted or precious gold jewellery.
              </p>
            </div>

            {/* Card 02 */}
            <div className="p-4 rounded-[8px] bg-white border border-[#dfcca6] shadow-2xs space-y-1">
              <div className="text-sm font-black text-[#8c6d26]">02</div>
              <h3 className="text-xs font-bold text-stone-900">We Test &amp; Weigh</h3>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                We verify the purity and actual gold weight.
              </p>
            </div>

            {/* Card 03 */}
            <div className="p-4 rounded-[8px] bg-white border border-[#dfcca6] shadow-2xs space-y-1">
              <div className="text-sm font-black text-[#8c6d26]">03</div>
              <h3 className="text-xs font-bold text-stone-900">Receive Your Offer</h3>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Your final offer is based on the verified gold and current market rate.
              </p>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* IMPORTANT INFORMATION BOX                                */}
        {/* ======================================================== */}
        <div className="p-4 rounded-[8px] bg-[#faf8f5] border border-[#dfcca6]/80 text-left sm:text-center space-y-2 shadow-2xs">
          <div className="text-[10.5px] font-bold uppercase tracking-widest text-stone-600 text-center">
            IMPORTANT INFORMATION
          </div>
          
          <div className="space-y-1.5 text-xs text-stone-600 max-w-3xl mx-auto leading-relaxed">
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
              <span>
                Prices shown are estimates based on live market spot prices and may change as the market moves. The final price offered can only be confirmed after we physically inspect and test your jewellery, including its purity, actual gold weight and any stones or non-gold components.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
              <span>
                Valid photographic identification is required when selling your items.
              </span>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
