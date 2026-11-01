"use client";

import React, { useState } from "react";

export default function Home() {
  const [activeView, setActiveView] = useState<"current" | "interactive" | "overview">("interactive");

  // Interactive Calculator State for "Interactive View"
  const [calcMetal, setCalcMetal] = useState<"gold" | "silver">("gold");
  const [calcUnit, setCalcUnit] = useState<"gram" | "tola" | "ounce">("tola");
  const [calcQuantity, setCalcQuantity] = useState<number>(1);

  const goldGram = 96.61;
  const silverGram = 1.30;

  const calculateTotal = () => {
    const basePrice = calcMetal === "gold" ? goldGram : silverGram;
    let multiplier = 1;
    if (calcUnit === "tola") multiplier = 11.6638;
    if (calcUnit === "ounce") multiplier = 31.1035;
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
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Updated 26 October 2026 at 19:01 UK time
            </p>
          </div>

          {/* Screenshot Segmented View Pill: Current View | Interactive View | Overview */}
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

        {/* 1. CURRENT VIEW: Spot Cards */}
        {activeView === "current" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 animate-fadeIn">
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
                  £96.61
                </div>
                <div className="text-xs text-slate-500 mt-1.5 font-medium">
                  per gram · live
                </div>
              </div>

              <div className="mt-4 space-y-1 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-stone-100">
                  <span className="text-slate-600 font-medium">Per tola (11.66g)</span>
                  <span className="font-bold text-slate-900 tabular-nums">£1,126.84</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-stone-100">
                  <span className="text-slate-600 font-medium">Per tola (10g)</span>
                  <span className="font-bold text-slate-900 tabular-nums">£966.10</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-600 font-medium">Per ounce</span>
                  <span className="font-bold text-slate-900 tabular-nums">£3,004.91</span>
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
                  £1.30
                </div>
                <div className="text-xs text-slate-500 mt-1.5 font-medium">
                  per gram · live
                </div>
              </div>

              <div className="mt-4 space-y-1 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Per tola (11.66g)</span>
                  <span className="font-bold text-slate-900 tabular-nums">£15.16</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Per tola (10g)</span>
                  <span className="font-bold text-slate-900 tabular-nums">£13.00</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-600 font-medium">Per ounce</span>
                  <span className="font-bold text-slate-900 tabular-nums">£40.43</span>
                </div>
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
                  <span className="text-xs font-bold text-emerald-600">● live</span>
                </div>
                <div className="text-3xl font-black text-slate-900 mt-1">£96.61 <span className="text-xs font-normal text-slate-500">/ gram</span></div>
                <div className="text-xs text-slate-600 mt-2 flex justify-between border-t border-stone-200/50 pt-2">
                  <span>Per tola (11.66g):</span>
                  <span className="font-bold text-slate-900">£1,126.84</span>
                </div>
              </div>

              {/* Silver Mini Card */}
              <div className="bg-[#fafafa] border border-slate-200 rounded-[5px] p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Silver (GBP)</span>
                  <span className="text-xs font-bold text-emerald-600">● live</span>
                </div>
                <div className="text-3xl font-black text-slate-900 mt-1">£1.30 <span className="text-xs font-normal text-slate-500">/ gram</span></div>
                <div className="text-xs text-slate-600 mt-2 flex justify-between border-t border-slate-200/60 pt-2">
                  <span>Per tola (11.66g):</span>
                  <span className="font-bold text-slate-900">£15.16</span>
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
                    <option value="gold">Gold (£96.61/g)</option>
                    <option value="silver">Silver (£1.30/g)</option>
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
                    min="0.1"
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
          </div>
        )}

        {/* 3. OVERVIEW: Comprehensive Table */}
        {activeView === "overview" && (
          <div className="mt-8 border border-stone-200 rounded-[5px] overflow-hidden bg-white shadow-xs animate-fadeIn">
            <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">Precious Metals Overview (GBP)</span>
              <span className="text-xs text-slate-500">Indicative London Spot Rates</span>
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
                  <tr className="hover:bg-amber-50/30 font-medium">
                    <td className="py-3 px-4 font-bold text-slate-900">Gold 24K (Pure 999.9)</td>
                    <td className="py-3 px-4 text-[#8b6914] font-bold">£96.61</td>
                    <td className="py-3 px-4 font-bold text-slate-900">£1,126.84</td>
                    <td className="py-3 px-4 font-bold text-slate-900">£966.10</td>
                    <td className="py-3 px-4 font-bold text-slate-900">£3,004.91</td>
                  </tr>
                  <tr className="hover:bg-amber-50/30">
                    <td className="py-3 px-4 font-semibold text-slate-800">Gold 22K (Jewellery standard)</td>
                    <td className="py-3 px-4">£88.56</td>
                    <td className="py-3 px-4">£1,032.94</td>
                    <td className="py-3 px-4">£885.59</td>
                    <td className="py-3 px-4">£2,754.50</td>
                  </tr>
                  <tr className="hover:bg-stone-50 font-medium">
                    <td className="py-3 px-4 font-bold text-slate-900">Silver (Fine 999)</td>
                    <td className="py-3 px-4 font-bold text-slate-700">£1.30</td>
                    <td className="py-3 px-4 font-bold text-slate-900">£15.16</td>
                    <td className="py-3 px-4 font-bold text-slate-900">£13.00</td>
                    <td className="py-3 px-4 font-bold text-slate-900">£40.43</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Disclaimer Note */}
        <div className="mt-8 p-4 rounded-[5px] bg-[#faf8f5]/60 border border-[#dfcca6]/50 text-xs text-slate-600 leading-relaxed">
          <p>
            Market rates are indicative and may change without notice. Final buying and selling prices are subject to confirmation by <strong className="text-slate-900 font-semibold">Bhai Jeweller</strong>.
          </p>
        </div>

      </main>
    </div>
  );
}
