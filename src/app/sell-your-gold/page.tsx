"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DEFAULT_RATES, WEIGHT_CONVERSIONS, formatGBP, formatUKDateTime } from "@/lib/rates";

interface KaratConfig {
  karat: string;
  name: string;
  purityDecimal: number;
  hallmark: string;
  lowMultiplier: number;  // 94% of spot
  highMultiplier: number; // 97.5% of spot
}

const KARAT_CONFIGS: KaratConfig[] = [
  { karat: "24ct", name: "Pure Fine Gold", purityDecimal: 0.999, hallmark: "999", lowMultiplier: 0.95, highMultiplier: 0.985 },
  { karat: "22ct", name: "Asian Standard Gold", purityDecimal: 0.916, hallmark: "916", lowMultiplier: 0.945, highMultiplier: 0.975 },
  { karat: "21ct", name: "Middle Eastern Gold", purityDecimal: 0.875, hallmark: "875", lowMultiplier: 0.94, highMultiplier: 0.97 },
  { karat: "20ct", name: "Traditional Hallmark", purityDecimal: 0.833, hallmark: "833", lowMultiplier: 0.935, highMultiplier: 0.965 },
  { karat: "18ct", name: "Diamond & Luxury Standard", purityDecimal: 0.750, hallmark: "750", lowMultiplier: 0.935, highMultiplier: 0.965 },
  { karat: "14ct", name: "Everyday Jewellery", purityDecimal: 0.585, hallmark: "585", lowMultiplier: 0.93, highMultiplier: 0.96 },
  { karat: "9ct", name: "British Standard Gold", purityDecimal: 0.375, hallmark: "375", lowMultiplier: 0.92, highMultiplier: 0.95 },
];

export default function SellYourGoldPage() {
  const [rates, setRates] = useState(DEFAULT_RATES);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdatedDisplay, setLastUpdatedDisplay] = useState(formatUKDateTime());

  // Calculator Inputs
  const [selectedKarat, setSelectedKarat] = useState<string>("22ct");
  const [grossWeight, setGrossWeight] = useState<string>("20");
  const [weightUnit, setWeightUnit] = useState<"gram" | "tola" | "ounce">("gram");
  const [stoneWeight, setStoneWeight] = useState<string>("0");

  const fetchRates = async (fresh = false) => {
    setIsRefreshing(true);
    try {
      const url = fresh ? `/api/rates?fresh=true&t=${Date.now()}` : `/api/rates?t=${Date.now()}`;
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setRates({
          goldGbpPerGram: data.goldGbpPerGram || DEFAULT_RATES.goldGbpPerGram,
          silverGbpPerGram: data.silverGbpPerGram || DEFAULT_RATES.silverGbpPerGram,
          lastUpdated: data.lastUpdated || new Date().toISOString(),
          isLive: data.isLive ?? true,
          currency: data.currency || "GBP",
        });
        setLastUpdatedDisplay(formatUKDateTime(new Date(data.lastUpdated || Date.now())));
      }
    } catch {
      setRates(DEFAULT_RATES);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  useEffect(() => {
    fetchRates();
    // Auto refresh every 60 seconds
    const interval = setInterval(fetchRates, 60000);
    return () => clearInterval(interval);
  }, []);

  const spotGold = rates.goldGbpPerGram;

  // Active Karat Object
  const activeKarat = KARAT_CONFIGS.find((k) => k.karat === selectedKarat) || KARAT_CONFIGS[1];

  // Weight conversion to grams
  const parsedGross = parseFloat(grossWeight) || 0;
  const parsedStones = parseFloat(stoneWeight) || 0;

  let multiplier = 1;
  if (weightUnit === "tola") multiplier = WEIGHT_CONVERSIONS.tolaTraditional;
  if (weightUnit === "ounce") multiplier = WEIGHT_CONVERSIONS.troyOunce;

  const totalGrossGrams = parsedGross * multiplier;
  const netGoldGrams = Math.max(0, totalGrossGrams - parsedStones);

  // Live Payout Rate per gram for the selected Karat
  const meltValuePerGram = spotGold * activeKarat.purityDecimal;
  const lowRatePerGram = meltValuePerGram * activeKarat.lowMultiplier;
  const highRatePerGram = meltValuePerGram * activeKarat.highMultiplier;

  // Total Estimated Payout
  const totalLow = netGoldGrams * lowRatePerGram;
  const totalHigh = netGoldGrams * highRatePerGram;

  // Quick weight buttons in grams
  const quickWeights = [5, 10, 11.66, 20, 31.1, 50, 100];

  const whatsappMessage = `*Sell Scrap Gold Inquiry - Bhai Jewellers*%0A%0A*Karat:* ${activeKarat.karat} (${activeKarat.name})%0A*Net Weight:* ${netGoldGrams.toFixed(2)}g (${parsedGross} ${weightUnit})%0A*Live Spot:* £${spotGold.toFixed(2)}/g%0A*Estimated Cash Offer:* ${formatGBP(totalLow)} - ${formatGBP(totalHigh)}%0A%0AI would like to lock this rate and visit your Bradford showroom (17 Duckworth Lane).`;

  return (
    <div className="min-h-screen bg-[#faf8f5] font-sans text-slate-800 pb-20 relative overflow-x-hidden">
      
      {/* Background Soft Luxury Marble Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-gradient-to-b from-[#f5ede0]/60 via-[#faf8f5]/30 to-transparent pointer-events-none -z-10" />

      {/* Top Gold Foil Accent Bar */}
      <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#caa771] to-transparent relative z-10 opacity-70" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        
        {/* Section Pill Badge */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-[10.5px] font-bold text-[#8b6914] tracking-widest uppercase bg-[#faf5ea] px-3 py-1 rounded-[4px] border border-[#dfcca6] shadow-2xs flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Official Scrap Gold Buying Desk · Bradford, UK
          </span>
        </div>

        {/* Page Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto pb-6 border-b border-[#dfcca6]/50">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight font-serif">
            Sell Your <span className="text-[#8b6914]">Scrap Gold</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            Cash out broken jewellery, old necklaces, bangles, rings, and coins at today&apos;s live market spot rate. Certified Swiss weighing and laser XRF assay in your presence.
          </p>

          {/* Live Spot Rate Banner */}
          <div className="inline-flex flex-wrap items-center justify-center gap-3 pt-2">
            <div className="inline-flex items-center gap-2 bg-white border border-[#dfcca6] rounded-[6px] px-3.5 py-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-700">
                Live 24ct Spot: <strong className="text-slate-950 text-sm">£{spotGold.toFixed(2)}/g</strong>
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Updated: {lastUpdatedDisplay}</span>
              <button
                type="button"
                onClick={() => fetchRates(true)}
                disabled={isRefreshing}
                className="p-1 hover:text-[#8b6914] transition-colors"
                title="Refresh Live Gold Spot Rate"
              >
                <svg className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#8b6914]" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* INTERACTIVE REAL-TIME VALUATION CALCULATOR               */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
          
          {/* Left Column: Interactive Calculator (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border-2 border-[#dfcca6] rounded-[10px] p-6 shadow-sm space-y-5">
              
              <div className="flex items-center justify-between pb-3 border-b border-[#dfcca6]/40">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-[5px] bg-[#faf5ea] border border-[#dfcca6] text-[#8b6914] flex items-center justify-center font-bold text-xs">
                    £
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Live Scrap Value Calculator</h2>
                    <p className="text-[11px] text-slate-500">Real-time instant cash payout estimator</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ● Real-Time API
                </span>
              </div>

              {/* 1. Karat Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Gold Purity (Karat)
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                  {KARAT_CONFIGS.map((k) => {
                    const isSelected = selectedKarat === k.karat;
                    return (
                      <button
                        key={k.karat}
                        type="button"
                        onClick={() => setSelectedKarat(k.karat)}
                        className={`py-2 px-1 rounded-[6px] text-center border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#8b6914] text-white border-[#8b6914] shadow-xs font-bold scale-102"
                            : "bg-[#faf8f5] text-slate-700 border-[#dfcca6]/70 hover:border-[#8b6914] hover:bg-white text-xs font-semibold"
                        }`}
                      >
                        <div className="text-xs sm:text-sm font-extrabold">{k.karat}</div>
                        <div className={`text-[9.5px] ${isSelected ? "text-amber-200" : "text-slate-400"}`}>
                          {k.hallmark}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Weight Inputs & Units */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Gross Weight */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Gold Weight
                    </label>
                    {/* Unit Selector */}
                    <div className="inline-flex rounded-[4px] border border-stone-200 p-0.5 bg-stone-50 text-[10px]">
                      {(["gram", "tola", "ounce"] as const).map((unit) => (
                        <button
                          key={unit}
                          type="button"
                          onClick={() => setWeightUnit(unit)}
                          className={`px-2 py-0.5 rounded-[2px] font-bold capitalize transition-all ${
                            weightUnit === unit ? "bg-[#8b6914] text-white" : "text-slate-600 hover:text-slate-950"
                          }`}
                        >
                          {unit}
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={grossWeight}
                    onChange={(e) => setGrossWeight(e.target.value)}
                    placeholder="Enter weight"
                    className="w-full bg-[#faf8f5] border border-stone-200 rounded-[5px] px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#8b6914] focus:bg-white"
                  />
                  {/* Quick Weight helper buttons */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {quickWeights.map((qw) => (
                      <button
                        key={qw}
                        type="button"
                        onClick={() => {
                          setWeightUnit("gram");
                          setGrossWeight(qw.toString());
                        }}
                        className="text-[10px] px-2 py-0.5 rounded bg-stone-100 hover:bg-[#faf5ea] hover:text-[#8b6914] border border-stone-200 font-semibold"
                      >
                        {qw}g
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stones / Non-gold deduction */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Non-Gold / Stone Deduction (g)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={stoneWeight}
                    onChange={(e) => setStoneWeight(e.target.value)}
                    placeholder="0"
                    className="w-full bg-[#faf8f5] border border-stone-200 rounded-[5px] px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#8b6914] focus:bg-white"
                  />
                  <p className="text-[10.5px] text-slate-500 mt-1">
                    Enter estimated stone, enamel or bead weight in grams.
                  </p>
                </div>
              </div>

              {/* Net Calculated Weight Summary Bar */}
              <div className="p-3 rounded-[6px] bg-[#faf5ea] border border-[#dfcca6] flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">
                  Net Pure Metal Weight:
                </span>
                <span className="font-extrabold text-slate-900 text-sm">
                  {netGoldGrams.toFixed(2)} grams ({activeKarat.karat} · {activeKarat.hallmark})
                </span>
              </div>

            </div>

            {/* Why Sell To Bhai Jewellers Bradford Feature Grid */}
            <div className="bg-white border-2 border-[#dfcca6] rounded-[10px] p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 font-serif">
                Why Sell To Bhai Jewellers Bradford?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-[6px] bg-[#faf8f5] border border-[#dfcca6]/50 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span>🔬 Laser XRF Spectrometry</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-snug">
                    Accurate atomic testing of exact gold karat purity without scraping or damaging your jewellery.
                  </p>
                </div>

                <div className="p-3 rounded-[6px] bg-[#faf8f5] border border-[#dfcca6]/50 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span>⚖️ Swiss Certified Class-II Scales</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-snug">
                    Government stamped trade-approved scales weighed clearly in front of you down to 0.01g.
                  </p>
                </div>

                <div className="p-3 rounded-[6px] bg-[#faf8f5] border border-[#dfcca6]/50 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span>⚡ Instant Same-Day Payment</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-snug">
                    Cash in hand or instant faster payments bank transfer direct to your account.
                  </p>
                </div>

                <div className="p-3 rounded-[6px] bg-[#faf8f5] border border-[#dfcca6]/50 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span>📍 17 Duckworth Lane, Bradford</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-snug">
                    Permanent Bradford showroom with private VIP booths and dedicated customer parking.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Live Payout Card & Lock CTA (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-gradient-to-b from-white via-[#fdfbf8] to-[#faf5ea] border-2 border-[#dfcca6] rounded-[10px] p-6 sm:p-7 shadow-sm sticky top-24 space-y-5">
              
              <div className="border-b border-[#dfcca6]/60 pb-4">
                <span className="text-[10.5px] font-bold text-[#8b6914] uppercase tracking-wider block">
                  Live Cash Valuation
                </span>
                <h3 className="text-xl font-black text-slate-900 font-serif mt-0.5">
                  Estimated Cash Offer
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Based on London spot fix of £{spotGold.toFixed(2)}/g for {activeKarat.karat}
                </p>
              </div>

              {/* Total Payout Range */}
              <div className="p-4 rounded-[8px] bg-white border-2 border-[#dfcca6] text-center shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Estimated Total Payout
                </span>
                <div className="text-2xl sm:text-3xl font-black text-[#8b6914] tracking-tight">
                  {netGoldGrams > 0 ? `${formatGBP(totalLow)} – ${formatGBP(totalHigh)}` : "£0.00"}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {netGoldGrams > 0 ? `Rate: £${lowRatePerGram.toFixed(2)} – £${highRatePerGram.toFixed(2)} /g` : "Enter weight to view valuation"}
                </div>
              </div>

              {/* Breakdown Table */}
              <div className="space-y-2 text-xs border-t border-[#dfcca6]/40 pt-3">
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Selected Karat:</span>
                  <span className="font-bold text-slate-900">{activeKarat.karat} ({activeKarat.name})</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Purity Hallmark:</span>
                  <span className="font-bold text-slate-900">{activeKarat.hallmark} ({(activeKarat.purityDecimal * 100).toFixed(1)}% Gold)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Net Tested Weight:</span>
                  <span className="font-bold text-slate-900">{netGoldGrams.toFixed(2)}g</span>
                </div>
                <div className="flex justify-between py-1 border-t border-stone-200/60 pt-1.5 font-bold">
                  <span className="text-slate-700">Melt Value (100%):</span>
                  <span className="text-slate-900">{formatGBP(netGoldGrams * meltValuePerGram)}</span>
                </div>
              </div>

              {/* Lock Price On WhatsApp CTA */}
              <div className="space-y-2 pt-2">
                <a
                  href={`https://wa.me/447735727897?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-[6px] bg-gradient-to-r from-[#25D366] to-[#1ebe5b] hover:from-[#20ba59] hover:to-[#17a84e] text-white text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  <span>Lock Price on WhatsApp</span>
                </a>

                <Link
                  href="/find-us"
                  className="w-full py-2.5 px-4 rounded-[6px] bg-[#faf5ea] hover:bg-[#8b6914] text-[#8b6914] hover:text-white border border-[#dfcca6] text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 text-center"
                >
                  <span>Visit Bradford Showroom →</span>
                </Link>
              </div>

              <p className="text-[10.5px] text-slate-500 text-center leading-relaxed">
                Final buying price confirmed upon laser assay at our Bradford showroom (17 Duckworth Lane, BD9 5ER). No obligation.
              </p>

            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* LIVE KARAT PRICING MATRIX (REAL-TIME COMPUTED)           */}
        {/* ======================================================== */}
        <div className="mt-14 bg-white border-2 border-[#dfcca6] rounded-[10px] overflow-hidden shadow-sm">
          <div className="p-4 sm:p-5 bg-gradient-to-r from-[#faf5ea] via-[#f7f0e0] to-[#faf5ea] border-b border-[#dfcca6] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-[#8b6914] uppercase tracking-widest block">
                Live Market Rates
              </span>
              <h3 className="text-lg font-bold text-slate-900 font-serif">
                Today&apos;s Live Scrap Gold Buyback Rates (GBP)
              </h3>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-[4px] border border-emerald-200 self-start sm:self-auto">
              ● Live Pricing Feed
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#dfcca6]/50 bg-[#faf8f5] text-[11px] uppercase text-slate-500 font-bold">
                  <th className="py-3 px-4">Karat & Standard</th>
                  <th className="py-3 px-4">Purity Hallmark</th>
                  <th className="py-3 px-4">Live Melt Value</th>
                  <th className="py-3 px-4 text-[#8b6914]">Our Buyback Rate /g</th>
                  <th className="py-3 px-4">Per Tola (11.66g)</th>
                  <th className="py-3 px-4">Per Troy Oz (31.1g)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {KARAT_CONFIGS.map((k) => {
                  const melt = spotGold * k.purityDecimal;
                  const low = melt * k.lowMultiplier;
                  const high = melt * k.highMultiplier;
                  const tolaBuyback = high * WEIGHT_CONVERSIONS.tolaTraditional;
                  const ozBuyback = high * WEIGHT_CONVERSIONS.troyOunce;
                  const is22 = k.karat === "22ct";

                  return (
                    <tr
                      key={k.karat}
                      className={`hover:bg-[#faf6ee] transition-colors ${is22 ? "bg-[#faf5ea]/50 font-medium" : ""}`}
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {k.karat} Gold <span className="text-slate-500 font-normal text-[11px] block">{k.name}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">
                        {k.hallmark} ({(k.purityDecimal * 100).toFixed(1)}%)
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-semibold tabular-nums">
                        {formatGBP(melt)}/g
                      </td>
                      <td className="py-3.5 px-4 font-black text-[#8b6914] tabular-nums text-xs sm:text-sm">
                        £{low.toFixed(2)} – £{high.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 tabular-nums">
                        {formatGBP(tolaBuyback)}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 tabular-nums">
                        {formatGBP(ozBuyback)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
