"use client";

import React, { useState, useEffect } from "react";
import { DEFAULT_RATES, formatGBP, formatUKDateTime } from "@/lib/rates";

interface SilverItem {
  id: string;
  name: string;
  weightGrams: number;
  purity: string;
  premiumPercentage: number;
  imageUrl: string;
  refiner?: string;
  popular?: boolean;
}

const SILVER_ITEMS: SilverItem[] = [
  { id: "1oz", name: "1 oz Silver Britannia Coin", weightGrams: 31.1035, purity: "999 Fine Silver", premiumPercentage: 0.18, popular: true, refiner: "The Royal Mint", imageUrl: "/bullion/silver-britannia.webp" },
  { id: "1oz-bar", name: "1 oz Minted Silver Bar", weightGrams: 31.1035, purity: "999 Fine Silver", premiumPercentage: 0.16, refiner: "PAMP / Metalor", imageUrl: "/bullion/silver-1oz-bar.webp" },
  { id: "100g", name: "100 Gram Minted Silver Bar", weightGrams: 100, purity: "999 Fine Silver", premiumPercentage: 0.15, refiner: "Umicore / PAMP", imageUrl: "/bullion/silver-100g.webp" },
  { id: "250g", name: "250 Gram Cast Silver Bar", weightGrams: 250, purity: "999 Fine Silver", premiumPercentage: 0.12, popular: true, refiner: "Nadir / Metalor", imageUrl: "/bullion/silver-250g.webp" },
  { id: "500g", name: "500 Gram Cast Silver Bar", weightGrams: 500, purity: "999 Fine Silver", premiumPercentage: 0.10, refiner: "Metalor / Umicore", imageUrl: "/bullion/silver-500g.webp" },
  { id: "1kg", name: "1 Kilo (1,000g) Cast Silver Bar", weightGrams: 1000, purity: "999 Fine Silver", premiumPercentage: 0.085, popular: true, refiner: "LBMA Certified 1kg Bar", imageUrl: "/bullion/silver-1kg.webp" },
];

export default function SilverPage() {
  const [rates, setRates] = useState(DEFAULT_RATES);
  const [lastUpdatedDisplay, setLastUpdatedDisplay] = useState(formatUKDateTime());

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

  return (
    <div className="min-h-screen bg-slate-50/40 font-sans text-slate-800 pb-20">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14">
        
        {/* Header */}
        <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-[4px] border border-slate-200">
              LBMA Investment Silver
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-1.5">
              Silver Bars & Coins Catalog
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              999 fine investment-grade silver bullion. Live prices update with London spot silver fixing.
            </p>
          </div>
          <div className="text-xs text-slate-500">
            Silver Spot: <strong className="text-slate-900">{formatGBP(silverGram)}/g</strong> · {lastUpdatedDisplay}
          </div>
        </div>

        {/* Silver Cards Grid with Real Images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {SILVER_ITEMS.map((item) => {
            const rawValue = item.weightGrams * silverGram;
            const estimatedPrice = rawValue * (1 + item.premiumPercentage);
            const waText = encodeURIComponent(`Hi Bhai Jeweller, I am interested in inquiring about ${item.name} (£${estimatedPrice.toFixed(2)}).`);

            return (
              <div
                key={item.id}
                className="group relative bg-white border border-slate-200 rounded-[8px] p-5 shadow-xs hover:border-slate-400 hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {item.popular && (
                  <span className="absolute top-3 right-3 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[3px] shadow-xs z-10">
                    Popular
                  </span>
                )}

                <div>
                  {/* Product Image Frame */}
                  <div className="w-full h-40 bg-slate-50 rounded-[6px] border border-slate-200 p-2 flex items-center justify-center mb-3 group-hover:scale-102 transition-transform duration-300">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-full max-w-full object-contain filter drop-shadow-sm"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {item.purity}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {item.refiner}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Net Silver Weight: <strong className="text-slate-800">{item.weightGrams >= 100 ? item.weightGrams.toFixed(0) : item.weightGrams.toFixed(2)}g</strong>
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Live Price</span>
                      <span className="text-2xl font-black text-slate-900 tracking-tight">
                        {formatGBP(estimatedPrice)}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      In Stock
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-2">
                  <a
                    href={`https://wa.me/923001234567?text=${waText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-[5px] bg-slate-50 hover:bg-slate-900 text-slate-800 hover:text-white border border-slate-200 text-xs font-bold transition-all duration-200 shadow-2xs"
                  >
                    <span>Inquire / Lock Price on WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Notice */}
        <div className="mt-8 p-4 rounded-[6px] bg-slate-100/70 border border-slate-200 text-xs text-slate-600 leading-relaxed">
          <p>
            Silver bullion is sourced from LBMA accredited refiners (PAMP, Metalor, Umicore, Royal Mint). All prices reflect live physical market rates plus standard minting margin.
          </p>
        </div>

      </main>
    </div>
  );
}
