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
  popular?: boolean;
}

const GOLD_ITEMS: BullionItem[] = [
  { id: "1g", name: "1 Gram Minted Gold Bar", weightGrams: 1, purity: "999.9 (24K)", type: "bar", premiumPercentage: 0.12 },
  { id: "2.5g", name: "2.5 Gram Minted Gold Bar", weightGrams: 2.5, purity: "999.9 (24K)", type: "bar", premiumPercentage: 0.09 },
  { id: "5g", name: "5 Gram Minted Gold Bar", weightGrams: 5, purity: "999.9 (24K)", type: "bar", premiumPercentage: 0.07 },
  { id: "10g", name: "10 Gram Minted Gold Bar", weightGrams: 10, purity: "999.9 (24K)", type: "bar", premiumPercentage: 0.05, popular: true },
  { id: "1tola", name: "1 Tola (11.66g) Minted Gold Bar", weightGrams: 11.6638, purity: "999.9 (24K)", type: "bar", premiumPercentage: 0.045, popular: true },
  { id: "20g", name: "20 Gram Minted Gold Bar", weightGrams: 20, purity: "999.9 (24K)", type: "bar", premiumPercentage: 0.04 },
  { id: "1oz", name: "1 oz Britannia Minted Coin", weightGrams: 31.1035, purity: "999.9 (24K)", type: "coin", premiumPercentage: 0.035, popular: true },
  { id: "sov", name: "Full Gold Sovereign Coin", weightGrams: 7.988, purity: "916.7 (22K)", type: "coin", premiumPercentage: 0.05 },
  { id: "50g", name: "50 Gram Cast Gold Bar", weightGrams: 50, purity: "999.9 (24K)", type: "bar", premiumPercentage: 0.03 },
  { id: "100g", name: "100 Gram Cast Gold Bar", weightGrams: 100, purity: "999.9 (24K)", type: "bar", premiumPercentage: 0.025, popular: true },
  { id: "1kg", name: "1 Kilo Investment Gold Bar", weightGrams: 1000, purity: "999.9 (24K)", type: "bar", premiumPercentage: 0.018 },
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
    <div className="min-h-screen bg-white font-sans text-slate-800 pb-20">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14">
        
        {/* Header */}
        <div className="border-b border-slate-100 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-[#8b6914] uppercase tracking-wider">
              Investment Bullion Desk
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
              Gold Bars & Coins
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Certified pure 24K and 22K investment gold. Prices update live with London spot rate.
            </p>
          </div>
          <div className="text-xs text-slate-500">
            Spot: <strong className="text-slate-900">{formatGBP(goldGram)}/g</strong> · {lastUpdatedDisplay}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
          {GOLD_ITEMS.map((item) => {
            const metalPurity = item.purity.includes("22K") ? 22 / 24 : 1.0;
            const rawMetalValue = item.weightGrams * goldGram * metalPurity;
            const estimatedPrice = rawMetalValue * (1 + item.premiumPercentage);
            const waText = encodeURIComponent(`Hi Bhai Jeweller, I am interested in inquiring about ${item.name} (£${estimatedPrice.toFixed(2)}).`);

            return (
              <div
                key={item.id}
                className="relative bg-white border border-[#dfcca6]/80 rounded-[5px] p-5 shadow-xs hover:border-[#caa771] hover:shadow-sm transition-all flex flex-col justify-between"
              >
                {item.popular && (
                  <span className="absolute -top-2.5 right-4 bg-[#8b6914] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[3px] shadow-xs">
                    Popular
                  </span>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-bold text-[#8b6914] uppercase tracking-wider bg-[#faf8f5] px-2 py-0.5 rounded border border-[#dfcca6]/50">
                      {item.purity}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {item.type === "coin" ? "Minted Coin" : "Fine Bar"}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Weight: {item.weightGrams >= 1 ? item.weightGrams.toFixed(2) : item.weightGrams}g
                  </p>

                  <div className="mt-4 pt-3 border-t border-stone-100">
                    <span className="text-[11px] text-slate-400 block">Indicative Live Price</span>
                    <span className="text-2xl font-black text-slate-900 tracking-tight">
                      {formatGBP(estimatedPrice)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-2">
                  <a
                    href={`https://wa.me/923001234567?text=${waText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-[5px] bg-[#faf8f5] hover:bg-[#8b6914] text-[#8b6914] hover:text-white border border-[#dfcca6] text-xs font-bold transition-all duration-200"
                  >
                    <span>Inquire / Lock Price</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Notice */}
        <div className="mt-8 p-4 rounded-[5px] bg-[#faf8f5]/60 border border-[#dfcca6]/50 text-xs text-slate-600 leading-relaxed">
          <p>
            All bullion bars and coins are supplied in certified sealed packaging or with certificate of authenticity. Final transaction prices are confirmed at our showroom based on live London fixing.
          </p>
        </div>

      </main>
    </div>
  );
}
