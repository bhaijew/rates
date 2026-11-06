"use client";

import React, { useState, useEffect } from "react";
import { DEFAULT_RATES, formatGBP, formatUKDateTime } from "@/lib/rates";
import { BullionProduct, INITIAL_SILVER_ITEMS } from "@/data/bullion-items";

export default function SilverPage() {
  const [rates, setRates] = useState(DEFAULT_RATES);
  const [silverProducts, setSilverProducts] = useState<BullionProduct[]>(INITIAL_SILVER_ITEMS);
  const [lastUpdatedDisplay, setLastUpdatedDisplay] = useState("");
  const [filter, setFilter] = useState<"all" | "bar" | "coin">("all");

  useEffect(() => {
    setLastUpdatedDisplay(formatUKDateTime());
    
    // Fetch live rates
    fetch(`/api/rates?t=${Date.now()}`, { cache: "no-store" })
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

    // Fetch admin synced items
    fetch("/api/admin/content")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data?.silverItems)) {
          setSilverProducts(res.data.silverItems);
        }
      })
      .catch(() => {});
  }, []);

  const silverGram = rates.silverGbpPerGram;

  const filteredItems = silverProducts.filter((item) => {
    if (filter === "all") return true;
    return item.type === filter;
  });

  return (
    <div className="min-h-screen bg-[#faf8f5]/60 font-sans text-slate-800 pb-20 relative">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-80 bg-gradient-to-b from-slate-200/50 via-transparent to-transparent pointer-events-none -z-10" />

      <main className="max-w-5xl mx-auto px-3 sm:px-6 pt-6 sm:pt-12">
        
        {/* Header Section */}
        <div className="border-b border-slate-200 pb-4 sm:pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-[4px] border border-slate-300 flex items-center gap-1.5 shadow-2xs font-notche">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600 animate-pulse" />
                LBMA Fine Silver Bullion
              </span>
              <span className="text-[11px] text-slate-400 font-medium">· London Fixings</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-notche font-bold tracking-tight text-slate-900 mt-1 sm:mt-1.5">
              Silver Bars & Coins Catalog
            </h1>
            <p className="text-[11px] sm:text-sm text-slate-500 mt-0.5 sm:mt-1 font-medium">
              Investment-grade .999 pure silver cast bars and UK legal tender CGT-free silver coins.
            </p>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-500 pt-1 sm:pt-0">
            <span className="flex items-center gap-1.5 font-numbers">
              <span className="w-2 h-2 rounded-full bg-slate-500 animate-pulse" />
              Spot: <strong className="text-slate-900 font-bold">{formatGBP(silverGram)}/g</strong>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-[11px] text-slate-400 font-numbers" suppressHydrationWarning>
              {lastUpdatedDisplay || "Live Feed"}
            </span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 mt-4 sm:mt-6 overflow-x-auto pb-1">
          <button
            onClick={() => setFilter("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
              filter === "all"
                ? "bg-slate-800 text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-800 hover:text-slate-800"
            }`}
          >
            All Products ({silverProducts.length})
          </button>
          <button
            onClick={() => setFilter("bar")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
              filter === "bar"
                ? "bg-slate-800 text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-800 hover:text-slate-800"
            }`}
          >
            Silver Bars ({silverProducts.filter((i) => i.type === "bar").length})
          </button>
          <button
            onClick={() => setFilter("coin")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
              filter === "coin"
                ? "bg-slate-800 text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-800 hover:text-slate-800"
            }`}
          >
            Silver Coins ({silverProducts.filter((i) => i.type === "coin").length})
          </button>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mt-4 sm:mt-8">
          {filteredItems.map((item) => {
            const rawMetalValue = item.weightGrams * silverGram;
            const calculatedPrice = rawMetalValue * (1 + item.premiumPercentage);
            const finalPrice = item.customPriceOverride || calculatedPrice;

            const waText = encodeURIComponent(
              `Hello Bhai Jewellers, I would like to inquire about / lock price for ${item.name} (£${finalPrice.toFixed(2)}).`
            );

            return (
              <div
                key={item.id}
                className="group relative bg-gradient-to-b from-white via-[#fcfcfd] to-[#f8f9fa] border-2 border-slate-200 hover:border-slate-400 rounded-2xl p-3 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_rgba(100,116,139,0.18)] transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden"
              >
                {/* Silver Accent Top Strip */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-500 opacity-80 group-hover:opacity-100 transition-opacity" />

                {item.popular && (
                  <span className="absolute top-3 right-3 bg-gradient-to-r from-slate-700 to-slate-900 text-white text-[8.5px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs z-10 flex items-center gap-1 font-notche">
                    <span>✦</span>
                    <span>Popular</span>
                  </span>
                )}

                <div>
                  <div className="relative w-full h-36 sm:h-48 rounded-xl bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 border border-slate-200 p-3 sm:p-4 flex items-center justify-center mb-3 overflow-hidden shadow-inner group-hover:border-slate-400 transition-colors">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="relative z-10 h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-110 group-hover:drop-shadow-2xl transition-all duration-300"
                      loading="lazy"
                    />

                    <span className="absolute bottom-2 left-2 z-10 bg-white/90 backdrop-blur-xs text-slate-700 text-[8.5px] sm:text-[9.5px] font-bold px-1.5 py-0.5 rounded border border-slate-300 shadow-2xs font-notche">
                      {item.type === "coin" ? "The Royal Mint" : "LBMA Good Delivery"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                    <span className="text-[9px] sm:text-[10px] font-black text-white bg-slate-700 px-2 py-0.5 rounded shadow-2xs uppercase tracking-wider font-notche">
                      {item.purity}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-slate-500 font-semibold truncate max-w-[110px] sm:max-w-none">
                      {item.refiner}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-base font-notche font-bold text-slate-900 group-hover:text-slate-700 transition-colors leading-snug line-clamp-2 min-h-[2.2rem] sm:min-h-0">
                    {item.name}
                  </h3>

                  <div className="mt-1 flex items-center gap-2 text-slate-500 text-[10.5px] sm:text-xs font-medium">
                    <span>Weight: <strong className="text-slate-800 font-numbers">{item.weightGrams}g</strong></span>
                    <span>·</span>
                    <span className="text-emerald-700 font-bold">Secure Delivery</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200">
                  <div className="flex items-end justify-between gap-1 mb-2">
                    <div>
                      <span className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-notche">
                        {item.customPriceOverride ? "Showroom Deal Price" : "Live Spot Price"}
                      </span>
                      <span className="text-base sm:text-2xl font-numbers font-bold text-slate-900 tracking-tight">
                        {formatGBP(finalPrice)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold block">
                        VAT Status
                      </span>
                      <span className="text-[9.5px] sm:text-[11px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                        Standard UK VAT
                      </span>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/447735727897?text=${waText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 hover:from-slate-800 hover:to-black text-white text-[11px] sm:text-xs font-notche font-bold tracking-wider shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5"
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
      </main>
    </div>
  );
}
