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
  const [lastUpdatedDisplay, setLastUpdatedDisplay] = useState(formatUKDateTime());
  const [heroBg, setHeroBg] = useState<"jewelry" | "gold">("jewelry");

  // Interactive Calculator State
  const [calcMetal, setCalcMetal] = useState<"gold" | "silver">("gold");
  const [calcUnit, setCalcUnit] = useState<"gram" | "tola" | "ounce">("tola");
  const [calcQuantity, setCalcQuantity] = useState<number>(1);

  // Fetch rates on mount and on refresh
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
      setTimeout(() => setIsRefreshing(false), 600);
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
    <div className="min-h-screen bg-[#0c0a07] font-sans text-slate-800 pb-20 relative overflow-x-hidden">
      
      {/* Dynamic Luxury Background Image: Fine Jewellery or Gold Bullion */}
      <div 
        className="fixed inset-0 bg-cover bg-center transition-all duration-700 ease-in-out pointer-events-none scale-105"
        style={{ 
          backgroundImage: `url(${heroBg === "jewelry" ? "'/images/luxury-gold-jewelry.jpg'" : "'/images/gold-bars-bg.jpg'"})`,
          opacity: 0.22,
        }}
      />

      {/* Multi-layered Deep Luxury Gradients for Maximum Legibility & Atmospheric Glow */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#0c0a07]/95 via-[#16120b]/90 to-[#0c0a07]/98 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#dfcca6]/18 via-transparent to-transparent pointer-events-none" />

      {/* Top Gold Foil Accent Bar */}
      <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#dfcca6] to-transparent relative z-10 opacity-70" />

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        
        {/* Page Header with Badge & Background Theme Switcher */}
        <div className="border-b border-[#dfcca6]/30 pb-5">
          {/* Top Bar: Desk Tag + Toggle Jewellery / Bullion */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-[10.5px] sm:text-[11px] font-bold text-[#dfcca6] tracking-widest uppercase bg-[#22180d]/90 px-2.5 py-1 rounded-[4px] border border-[#dfcca6]/50 shadow-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#dfcca6] animate-pulse" />
                UK London Bullion Desk
              </span>
              <span className="text-xs text-stone-300 font-medium">· London Fixings</span>
            </div>

            {/* Background Theme Switcher: Jewellery / Gold Bullion */}
            <div className="inline-flex items-center p-0.5 rounded-[5px] bg-black/60 border border-[#dfcca6]/40 backdrop-blur-xs text-[11px]">
              <button
                type="button"
                onClick={() => setHeroBg("jewelry")}
                className={`px-2.5 py-1 rounded-[3px] font-semibold transition-all cursor-pointer ${
                  heroBg === "jewelry"
                    ? "bg-[#8b6914] text-white shadow-xs"
                    : "text-stone-300 hover:text-white"
                }`}
                title="Switch background to Fine Jewellery"
              >
                💎 Jewellery
              </button>
              <button
                type="button"
                onClick={() => setHeroBg("gold")}
                className={`px-2.5 py-1 rounded-[3px] font-semibold transition-all cursor-pointer ${
                  heroBg === "gold"
                    ? "bg-[#8b6914] text-white shadow-xs"
                    : "text-stone-300 hover:text-white"
                }`}
                title="Switch background to Gold Bullion"
              >
                🪙 Gold Bullion
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mt-1">
                Live Gold & Silver Rates <span className="text-[#dfcca6]">(GBP)</span>
              </h1>

              <div className="flex items-center gap-2 mt-2">
                {/* Radar Live Indicator */}
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <p className="text-xs text-stone-300 font-medium">
                  Updated {lastUpdatedDisplay}
                </p>
                <button
                  onClick={fetchRates}
                  disabled={isRefreshing}
                  title="Refresh Live London Rates"
                  className="p-1 text-[#dfcca6] hover:text-white transition-all rounded hover:bg-white/10 active:scale-90"
                >
                  <svg
                    className={`w-3.5 h-3.5 transition-transform duration-500 ${isRefreshing ? "animate-spin text-[#dfcca6]" : ""}`}
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
            <div className="inline-flex items-center p-1 bg-black/50 border border-[#dfcca6]/50 rounded-[6px] shadow-xs self-start sm:self-auto backdrop-blur-xs">
              <button
                onClick={() => setActiveView("current")}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-[4px] transition-all duration-200 cursor-pointer ${
                  activeView === "current"
                    ? "bg-[#8b6914] text-white shadow-xs scale-100"
                    : "text-[#dfcca6] hover:text-white hover:bg-white/10"
                }`}
              >
                Current View
              </button>
              <button
                onClick={() => setActiveView("interactive")}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-[4px] transition-all duration-200 cursor-pointer ${
                  activeView === "interactive"
                    ? "bg-[#8b6914] text-white shadow-xs scale-100"
                    : "text-[#dfcca6] hover:text-white hover:bg-white/10"
                }`}
              >
                Interactive View
              </button>
              <button
                onClick={() => setActiveView("overview")}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-[4px] transition-all duration-200 cursor-pointer ${
                  activeView === "overview"
                    ? "bg-[#8b6914] text-white shadow-xs scale-100"
                    : "text-[#dfcca6] hover:text-white hover:bg-white/10"
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
              
              {/* GOLD CARD */}
              <div className="relative group bg-gradient-to-br from-[#ffffff] via-[#fdfbf7] to-[#fbf7ed] border-2 border-[#dfcca6] rounded-[8px] p-6 shadow-[0_4px_24px_-4px_rgba(212,175,55,0.15)] hover:shadow-[0_12px_36px_-4px_rgba(212,175,55,0.28)] hover:border-[#caa771] transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                {/* Top Metallic Gold Accent Strip */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#eedbb9] via-[#9c8254] to-[#caa771]" />

                {/* Subtle Shimmer Sweep on Hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {/* Gold Bar Icon */}
                    <div className="w-8 h-8 rounded-[5px] bg-[#fbf5ea] border border-[#dfcca6] flex items-center justify-center text-[#9c8254] shadow-2xs">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M4 18h16l2-8H2l2 8zm1-10h14l1-4H4l1 4z" opacity="0.8" />
                        <path d="M3 19h18v2H3v-2z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900 tracking-tight">
                        Gold spot price (GBP)
                      </h2>
                      <span className="text-[10px] font-semibold text-[#8b6914] uppercase tracking-wider">
                        24K · 999.9 Fine Gold
                      </span>
                    </div>
                  </div>

                  {/* Live Pulse Pill */}
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50/90 border border-emerald-300/60 px-2.5 py-1 rounded-full shadow-2xs">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    live
                  </span>
                </div>

                <div className="mt-5 pb-5 border-b border-[#dfcca6]/50">
                  <div className="flex items-baseline gap-2">
                    <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight font-sans">
                      {formatGBP(goldGram)}
                    </div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      / gram
                    </span>
                  </div>
                  <div className="text-xs text-[#8b6914] mt-1 font-medium flex items-center gap-1.5">
                    <span>London LBMA Benchmark</span>
                    <span>·</span>
                    <span className="text-emerald-600 font-bold">● Active Market</span>
                  </div>
                </div>

                <div className="mt-4 space-y-1 text-sm">
                  <div className="flex items-center justify-between py-2 px-2.5 rounded-[4px] hover:bg-[#faf5ea]/80 transition-colors">
                    <span className="text-slate-600 font-medium text-xs sm:text-sm flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#9c8254]" />
                      Per tola (11.66g)
                    </span>
                    <span className="font-extrabold text-slate-900 tabular-nums">
                      {formatGBP(goldGram * WEIGHT_CONVERSIONS.tolaTraditional)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 px-2.5 rounded-[4px] hover:bg-[#faf5ea]/80 transition-colors">
                    <span className="text-slate-600 font-medium text-xs sm:text-sm flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#dfcca6]" />
                      Per tola (10g)
                    </span>
                    <span className="font-extrabold text-slate-900 tabular-nums">
                      {formatGBP(goldGram * WEIGHT_CONVERSIONS.tola10g)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 px-2.5 rounded-[4px] hover:bg-[#faf5ea]/80 transition-colors">
                    <span className="text-slate-600 font-medium text-xs sm:text-sm flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#caa771]" />
                      Per troy ounce (31.10g)
                    </span>
                    <span className="font-extrabold text-slate-900 tabular-nums">
                      {formatGBP(goldGram * WEIGHT_CONVERSIONS.troyOunce)}
                    </span>
                  </div>
                </div>

                {/* Subtle Gold Ingot Watermark */}
                <div className="absolute -right-4 -bottom-4 w-28 h-28 opacity-[0.035] pointer-events-none select-none text-[#9c8254]">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <path d="M4 18h16l2-8H2l2 8zm1-10h14l1-4H4l1 4z" />
                    <path d="M3 19h18v2H3v-2z" />
                  </svg>
                </div>
              </div>

              {/* SILVER CARD */}
              <div className="relative group bg-gradient-to-br from-[#ffffff] via-[#f8fafc] to-[#f1f5f9] border-2 border-slate-200 rounded-[8px] p-6 shadow-[0_4px_24px_-4px_rgba(148,163,184,0.15)] hover:shadow-[0_12px_36px_-4px_rgba(148,163,184,0.28)] hover:border-slate-300 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                {/* Top Metallic Silver Accent Strip */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-200 via-slate-400 to-slate-300" />

                {/* Subtle Shimmer Sweep on Hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {/* Silver Coin Icon */}
                    <div className="w-8 h-8 rounded-[5px] bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shadow-2xs">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="8" />
                        <circle cx="12" cy="12" r="4" strokeDasharray="2 2" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900 tracking-tight">
                        Silver spot price (GBP)
                      </h2>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                        999 Fine Pure Silver
                      </span>
                    </div>
                  </div>

                  {/* Live Pulse Pill */}
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50/90 border border-emerald-300/60 px-2.5 py-1 rounded-full shadow-2xs">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    live
                  </span>
                </div>

                <div className="mt-5 pb-5 border-b border-slate-200">
                  <div className="flex items-baseline gap-2">
                    <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight font-sans">
                      {formatGBP(silverGram)}
                    </div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      / gram
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 font-medium flex items-center gap-1.5">
                    <span>Physical Bullion Fix</span>
                    <span>·</span>
                    <span className="text-emerald-600 font-bold">● Active Market</span>
                  </div>
                </div>

                <div className="mt-4 space-y-1 text-sm">
                  <div className="flex items-center justify-between py-2 px-2.5 rounded-[4px] hover:bg-slate-100/70 transition-colors">
                    <span className="text-slate-600 font-medium text-xs sm:text-sm flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                      Per tola (11.66g)
                    </span>
                    <span className="font-extrabold text-slate-900 tabular-nums">
                      {formatGBP(silverGram * WEIGHT_CONVERSIONS.tolaTraditional)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 px-2.5 rounded-[4px] hover:bg-slate-100/70 transition-colors">
                    <span className="text-slate-600 font-medium text-xs sm:text-sm flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      Per tola (10g)
                    </span>
                    <span className="font-extrabold text-slate-900 tabular-nums">
                      {formatGBP(silverGram * WEIGHT_CONVERSIONS.tola10g)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 px-2.5 rounded-[4px] hover:bg-slate-100/70 transition-colors">
                    <span className="text-slate-600 font-medium text-xs sm:text-sm flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      Per troy ounce (31.10g)
                    </span>
                    <span className="font-extrabold text-slate-900 tabular-nums">
                      {formatGBP(silverGram * WEIGHT_CONVERSIONS.troyOunce)}
                    </span>
                  </div>
                </div>

                {/* Subtle Silver Coin Watermark */}
                <div className="absolute -right-4 -bottom-4 w-28 h-28 opacity-[0.035] pointer-events-none select-none text-slate-700">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
                    <circle cx="12" cy="12" r="9" />
                    <circle cx="12" cy="12" r="6" strokeDasharray="3 3" />
                  </svg>
                </div>
              </div>

            </div>

            {/* GOLD : SILVER RATIO EXECUTIVE WIDGET */}
            <div className="relative overflow-hidden bg-gradient-to-r from-[#ffffff] via-[#fbf7f0] to-[#f4f7fa] border border-[#dfcca6] rounded-[8px] p-5 shadow-xs transition-all duration-300 hover:border-[#caa771]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#8b6914] bg-[#fbf5ea] px-2 py-0.5 rounded-[3px] border border-[#dfcca6]/50">
                      Market Intelligence
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[#8b6914]" />
                    <span className="text-xs text-slate-600 font-semibold">Gold / Silver Ratio</span>
                  </div>

                  <div className="flex items-baseline gap-2.5 pt-1">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      1 : {goldSilverRatio}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      (1 oz of Gold = {goldSilverRatio} oz of Silver)
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    Historical average is ~65:1. Current ratio indicates silver is <strong className="text-[#8b6914]">attractive value</strong> relative to gold.
                  </p>
                </div>

                <div className="self-stretch sm:self-center flex flex-col items-end justify-center shrink-0">
                  <div className="w-full sm:w-auto px-4 py-2.5 rounded-[6px] bg-white border border-[#dfcca6] text-center shadow-2xs">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Live Ratio</span>
                    <span className="text-lg font-black text-[#8b6914] tabular-nums">
                      {goldSilverRatio}
                    </span>
                  </div>
                </div>
              </div>

              {/* Visual Balance Bar */}
              <div className="mt-4 pt-3 border-t border-[#dfcca6]/40">
                <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1.5">
                  <span className="flex items-center gap-1 text-[#8b6914]">
                    <span className="w-2 h-2 rounded-full bg-[#9c8254]" /> Gold (XAU)
                  </span>
                  <span className="flex items-center gap-1 text-slate-600">
                    Silver (XAG) <span className="w-2 h-2 rounded-full bg-slate-400" />
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${Math.min(Math.max((goldSilverRatio / 100) * 100, 20), 85)}%` }}
                    className="bg-gradient-to-r from-[#dfcca6] via-[#9c8254] to-[#856b3e] h-full transition-all duration-700"
                  />
                  <div className="flex-1 bg-gradient-to-r from-slate-300 to-slate-400 h-full" />
                </div>
              </div>
            </div>

            {/* Quick Action Navigation Grid (Interactive Buttons) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <Link
                href="/gold-bars"
                className="group p-3.5 bg-white border border-[#dfcca6]/80 rounded-[6px] hover:border-[#8b6914] hover:shadow-xs transition-all duration-200 text-center"
              >
                <span className="text-xs font-bold text-slate-900 group-hover:text-[#8b6914] transition-colors block">
                  Gold Bars & Coins →
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">1g to 1kg Catalog</span>
              </Link>

              <Link
                href="/silver"
                className="group p-3.5 bg-white border border-slate-200 rounded-[6px] hover:border-slate-400 hover:shadow-xs transition-all duration-200 text-center"
              >
                <span className="text-xs font-bold text-slate-900 group-hover:text-slate-700 transition-colors block">
                  Silver Bullion →
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">1oz to 5kg Bars</span>
              </Link>

              <Link
                href="/zakat"
                className="group p-3.5 bg-white border border-[#dfcca6]/80 rounded-[6px] hover:border-[#8b6914] hover:shadow-xs transition-all duration-200 text-center"
              >
                <span className="text-xs font-bold text-slate-900 group-hover:text-[#8b6914] transition-colors block">
                  Zakat Calculator →
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Hanafi & Ja&apos;fari</span>
              </Link>

              <Link
                href="/sell-your-gold"
                className="group p-3.5 bg-white border border-slate-200 rounded-[6px] hover:border-[#8b6914] hover:shadow-xs transition-all duration-200 text-center"
              >
                <span className="text-xs font-bold text-slate-900 group-hover:text-[#8b6914] transition-colors block">
                  Sell Scrap Gold →
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Instant Cash Value</span>
              </Link>
            </div>
          </div>
        )}

        {/* 2. INTERACTIVE VIEW: Spot Cards + Interactive Live Rate Calculator */}
        {activeView === "interactive" && (
          <div className="space-y-6 mt-8 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gold Mini Card */}
              <div className="bg-gradient-to-br from-white to-[#fbf7ed] border border-[#dfcca6] rounded-[6px] p-5 shadow-xs">
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
              <div className="bg-gradient-to-br from-white to-[#f8fafc] border border-slate-200 rounded-[6px] p-5 shadow-xs">
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
            <div className="bg-white border-2 border-[#dfcca6] rounded-[8px] p-6 shadow-sm">
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

                <div className="bg-gradient-to-r from-[#9c8254] to-[#73582a] text-white rounded-[6px] p-3 flex flex-col justify-center shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-amber-200">Total Live Value</span>
                  <span className="text-xl font-extrabold tracking-tight mt-0.5">£{calculateTotal()}</span>
                </div>
              </div>
            </div>

            {/* Quick Strip */}
            <div className="p-3.5 rounded-[6px] bg-[#faf8f5] border border-[#dfcca6]/60 flex items-center justify-between text-xs">
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
          <div className="mt-8 border-2 border-[#dfcca6]/80 rounded-[8px] overflow-hidden bg-white shadow-xs animate-fadeIn">
            <div className="p-4 bg-gradient-to-r from-[#faf8f5] to-white border-b border-[#dfcca6]/60 flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-slate-900 block">Precious Metals Complete Overview (GBP)</span>
                <span className="text-[11px] text-slate-500">Live London Market Spot Rates</span>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-[4px] border border-emerald-200">
                ● Live Feed
              </span>
            </div>
            <div className="overflow-x-auto">
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
                  <tr className="hover:bg-slate-50 font-medium bg-slate-50/40">
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
        <div className="mt-8 p-4 rounded-[6px] bg-[#1a140d]/85 border border-[#dfcca6]/40 text-xs text-stone-300 leading-relaxed shadow-sm">
          <p>
            London spot market prices update in real time. Final physical buying and selling prices are subject to showroom verification and trade locking by <strong className="text-[#dfcca6] font-semibold">Bhai Jeweller</strong>.
          </p>
        </div>

      </main>
    </div>
  );
}
