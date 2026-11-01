"use client";

import React from "react";

export default function GoldBarsPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 pb-20">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14">
        
        <div className="border-b border-slate-100 pb-5">
          <span className="text-xs font-semibold text-[#8b6914] uppercase tracking-wider">
            Investment Bullion
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
            Gold Bars & Coins
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Certified 24K (999.9) pure investment gold bars and minted coins.
          </p>
        </div>

        {/* Clean Ready State Container (Data to be added) */}
        <div className="mt-8 p-10 rounded-[5px] border border-dashed border-stone-300 bg-[#faf8f5]/40 text-center">
          <div className="w-12 h-12 rounded-[5px] border border-[#dfcca6] bg-white text-[#8b6914] flex items-center justify-center mx-auto mb-3 shadow-xs">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9.5 9.5a2.5 2.5 0 014.5 1.5c0 1.2-1.5 1.8-1.5 2.8m0 2.5h.01" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Gold Bars & Coins Catalog
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
            Live inventory and bar weights (1g to 1kg) will be updated here shortly. For immediate stock availability or bullion locking, please contact our showroom.
          </p>
          <div className="mt-5">
            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[5px] bg-[#8b6914] hover:bg-[#72540b] text-white text-xs font-bold transition-colors shadow-xs"
            >
              <span>Inquire Gold Stock on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Notice */}
        <div className="mt-8 p-4 rounded-[5px] bg-[#faf8f5]/60 border border-[#dfcca6]/50 text-xs text-slate-600 leading-relaxed">
          <p>
            All bullion bars supplied by <strong>Bhai Jeweller</strong> are LBMA-approved, 999.9 fine gold, tamper-evident sealed with serial certificates.
          </p>
        </div>

      </main>
    </div>
  );
}
