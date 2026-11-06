"use client";

import React, { useState } from "react";
import Link from "next/link";
import OffersShowcase from "@/components/OffersShowcase";
import InstagramStoriesWidget from "@/components/InstagramStoriesWidget";

export default function OffersPage() {
  const [showLiveWidget, setShowLiveWidget] = useState(false);

  const waInquiry = encodeURIComponent(
    "Hello Bhai Jewellers, do you currently have any special offers or promotions available in your Bradford showroom?"
  );

  return (
    <div className="min-h-screen bg-[#faf7f2] font-sans text-slate-800 pb-20 relative overflow-x-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-gradient-to-b from-[#f5ede0]/80 via-transparent to-transparent pointer-events-none -z-10" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        
        {/* Page Top Header */}
        <div className="border-b border-[#dfcca6]/50 pb-5 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-[10px] sm:text-[11px] font-bold text-[#8b6914] uppercase tracking-wider bg-[#fbf5ea] px-2.5 py-1 rounded-[4px] border border-[#dfcca6]/60">
                Bhai Jewellers Bradford
              </span>
              <span className="text-xs text-stone-500 font-medium">· Live Showroom Stories & Offers</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-extrabold tracking-tight text-slate-900 mt-2">
              Today&apos;s Special Offers
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Handpicked 22K & 24K jewellery deals, daily showroom arrivals, and live spot-linked bullion offers.
            </p>
          </div>

          {/* Quick Contact & Instagram links */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="https://www.instagram.com/bhaijeweller"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#dfcca6] bg-white hover:bg-[#fbf5ea] text-xs font-semibold text-stone-800 transition-all shadow-2xs"
            >
              <svg className="w-3.5 h-3.5 text-[#8b6914]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" strokeWidth="1.8" />
                <circle cx="12" cy="12" r="4" strokeWidth="1.8" />
                <circle cx="18" cy="6" r="1" fill="currentColor" stroke="none" />
              </svg>
              <span>@bhaijeweller</span>
            </a>

            <a
              href="tel:01274488801"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#dfcca6] bg-white hover:bg-[#fbf5ea] text-xs font-semibold text-stone-800 transition-all shadow-2xs"
            >
              <svg className="w-3.5 h-3.5 text-[#8b6914]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>01274 488801</span>
            </a>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SHAANDAR-STYLE LUXURY OFFERS SHOWCASE (Primary Feature)   */}
        {/* ======================================================== */}
        <div className="mt-4">
          <OffersShowcase />
        </div>

        {/* Live Instagram Widget Option (Secondary / Toggleable) */}
        <div className="mt-8 border-t border-[#dfcca6]/50 pt-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Live Instagram Stories Stream
              </h3>
              <p className="text-xs text-stone-500">
                Direct embed feed from our official Instagram channel.
              </p>
            </div>
            <button
              onClick={() => setShowLiveWidget(!showLiveWidget)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#dfcca6] bg-white hover:bg-[#fbf5ea] text-[#8b6914] cursor-pointer transition-colors shadow-2xs"
            >
              {showLiveWidget ? "Hide Feed ▲" : "View Live IG Feed ▼"}
            </button>
          </div>

          {showLiveWidget && (
            <div className="mt-4 animate-in fade-in duration-300">
              <InstagramStoriesWidget />
            </div>
          )}
        </div>

        {/* Showroom Direct WhatsApp CTA Card */}
        <div className="mt-8 bg-gradient-to-b from-white via-[#fdfbf9] to-[#fbf7f0] border-2 border-[#dfcca6] rounded-2xl p-6 sm:p-10 text-center shadow-[0_4px_24px_-4px_rgba(212,175,55,0.12)] relative overflow-hidden">
          {/* Top Gold Accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#d4af37] via-[#f7e799] to-[#aa7c11]" />

          {/* Icon Stage */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#faf5ea] to-[#eedbb9] border border-[#d4af37]/60 flex items-center justify-center text-[#8b6914] mx-auto mb-4 shadow-sm">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v3a2 2 0 01-2 2m-14 0v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
          </div>

          <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
            Want Today&apos;s Best Bullion & Jewellery Deals?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto mt-2 leading-relaxed">
            All gold bars, sovereign coins, and bespoke 22K/24K jewellery rates update constantly against the live London spot fixing.
          </p>

          {/* Action CTAs */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`https://wa.me/447735727897?text=${waInquiry}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#9c8254] via-[#caa771] to-[#8b6914] hover:from-[#8b6914] hover:to-[#73582a] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span>Inquire In-Store Deals on WhatsApp</span>
            </a>

            <Link
              href="/gold-bars"
              className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 rounded-xl bg-white border border-[#dfcca6] hover:border-[#8b6914] text-slate-800 hover:text-[#8b6914] text-xs sm:text-sm font-bold transition-all shadow-xs"
            >
              Browse Gold Bullion Catalog →
            </Link>

            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 rounded-xl bg-white border border-[#dfcca6] hover:border-[#8b6914] text-slate-800 hover:text-[#8b6914] text-xs sm:text-sm font-bold transition-all shadow-xs"
            >
              View Live Rates →
            </Link>
          </div>
        </div>

        {/* In-Store Showroom Notice */}
        <div className="mt-8 p-4 sm:p-5 rounded-xl bg-[#faf8f5]/80 border border-[#dfcca6]/50 text-xs text-slate-600 leading-relaxed shadow-2xs text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <strong className="text-slate-900 block font-bold">Visiting our Bradford Showroom?</strong>
            <span>17 Duckworth Lane, Bradford, BD9 5ER · Walk-ins & appointments welcome.</span>
          </div>
          <a
            href="tel:01274488801"
            className="text-[#8b6914] font-bold hover:underline shrink-0 text-xs sm:text-sm"
          >
            Call: 01274 488801
          </a>
        </div>
      </main>
    </div>
  );
}
