"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  DEFAULT_RATES,
  WEIGHT_CONVERSIONS,
  GOLD_PURITIES,
  calculateGoldSilverRatio,
  formatGBP,
  formatUKDateTime,
} from "@/lib/rates";

export default function Home() {
  const [activeView, setActiveView] = useState<"current" | "interactive" | "overview">("current");
  const [rates, setRates] = useState(DEFAULT_RATES);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdatedDisplay, setLastUpdatedDisplay] = useState("");
  const [heroBg, setHeroBg] = useState<"jewelry" | "gold">("jewelry");

  // Interactive Calculator State
  const [calcMetal, setCalcMetal] = useState<"gold" | "silver">("gold");
  const [calcUnit, setCalcUnit] = useState<"gram" | "tola" | "ounce">("tola");
  const [calcQuantity, setCalcQuantity] = useState<number>(1);

  // Fetch real-time live rates (supports force fresh on demand)
  const fetchRates = async (fresh = false) => {
    setIsRefreshing(true);
    try {
      const url = fresh
        ? `/api/rates?fresh=true&t=${Date.now()}`
        : `/api/rates?t=${Date.now()}`;
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setRates({
          goldGbpPerGram: data.goldGbpPerGram || DEFAULT_RATES.goldGbpPerGram,
          silverGbpPerGram: data.silverGbpPerGram || DEFAULT_RATES.silverGbpPerGram,
          goldOunceGbp: data.goldOunceGbp,
          silverOunceGbp: data.silverOunceGbp,
          goldChange24h: data.goldChange24h,
          goldChangePercent24h: data.goldChangePercent24h,
          goldLiveHigh: data.goldLiveHigh,
          goldLiveLow: data.goldLiveLow,
          silverChange24h: data.silverChange24h,
          silverChangePercent24h: data.silverChangePercent24h,
          silverLiveHigh: data.silverLiveHigh,
          silverLiveLow: data.silverLiveLow,
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
    setLastUpdatedDisplay(formatUKDateTime());
    fetchRates(true);
    // Auto-polling every 20 seconds to guarantee real-time market accuracy
    const timer = setInterval(() => {
      fetchRates(false);
    }, 20000);
    return () => clearInterval(timer);
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

  const goldWaMessage = encodeURIComponent(
    `Hello Bhai Jewellers, I would like to lock the live Gold Spot Rate of £${goldGram.toFixed(2)}/g.`
  );
  const silverWaMessage = encodeURIComponent(
    `Hello Bhai Jewellers, I would like to lock the live Silver Spot Rate of £${silverGram.toFixed(2)}/g.`
  );

  return (
    <div className="min-h-screen bg-[#faf8f5] font-sans text-slate-800 pb-20 relative overflow-x-hidden">
      
      {/* Light Warm Luxury Background Image: Fine Jewellery or Gold Bullion */}
      <div 
        className="fixed inset-0 bg-cover bg-center transition-all duration-700 ease-in-out pointer-events-none scale-105"
        style={{ 
          backgroundImage: `url(${heroBg === "jewelry" ? "'/images/luxury-gold-jewelry.jpg'" : "'/images/gold-bars-bg.jpg'"})`,
          opacity: 0.13,
        }}
      />

      {/* Warm Ambient Pearl Gradients for Light Royal Jewellery Aesthetic */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#faf8f5]/90 via-[#fdfbf7]/75 to-[#faf8f5]/95 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#dfcca6]/35 via-transparent to-transparent pointer-events-none" />

      {/* Top Gold Metallic Accent Bar */}
      <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#caa771] to-transparent relative z-10 opacity-80" />

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        
        {/* Page Header with Badge & Background Theme Switcher */}
        <div className="border-b border-[#dfcca6]/70 pb-5">
          {/* Top Bar: Desk Tag + Toggle Jewellery / Bullion */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-[10.5px] sm:text-[11px] font-bold text-[#8b6914] tracking-widest uppercase bg-[#faf5ea] px-2.5 py-1 rounded-[4px] border border-[#dfcca6] shadow-2xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                UK London Bullion Desk
              </span>
              <span className="text-xs text-slate-500 font-medium">· London Fixings</span>
            </div>

            {/* Background Theme Switcher: Jewellery / Gold Bullion */}
            <div className="inline-flex items-center p-0.5 rounded-[5px] bg-white border border-[#dfcca6] shadow-2xs text-[11px]">
              <button
                type="button"
                onClick={() => setHeroBg("jewelry")}
                className={`px-2.5 py-1 rounded-[3px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  heroBg === "jewelry"
                    ? "bg-[#8b6914] text-white shadow-xs"
                    : "text-[#8b6914] hover:bg-[#faf5ea]"
                }`}
                title="Switch background to Fine Jewellery"
              >
                <span>💎</span>
                <span>Jewellery</span>
              </button>
              <button
                type="button"
                onClick={() => setHeroBg("gold")}
                className={`px-2.5 py-1 rounded-[3px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  heroBg === "gold"
                    ? "bg-[#8b6914] text-white shadow-xs"
                    : "text-[#8b6914] hover:bg-[#faf5ea]"
                }`}
                title="Switch background to Gold Bullion"
              >
                <span>🪙</span>
                <span>Gold Bullion</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 mt-1">
                Live Gold & Silver Rates <span className="text-[#8b6914]">(GBP)</span>
              </h1>

              <div className="flex items-center gap-2 mt-2">
                {/* Radar Live Indicator */}
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <p className="text-xs text-slate-600 font-medium" suppressHydrationWarning>
                  {lastUpdatedDisplay ? `Updated ${lastUpdatedDisplay}` : "Live Market Feed"}
                </p>
                <button
                  onClick={() => fetchRates(true)}
                  disabled={isRefreshing}
                  title="Click to fetch latest live spot price"
                  className="p-1 text-slate-400 hover:text-[#8b6914] transition-all rounded hover:bg-[#faf5ea] active:scale-90 cursor-pointer"
                >
                  <svg
                    className={`w-3.5 h-3.5 transition-transform duration-500 ${isRefreshing ? "animate-spin text-[#8b6914]" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Segmented View Pill: Current View | Interactive View | Overview */}
            <div className="inline-flex items-center p-1 bg-white border border-[#dfcca6] rounded-[6px] shadow-xs self-start sm:self-auto">
              <button
                onClick={() => setActiveView("current")}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-[4px] transition-all duration-200 cursor-pointer ${
                  activeView === "current"
                    ? "bg-[#8b6914] text-white shadow-xs scale-100"
                    : "text-[#8b6914] hover:text-[#6e520d] hover:bg-[#faf5ea]"
                }`}
              >
                Current View
              </button>
              <button
                onClick={() => setActiveView("interactive")}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-[4px] transition-all duration-200 cursor-pointer ${
                  activeView === "interactive"
                    ? "bg-[#8b6914] text-white shadow-xs scale-100"
                    : "text-[#8b6914] hover:text-[#6e520d] hover:bg-[#faf5ea]"
                }`}
              >
                Interactive View
              </button>
              <button
                onClick={() => setActiveView("overview")}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-[4px] transition-all duration-200 cursor-pointer ${
                  activeView === "overview"
                    ? "bg-[#8b6914] text-white shadow-xs scale-100"
                    : "text-[#8b6914] hover:text-[#6e520d] hover:bg-[#faf5ea]"
                }`}
              >
                Overview
              </button>
            </div>
          </div>
        </div>

        {/* 1. CURRENT VIEW: Spot Cards + Market Ratio */}
        {activeView === "current" && (
          <div className="space-y-6 mt-8 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* GOLD SPOT CARD */}
              <div className="relative group bg-gradient-to-br from-white via-[#fcfaf6] to-[#fbf5e8] border-2 border-[#dfcca6] hover:border-[#caa771] rounded-2xl p-6 shadow-[0_4px_24px_-4px_rgba(212,175,55,0.15)] hover:shadow-[0_16px_40px_rgba(212,175,55,0.25)] transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col justify-between">
                
                {/* 24K Metallic Gold Accent Strip */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#d4af37] via-[#f7e799] to-[#aa7c11]" />

                {/* Subtle Shimmer Sweep on Hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

                <div>
                  {/* Top Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Gold Bar Icon */}
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#fbf5ea] to-[#eedbb9] border border-[#d4af37]/60 flex items-center justify-center text-[#8b6914] shadow-xs">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                          <path d="M4 18h16l2-8H2l2 8zm1-10h14l1-4H4l1 4z" opacity="0.8" />
                          <path d="M3 19h18v2H3v-2z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                          Gold spot price (GBP)
                        </h2>
                        <span className="text-[10px] font-bold text-[#8b6914] uppercase tracking-wider block">
                          24K Pure · 999.9 Fine Gold
                        </span>
                      </div>
                    </div>

                    {/* Live Pulse Pill */}
                    <span className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-300/80 px-2.5 py-1 rounded-full shadow-2xs">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                      live
                    </span>
                  </div>

                  {/* Main Price */}
                  <div className="mt-5 pb-5 border-b border-[#dfcca6]/50">
                    <div className="flex items-baseline gap-2">
                      <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight font-sans">
                        {formatGBP(goldGram)}
                      </div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        / gram
                      </span>
                    </div>

                    {/* Live High / Low and Change Bar */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 text-xs">
                      {rates.goldChangePercent24h !== undefined && (
                        <span className={`inline-flex items-center gap-1 font-extrabold px-2 py-0.5 rounded text-[11px] ${
                          rates.goldChangePercent24h >= 0 
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}>
                          <span>{rates.goldChangePercent24h >= 0 ? "▲" : "▼"}</span>
                          <span>{rates.goldChangePercent24h >= 0 ? "+" : ""}{rates.goldChangePercent24h.toFixed(2)}%</span>
                        </span>
                      )}
                      {rates.goldLiveHigh && (
                        <span className="text-slate-500 text-[11px] font-medium">
                          Live High: <strong className="text-slate-800 font-bold">£{rates.goldLiveHigh.toFixed(2)}</strong>
                        </span>
                      )}
                      {rates.goldLiveLow && (
                        <span className="text-slate-500 text-[11px] font-medium">
                          Live Low: <strong className="text-slate-800 font-bold">£{rates.goldLiveLow.toFixed(2)}</strong>
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-[#8b6914] mt-2 font-semibold flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        London LBMA Benchmark
                      </span>
                      <span className="text-slate-400 text-[11px]">· 0% VAT Bullion</span>
                    </div>
                  </div>

                  {/* Weight Breakdown */}
                  <div className="mt-4 space-y-1.5 text-sm">
                    <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#faf6ee]/70 hover:bg-[#f6eedc] border border-[#dfcca6]/40 transition-colors">
                      <span className="text-slate-700 font-medium text-xs sm:text-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#8b6914]" />
                        Per tola (11.66g)
                      </span>
                      <span className="font-extrabold text-slate-900 tabular-nums">
                        {formatGBP(goldGram * WEIGHT_CONVERSIONS.tolaTraditional)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#faf6ee]/70 hover:bg-[#f6eedc] border border-[#dfcca6]/40 transition-colors">
                      <span className="text-slate-700 font-medium text-xs sm:text-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#b8860b]" />
                        Per tola (10g)
                      </span>
                      <span className="font-extrabold text-slate-900 tabular-nums">
                        {formatGBP(goldGram * WEIGHT_CONVERSIONS.tola10g)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#faf6ee]/70 hover:bg-[#f6eedc] border border-[#dfcca6]/40 transition-colors">
                      <span className="text-slate-700 font-medium text-xs sm:text-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#caa771]" />
                        Per ounce (31.10g)
                      </span>
                      <span className="font-extrabold text-slate-900 tabular-nums">
                        {formatGBP(goldGram * WEIGHT_CONVERSIONS.troyOunce)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Link: Lock on WhatsApp */}
                <div className="mt-5 pt-3 border-t border-[#dfcca6]/40">
                  <a
                    href={`https://wa.me/447735727897?text=${goldWaMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gradient-to-r from-[#9c8254] via-[#caa771] to-[#8b6914] hover:from-[#8b6914] hover:to-[#73582a] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-98"
                  >
                    <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                    <span>Lock Gold Spot Rate on WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* SILVER SPOT CARD */}
              <div className="relative group bg-gradient-to-br from-white via-[#f8fafc] to-[#f1f5f9] border-2 border-slate-200 hover:border-slate-400 rounded-2xl p-6 shadow-[0_4px_24px_-4px_rgba(148,163,184,0.15)] hover:shadow-[0_16px_40px_rgba(148,163,184,0.25)] transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col justify-between">
                
                {/* 999 Platinum/Silver Accent Strip */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-slate-300 via-slate-100 to-slate-400" />

                {/* Subtle Shimmer Sweep on Hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

                <div>
                  {/* Top Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Silver Coin Icon */}
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 shadow-xs">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="8" />
                          <circle cx="12" cy="12" r="4" strokeDasharray="2 2" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                          Silver spot price (GBP)
                        </h2>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          999 Fine Pure Silver
                        </span>
                      </div>
                    </div>

                    {/* Live Pulse Pill */}
                    <span className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-300/80 px-2.5 py-1 rounded-full shadow-2xs">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                      live
                    </span>
                  </div>

                  {/* Main Price */}
                  <div className="mt-5 pb-5 border-b border-slate-200">
                    <div className="flex items-baseline gap-2">
                      <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight font-sans">
                        {formatGBP(silverGram)}
                      </div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        / gram
                      </span>
                    </div>

                    {/* Live High / Low and Change Bar */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 text-xs">
                      {rates.silverChangePercent24h !== undefined && (
                        <span className={`inline-flex items-center gap-1 font-extrabold px-2 py-0.5 rounded text-[11px] ${
                          rates.silverChangePercent24h >= 0 
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}>
                          <span>{rates.silverChangePercent24h >= 0 ? "▲" : "▼"}</span>
                          <span>{rates.silverChangePercent24h >= 0 ? "+" : ""}{rates.silverChangePercent24h.toFixed(2)}%</span>
                        </span>
                      )}
                      {rates.silverLiveHigh && (
                        <span className="text-slate-500 text-[11px] font-medium">
                          Live High: <strong className="text-slate-800 font-bold">£{rates.silverLiveHigh.toFixed(2)}</strong>
                        </span>
                      )}
                      {rates.silverLiveLow && (
                        <span className="text-slate-500 text-[11px] font-medium">
                          Live Low: <strong className="text-slate-800 font-bold">£{rates.silverLiveLow.toFixed(2)}</strong>
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-500 mt-1.5 font-semibold flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Physical London Bullion Fix
                      </span>
                      <span className="text-slate-400 text-[11px]">· Pure Investment Grade</span>
                    </div>
                  </div>

                  {/* Weight Breakdown */}
                  <div className="mt-4 space-y-1.5 text-sm">
                    <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors">
                      <span className="text-slate-700 font-medium text-xs sm:text-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-500" />
                        Per tola (11.66g)
                      </span>
                      <span className="font-extrabold text-slate-900 tabular-nums">
                        {formatGBP(silverGram * WEIGHT_CONVERSIONS.tolaTraditional)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors">
                      <span className="text-slate-700 font-medium text-xs sm:text-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-400" />
                        Per tola (10g)
                      </span>
                      <span className="font-extrabold text-slate-900 tabular-nums">
                        {formatGBP(silverGram * WEIGHT_CONVERSIONS.tola10g)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors">
                      <span className="text-slate-700 font-medium text-xs sm:text-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-400" />
                        Per ounce (31.10g)
                      </span>
                      <span className="font-extrabold text-slate-900 tabular-nums">
                        {formatGBP(silverGram * WEIGHT_CONVERSIONS.troyOunce)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Link: Lock on WhatsApp */}
                <div className="mt-5 pt-3 border-t border-slate-200">
                  <a
                    href={`https://wa.me/447735727897?text=${silverWaMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-98"
                  >
                    <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                    <span>Lock Silver Spot Rate on WhatsApp</span>
                  </a>
                </div>
              </div>

            </div>

            {/* GOLD : SILVER RATIO EXECUTIVE WIDGET */}
            <div className="relative overflow-hidden bg-gradient-to-r from-white via-[#fbf7f0] to-[#f4f7fa] border-2 border-[#dfcca6] hover:border-[#caa771] rounded-2xl p-6 shadow-sm transition-all duration-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8b6914] bg-[#fbf5ea] px-2.5 py-0.5 rounded-full border border-[#dfcca6]">
                      Market Intelligence
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8b6914]" />
                    <span className="text-xs text-slate-700 font-bold">Gold / Silver Ratio</span>
                  </div>

                  <div className="flex items-baseline gap-3 pt-1">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-sans">
                      1 : {goldSilverRatio}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      (1 oz of Gold = {goldSilverRatio} oz of Silver)
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                    Historical average is ~65:1. It currently takes <strong className="text-slate-900 font-bold">{goldSilverRatio} ounces of silver</strong> to buy 1 ounce of gold, indicating silver is trading at an attractive relative value.
                  </p>
                </div>

                <div className="self-stretch sm:self-center flex flex-col items-end justify-center shrink-0">
                  <div className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white border border-[#dfcca6] text-center shadow-xs">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Live Ratio</span>
                    <span className="text-xl font-black text-[#8b6914] tabular-nums">
                      {goldSilverRatio}
                    </span>
                  </div>
                </div>
              </div>

              {/* Visual Balance Bar */}
              <div className="mt-5 pt-3.5 border-t border-[#dfcca6]/50">
                <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-2">
                  <span className="flex items-center gap-1.5 text-[#8b6914]">
                    <span className="w-2 h-2 rounded-full bg-[#9c8254]" /> Gold (XAU)
                  </span>
                  <span className="text-slate-400 text-[10px] font-medium hidden sm:inline">
                    London Physical Exchange Balance
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-700">
                    Silver (XAG) <span className="w-2 h-2 rounded-full bg-slate-500" />
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                  <div
                    style={{ width: `${Math.min(Math.max((goldSilverRatio / 100) * 100, 20), 85)}%` }}
                    className="bg-gradient-to-r from-[#dfcca6] via-[#9c8254] to-[#856b3e] h-full transition-all duration-700"
                  />
                  <div className="flex-1 bg-gradient-to-r from-slate-300 to-slate-500 h-full" />
                </div>
              </div>
            </div>

            {/* Quick Action Navigation Grid (Interactive Buttons) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <Link
                href="/gold-bars"
                className="group p-4 bg-white border border-[#dfcca6]/80 hover:border-[#8b6914] rounded-xl hover:shadow-sm transition-all duration-200 text-center flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-slate-900 group-hover:text-[#8b6914] transition-colors block">
                    Gold Bars & Coins →
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">1g to 1kg Minted</span>
                </div>
              </Link>

              <Link
                href="/silver"
                className="group p-4 bg-white border border-slate-200 hover:border-slate-400 rounded-xl hover:shadow-sm transition-all duration-200 text-center flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-slate-900 group-hover:text-slate-700 transition-colors block">
                    Silver Bullion →
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">1oz to 1kg Bars</span>
                </div>
              </Link>

              <Link
                href="/zakat"
                className="group p-4 bg-white border border-[#dfcca6]/80 hover:border-[#8b6914] rounded-xl hover:shadow-sm transition-all duration-200 text-center flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-slate-900 group-hover:text-[#8b6914] transition-colors block">
                    Zakat Calculator →
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Hanafi & Ja&apos;fari</span>
                </div>
              </Link>

              <Link
                href="/sell-your-gold"
                className="group p-4 bg-white border border-slate-200 hover:border-[#8b6914] rounded-xl hover:shadow-sm transition-all duration-200 text-center flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-slate-900 group-hover:text-[#8b6914] transition-colors block">
                    Sell Scrap Gold →
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Instant Cash Value</span>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* 2. INTERACTIVE VIEW: Spot Cards + Interactive Live Rate Calculator */}
        {activeView === "interactive" && (
          <div className="space-y-6 mt-8 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gold Mini Card */}
              <div className="bg-gradient-to-br from-white to-[#fbf7ed] border border-[#dfcca6] rounded-xl p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8b6914]">Gold 24K (GBP)</span>
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
              <div className="bg-gradient-to-br from-white to-[#f8fafc] border border-slate-200 rounded-xl p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Silver 999 (GBP)</span>
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
            <div className="bg-white border-2 border-[#dfcca6] rounded-2xl p-6 shadow-sm">
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
                    className="w-full bg-[#faf8f5] border border-stone-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#8b6914]"
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
                    className="w-full bg-[#faf8f5] border border-stone-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#8b6914]"
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
                    className="w-full bg-[#faf8f5] border border-stone-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#8b6914]"
                  />
                </div>

                <div className="bg-gradient-to-r from-[#9c8254] to-[#73582a] text-white rounded-xl p-3 flex flex-col justify-center shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-amber-200">Total Live Value</span>
                  <span className="text-xl font-extrabold tracking-tight mt-0.5">£{calculateTotal()}</span>
                </div>
              </div>
            </div>

            {/* Quick Strip */}
            <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-[#dfcca6]/60 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">
                Gold : Silver Ratio: <strong className="text-slate-900">{goldSilverRatio}</strong>
              </span>
              <span className="text-[#8b6914] font-semibold" suppressHydrationWarning>
                {lastUpdatedDisplay ? `Updated ${lastUpdatedDisplay}` : "Live Market Feed"}
              </span>
            </div>
          </div>
        )}

        {/* 3. OVERVIEW: Comprehensive Purity Table (Mobile Responsive Cards + Desktop Table) */}
        {activeView === "overview" && (
          <div className="mt-8 border-2 border-[#dfcca6]/80 rounded-2xl overflow-hidden bg-white shadow-xs animate-fadeIn">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-[#faf8f5] to-white border-b border-[#dfcca6]/60 flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-slate-900 block">Precious Metals Complete Overview (GBP)</span>
                <span className="text-[11px] text-slate-500">Live London Market Spot Rates</span>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-[4px] border border-emerald-200">
                • Live Feed
              </span>
            </div>

            {/* Mobile View: Stacked Cards (Visible only on mobile < md) */}
            <div className="block md:hidden p-3 space-y-3 bg-[#faf8f5]/40">
              {GOLD_PURITIES.map((purity) => {
                const priceGram = goldGram * purity.fraction;
                const priceTolaTrad = priceGram * WEIGHT_CONVERSIONS.tolaTraditional;
                const priceTola10g = priceGram * WEIGHT_CONVERSIONS.tola10g;
                const priceOunce = priceGram * WEIGHT_CONVERSIONS.troyOunce;
                const is24K = purity.karat === "24K";

                return (
                  <div
                    key={purity.karat}
                    className={`p-3.5 rounded-xl border transition-all ${
                      is24K
                        ? "bg-gradient-to-br from-amber-50/60 to-white border-[#dfcca6] shadow-xs"
                        : "bg-white border-stone-200/90"
                    }`}
                  >
                    {/* Top Row: Karat + Gram Price */}
                    <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-black px-2 py-0.5 rounded ${
                            is24K ? "bg-[#8b6914] text-white" : "bg-slate-100 text-slate-800"
                          }`}>
                            {purity.karat}
                          </span>
                          <span className="text-xs font-bold text-slate-900">Gold</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">{purity.purity} · {purity.label}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Per Gram</span>
                        <span className={`text-base font-black ${is24K ? "text-[#8b6914]" : "text-slate-900"}`}>
                          {formatGBP(priceGram)}
                        </span>
                      </div>
                    </div>

                    {/* Weight Breakdown Grid */}
                    <div className="grid grid-cols-3 gap-2 mt-2.5 text-center">
                      <div className="p-2 rounded-lg bg-[#faf6ee]/80 border border-[#dfcca6]/40">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight block">Tola (11.66g)</span>
                        <span className="text-xs font-extrabold text-slate-900 block mt-0.5">
                          {formatGBP(priceTolaTrad)}
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-[#faf6ee]/80 border border-[#dfcca6]/40">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight block">Tola (10g)</span>
                        <span className="text-xs font-extrabold text-slate-900 block mt-0.5">
                          {formatGBP(priceTola10g)}
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-[#faf6ee]/80 border border-[#dfcca6]/40">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight block">Ounce (31.10g)</span>
                        <span className="text-xs font-extrabold text-slate-900 block mt-0.5">
                          {formatGBP(priceOunce)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Silver Mobile Card */}
              <div className="p-3.5 rounded-xl border bg-gradient-to-br from-slate-50 to-white border-slate-200 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black px-2 py-0.5 rounded bg-slate-800 text-white">
                        999
                      </span>
                      <span className="text-xs font-bold text-slate-900">Silver</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">Pure Fine Investment Grade</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Per Gram</span>
                    <span className="text-base font-black text-slate-900">
                      {formatGBP(silverGram)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-2.5 text-center">
                  <div className="p-2 rounded-lg bg-slate-100/70 border border-slate-200">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight block">Tola (11.66g)</span>
                    <span className="text-xs font-extrabold text-slate-900 block mt-0.5">
                      {formatGBP(silverGram * WEIGHT_CONVERSIONS.tolaTraditional)}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-100/70 border border-slate-200">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight block">Tola (10g)</span>
                    <span className="text-xs font-extrabold text-slate-900 block mt-0.5">
                      {formatGBP(silverGram * WEIGHT_CONVERSIONS.tola10g)}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-100/70 border border-slate-200">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight block">Ounce (31.10g)</span>
                    <span className="text-xs font-extrabold text-slate-900 block mt-0.5">
                      {formatGBP(silverGram * WEIGHT_CONVERSIONS.troyOunce)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop View: Full Table (Visible on md and larger) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[#dfcca6]/40 bg-[#faf8f5]/60 text-[11px] uppercase text-slate-500 font-semibold">
                    <th className="py-3 px-4">Commodity / Purity</th>
                    <th className="py-3 px-4">Per Gram</th>
                    <th className="py-3 px-4">Per Tola (11.66g)</th>
                    <th className="py-3 px-4">Per Tola (10g)</th>
                    <th className="py-3 px-4">Per Ounce (31.10g)</th>
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
                        className={is24K ? "bg-amber-50/30 font-medium" : "hover:bg-amber-50/10 transition-colors"}
                      >
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900">Gold {purity.karat}</span>{" "}
                          <span className="text-slate-500 text-[11px]">({purity.purity} · {purity.label})</span>
                        </td>
                        <td className={`py-3.5 px-4 font-bold ${is24K ? "text-[#8b6914]" : "text-slate-800"}`}>
                          {formatGBP(priceGram)}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          {formatGBP(priceTolaTrad)}
                        </td>
                        <td className="py-3.5 px-4 text-slate-800">
                          {formatGBP(priceTola10g)}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          {formatGBP(priceOunce)}
                        </td>
                      </tr>
                    );
                  })}
                  {/* Silver Row */}
                  <tr className="hover:bg-stone-50 font-medium bg-slate-50/50">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900">Silver 999</span>{" "}
                      <span className="text-slate-500 text-[11px]">(Pure Fine Silver)</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-700">
                      {formatGBP(silverGram)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {formatGBP(silverGram * WEIGHT_CONVERSIONS.tolaTraditional)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {formatGBP(silverGram * WEIGHT_CONVERSIONS.tola10g)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {formatGBP(silverGram * WEIGHT_CONVERSIONS.troyOunce)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Disclaimer Note */}
        <div className="mt-8 p-4 rounded-xl bg-[#faf8f5]/80 border border-[#dfcca6]/60 text-xs text-slate-600 leading-relaxed shadow-2xs">
          <p>
            Market rates are indicative London spot rates and update regularly. Final buying and selling prices are subject to confirmation by <strong className="text-slate-900 font-semibold">Bhai Jeweller</strong>.
          </p>
        </div>

      </main>
    </div>
  );
}
