"use client";

import React from "react";

export default function SilverPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 pb-20">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14">
        
        <div className="border-b border-slate-100 pb-5">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Silver Bullion Desk
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
            Silver Bars & Coins
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Priced against today&apos;s live spot silver rate of £1.30 per gram.
          </p>
        </div>

        {/* Clean Ready State Container (Data to be added) */}
        <div className="mt-8 p-10 rounded-[5px] border border-dashed border-slate-300 bg-stone-50/50 text-center">
          <div className="w-12 h-12 rounded-[5px] border border-slate-200 bg-white text-slate-700 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 7.5v9m-2.5-6.8c0-.9.8-1.5 2.5-1.5s2.5.6 2.5 1.5-.8 1.4-2.5 1.8-2.5.9-2.5 1.8.8 1.5 2.5 1.5 2.5-.6 2.5-1.5" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Silver Bars & Coins Catalog
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
            Live 999 fine silver bars (100g, 250g, 500g, 1kg) and 1 oz coins inventory will be updated here shortly. For orders or bulk pricing, contact our desk.
          </p>
          <div className="mt-5">
            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[5px] bg-slate-900 hover:bg-black text-white text-xs font-bold transition-colors shadow-xs"
            >
              <span>Inquire Silver Stock on WhatsApp</span>
            </a>
          </div>
        </div>

      </main>
    </div>
  );
}
