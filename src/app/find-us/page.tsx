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
            Visit Bhai Jewellers
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-medium max-w-md mx-auto">
            Find our flagship bullion showroom in the heart of the UK Asian Jewellery Quarter.
          </p>
        </div>

        {/* Showroom Showcase Card */}
        <div className="mt-10 rounded-[16px] border-2 border-[#dfcca6] bg-gradient-to-b from-[#fbf9f5] to-[#f6f1e7] p-5 sm:p-7 shadow-xs">
          <div className="flex flex-col lg:flex-row items-center gap-6 justify-between">
            
            {/* Showroom Interior Highlights */}
            <div className="space-y-4 max-w-lg">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#faf5ea] border border-[#dfcca6] text-[#8b6914] text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Flagship UK Showroom
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif leading-tight">
                Luxury Hospitality & Secure Bullion Trading
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Step into a world of pure craftsmanship. Whether buying investment bullion, valuing scrap gold, or selecting a bridal trousseau, enjoy private consultations with dedicated gold specialists.
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
                <div className="text-lg font-bold font-serif text-white">Bhai Jeweller Suite</div>
                <p className="text-xs text-stone-300 leading-snug">
                  Experience personal one-on-one bullion appraisals and bridal custom fittings in complete privacy.
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
              <h3 className="text-xl font-bold text-stone-900 font-serif">Bhai Jewellers</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                141 Cheetham Hill Road, Cheetham Hill, Manchester, M8 8PY, United Kingdom
              </p>
              <div className="text-xs font-semibold text-stone-800 pt-1">
                Telephone: <a href="tel:01612025809" className="text-[#8b6914] hover:underline font-bold">0161 202 5809</a>
              </div>
            </div>

            {/* 3 Action Buttons (Get Directions, Call Shop, WhatsApp) */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {/* Get Directions */}
              <a
                href="https://maps.google.com/?q=141+Cheetham+Hill+Road+Manchester+M8+8PY"
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
                href="tel:01612025809"
                className="py-2.5 px-2 rounded-[5px] bg-[#faf8f5] hover:bg-[#f3ece0] border border-[#dfcca6] text-stone-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors text-center"
              >
                <svg className="w-3.5 h-3.5 shrink-0 text-[#8b6914]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>Call Shop</span>
              </a>

              {/* WhatsApp Us */}
              <a
                href="https://wa.me/447385325805"
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
                <span>Opening Hours</span>
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
                    <h4 className="text-base font-bold text-stone-900 font-serif">Bhai Jewellers Location</h4>
                    <span className="text-[11px] text-stone-400 font-mono">53.505126, -2.239855</span>
                  </div>
                </div>

                <a
                  href="https://maps.google.com/?q=141+Cheetham+Hill+Road+Manchester+M8+8PY"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#8b6914] hover:underline flex items-center gap-1"
                >
                  <span>Open Maps</span>
                  <span>↗</span>
                </a>
              </div>

              <p className="text-xs text-stone-500 leading-relaxed">
                Loading the interactive map below will connect to Google Maps to help you calculate driving directions, bus routes, or plan your journey.
              </p>
            </div>

            {/* Embedded Live Map Frame */}
            <div className="my-5 rounded-[12px] overflow-hidden border border-stone-200 bg-stone-100 h-64 relative shadow-inner">
              <iframe
                title="Bhai Jewellers Location Map"
                src="https://maps.google.com/maps?q=141+Cheetham+Hill+Road,+Manchester+M8+8PY&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Bottom Direct Route Helper */}
            <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Easily accessible via Cheetham Hill Rd (A665)</span>
              </div>

              <a
                href="https://maps.google.com/?q=141+Cheetham+Hill+Road+Manchester+M8+8PY"
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

      </main>
    </div>
  );
}
