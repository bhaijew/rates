"use client";

import React, { useState, useEffect } from "react";
import {
  DEFAULT_RATES,
  WEIGHT_CONVERSIONS,
  GOLD_PURITIES,
  calculateGoldSilverRatio,
  formatGBP,
  formatUKDateTime,
} from "@/lib/rates";

export default function Home() {
  const [activeView, setActiveView] = useState<"current" | "interactive" | "overview">("interactive");
  const [rates, setRates] = useState(DEFAULT_RATES);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdatedDisplay, setLastUpdatedDisplay] = useState(formatUKDateTime());

  // Interactive Calculator State
  const [calcMetal, setCalcMetal] = useState<"gold" | "silver">("gold");
  const [calcUnit, setCalcUnit] = useState<"gram" | "tola" | "ounce">("tola");
  const [calcQuantity, setCalcQuantity] = useState<number>(1);

  // Fetch rates on mount
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
      // Fallback
      setRates(DEFAULT_RATES);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const goldGram = rates.goldGbpPerGram;
  const silverGram = rates.silverGbpPerGram;
  const goldSilverRatio = calculateGoldSilverRatio(goldGram, silverGram);

  const calculateTotal = () => {
    const basePrice = calcMetal === "gold" ? goldGram : silverGram;
    let multiplier = 1;
    if (calcUnit === "tola") multiplier = WEIGHT_CONVERSIONS.tolaTraditional;
    if (calcUnit === "ounce") multiplier = WEIGHT_CONVERSIONS.troyOunce;
    return (basePrice * multiplier * (calcQuantity || 0)).toLocaleString("en-GB", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 pb-20">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14">
        
        {/* Page Header */}
        <div className="border-b border-slate-100 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Live Gold & Silver Rates (GBP)
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs sm:text-sm text-slate-500">
                Updated {lastUpdatedDisplay}
              </p>
              <button
                onClick={fetchRates}
                disabled={isRefreshing}
                title="Refresh Live Rates"
                className="p-1 text-slate-400 hover:text-[#9c8254] transition-colors rounded hover:bg-stone-50"
              >
                <svg
                  className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#9c8254]" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          {/* Segmented View Pill: Current View | Interactive View | Overview */}
          <div className="inline-flex items-center p-1 bg-white border border-[#e8dac1] rounded-full shadow-xs self-start sm:self-auto">
            <button
              onClick={() => setActiveView("current")}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                activeView === "current"
                  ? "bg-[#8b6914] text-white shadow-xs"
                  : "text-[#8b6914] hover:text-[#6e520d]"
              }`}
            >
              Current View
            </button>
            <button
              onClick={() => setActiveView("interactive")}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                activeView === "interactive"
                  ? "bg-[#8b6914] text-white shadow-xs"
                  : "text-[#8b6914] hover:text-[#6e520d]"
              }`}
            >
              Interactive View
            </button>
            <button
              onClick={() => setActiveView("overview")}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                activeView === "overview"
                  ? "bg-[#8b6914] text-white shadow-xs"
                  : "text-[#8b6914] hover:text-[#6e520d]"
              }`}
            >
              Overview
            </button>
          </div>
        </div>

        {/* 1. CURRENT VIEW: Spot Cards + Gold:Silver Ratio */}
        {activeView === "current" && (
          <div className="space-y-6 mt-8 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* GOLD CARD */}
              <div className="bg-[#faf8f5]/40 border border-[#dfcca6]/80 rounded-[5px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:border-[#caa771] transition-all">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-900 tracking-tight">
                    Gold spot price (GBP)
                  </h2>
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-[5px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    live
                  </span>
                </div>

                <div className="mt-4 pb-5 border-b border-[#dfcca6]/40">
                  <div className="text-4xl font-extrabold text-slate-900 tracking-tight">
                    {formatGBP(goldGram)}
                  </div>
                  <div className="text-xs text-slate-500 mt-1.5 font-medium">
                    per gram · 24K pure · live
                  </div>
                </div>

                <div className="mt-4 space-y-1 text-sm">
                  <div className="flex items-center justify-between py-2 border-b border-stone-100">
                    <span className="text-slate-600 font-medium">Per tola (11.66g)</span>
                    <span className="font-bold text-slate-900 tabular-nums">
                      {formatGBP(goldGram * WEIGHT_CONVERSIONS.tolaTraditional)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-stone-100">
                    <span className="text-slate-600 font-medium">Per tola (10g)</span>
                    <span className="font-bold text-slate-900 tabular-nums">
                      {formatGBP(goldGram * WEIGHT_CONVERSIONS.tola10g)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-slate-600 font-medium">Per ounce (31.10g)</span>
                    <span className="font-bold text-slate-900 tabular-nums">
                      {formatGBP(goldGram * WEIGHT_CONVERSIONS.troyOunce)}
                    </span>
                  </div>
                </div>
              </div>

              {/* SILVER CARD */}
              <div className="bg-[#fafafa] border border-slate-200 rounded-[5px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:border-slate-300 transition-all">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-900 tracking-tight">
                    Silver spot price (GBP)
                  </h2>
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-[5px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    live
                  </span>
                </div>

                <div className="mt-4 pb-5 border-b border-slate-200/60">
                  <div className="text-4xl font-extrabold text-slate-900 tracking-tight">
                    {formatGBP(silverGram)}
                  </div>
                  <div className="text-xs text-slate-500 mt-1.5 font-medium">
                    per gram · 999 fine · live
                  </div>
                </div>

                <div className="mt-4 space-y-1 text-sm">
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">Per tola (11.66g)</span>
                    <span className="font-bold text-slate-900 tabular-nums">
                      {formatGBP(silverGram * WEIGHT_CONVERSIONS.tolaTraditional)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">Per tola (10g)</span>
                    <span className="font-bold text-slate-900 tabular-nums">
                      {formatGBP(silverGram * WEIGHT_CONVERSIONS.tola10g)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-slate-600 font-medium">Per ounce (31.10g)</span>
                    <span className="font-bold text-slate-900 tabular-nums">
                      {formatGBP(silverGram * WEIGHT_CONVERSIONS.troyOunce)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* GOLD : SILVER RATIO CARD */}
            <div className="bg-gradient-to-r from-[#faf8f5] to-white border border-[#dfcca6] rounded-[5px] p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8b6914]">
                    Market Intelligence
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8b6914]" />
                  <span className="text-xs text-slate-500 font-medium">Gold / Silver Ratio</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  1 : {goldSilverRatio}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  It currently takes {goldSilverRatio} ounces of silver to buy 1 ounce of gold.
                </p>
              </div>
              <div className="px-4 py-2 rounded-[5px] bg-white border border-[#dfcca6] text-xs font-bold text-[#8b6914] shrink-0">
                Live Ratio: {goldSilverRatio}
              </div>
            </div>
          </div>
        )}

        {/* 2. INTERACTIVE VIEW: Spot Cards + Interactive Live Rate Calculator */}
        {activeView === "interactive" && (
          <div className="space-y-6 mt-8 animate-fadeIn">
            {/* Spot Cards Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gold Mini Card */}
              <div className="bg-[#faf8f5]/50 border border-[#dfcca6] rounded-[5px] p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8b6914]">Gold (GBP)</span>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> live
                  </span>
                </div>
                <div className="text-3xl font-black text-slate-900 mt-1">
                  {formatGBP(goldGram)} <span className="text-xs font-normal text-slate-500">/ gram</span>
                </div>
                <div className="text-xs text-slate-600 mt-2 flex justify-between border-t border-stone-200/50 pt-2">
                  <span>Per tola (11.66g):</span>
                  <span className="font-bold text-slate-900">
                    {formatGBP(goldGram * WEIGHT_CONVERSIONS.tolaTraditional)}
                  </span>
                </div>
              </div>

              {/* Silver Mini Card */}
              <div className="bg-[#fafafa] border border-slate-200 rounded-[5px] p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Silver (GBP)</span>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> live
                  </span>
                </div>
                <div className="text-3xl font-black text-slate-900 mt-1">
                  {formatGBP(silverGram)} <span className="text-xs font-normal text-slate-500">/ gram</span>
                </div>
                <div className="text-xs text-slate-600 mt-2 flex justify-between border-t border-slate-200/60 pt-2">
                  <span>Per tola (11.66g):</span>
                  <span className="font-bold text-slate-900">
                    {formatGBP(silverGram * WEIGHT_CONVERSIONS.tolaTraditional)}
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Calculator Box */}
            <div className="bg-white border border-[#dfcca6]/80 rounded-[5px] p-6 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Live Interactive Value Calculator
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Calculate custom gold or silver amounts directly at today&apos;s live spot rate.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Metal</label>
                  <select
                    value={calcMetal}
                    onChange={(e) => setCalcMetal(e.target.value as "gold" | "silver")}
                    className="w-full bg-[#faf8f5] border border-stone-200 rounded-[5px] px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#8b6914]"
                  >
                    <option value="gold">Gold ({formatGBP(goldGram)}/g)</option>
                    <option value="silver">Silver ({formatGBP(silverGram)}/g)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Weight Unit</label>
                  <select
                    value={calcUnit}
                    onChange={(e) => setCalcUnit(e.target.value as "gram" | "tola" | "ounce")}
                    className="w-full bg-[#faf8f5] border border-stone-200 rounded-[5px] px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#8b6914]"
                  >
                    <option value="tola">Tola (11.66g)</option>
                    <option value="gram">Grams (g)</option>
                    <option value="ounce">Troy Ounce (31.10g)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Quantity</label>
                  <input
                    type="number"
                    min="0.01"
                    step="any"
                    value={calcQuantity}
                    onChange={(e) => setCalcQuantity(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#faf8f5] border border-stone-200 rounded-[5px] px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#8b6914]"
                  />
                </div>

                <div className="bg-[#8b6914] text-white rounded-[5px] p-2.5 flex flex-col justify-center">
                  <span className="text-[10px] uppercase font-bold text-amber-200">Total Live Value</span>
                  <span className="text-xl font-extrabold tracking-tight mt-0.5">£{calculateTotal()}</span>
                </div>
              </div>
            </div>

            {/* Quick Gold : Silver Ratio Strip */}
            <div className="p-3.5 rounded-[5px] bg-[#faf8f5] border border-[#dfcca6]/60 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">
                Gold : Silver Ratio: <strong className="text-slate-900">{goldSilverRatio}</strong>
              </span>
              <span className="text-[#8b6914] font-semibold">
                Updated {lastUpdatedDisplay}
              </span>
            </div>
          </div>
        )}

        {/* 3. OVERVIEW: Comprehensive Purity Table */}
        {activeView === "overview" && (
          <div className="mt-8 border border-stone-200 rounded-[5px] overflow-hidden bg-white shadow-xs animate-fadeIn">
            <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">Precious Metals Complete Overview (GBP)</span>
              <span className="text-xs text-slate-500">Live London Market Rates</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50/50 text-[11px] uppercase text-slate-500 font-semibold">
                    <th className="py-2.5 px-4">Commodity / Purity</th>
                    <th className="py-2.5 px-4">Per Gram</th>
                    <th className="py-2.5 px-4">Per Tola (11.66g)</th>
                    <th className="py-2.5 px-4">Per Tola (10g)</th>
                    <th className="py-2.5 px-4">Per Ounce</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-slate-700">
                  {GOLD_PURITIES.map((purity) => {
                    const priceGram = goldGram * purity.fraction;
                    const priceTolaTrad = priceGram * WEIGHT_CONVERSIONS.tolaTraditional;
                    const priceTola10g = priceGram * WEIGHT_CONVERSIONS.tola10g;
                    const priceOunce = priceGram * WEIGHT_CONVERSIONS.troyOunce;
                    const is24K = purity.karat === "24K";

                    return (
                      <tr
                        key={purity.karat}
                        className={is24K ? "bg-amber-50/20 font-medium" : "hover:bg-amber-50/10"}
                      >
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900">Gold {purity.karat}</span>{" "}
                          <span className="text-slate-500 text-[11px]">({purity.purity} · {purity.label})</span>
                        </td>
                        <td className={`py-3 px-4 font-bold ${is24K ? "text-[#8b6914]" : "text-slate-800"}`}>
                          {formatGBP(priceGram)}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {formatGBP(priceTolaTrad)}
                        </td>
                        <td className="py-3 px-4 text-slate-800">
                          {formatGBP(priceTola10g)}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {formatGBP(priceOunce)}
                        </td>
                      </tr>
                    );
                  })}
                  {/* Silver Row */}
                  <tr className="hover:bg-stone-50 font-medium bg-slate-50/30">
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900">Silver 999</span>{" "}
                      <span className="text-slate-500 text-[11px]">(Pure Fine Silver)</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-700">
                      {formatGBP(silverGram)}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {formatGBP(silverGram * WEIGHT_CONVERSIONS.tolaTraditional)}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {formatGBP(silverGram * WEIGHT_CONVERSIONS.tola10g)}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {formatGBP(silverGram * WEIGHT_CONVERSIONS.troyOunce)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Disclaimer Note */}
        <div className="mt-8 p-4 rounded-[5px] bg-[#faf8f5]/60 border border-[#dfcca6]/50 text-xs text-slate-600 leading-relaxed">
          <p>
            Market rates are indicative London spot rates and update regularly. Final buying and selling prices are subject to confirmation by <strong className="text-slate-900 font-semibold">Bhai Jeweller</strong>.
          </p>
        </div>

      </main>
    </div>
  );
}
