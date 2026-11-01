"use client";

import React, { useState, useEffect } from "react";

export default function SellBullionPage() {
  const [mounted, setMounted] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Spot prices per gram (GBP)
  const spotGold = 97.74;
  const spotSilver = 1.31;

  // Gold Bullion Form State
  const [goldType, setGoldType] = useState<"bar" | "coin">("bar");
  const [goldWeight, setGoldWeight] = useState<string>("");

  // Silver Bullion Form State
  const [silverType, setSilverType] = useState<"bar" | "coin">("bar");
  const [silverPurity, setSilverPurity] = useState<string>("999");
  const [silverWeight, setSilverWeight] = useState<string>("111");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // Quick weight helper buttons
  const goldQuickWeights = [
    { label: "1g", val: "1" },
    { label: "2.5g", val: "2.5" },
    { label: "5g", val: "5" },
    { label: "10g", val: "10" },
    { label: "20g", val: "20" },
    { label: "1oz", val: "31.1" },
    { label: "50g", val: "50" },
    { label: "100g", val: "100" },
  ];

  const silverQuickWeights = [
    { label: "1g", val: "1" },
    { label: "2.5g", val: "2.5" },
    { label: "5g", val: "5" },
    { label: "10g", val: "10" },
    { label: "20g", val: "20" },
    { label: "1oz", val: "31.1" },
    { label: "50g", val: "50" },
    { label: "100g", val: "100" },
    { label: "1kg", val: "1000" },
  ];

  // Calculations
  const parsedGoldWeight = parseFloat(goldWeight) || 0;
  // Investment bullion 24ct payout: 100% of spot
  const estimatedGoldOffer = parsedGoldWeight > 0 ? parsedGoldWeight * spotGold : null;

  const parsedSilverWeight = parseFloat(silverWeight) || 0;
  // Silver 999 payout: ~97% of spot rate
  const estimatedSilverOffer = parsedSilverWeight > 0 ? parsedSilverWeight * spotSilver * 0.97 : null;

  return (
    <div className="relative min-h-screen bg-[#faf7f2] font-sans text-stone-800 pb-20 sm:pb-32 overflow-x-hidden">
      
      {/* Warm Golden Bokeh Background Orbs Matching Reference */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-10 -left-10 w-96 h-96 rounded-full bg-amber-100/60 blur-3xl opacity-70" />
        <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] rounded-full bg-[#faecd6]/80 blur-3xl opacity-60" />
        <div className="absolute bottom-20 left-1/4 w-[600px] h-[600px] rounded-full bg-[#fcefe2]/70 blur-3xl opacity-50" />
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-10">
        
        {/* ======================================================== */}
        {/* TOP HERO BANNER CARD (Matching Reference Screenshot)     */}
        {/* ======================================================== */}
        <div className="rounded-[12px] overflow-hidden border border-[#dfcca6] bg-white shadow-md">
          
          {/* Banner Graphic & Text */}
          <div className="relative bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden">
            <div className="absolute inset-0 bg-radial from-amber-600/10 via-transparent to-black/40 pointer-events-none" />
            
            <div className="relative z-10 space-y-1.5 max-w-md text-left">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-serif text-white">
                Sell Bullion
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-amber-400">
                Sell your gold &amp; silver bars or coins
              </p>
              <p className="text-xs text-stone-300 leading-relaxed pt-0.5">
                Cash out your bars and coins, valued at today&apos;s live market rate.
              </p>
            </div>

            {/* Bullion Ingot / Stacks Graphic */}
            <div className="relative z-10 flex items-center gap-3 shrink-0">
              {/* Gold Bar Motif */}
              <div className="w-20 h-28 rounded bg-gradient-to-tr from-amber-500 via-yellow-200 to-amber-600 p-1.5 shadow-xl border border-amber-300 flex flex-col items-center justify-between text-stone-950 transform -rotate-6">
                <span className="text-[7px] font-bold font-serif">UMICORE</span>
                <span className="text-[10px] font-black">100g</span>
                <span className="text-[6.5px] font-mono">999.9</span>
              </div>
              {/* Stacked Coins / Ingot */}
              <div className="w-18 h-24 rounded bg-gradient-to-tr from-slate-300 via-white to-slate-400 p-1.5 shadow-xl border border-stone-200 flex flex-col items-center justify-between text-stone-800 transform rotate-6">
                <span className="text-[6.5px] font-bold">SILVER</span>
                <span className="text-[9px] font-black">1oz</span>
                <span className="text-[6px] font-mono">999</span>
              </div>
            </div>
          </div>

          {/* Lower Spot Bar Inside Card */}
          <div className="p-4 sm:p-5 bg-[#faf8f5] border-t border-[#dfcca6]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Live Spot Pills */}
            <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
              
              {/* Gold Spot Box */}
              <div className="bg-white border border-[#dfcca6] rounded-[8px] py-2 px-4 shadow-2xs flex flex-col items-center justify-center text-center">
                <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-stone-500 uppercase">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                  <span>Live Gold Spot</span>
                </div>
                <div className="text-base sm:text-lg font-black text-stone-900 mt-0.5">
                  £{spotGold.toFixed(2)} <span className="text-xs font-medium text-stone-500">/g</span>
                </div>
              </div>

              {/* Silver Spot Box */}
              <div className="bg-white border border-[#dfcca6] rounded-[8px] py-2 px-4 shadow-2xs flex flex-col items-center justify-center text-center">
                <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-stone-500 uppercase">
                  <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
                  <span>Live Silver Spot</span>
                </div>
                <div className="text-base sm:text-lg font-black text-stone-900 mt-0.5">
                  £{spotSilver.toFixed(2)} <span className="text-xs font-medium text-stone-500">/g</span>
                </div>
              </div>

            </div>

            {/* Refresh & Timestamp */}
            <div className="flex items-center justify-between sm:justify-end gap-3 text-[11px] text-stone-500">
              <button
                onClick={handleRefresh}
                className="inline-flex items-center gap-1 hover:text-[#8c6d26] font-semibold transition-colors cursor-pointer"
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
              <span className="text-stone-400 font-mono">
                {mounted ? "28 October 2026 at 09:40am BST" : ""}
              </span>
            </div>

          </div>

        </div>

        {/* ======================================================== */}
        {/* SECTION 1: SELL GOLD BULLION                             */}
        {/* ======================================================== */}
        <section className="space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#8c6d26]">
              Sell Gold Bullion
            </h2>
            <p className="text-xs sm:text-[13px] text-stone-500">
              Sell your gold bars and gold coins to us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
            
            {/* Form Column */}
            <div className="rounded-[8px] border border-[#dfcca6] bg-[#faf8f5]/80 p-5 space-y-4 shadow-xs">
              
              {/* Bullion Type Tabs */}
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1.5 uppercase tracking-wider">
                  Bullion Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGoldType("bar")}
                    className={`py-2 px-3 rounded-[5px] text-xs font-bold transition-all cursor-pointer ${
                      goldType === "bar"
                        ? "bg-[#7a5a10] text-white shadow-xs"
                        : "bg-[#faecd6]/80 text-[#7a5a10] hover:bg-[#faecd6]"
                    }`}
                  >
                    Gold Bar
                  </button>
                  <button
                    type="button"
                    onClick={() => setGoldType("coin")}
                    className={`py-2 px-3 rounded-[5px] text-xs font-bold transition-all cursor-pointer ${
                      goldType === "coin"
                        ? "bg-[#7a5a10] text-white shadow-xs"
                        : "bg-[#faecd6]/80 text-[#7a5a10] hover:bg-[#faecd6]"
                    }`}
                  >
                    Gold Coin
                  </button>
                </div>
              </div>

              {/* Purity Field */}
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1.5 uppercase tracking-wider">
                  Purity
                </label>
                <div className="w-full bg-white border border-[#dfcca6] rounded-[5px] py-2 px-3 text-xs font-semibold text-stone-800">
                  {goldType === "bar" ? "24ct Gold" : "22ct Sovereign / 24ct Coin"}
                </div>
                <p className="text-[10px] text-stone-400 mt-1">
                  {goldType === "bar"
                    ? "We buy investment gold bars at 24ct (999.9) only"
                    : "We buy full/half Sovereigns, Britannias & Krugerrands"}
                </p>
              </div>

              {/* Weight (grams) */}
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1.5 uppercase tracking-wider">
                  Weight (grams)
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={goldWeight}
                  onChange={(e) => setGoldWeight(e.target.value)}
                  placeholder="eg. 50"
                  className="w-full bg-white border border-[#dfcca6] rounded-[5px] py-2 px-3 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#8c6d26]"
                />

                {/* Quick Weight Pills */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {goldQuickWeights.map((w) => (
                    <button
                      key={w.label}
                      type="button"
                      onClick={() => setGoldWeight(w.val)}
                      className={`text-[10.5px] px-2 py-0.5 rounded-[4px] border transition-colors cursor-pointer ${
                        goldWeight === w.val
                          ? "bg-[#7a5a10] text-white border-[#7a5a10]"
                          : "bg-white text-stone-700 border-stone-200 hover:border-[#dfcca6]"
                      }`}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Receipt / Estimate Summary Column */}
            <div className="rounded-[8px] border border-[#dfcca6] bg-white p-5 flex flex-col justify-between shadow-xs">
              
              <div className="divide-y divide-stone-100 text-xs">
                <div className="flex justify-between py-2">
                  <span className="text-stone-500 uppercase tracking-wider text-[10.5px] font-semibold">Live Market Spot</span>
                  <span className="font-bold text-stone-900">£{spotGold.toFixed(2)} /g</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-stone-500 uppercase tracking-wider text-[10.5px] font-semibold">Metal</span>
                  <span className="font-semibold text-stone-800">Gold</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-stone-500 uppercase tracking-wider text-[10.5px] font-semibold">Item</span>
                  <span className="font-semibold text-stone-800">{goldType === "bar" ? "Gold Bar" : "Gold Coin"}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-stone-500 uppercase tracking-wider text-[10.5px] font-semibold">Purity</span>
                  <span className="font-semibold text-stone-800">24ct Gold</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-stone-500 uppercase tracking-wider text-[10.5px] font-semibold">Weight</span>
                  <span className="font-semibold text-stone-800">
                    {parsedGoldWeight > 0 ? `${parsedGoldWeight.toFixed(2)}g` : "—"}
                  </span>
                </div>
              </div>

              {/* Offer Result Box */}
              <div className="mt-5 p-4 rounded-[6px] bg-[#faf6ee] border border-[#dfcca6]/60 text-center space-y-1">
                <div className="text-[10.5px] font-bold text-stone-500 uppercase tracking-widest">
                  ESTIMATED BULLION OFFER
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#8c6d26] tracking-tight">
                  {estimatedGoldOffer !== null
                    ? `£${estimatedGoldOffer.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    : "—"}
                </div>
                <div className="text-[10px] text-stone-400">
                  Calculated using today&apos;s live market rate.
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 2: SELL SILVER BULLION                           */}
        {/* ======================================================== */}
        <section className="space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#8c6d26]">
              Sell Silver Bullion
            </h2>
            <p className="text-xs sm:text-[13px] text-stone-500">
              Sell your silver bars and silver coins to us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
            
            {/* Form Column */}
            <div className="rounded-[8px] border border-[#dfcca6] bg-[#faf8f5]/80 p-5 space-y-4 shadow-xs">
              
              {/* Silver Bullion Type Tabs */}
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1.5 uppercase tracking-wider">
                  Bullion Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSilverType("bar")}
                    className={`py-2 px-3 rounded-[5px] text-xs font-bold transition-all cursor-pointer ${
                      silverType === "bar"
                        ? "bg-[#3f4d63] text-white shadow-xs"
                        : "bg-[#faecd6]/80 text-[#3f4d63] hover:bg-[#faecd6]"
                    }`}
                  >
                    Silver Bar
                  </button>
                  <button
                    type="button"
                    onClick={() => setSilverType("coin")}
                    className={`py-2 px-3 rounded-[5px] text-xs font-bold transition-all cursor-pointer ${
                      silverType === "coin"
                        ? "bg-[#3f4d63] text-white shadow-xs"
                        : "bg-[#faecd6]/80 text-[#3f4d63] hover:bg-[#faecd6]"
                    }`}
                  >
                    Silver Coin
                  </button>
                </div>
              </div>

              {/* Silver Purity Field */}
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1.5 uppercase tracking-wider">
                  Purity
                </label>
                <div className="relative">
                  <select
                    value={silverPurity}
                    onChange={(e) => setSilverPurity(e.target.value)}
                    className="w-full bg-white border border-[#dfcca6] rounded-[5px] py-2 px-3 text-xs font-semibold text-stone-800 appearance-none focus:outline-none focus:ring-1 focus:ring-[#8c6d26]"
                  >
                    <option value="999">999 Fine Silver</option>
                    <option value="925">925 Sterling Silver</option>
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 text-xs">
                    ▼
                  </div>
                </div>
              </div>

              {/* Silver Weight (grams) */}
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1.5 uppercase tracking-wider">
                  Weight (grams)
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={silverWeight}
                  onChange={(e) => setSilverWeight(e.target.value)}
                  placeholder="eg. 100"
                  className="w-full bg-white border border-[#dfcca6] rounded-[5px] py-2 px-3 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#8c6d26]"
                />

                {/* Quick Weight Pills */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {silverQuickWeights.map((w) => (
                    <button
                      key={w.label}
                      type="button"
                      onClick={() => setSilverWeight(w.val)}
                      className={`text-[10.5px] px-2 py-0.5 rounded-[4px] border transition-colors cursor-pointer ${
                        silverWeight === w.val
                          ? "bg-[#3f4d63] text-white border-[#3f4d63]"
                          : "bg-white text-stone-700 border-stone-200 hover:border-[#dfcca6]"
                      }`}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Receipt Summary Column */}
            <div className="rounded-[8px] border border-[#dfcca6] bg-white p-5 flex flex-col justify-between shadow-xs">
              
              <div className="divide-y divide-stone-100 text-xs">
                <div className="flex justify-between py-2">
                  <span className="text-stone-500 uppercase tracking-wider text-[10.5px] font-semibold">Live Market Spot</span>
                  <span className="font-bold text-stone-900">£{spotSilver.toFixed(2)} /g</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-stone-500 uppercase tracking-wider text-[10.5px] font-semibold">Metal</span>
                  <span className="font-semibold text-stone-800">Silver</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-stone-500 uppercase tracking-wider text-[10.5px] font-semibold">Item</span>
                  <span className="font-semibold text-stone-800">{silverType === "bar" ? "Silver Bar" : "Silver Coin"}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-stone-500 uppercase tracking-wider text-[10.5px] font-semibold">Purity</span>
                  <span className="font-semibold text-stone-800">
                    {silverPurity === "999" ? "999 Fine Silver" : "925 Sterling Silver"}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-stone-500 uppercase tracking-wider text-[10.5px] font-semibold">Weight</span>
                  <span className="font-semibold text-stone-800">
                    {parsedSilverWeight > 0 ? `${parsedSilverWeight.toFixed(2)}g` : "—"}
                  </span>
                </div>
              </div>

              {/* Offer Result Box */}
              <div className="mt-5 p-4 rounded-[6px] bg-[#faf6ee] border border-[#dfcca6]/60 text-center space-y-1">
                <div className="text-[10.5px] font-bold text-stone-500 uppercase tracking-widest">
                  ESTIMATED BULLION OFFER
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#8c6d26] tracking-tight">
                  {estimatedSilverOffer !== null
                    ? `£${estimatedSilverOffer.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    : "—"}
                </div>
                <div className="text-[10px] text-stone-400">
                  Calculated using today&apos;s live market rate.
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ======================================================== */}
        {/* HOW IT WORKS (3 CARDS MATCHING SCREENSHOT)               */}
        {/* ======================================================== */}
        <section className="space-y-3 pt-2">
          <div className="text-center text-[10.5px] font-bold uppercase tracking-widest text-[#8c6d26]">
            HOW IT WORKS
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Card 01 */}
            <div className="p-4 rounded-[8px] bg-white border border-[#dfcca6] shadow-2xs space-y-1">
              <div className="text-sm font-black text-[#8c6d26]">01</div>
              <h3 className="text-xs font-bold text-stone-900">Bring Your Bullion In</h3>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Bring your gold or silver bars or coins to the shop.
              </p>
            </div>

            {/* Card 02 */}
            <div className="p-4 rounded-[8px] bg-white border border-[#dfcca6] shadow-2xs space-y-1">
              <div className="text-sm font-black text-[#8c6d26]">02</div>
              <h3 className="text-xs font-bold text-stone-900">We Test &amp; Weigh</h3>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                We verify the weight, purity and authenticity of each item.
              </p>
            </div>

            {/* Card 03 */}
            <div className="p-4 rounded-[8px] bg-white border border-[#dfcca6] shadow-2xs space-y-1">
              <div className="text-sm font-black text-[#8c6d26]">03</div>
              <h3 className="text-xs font-bold text-stone-900">Receive Your Offer</h3>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Your final offer is based on the verification and the current rate.
              </p>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* IMPORTANT INFORMATION BOX                                */}
        {/* ======================================================== */}
        <div className="p-4 rounded-[8px] bg-[#faf8f5] border border-[#dfcca6]/80 text-center space-y-1.5 shadow-2xs">
          <div className="text-[10.5px] font-bold uppercase tracking-widest text-stone-600">
            IMPORTANT INFORMATION
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-stone-600">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
            <span>
              We buy investment bullion - gold and silver bars and coins. Bring your items in for testing and weighing, and we will confirm your final offer in-store.
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* DISCLAIMER BOX                                           */}
        {/* ======================================================== */}
        <div className="p-4 rounded-[8px] bg-white border border-[#dfcca6]/70 text-center space-y-1.5 shadow-2xs">
          <div className="text-[10.5px] font-bold uppercase tracking-widest text-stone-500">
            DISCLAIMER
          </div>
          <div className="flex items-center justify-center gap-2 text-[11.5px] text-stone-500 leading-relaxed max-w-2xl mx-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-400 shrink-0" />
            <span>
              This is an estimation and does not constitute a guaranteed offer. Final value is confirmed after verification of the item&apos;s weight, purity, authenticity and condition. Market prices may change.
            </span>
          </div>
        </div>

        {/* Bottom Update Timestamp */}
        <div className="text-center text-[11px] text-stone-400 font-mono pt-1">
          {mounted ? "Rates last updated on 28 October 2026 at 09:40am BST" : ""}
        </div>

      </main>
    </div>
  );
}
