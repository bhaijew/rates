"use client";

import React, { useState, useEffect } from "react";

export default function FindUsPage() {
  const [activePhoto, setActivePhoto] = useState(0);
  const [currentDayName, setCurrentDayName] = useState("");

  useEffect(() => {
    setCurrentDayName(new Date().toLocaleDateString("en-US", { weekday: "long" }));
  }, []);

  const showroomFeatures = [
    {
      title: "Private Bullion & VIP Lounge",
      desc: "Discreet consultation desks for high-value gold transactions with complimentary hospitality & refreshments.",
      tag: "VIP Service",
    },
    {
      title: "Non-Destructive XRF Assay Lab",
      desc: "Live laser spectrography testing & certified Swiss weighing scales conducted in your presence.",
      tag: "Assay Verified",
    },
    {
      title: "Bridal Jewellery Suites",
      desc: "Explore handcrafted 22K pure bridal necklace sets, bangles, and diamond rings in our private viewing chambers.",
      tag: "Bridal Suite",
    },
  ];

  const openingHours = [
    { day: "Monday", hours: "11:00 AM – 7:00 PM" },
    { day: "Tuesday", hours: "11:00 AM – 7:00 PM" },
    { day: "Wednesday", hours: "11:00 AM – 7:00 PM" },
    { day: "Thursday", hours: "11:00 AM – 7:00 PM" },
    { day: "Friday", hours: "11:00 AM – 7:00 PM" },
    { day: "Saturday", hours: "11:00 AM – 7:00 PM" },
    { day: "Sunday", hours: "11:00 AM – 7:00 PM" },
  ];

  return (
    <div className="min-h-screen bg-[#faf8f4] font-sans text-stone-800 pb-24 sm:pb-32">
      
      {/* Background Soft Luxury Glow */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-[#f3ece0]/60 via-[#f8f4ed]/30 to-transparent pointer-events-none -z-10" />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16">
        
        {/* Header with Top Floating Pin Badge */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#faf5ea] border border-[#dfcca6] text-[#8b6914] flex items-center justify-center mx-auto shadow-xs">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#745511] font-serif tracking-tight mt-3">
            Visit Bhai Jewellers Bradford
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-medium max-w-md mx-auto">
            Find our flagship bullion showroom located at 17 Duckworth Lane, Bradford.
          </p>
        </div>

        {/* Showroom Showcase Card */}
        <div className="mt-10 rounded-[16px] border-2 border-[#dfcca6] bg-gradient-to-b from-[#fbf9f5] to-[#f6f1e7] p-5 sm:p-7 shadow-xs">
          <div className="flex flex-col lg:flex-row items-center gap-6 justify-between">
            
            {/* Showroom Interior Highlights */}
            <div className="space-y-4 max-w-lg">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#faf5ea] border border-[#dfcca6] text-[#8b6914] text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Bradford Flagship Showroom
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif leading-tight">
                Luxury Hospitality & Secure Bullion Trading
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Step into a world of pure craftsmanship. Whether buying investment bullion, valuing scrap gold, or selecting a 22K bridal trousseau, enjoy private consultations with dedicated gold specialists in Bradford.
              </p>

              {/* Feature Tags */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-[11px] font-semibold bg-white border border-[#dfcca6]/70 text-stone-700 px-3 py-1 rounded-[5px]">
                  ☕ VIP Refreshments Lounge
                </span>
                <span className="text-[11px] font-semibold bg-white border border-[#dfcca6]/70 text-stone-700 px-3 py-1 rounded-[5px]">
                  🛡️ Biometric Secure Facility
                </span>
                <span className="text-[11px] font-semibold bg-white border border-[#dfcca6]/70 text-stone-700 px-3 py-1 rounded-[5px]">
                  🚗 Dedicated Customer Parking
                </span>
              </div>
            </div>

            {/* Visual Lounge Presentation Box */}
            <div className="w-full lg:w-80 h-52 rounded-[12px] bg-[#0d0f12] text-white p-5 flex flex-col justify-between border border-[#dfcca6] shadow-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-black via-stone-900 to-amber-950/40 opacity-90" />
              
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300 bg-black/50 px-2 py-0.5 rounded border border-amber-400/30">
                  Private Suite
                </span>
                <span className="text-amber-400 font-serif text-lg">✦</span>
              </div>

              <div className="relative z-10 space-y-1">
                <div className="text-lg font-bold font-serif text-white">Bhai Jeweller Bradford</div>
                <p className="text-xs text-stone-300 leading-snug">
                  17 Duckworth Lane, Bradford BD9 5ER. Personal one-on-one bullion appraisals and bridal fittings.
                </p>
              </div>

              <div className="relative z-10 text-[10px] text-amber-200/80 font-medium">
                Open 7 Days • 11:00 AM – 7:00 PM
              </div>
            </div>

          </div>
        </div>

        {/* Dual Cards Grid: Store Information & Live Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          
          {/* LEFT CARD: Store Details & Opening Hours */}
          <div className="rounded-[16px] border-2 border-[#dfcca6] bg-white p-6 sm:p-7 shadow-xs space-y-6">
            
            {/* Live Status Pill */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Open Now • Closes at 7:00 PM
              </span>
              <span className="text-xs text-stone-400 font-medium">Updated Daily</span>
            </div>

            {/* Address & Phone */}
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-stone-900 font-serif">Bhai Jewellers Bradford</h3>
              <p className="text-xs sm:text-sm text-stone-700 font-medium leading-relaxed">
                17 Duckworth Lane, Bradford, BD9 5ER, United Kingdom
              </p>
              <div className="text-xs text-stone-800 pt-1 space-y-1">
                <div>Landline: <a href="tel:01274488801" className="text-[#8b6914] hover:underline font-bold">01274 488801</a></div>
                <div>Mobile / WhatsApp: <a href="https://wa.me/447735727897" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:underline font-bold">+44 7735 727897</a></div>
              </div>
            </div>

            {/* 3 Action Buttons (Get Directions, Call Shop, WhatsApp) */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {/* Get Directions */}
              <a
                href="https://maps.google.com/?q=Bhai+Jewellers+17+Duckworth+Lane+Bradford+BD9+5ER"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-2 rounded-[5px] bg-[#7a5b13] hover:bg-[#63480a] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs text-center"
              >
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span>Directions</span>
              </a>

              {/* Call Shop */}
              <a
                href="tel:01274488801"
                className="py-2.5 px-2 rounded-[5px] bg-[#faf8f5] hover:bg-[#f3ece0] border border-[#dfcca6] text-stone-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors text-center"
              >
                <svg className="w-3.5 h-3.5 shrink-0 text-[#8b6914]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>Call Shop</span>
              </a>

              {/* WhatsApp Us */}
              <a
                href="https://wa.me/447735727897"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-2 rounded-[5px] bg-[#faf8f5] hover:bg-[#f3ece0] border border-[#dfcca6] text-stone-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors text-center"
              >
                <svg className="w-3.5 h-3.5 shrink-0 text-emerald-600 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                </svg>
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Opening Hours Table */}
            <div className="pt-2 border-t border-stone-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 uppercase tracking-wider mb-2.5">
                <svg className="w-4 h-4 text-[#8b6914]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
                </svg>
                <span>Bradford Opening Hours</span>
              </div>

              <div className="space-y-1.5 text-xs">
                {openingHours.map((item) => {
                  const isToday = item.day === currentDayName;
                  return (
                    <div
                      key={item.day}
                      className={`flex items-center justify-between py-1.5 px-2.5 rounded-[4px] transition-colors ${
                        isToday
                          ? "bg-[#faf5ea] font-bold text-[#745511] border border-[#dfcca6]/60"
                          : "text-stone-600 hover:bg-stone-50"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        {item.day}
                        {isToday && (
                          <span className="text-[10px] bg-[#8b6914] text-white px-1.5 py-0.2 rounded font-normal">
                            Today
                          </span>
                        )}
                      </span>
                      <span className="tabular-nums">{item.hours}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT CARD: Interactive Map Preview */}
          <div className="rounded-[16px] border-2 border-[#dfcca6] bg-white p-6 sm:p-7 shadow-xs flex flex-col justify-between">
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-[#faf5ea] border border-[#dfcca6] text-[#8b6914] flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-stone-900 font-serif">17 Duckworth Lane, Bradford</h4>
                    <span className="text-[11px] text-stone-500 font-mono">BD9 5ER, West Yorkshire</span>
                  </div>
                </div>

                <a
                  href="https://maps.google.com/?q=Bhai+Jewellers+17+Duckworth+Lane+Bradford+BD9+5ER"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#8b6914] hover:underline flex items-center gap-1"
                >
                  <span>Open Maps</span>
                  <span>↗</span>
                </a>
              </div>

              <p className="text-xs text-stone-500 leading-relaxed">
                Plan your visit to our Bradford showroom. Easily accessible via Duckworth Lane / Toller Lane with nearby customer parking.
              </p>
            </div>

            {/* Embedded Live Map Frame */}
            <div className="my-5 rounded-[12px] overflow-hidden border border-stone-200 bg-stone-100 h-64 relative shadow-inner">
              <iframe
                title="Bhai Jewellers Bradford Location Map"
                src="https://maps.google.com/maps?q=Bhai+Jewellers,+17+Duckworth+Lane,+Bradford+BD9+5ER,+UK&t=&z=16&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Bottom Direct Route Helper */}
            <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>17 Duckworth Lane, Bradford BD9 5ER</span>
              </div>

              <a
                href="https://maps.google.com/?q=Bhai+Jewellers+17+Duckworth+Lane+Bradford+BD9+5ER"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-4 rounded-full bg-[#7a5b13] hover:bg-[#63480a] text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5 whitespace-nowrap"
              >
                <span>Navigate in Google Maps</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>

          </div>

        </div>

        {/* SOCIAL MEDIA SECTION: INSTAGRAM & TIKTOK SHOWCASE */}
        <div className="mt-12 rounded-[16px] border-2 border-[#dfcca6] bg-gradient-to-r from-[#faf6ee] via-white to-[#faf6ee] p-6 sm:p-8 shadow-xs">
          <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8b6914] bg-[#faf2de] px-2.5 py-1 rounded-[4px] border border-[#dfcca6]">
              Follow Bhai Jewellers
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
              Join Us On Instagram & TikTok
            </h3>
            <p className="text-xs sm:text-sm text-stone-600">
              Watch our daily live showcases of 22ct bridal collections, new arrivals, gold rates, and showroom offers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Instagram Banner Card */}
            <a
              href="https://www.instagram.com/bhaijeweller/"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-5 rounded-[12px] border border-[#dfcca6] bg-white hover:border-[#caa771] hover:shadow-md transition-all flex items-center gap-4"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
                </svg>
              </div>
              <div className="flex-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">Instagram</span>
                <span className="text-base font-extrabold text-stone-900 group-hover:text-[#8b6914] transition-colors block">@bhaijeweller</span>
                <span className="text-xs text-stone-500 block mt-0.5">Follow for daily jewellery videos →</span>
              </div>
            </a>

            {/* TikTok Banner Card */}
            <a
              href="https://www.tiktok.com/@bhaijeweller"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-5 rounded-[12px] border border-[#dfcca6] bg-white hover:border-black hover:shadow-md transition-all flex items-center gap-4"
            >
              <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.77 1.81-.07 3.25-1.55 3.32-3.36.07-2.6.02-5.2.03-7.8.01-4.38.01-8.77.02-13.15z"/>
                </svg>
              </div>
              <div className="flex-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">TikTok</span>
                <span className="text-base font-extrabold text-stone-900 group-hover:text-black transition-colors block">@bhaijeweller</span>
                <span className="text-xs text-stone-500 block mt-0.5">Watch TikTok showcases & trends →</span>
              </div>
            </a>
          </div>
        </div>

      </main>
    </div>
  );
}
