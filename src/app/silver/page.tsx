"use client";

import React, { useState, useEffect } from "react";
import { DEFAULT_RATES, formatGBP, formatUKDateTime } from "@/lib/rates";

interface SilverItem {
  id: string;
  name: string;
  weightGrams: number;
  purity: string;
  type: "bar" | "coin";
  premiumPercentage: number;
  imageUrl: string;
  refiner: string;
  popular?: boolean;
}

const SILVER_ITEMS: SilverItem[] = [
  { id: "1oz", name: "1 oz Silver Britannia Coin", weightGrams: 31.1035, purity: "999 Fine Silver", type: "coin", premiumPercentage: 0.18, popular: true, refiner: "The Royal Mint", imageUrl: "/bullion/silver-britannia.webp" },
  { id: "1oz-bar", name: "1 oz Minted Silver Bar", weightGrams: 31.1035, purity: "999 Fine Silver", type: "bar", premiumPercentage: 0.16, refiner: "PAMP / Metalor", imageUrl: "/bullion/silver-1oz-bar.webp" },
  { id: "100g", name: "100 Gram Minted Silver Bar", weightGrams: 100, purity: "999 Fine Silver", type: "bar", premiumPercentage: 0.15, refiner: "Umicore / PAMP", imageUrl: "/bullion/silver-100g.webp" },
  { id: "250g", name: "250 Gram Cast Silver Bar", weightGrams: 250, purity: "999 Fine Silver", type: "bar", premiumPercentage: 0.12, popular: true, refiner: "Nadir / Metalor", imageUrl: "/bullion/silver-250g.webp" },
  { id: "500g", name: "500 Gram Cast Silver Bar", weightGrams: 500, purity: "999 Fine Silver", type: "bar", premiumPercentage: 0.10, refiner: "Metalor / Umicore", imageUrl: "/bullion/silver-500g.webp" },
  { id: "1kg", name: "1 Kilo (1,000g) Cast Silver Bar", weightGrams: 1000, purity: "999 Fine Silver", type: "bar", premiumPercentage: 0.085, popular: true, refiner: "LBMA Certified 1kg Bar", imageUrl: "/bullion/silver-1kg.webp" },
];

export default function SilverPage() {
  const [rates, setRates] = useState(DEFAULT_RATES);
  const [lastUpdatedDisplay, setLastUpdatedDisplay] = useState(formatUKDateTime());
  const [filter, setFilter] = useState<"all" | "bar" | "coin">("all");

  useEffect(() => {
    fetch("/api/rates")
      .then((res) => res.json())
      .then((data) => {
        if (data.silverGbpPerGram) {
          setRates({
            goldGbpPerGram: data.goldGbpPerGram,
            silverGbpPerGram: data.silverGbpPerGram,
            lastUpdated: data.lastUpdated,
            isLive: true,
            currency: "GBP",
          });
          setLastUpdatedDisplay(formatUKDateTime(new Date(data.lastUpdated)));
        }
      })
      .catch(() => {});
  }, []);

  const silverGram = rates.silverGbpPerGram;

  const filteredItems = SILVER_ITEMS.filter((item) => {
    if (filter === "all") return true;
    return item.type === filter;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-800 pb-20 relative">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-80 bg-gradient-to-b from-slate-200/50 via-transparent to-transparent pointer-events-none -z-10" />

      <main className="max-w-5xl mx-auto px-3 sm:px-6 pt-6 sm:pt-12">
        
        {/* Header Section */}
        <div className="border-b border-slate-200 pb-4 sm:pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-[4px] border border-slate-300 flex items-center gap-1.5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                LBMA Investment Silver
              </span>
              <span className="text-[11px] text-slate-400 font-medium">· London Fixings</span>
            </div>

            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-1 sm:mt-1.5">
              Silver Bars & Coins Catalog
            </h1>
            <p className="text-[11px] sm:text-sm text-slate-500 mt-0.5 sm:mt-1">
              999 fine investment-grade silver bullion. Live prices synced with London fixing.
            </p>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-500 pt-1 sm:pt-0">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Spot: <strong className="text-slate-900">{formatGBP(silverGram)}/g</strong>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-[11px] text-slate-400">{lastUpdatedDisplay}</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 mt-4 sm:mt-6 overflow-x-auto pb-1">
          <button
            onClick={() => setFilter("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
              filter === "all"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-400 hover:text-slate-900"
            }`}
          >
            All Products ({SILVER_ITEMS.length})
          </button>
          <button
            onClick={() => setFilter("bar")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
              filter === "bar"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-400 hover:text-slate-900"
            }`}
          >
            Silver Bars ({SILVER_ITEMS.filter((i) => i.type === "bar").length})
          </button>
          <button
            onClick={() => setFilter("coin")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
              filter === "coin"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-400 hover:text-slate-900"
            }`}
          >
            Silver Coins ({SILVER_ITEMS.filter((i) => i.type === "coin").length})
          </button>
        </div>

        {/* Product Cards Grid: 2 per row on mobile, 3 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mt-4 sm:mt-8">
          {filteredItems.map((item) => {
            const rawValue = item.weightGrams * silverGram;
            const estimatedPrice = rawValue * (1 + item.premiumPercentage);
            const waText = encodeURIComponent(
              `Hello Bhai Jewellers, I would like to inquire about / lock price for ${item.name} (£${estimatedPrice.toFixed(2)}).`
            );

            return (
              <div
                key={item.id}
                className="group relative bg-gradient-to-b from-white via-slate-50/50 to-slate-100/50 border-2 border-slate-200 hover:border-slate-400 rounded-2xl p-3 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_rgba(148,163,184,0.22)] transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden"
              >
                {/* Platinum Accent Strip */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-300 via-slate-100 to-slate-400 opacity-80 group-hover:opacity-100 transition-opacity" />

                {/* Subtle Shimmer Sweep on Hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none z-20" />

                {/* Popular Pill */}
                {item.popular && (
                  <span className="absolute top-3 right-3 bg-slate-900 text-white text-[8.5px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs z-10 flex items-center gap-1">
                    <span>✦</span>
                    <span>Popular</span>
                  </span>
                )}

                <div>
                  {/* Luxury Showroom Stage for Bullion Image */}
                  <div className="relative w-full h-36 sm:h-48 rounded-xl bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 border border-slate-200/80 p-3 sm:p-4 flex items-center justify-center mb-3 overflow-hidden shadow-inner group-hover:border-slate-400 transition-colors">
                    {/* Ambient Spotlight */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.95)_0%,_rgba(241,245,249,0.35)_70%,_transparent_100%)] pointer-events-none" />

                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="relative z-10 h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-110 group-hover:drop-shadow-2xl transition-all duration-300"
                      loading="lazy"
                    />

                    {/* Hallmark / Mint Badge on Image */}
                    <span className="absolute bottom-2 left-2 z-10 bg-white/90 backdrop-blur-xs text-slate-700 text-[8.5px] sm:text-[9.5px] font-bold px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs">
                      {item.type === "coin" ? "The Royal Mint" : "LBMA Good Delivery"}
                    </span>
                  </div>

                  {/* Purity & Refiner Chips */}
                  <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                    <span className="text-[9px] sm:text-[10px] font-black text-white bg-slate-900 px-2 py-0.5 rounded shadow-2xs uppercase tracking-wider">
                      {item.purity}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-slate-500 font-semibold truncate max-w-[110px] sm:max-w-none">
                      {item.refiner}
                    </span>
                  </div>

                  {/* Title & Weight */}
                  <h3 className="text-xs sm:text-base font-extrabold text-slate-900 group-hover:text-slate-700 transition-colors leading-snug line-clamp-2 min-h-[2.2rem] sm:min-h-0">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1 sm:mt-1.5 text-[10px] sm:text-xs text-slate-500 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    Weight: <strong className="text-slate-900 font-bold">{item.weightGrams >= 100 ? item.weightGrams.toFixed(0) : item.weightGrams.toFixed(2)}g</strong>
                  </div>

                  {/* Price & Stock Section */}
                  <div className="mt-3 pt-2.5 sm:pt-3 border-t border-slate-200 flex items-end justify-between gap-1">
                    <div>
                      <span className="text-[8.5px] sm:text-[9.5px] text-slate-400 uppercase font-extrabold tracking-wider block leading-tight">
                        Live Indicative Price
                      </span>
                      <span className="text-base sm:text-2xl font-black text-slate-900 tracking-tight tabular-nums block">
                        {formatGBP(estimatedPrice)}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      In Stock
                    </span>
                  </div>
                </div>

                {/* WhatsApp Order Button */}
                <div className="mt-3 sm:mt-4 pt-1">
                  <a
                    href={`https://wa.me/447735727897?text=${waText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-2 sm:px-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 hover:from-black hover:to-slate-800 text-white text-[10px] sm:text-xs font-black tracking-wide shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all duration-200"
                  >
                    <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                    <span>Inquire / Lock Price</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Notice */}
        <div className="mt-8 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed shadow-2xs">
          <p>
            Silver bullion bars and coins are LBMA-approved investment grade. Prices reflect live physical market rates plus minting and transport premium.
          </p>
        </div>

      </main>
    </div>
  );
}
