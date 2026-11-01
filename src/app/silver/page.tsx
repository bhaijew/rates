"use client";

import React, { useState, useEffect } from "react";
import { DEFAULT_RATES, formatGBP, formatUKDateTime } from "@/lib/rates";

interface SilverItem {
  id: string;
  name: string;
  weightGrams: number;
  purity: string;
  premiumPercentage: number;
  popular?: boolean;
}

const SILVER_ITEMS: SilverItem[] = [
  { id: "1oz", name: "1 oz Silver Britannia / Maple Coin", weightGrams: 31.1035, purity: "999 Fine", premiumPercentage: 0.18, popular: true },
  { id: "100g", name: "100 Gram Minted Silver Bar", weightGrams: 100, purity: "999 Fine", premiumPercentage: 0.15 },
  { id: "250g", name: "250 Gram Cast Silver Bar", weightGrams: 250, purity: "999 Fine", premiumPercentage: 0.12, popular: true },
  { id: "500g", name: "500 Gram Cast Silver Bar", weightGrams: 500, purity: "999 Fine", premiumPercentage: 0.10 },
  { id: "1kg", name: "1 Kilo (1,000g) Cast Silver Bar", weightGrams: 1000, purity: "999 Fine", premiumPercentage: 0.085, popular: true },
  { id: "5kg", name: "5 Kilo Investment Silver Bar", weightGrams: 5000, purity: "999 Fine", premiumPercentage: 0.07 },
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
    <div className="min-h-screen bg-white font-sans text-slate-800 pb-20">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14">
        
        {/* Header */}
        <div className="border-b border-slate-100 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Silver Bullion Desk
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
              Silver Bars & Coins
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              999 fine investment silver bullion, priced against live London spot rate.
            </p>
          </div>
          <div className="text-xs text-slate-500">
            Silver Spot: <strong className="text-slate-900">{formatGBP(silverGram)}/g</strong> · {lastUpdatedDisplay}
          </div>
        </div>

        {/* Silver Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
          {SILVER_ITEMS.map((item) => {
            const rawValue = item.weightGrams * silverGram;
            const estimatedPrice = rawValue * (1 + item.premiumPercentage);
            const waText = encodeURIComponent(`Hi Bhai Jeweller, I am interested in ordering ${item.name} (£${estimatedPrice.toFixed(2)}).`);

            return (
              <div
                key={item.id}
                className="relative bg-white border border-slate-200 rounded-[5px] p-5 shadow-xs hover:border-slate-400 hover:shadow-sm transition-all flex flex-col justify-between"
              >
                {item.popular && (
                  <span className="absolute -top-2.5 right-4 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[3px] shadow-xs">
                    Popular
                  </span>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                      {item.purity}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Investment Silver
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Weight: {item.weightGrams >= 100 ? item.weightGrams.toFixed(0) : item.weightGrams.toFixed(2)}g
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100">
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
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-[5px] bg-slate-50 hover:bg-slate-900 text-slate-800 hover:text-white border border-slate-200 text-xs font-bold transition-all duration-200"
                  >
                    <span>Inquire / Lock Price</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Notice */}
        <div className="mt-8 p-4 rounded-[5px] bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
          <p>
            Silver bullion bars and coins are LBMA-approved investment grade. Prices reflect live physical market rates plus minting and transport premium.
          </p>
        </div>

      </main>
    </div>
  );
}
