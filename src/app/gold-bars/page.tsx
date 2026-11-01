"use client";

import React, { useState, useEffect } from "react";
import { DEFAULT_RATES, formatGBP, formatUKDateTime } from "@/lib/rates";

interface BullionItem {
  id: string;
  name: string;
  weightGrams: number;
  purity: string;
  type: "bar" | "coin";
  premiumPercentage: number;
  imageUrl: string;
  refiner?: string;
  popular?: boolean;
}

const GOLD_ITEMS: BullionItem[] = [
  { id: "1g", name: "1 Gram Minted Gold Bar", weightGrams: 1, purity: "999.9 (24K)", type: "bar", premiumPercentage: 0.12, refiner: "PAMP Suisse / Metalor", imageUrl: "/bullion/gold-1g.webp" },
  { id: "2.5g", name: "2.5 Gram Minted Gold Bar", weightGrams: 2.5, purity: "999.9 (24K)", type: "bar", premiumPercentage: 0.09, refiner: "PAMP Suisse / Valcambi", imageUrl: "/bullion/gold-2.5g.webp" },
  { id: "5g", name: "5 Gram Minted Gold Bar", weightGrams: 5, purity: "999.9 (24K)", type: "bar", premiumPercentage: 0.07, refiner: "PAMP Suisse / Umicore", imageUrl: "/bullion/gold-5g.webp" },
  { id: "10g", name: "10 Gram Minted Gold Bar", weightGrams: 10, purity: "999.9 (24K)", type: "bar", premiumPercentage: 0.05, popular: true, refiner: "PAMP Fortuna Sealed", imageUrl: "/bullion/gold-10g.webp" },
  { id: "1tola", name: "1 Tola (11.66g) Minted Gold Bar", weightGrams: 11.6638, purity: "999.9 (24K)", type: "bar", premiumPercentage: 0.045, popular: true, refiner: "Certified Traditional Tola", imageUrl: "/bullion/gold-tola.webp" },
  { id: "20g", name: "20 Gram Minted Gold Bar", weightGrams: 20, purity: "999.9 (24K)", type: "bar", premiumPercentage: 0.04, refiner: "LBMA Approved Refiner", imageUrl: "/bullion/gold-20g.webp" },
  { id: "1oz", name: "1 oz Gold Britannia Coin", weightGrams: 31.1035, purity: "999.9 (24K)", type: "coin", premiumPercentage: 0.035, popular: true, refiner: "The Royal Mint", imageUrl: "/bullion/gold-britannia.webp" },
  { id: "sov", name: "Full Gold Sovereign Coin", weightGrams: 7.988, purity: "916.7 (22K)", type: "coin", premiumPercentage: 0.05, refiner: "The Royal Mint (22ct)", imageUrl: "/bullion/gold-sovereign.webp" },
  { id: "100g", name: "100 Gram Investment Gold Bar", weightGrams: 100, purity: "999.9 (24K)", type: "bar", premiumPercentage: 0.025, popular: true, refiner: "Metalor / Umicore / PAMP", imageUrl: "/bullion/gold-100g.webp" },
  { id: "1kg", name: "1 Kilo (1,000g) Investment Gold Bar", weightGrams: 1000, purity: "999.9 (24K)", type: "bar", premiumPercentage: 0.018, refiner: "LBMA Certified Refiner", imageUrl: "/bullion/gold-1kg.webp" },
];

export default function GoldBarsPage() {
  const [rates, setRates] = useState(DEFAULT_RATES);
  const [lastUpdatedDisplay, setLastUpdatedDisplay] = useState(formatUKDateTime());

  useEffect(() => {
    fetch("/api/rates")
      .then((res) => res.json())
      .then((data) => {
        if (data.goldGbpPerGram) {
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

  const goldGram = rates.goldGbpPerGram;

  return (
    <div className="min-h-screen bg-[#faf8f5]/40 font-sans text-slate-800 pb-20">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14">
        
        {/* Header */}
        <div className="border-b border-[#dfcca6]/50 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-[#8b6914] uppercase tracking-wider bg-[#fbf5ea] px-2 py-0.5 rounded-[4px] border border-[#dfcca6]/60">
              LBMA Approved Investment Bullion
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-1.5">
              Gold Bars & Coins Catalog
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Certified 24K pure gold bars & 22K sovereign coins. Live pricing synced with London fixing.
            </p>
          </div>
          <div className="text-xs text-slate-500">
            Gold Spot: <strong className="text-slate-900">{formatGBP(goldGram)}/g</strong> · {lastUpdatedDisplay}
          </div>
        </div>

        {/* Product Cards Grid with Real Images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {GOLD_ITEMS.map((item) => {
            const metalPurity = item.purity.includes("22K") ? 22 / 24 : 1.0;
            const rawMetalValue = item.weightGrams * goldGram * metalPurity;
            const estimatedPrice = rawMetalValue * (1 + item.premiumPercentage);
            const waText = encodeURIComponent(`Hi Bhai Jeweller, I am interested in inquiring about ${item.name} (£${estimatedPrice.toFixed(2)}).`);

            return (
              <div
                key={item.id}
                className="group relative bg-white border border-[#dfcca6] rounded-[8px] p-5 shadow-xs hover:border-[#caa771] hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {item.popular && (
                  <span className="absolute top-3 right-3 bg-[#8b6914] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[3px] shadow-xs z-10">
                    Bestseller
                  </span>
                )}

                <div>
                  {/* Product Image Frame */}
                  <div className="w-full h-40 bg-[#faf8f5] rounded-[6px] border border-[#dfcca6]/40 p-2 flex items-center justify-center mb-3 group-hover:scale-102 transition-transform duration-300">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-full max-w-full object-contain filter drop-shadow-sm"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold text-[#8b6914] uppercase tracking-wider bg-[#faf8f5] px-2 py-0.5 rounded border border-[#dfcca6]/50">
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
                    Net Pure Weight: <strong className="text-slate-800">{item.weightGrams >= 1 ? item.weightGrams.toFixed(2) : item.weightGrams}g</strong>
                  </p>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-baseline justify-between">
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
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-[5px] bg-[#faf8f5] hover:bg-[#8b6914] text-[#8b6914] hover:text-white border border-[#dfcca6] text-xs font-bold transition-all duration-200 shadow-2xs"
                  >
                    <span>Inquire / Lock Price on WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Notice */}
        <div className="mt-8 p-4 rounded-[6px] bg-[#faf8f5]/80 border border-[#dfcca6]/50 text-xs text-slate-600 leading-relaxed">
          <p>
            All investment bars and coins are LBMA certified and supplied in sealed tamper-proof packaging or original mint capsules. Prices update continuously with the live London bullion fixing.
          </p>
        </div>

      </main>
    </div>
  );
}
