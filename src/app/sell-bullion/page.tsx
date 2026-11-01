"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DEFAULT_RATES, WEIGHT_CONVERSIONS, calculateGoldSilverRatio, formatGBP, formatUKDateTime } from "@/lib/rates";

interface BullionPreset {
  id: string;
  name: string;
  metal: "gold" | "silver";
  weightGrams: number;
  purityFraction: number;
  payoutPercentage: number; // e.g. 0.99 for 99% of spot
  category: "bar" | "coin";
  badge: string;
}

const BULLION_PRESETS: BullionPreset[] = [
  // Gold Bars
  { id: "gold-1g", name: "1 Gram Gold Bar", metal: "gold", weightGrams: 1, purityFraction: 1.0, payoutPercentage: 0.97, category: "bar", badge: "24ct / 999.9" },
  { id: "gold-2.5g", name: "2.5 Gram Gold Bar", metal: "gold", weightGrams: 2.5, purityFraction: 1.0, payoutPercentage: 0.975, category: "bar", badge: "24ct / 999.9" },
  { id: "gold-5g", name: "5 Gram Gold Bar", metal: "gold", weightGrams: 5, purityFraction: 1.0, payoutPercentage: 0.98, category: "bar", badge: "24ct / 999.9" },
  { id: "gold-10g", name: "10 Gram Gold Bar", metal: "gold", weightGrams: 10, purityFraction: 1.0, payoutPercentage: 0.985, category: "bar", badge: "24ct / 999.9" },
  { id: "gold-20g", name: "20 Gram Gold Bar", metal: "gold", weightGrams: 20, purityFraction: 1.0, payoutPercentage: 0.985, category: "bar", badge: "24ct / 999.9" },
  { id: "gold-1oz", name: "1 Troy Ounce Gold Bar", metal: "gold", weightGrams: 31.1035, purityFraction: 1.0, payoutPercentage: 0.99, category: "bar", badge: "24ct / 999.9" },
  { id: "gold-50g", name: "50 Gram Gold Bar", metal: "gold", weightGrams: 50, purityFraction: 1.0, payoutPercentage: 0.99, category: "bar", badge: "24ct / 999.9" },
  { id: "gold-100g", name: "100 Gram Gold Bar", metal: "gold", weightGrams: 100, purityFraction: 1.0, payoutPercentage: 0.995, category: "bar", badge: "24ct / 999.9" },
  { id: "gold-250g", name: "250 Gram Gold Bar", metal: "gold", weightGrams: 250, purityFraction: 1.0, payoutPercentage: 0.995, category: "bar", badge: "24ct / 999.9" },
  { id: "gold-500g", name: "500 Gram Gold Bar", metal: "gold", weightGrams: 500, purityFraction: 1.0, payoutPercentage: 0.995, category: "bar", badge: "24ct / 999.9" },
  { id: "gold-1kg", name: "1 Kilogram Gold Bar", metal: "gold", weightGrams: 1000, purityFraction: 1.0, payoutPercentage: 1.00, category: "bar", badge: "LBMA 999.9" },
  // Gold Coins
  { id: "gold-sov-full", name: "Full Gold Sovereign", metal: "gold", weightGrams: 7.988, purityFraction: 22 / 24, payoutPercentage: 0.985, category: "coin", badge: "22ct (7.32g pure)" },
  { id: "gold-sov-half", name: "Half Gold Sovereign", metal: "gold", weightGrams: 3.99, purityFraction: 22 / 24, payoutPercentage: 0.98, category: "coin", badge: "22ct (3.66g pure)" },
  { id: "gold-brit-1oz", name: "1oz Gold Britannia Coin", metal: "gold", weightGrams: 31.1035, purityFraction: 1.0, payoutPercentage: 0.99, category: "coin", badge: "24ct (999.9)" },
  { id: "gold-krug-1oz", name: "1oz Gold Krugerrand Coin", metal: "gold", weightGrams: 33.93, purityFraction: 22 / 24, payoutPercentage: 0.985, category: "coin", badge: "22ct (1oz pure)" },
  // Silver Bars & Coins
  { id: "silver-1oz", name: "1oz Silver Britannia / Coin", metal: "silver", weightGrams: 31.1035, purityFraction: 1.0, payoutPercentage: 0.95, category: "coin", badge: "999 Fine" },
  { id: "silver-100g", name: "100 Gram Silver Bar", metal: "silver", weightGrams: 100, purityFraction: 1.0, payoutPercentage: 0.95, category: "bar", badge: "999 Fine" },
  { id: "silver-250g", name: "250 Gram Silver Bar", metal: "silver", weightGrams: 250, purityFraction: 1.0, payoutPercentage: 0.96, category: "bar", badge: "999 Fine" },
  { id: "silver-500g", name: "500 Gram Silver Bar", metal: "silver", weightGrams: 500, purityFraction: 1.0, payoutPercentage: 0.965, category: "bar", badge: "999 Fine" },
  { id: "silver-1kg", name: "1 Kilogram Silver Bar", metal: "silver", weightGrams: 1000, purityFraction: 1.0, payoutPercentage: 0.975, category: "bar", badge: "999 Fine" },
  { id: "silver-5kg", name: "5 Kilogram Silver Bar", metal: "silver", weightGrams: 5000, purityFraction: 1.0, payoutPercentage: 0.98, category: "bar", badge: "999 Fine" },
];

export default function SellBullionPage() {
  const [rates, setRates] = useState(DEFAULT_RATES);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdatedDisplay, setLastUpdatedDisplay] = useState(formatUKDateTime());

  // Interactive Calculator State
  const [activeMetal, setActiveMetal] = useState<"gold" | "silver">("gold");
  const [selectedPresetId, setSelectedPresetId] = useState<string>("gold-100g");
  const [quantity, setQuantity] = useState<number>(1);
  const [customWeight, setCustomWeight] = useState<string>("");
  const [isCustom, setIsCustom] = useState<boolean>(false);

  const fetchRates = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/rates");
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
    const interval = setInterval(fetchRates, 60000);
    return () => clearInterval(interval);
  }, []);

  const spotGold = rates.goldGbpPerGram;
  const spotSilver = rates.silverGbpPerGram;
  const ratio = calculateGoldSilverRatio(spotGold, spotSilver);

  // Active preset
  const availablePresets = BULLION_PRESETS.filter((p) => p.metal === activeMetal);
  const currentPreset = BULLION_PRESETS.find((p) => p.id === selectedPresetId) || availablePresets[0];

  // Calculation
  const spotBase = activeMetal === "gold" ? spotGold : spotSilver;
  let weightPerUnit = currentPreset.weightGrams;
  let purityFraction = currentPreset.purityFraction;
  let payoutPct = currentPreset.payoutPercentage;

  if (isCustom) {
    weightPerUnit = parseFloat(customWeight) || 0;
    purityFraction = activeMetal === "gold" ? 1.0 : 1.0;
    payoutPct = 0.98; // 98% for custom bullion
  }

  const meltValuePerItem = weightPerUnit * purityFraction * spotBase;
  const payoutPerItem = meltValuePerItem * payoutPct;
  const totalPayout = payoutPerItem * (quantity || 1);

  const whatsappMessage = `*Sell Bullion Inquiry - Bhai Jewellers*%0A%0A*Item:* ${isCustom ? `Custom ${activeMetal.toUpperCase()} Bullion (${weightPerUnit}g)` : currentPreset.name}%0A*Quantity:* ${quantity}%0A*Live Spot:* £${spotBase.toFixed(2)}/g%0A*Estimated Total Cash Payout:* ${formatGBP(totalPayout)}%0A%0AI would like to lock this rate and cash out at your Bradford showroom (17 Duckworth Lane, BD9 5ER).`;

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
            Official Bullion Buyback Desk · Bradford, UK
          </span>
        </div>

        {/* Page Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto pb-6 border-b border-[#dfcca6]/50">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight font-serif">
            Sell Investment <span className="text-[#8b6914]">Gold & Silver Bullion</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            Cash out your gold bars, silver bars, Sovereigns and Britannias at up to 100% of live London market spot rate. LBMA refiners accepted. Instant payment in Bradford.
          </p>

          {/* Dual Spot Live Rate Banner */}
          <div className="inline-flex flex-wrap items-center justify-center gap-3 pt-2">
            <div className="inline-flex items-center gap-2 bg-white border border-[#dfcca6] rounded-[6px] px-3.5 py-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-700">
                Live Gold Spot: <strong className="text-slate-950 text-sm">£{spotGold.toFixed(2)}/g</strong>
              </span>
            </div>

            <div className="inline-flex items-center gap-2 bg-white border border-slate-300 rounded-[6px] px-3.5 py-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
              <span className="text-xs font-bold text-slate-700">
                Live Silver Spot: <strong className="text-slate-950 text-sm">£{spotSilver.toFixed(2)}/g</strong>
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs text-slate-500">
              <span className="text-[11px] font-semibold bg-[#faf5ea] px-2 py-0.5 rounded border border-[#dfcca6]">
                Ratio {ratio}:1
              </span>
              <button
                type="button"
                onClick={fetchRates}
                disabled={isRefreshing}
                className="p-1 hover:text-[#8b6914] transition-colors ml-1"
                title="Refresh Live Market Rates"
              >
                <svg className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#8b6914]" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* INTERACTIVE REAL-TIME BULLION CALCULATOR                 */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
          
          {/* Left Column: Calculator Controls (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border-2 border-[#dfcca6] rounded-[10px] p-6 shadow-sm space-y-5">
              
              <div className="flex items-center justify-between pb-3 border-b border-[#dfcca6]/40">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-[5px] bg-[#faf5ea] border border-[#dfcca6] text-[#8b6914] flex items-center justify-center font-bold text-xs">
                    ⚖️
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Live Bullion Buyback Calculator</h2>
                    <p className="text-[11px] text-slate-500">Select bar, coin or custom weight</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ● Live Up To 100% Spot
                </span>
              </div>

              {/* 1. Metal Toggle: Gold vs Silver */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Precious Metal
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMetal("gold");
                      setIsCustom(false);
                      setSelectedPresetId("gold-100g");
                    }}
                    className={`py-3 px-4 rounded-[6px] text-center border-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      activeMetal === "gold"
                        ? "bg-gradient-to-r from-[#8b6914] to-[#6d520f] text-white border-[#8b6914] shadow-xs font-bold"
                        : "bg-[#faf8f5] text-slate-700 border-[#dfcca6] hover:bg-white text-xs font-semibold"
                    }`}
                  >
                    <span>🪙 Gold Bullion</span>
                    <span className={`text-[10.5px] px-1.5 py-0.2 rounded font-bold ${activeMetal === "gold" ? "bg-white/20 text-white" : "bg-stone-200 text-stone-700"}`}>
                      £{spotGold.toFixed(2)}/g
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveMetal("silver");
                      setIsCustom(false);
                      setSelectedPresetId("silver-1kg");
                    }}
                    className={`py-3 px-4 rounded-[6px] text-center border-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      activeMetal === "silver"
                        ? "bg-gradient-to-r from-slate-700 to-slate-900 text-white border-slate-700 shadow-xs font-bold"
                        : "bg-[#faf8f5] text-slate-700 border-slate-300 hover:bg-white text-xs font-semibold"
                    }`}
                  >
                    <span>🥈 Silver Bullion</span>
                    <span className={`text-[10.5px] px-1.5 py-0.2 rounded font-bold ${activeMetal === "silver" ? "bg-white/20 text-white" : "bg-stone-200 text-stone-700"}`}>
                      £{spotSilver.toFixed(2)}/g
                    </span>
                  </button>
                </div>
              </div>

              {/* 2. Preset Selection or Custom Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Select Standard Bar / Coin
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCustom(!isCustom)}
                    className="text-[11px] font-bold text-[#8b6914] hover:underline"
                  >
                    {isCustom ? "← Choose Standard Preset" : "+ Enter Custom Weight"}
                  </button>
                </div>

                {!isCustom ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {availablePresets.map((preset) => {
                      const isSelected = selectedPresetId === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setSelectedPresetId(preset.id)}
                          className={`p-2.5 rounded-[6px] text-left border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#faf5ea] border-[#8b6914] ring-1 ring-[#8b6914] shadow-xs"
                              : "bg-[#faf8f5] border-stone-200 hover:border-[#dfcca6] hover:bg-white"
                          }`}
                        >
                          <div className="text-xs font-bold text-slate-900 leading-tight">
                            {preset.name}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5 flex justify-between">
                            <span>{preset.badge}</span>
                            <span className="font-bold text-[#8b6914]">{(preset.payoutPercentage * 100).toFixed(1)}%</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-2 p-3.5 bg-[#faf8f5] rounded-[6px] border border-[#dfcca6]">
                    <label className="block text-xs font-bold text-slate-700">
                      Custom {activeMetal.toUpperCase()} Weight in Grams
                    </label>
                    <input
                      type="number"
                      min="0.1"
                      step="any"
                      placeholder="e.g. 125.5"
                      value={customWeight}
                      onChange={(e) => setCustomWeight(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-[5px] px-3.5 py-2 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#8b6914]"
                    />
                    <p className="text-[11px] text-slate-500">
                      We buy custom investment bars, grains, and stamped ingots.
                    </p>
                  </div>
                )}
              </div>

              {/* 3. Quantity Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Quantity / Number of Bars
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-[#faf8f5] border border-stone-200 rounded-[5px] px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#8b6914] focus:bg-white"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <div className="p-2.5 rounded-[5px] bg-[#faf5ea] border border-[#dfcca6] text-xs space-y-0.5">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total Pure Weight:</span>
                      <span className="font-bold text-slate-900 tabular-nums">
                        {(weightPerUnit * purityFraction * quantity).toFixed(2)}g
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Payout Tier:</span>
                      <span className="font-bold text-[#8b6914]">{(payoutPct * 100).toFixed(1)}% of Spot</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* LBMA Good Delivery Brands Accepted */}
            <div className="bg-white border-2 border-[#dfcca6] rounded-[10px] p-6 shadow-sm space-y-3">
              <h3 className="text-base font-bold text-slate-900 font-serif">
                LBMA & Trade Refiners Accepted
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We guarantee maximum cash payout for all internationally accredited London Bullion Market Association (LBMA) good-delivery brands:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center text-xs font-bold text-slate-800">
                <span className="p-2 rounded bg-[#faf8f5] border border-stone-200">PAMP Suisse</span>
                <span className="p-2 rounded bg-[#faf8f5] border border-stone-200">Umicore</span>
                <span className="p-2 rounded bg-[#faf8f5] border border-stone-200">Metalor</span>
                <span className="p-2 rounded bg-[#faf8f5] border border-stone-200">The Royal Mint</span>
                <span className="p-2 rounded bg-[#faf8f5] border border-stone-200">Valcambi</span>
                <span className="p-2 rounded bg-[#faf8f5] border border-stone-200">Heraeus</span>
                <span className="p-2 rounded bg-[#faf8f5] border border-stone-200">Baird &amp; Co</span>
                <span className="p-2 rounded bg-[#faf8f5] border border-stone-200">Perth Mint</span>
              </div>
            </div>

          </div>

          {/* Right Column: Live Valuation Card & Lock Button (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-gradient-to-b from-white via-[#fdfbf8] to-[#faf5ea] border-2 border-[#dfcca6] rounded-[10px] p-6 sm:p-7 shadow-sm sticky top-24 space-y-5">
              
              <div className="border-b border-[#dfcca6]/60 pb-4">
                <span className="text-[10.5px] font-bold text-[#8b6914] uppercase tracking-wider block">
                  Official Bullion Buyback
                </span>
                <h3 className="text-xl font-black text-slate-900 font-serif mt-0.5">
                  Live Cash Buyback Value
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Based on live {activeMetal} spot fix of £{spotBase.toFixed(2)}/g
                </p>
              </div>

              {/* Total Payout */}
              <div className="p-4 rounded-[8px] bg-white border-2 border-[#dfcca6] text-center shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Total Instant Cash Payout
                </span>
                <div className="text-3xl sm:text-4xl font-black text-[#8b6914] tracking-tight">
                  {formatGBP(totalPayout)}
                </div>
                <div className="text-xs text-slate-600 font-medium pt-1">
                  {quantity > 1 ? `(${quantity}x @ ${formatGBP(payoutPerItem)} each)` : `@ ${(payoutPct * 100).toFixed(1)}% of live spot`}
                </div>
              </div>

              {/* Breakdown Details */}
              <div className="space-y-2 text-xs border-t border-[#dfcca6]/40 pt-3">
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Selected Product:</span>
                  <span className="font-bold text-slate-900">{isCustom ? "Custom Bullion" : currentPreset.name}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Unit Weight:</span>
                  <span className="font-bold text-slate-900">{weightPerUnit.toFixed(2)}g</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">100% Melt Value:</span>
                  <span className="font-bold text-slate-900 tabular-nums">{formatGBP(meltValuePerItem * quantity)}</span>
                </div>
                <div className="flex justify-between py-1 border-t border-stone-200/60 pt-1.5 font-bold">
                  <span className="text-slate-700">Our Buyback Rate:</span>
                  <span className="text-emerald-700">{(payoutPct * 100).toFixed(1)}% of Spot</span>
                </div>
              </div>

              {/* Action Buttons */}
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
                  <span>Lock Bullion Rate on WhatsApp</span>
                </a>

                <Link
                  href="/find-us"
                  className="w-full py-2.5 px-4 rounded-[6px] bg-[#faf5ea] hover:bg-[#8b6914] text-[#8b6914] hover:text-white border border-[#dfcca6] text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 text-center"
                >
                  <span>Visit Bradford Showroom →</span>
                </Link>
              </div>

              <div className="p-2.5 rounded-[5px] bg-white border border-[#dfcca6]/60 text-[11px] text-slate-600 leading-snug">
                📍 <strong>Showroom Walk-ins Welcome:</strong> 17 Duckworth Lane, Bradford, BD9 5ER. Instant payment via Cash or Faster Bank Transfer upon verification.
              </div>

            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* LIVE REAL-TIME BULLION BUYBACK MATRIX                    */}
        {/* ======================================================== */}
        <div className="mt-14 bg-white border-2 border-[#dfcca6] rounded-[10px] overflow-hidden shadow-sm">
          <div className="p-4 sm:p-5 bg-gradient-to-r from-[#faf5ea] via-[#f7f0e0] to-[#faf5ea] border-b border-[#dfcca6] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-[#8b6914] uppercase tracking-widest block">
                Standard Bullion Catalog
              </span>
              <h3 className="text-lg font-bold text-slate-900 font-serif">
                Today&apos;s Live Bullion Buyback Price List (GBP)
              </h3>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-[4px] border border-emerald-200 self-start sm:self-auto">
              ● Live Spot Matrix
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#dfcca6]/50 bg-[#faf8f5] text-[11px] uppercase text-slate-500 font-bold">
                  <th className="py-3 px-4">Bullion Item</th>
                  <th className="py-3 px-4">Weight &amp; Purity</th>
                  <th className="py-3 px-4">100% Melt Value</th>
                  <th className="py-3 px-4 text-[#8b6914]">Our Buyback Rate</th>
                  <th className="py-3 px-4">Instant Lock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {BULLION_PRESETS.map((p) => {
                  const base = p.metal === "gold" ? spotGold : spotSilver;
                  const melt = p.weightGrams * p.purityFraction * base;
                  const payout = melt * p.payoutPercentage;
                  const isGold = p.metal === "gold";

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-[#faf6ee] transition-colors ${p.id === "gold-100g" ? "bg-[#faf5ea]/50 font-medium" : ""}`}
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {p.name}
                        <span className="text-slate-400 font-normal text-[11px] block capitalize">{p.category}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">
                        {p.weightGrams}g · <span className={isGold ? "text-[#8b6914]" : "text-slate-600"}>{p.badge}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 tabular-nums font-semibold">
                        {formatGBP(melt)}
                      </td>
                      <td className="py-3.5 px-4 font-black text-slate-900 tabular-nums text-sm sm:text-base">
                        {formatGBP(payout)}{" "}
                        <span className="text-[10px] text-emerald-700 font-bold">
                          ({(p.payoutPercentage * 100).toFixed(1)}%)
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <a
                          href={`https://wa.me/447735727897?text=Hello%20Bhai%20Jewellers,%20I%20would%20like%20to%20sell%20my%20${encodeURIComponent(p.name)}%20(Today%27s%20rate:%20${formatGBP(payout)}).`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-[4px] bg-[#faf5ea] hover:bg-[#8b6914] text-[#8b6914] hover:text-white border border-[#dfcca6] text-[11px] font-bold transition-all inline-block whitespace-nowrap shadow-2xs"
                        >
                          Lock Rate →
                        </a>
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
