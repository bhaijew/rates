"use client";

import React, { useState, useEffect } from "react";

export default function FindUsPage() {
  const [currentDayName, setCurrentDayName] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCurrentDayName(new Date().toLocaleDateString("en-US", { weekday: "long" }));
  }, []);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText("17 Duckworth Lane, Bradford, BD9 5ER, United Kingdom");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openingHours = [
    { day: "Monday", hours: "11:00 AM – 7:00 PM" },
    { day: "Tuesday", hours: "11:00 AM – 7:00 PM" },
    { day: "Wednesday", hours: "11:00 AM – 7:00 PM" },
    { day: "Thursday", hours: "11:00 AM – 7:00 PM" },
    { day: "Friday", hours: "11:00 AM – 7:00 PM" },
    { day: "Saturday", hours: "11:00 AM – 7:00 PM" },
    { day: "Sunday", hours: "11:00 AM – 7:00 PM" },
  ];

  const showroomAmenities = [
    {
      title: "Private VIP Bullion Suite",
      desc: "Discreet consultation lounge for high-value gold bullion bars, coins, and scrap buybacks.",
      icon: "🛡️",
    },
    {
      title: "On-Site Laser XRF Assay Lab",
      desc: "Instant non-destructive metal testing and Swiss-certified trade precision weighing.",
      icon: "🔬",
    },
    {
      title: "22K Bridal Viewing Chambers",
      desc: "Exclusive private fitting chambers for bridal necklace sets, bangles, and bespoke orders.",
      icon: "💎",
    },
    {
      title: "VIP Hospitality Lounge",
      desc: "Complimentary luxury refreshments, tea, and espresso for all showroom guests.",
      icon: "☕",
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5] font-sans text-slate-800 pb-20 relative overflow-x-hidden">
      
      {/* Background Soft Luxury Marble Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-gradient-to-b from-[#f5ede0]/60 via-[#faf8f5]/30 to-transparent pointer-events-none -z-10" />

      {/* Top Gold Foil Accent Bar */}
      <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#caa771] to-transparent relative z-10 opacity-70" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        
        {/* Section Pill Badge */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-[10.5px] font-bold text-[#8b6914] tracking-widest uppercase bg-[#faf5ea] px-3 py-1 rounded-[4px] border border-[#dfcca6] shadow-2xs flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Flagship Bullion & Jewellery Showroom · Bradford, UK
          </span>
        </div>

        {/* Page Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto pb-8 border-b border-[#dfcca6]/50">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight font-serif">
            Visit Our <span className="text-[#8b6914]">Bradford Showroom</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            Located at 17 Duckworth Lane in the heart of Bradford. Experience discreet bullion trading, live gold price fixing, and handcrafted 22-karat Asian bridal collections.
          </p>

          {/* Live Showroom Status Bar */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Open 7 Days · 11:00 AM – 7:00 PM
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-slate-700 border border-[#dfcca6] text-xs font-semibold shadow-2xs">
              📍 17 Duckworth Lane, Bradford BD9 5ER
            </span>
          </div>
        </div>

        {/* Two-Column Professional Layout: Left Info & Right Interactive Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
          
          {/* LEFT COLUMN: Location Details, Hours & Amenities (7 Cols) */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* 1. STORE ADDRESS & DIRECT ACTION BAR */}
            <div className="bg-white border-2 border-[#dfcca6] rounded-[10px] p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-[#dfcca6]/40">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#8b6914]">Bradford Headquarters</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 font-serif">
                    Bhai Jewellers
                  </h3>
                  <p className="text-sm text-slate-700 font-medium leading-relaxed pt-0.5">
                    17 Duckworth Lane, Bradford, BD9 5ER, United Kingdom
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-[5px] bg-[#faf5ea] hover:bg-[#8b6914] text-[#8b6914] hover:text-white border border-[#dfcca6] transition-all shadow-2xs self-start"
                >
                  {copied ? "Address Copied! ✓" : "Copy Address"}
                </button>
              </div>

              {/* Quick Communication Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-4">
                <a
                  href="https://maps.google.com/?q=Bhai+Jewellers+17+Duckworth+Lane+Bradford+BD9+5ER"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-[6px] bg-[#8b6914] hover:bg-[#73582a] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span>Google Directions</span>
                </a>

                <a
                  href="tel:01274488801"
                  className="py-2.5 px-3 rounded-[6px] bg-[#faf5ea] hover:bg-[#f3ece0] border border-[#dfcca6] text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                >
                  <svg className="w-3.5 h-3.5 shrink-0 text-[#8b6914]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>01274 488801</span>
                </a>

                <a
                  href="https://wa.me/447735727897"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-[6px] bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  <span>WhatsApp Chat</span>
                </a>
              </div>
            </div>

            {/* 2. BRADFORD OPENING HOURS CARD */}
            <div className="bg-white border-2 border-[#dfcca6] rounded-[10px] p-6 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#dfcca6]/40 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-[5px] bg-[#faf5ea] border border-[#dfcca6] text-[#8b6914] flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" strokeWidth="2" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Bradford Showroom Opening Hours
                  </h4>
                </div>
                <span className="text-[11px] font-bold text-[#8b6914] bg-[#faf5ea] px-2 py-0.5 rounded border border-[#dfcca6]">
                  7 Days A Week
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                {openingHours.map((item) => {
                  const isToday = item.day === currentDayName;
                  return (
                    <div
                      key={item.day}
                      className={`flex items-center justify-between py-2 px-3 rounded-[5px] transition-colors ${
                        isToday
                          ? "bg-gradient-to-r from-[#faf5ea] to-[#f4ebe0] font-bold text-[#745511] border border-[#dfcca6]"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${isToday ? "bg-[#8b6914]" : "bg-slate-300"}`} />
                        <span>{item.day}</span>
                        {isToday && (
                          <span className="text-[10px] bg-[#8b6914] text-white px-1.5 py-0.2 rounded font-semibold">
                            Today
                          </span>
                        )}
                      </span>
                      <span className="tabular-nums font-semibold">{item.hours}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. SHOWROOM AMENITIES GRID */}
            <div className="bg-white border-2 border-[#dfcca6] rounded-[10px] p-6 shadow-sm">
              <div className="pb-3 border-b border-[#dfcca6]/40 mb-4">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#8b6914] block">
                  Showroom Standards & Security
                </span>
                <h4 className="text-base font-bold text-slate-900 font-serif">
                  What To Expect At Our Showroom
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {showroomAmenities.map((amenity) => (
                  <div
                    key={amenity.title}
                    className="p-3.5 rounded-[8px] bg-[#faf8f5] border border-[#dfcca6]/60 space-y-1"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{amenity.icon}</span>
                      <span className="text-xs font-bold text-slate-900">{amenity.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">
                      {amenity.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. TRANSPORT & PARKING GUIDE */}
            <div className="p-4 rounded-[8px] bg-[#faf5ea] border border-[#dfcca6] text-xs text-slate-700 leading-relaxed space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <span>🚗 Travel & Parking Guide</span>
              </div>
              <p>
                <strong>Driving:</strong> Situated on Duckworth Lane (BD9 5ER), directly connected to Toller Lane (A6177). Free and metered customer parking is available immediately adjacent to the showroom.
              </p>
              <p>
                <strong>Public Transit:</strong> Direct bus services (Routes 620, 621) stop within 50 yards. Approximately 8 minutes by taxi from Bradford Interchange.
              </p>
            </div>

          </div>

          {/* RIGHT COLUMN: Interactive Live Map & VIP Appointment Card (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* 1. INTERACTIVE GOOGLE MAP BOX */}
            <div className="bg-white border-2 border-[#dfcca6] rounded-[10px] p-5 shadow-sm sticky top-24 space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-[#dfcca6]/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-[5px] bg-[#faf5ea] border border-[#dfcca6] text-[#8b6914] flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Live Showroom Map</h4>
                    <span className="text-[11px] text-slate-500 font-mono">17 Duckworth Lane, BD9 5ER</span>
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

              {/* Embedded Interactive Google Map */}
              <div className="w-full h-72 sm:h-80 rounded-[8px] overflow-hidden border border-[#dfcca6] relative shadow-inner bg-stone-100">
                <iframe
                  title="Bhai Jewellers Bradford Location Map"
                  src="https://maps.google.com/maps?q=Bhai+Jewellers,+17+Duckworth+Lane,+Bradford+BD9+5ER,+UK&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Navigate CTA */}
              <a
                href="https://maps.google.com/?q=Bhai+Jewellers+17+Duckworth+Lane+Bradford+BD9+5ER"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-[6px] bg-gradient-to-r from-[#8b6914] via-[#9c8254] to-[#73582a] hover:from-[#73582a] hover:to-[#57411c] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 active:scale-95 text-center"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <span>Start Turn-by-Turn Navigation</span>
              </a>

              {/* 2. BOOK VIP PRIVATE APPOINTMENT */}
              <div className="mt-4 pt-4 border-t border-[#dfcca6]/40 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <span>✦ Book Private VIP Appointment</span>
                </div>
                <p className="text-[11.5px] text-slate-600 leading-relaxed">
                  Trading large bullion quantities or bespoke bridal sets? Reserve a private suite in advance with our chief gold appraiser.
                </p>
                <a
                  href="https://wa.me/447735727897?text=Hello%20Bhai%20Jewellers,%20I%20would%20like%20to%20book%20a%20private%20VIP%20showroom%20appointment."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-[6px] bg-[#faf5ea] hover:bg-[#8b6914] text-[#8b6914] hover:text-white border border-[#dfcca6] text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5"
                >
                  <span>Book VIP Visit on WhatsApp</span>
                  <span>→</span>
                </a>
              </div>

            </div>

          </div>

        </div>

        {/* SOCIAL MEDIA SHOWCASE BANNER: INSTAGRAM & TIKTOK */}
        <div className="mt-12 rounded-[10px] border-2 border-[#dfcca6] bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-[#dfcca6]/50 mb-6">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8b6914] bg-[#faf5ea] px-2.5 py-1 rounded-[4px] border border-[#dfcca6]">
                Official Social Media
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif mt-2">
                Follow Bhai Jewellers on Instagram & TikTok
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Watch daily 22K bridal jewellery video showcases, new showroom arrivals, and customer reviews.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-800">Updated Daily</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {/* Instagram Link */}
            <a
              href="https://www.instagram.com/bhaijeweller/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-[8px] bg-gradient-to-r from-[#fdfbf8] to-[#fbf4eb] border border-[#dfcca6] hover:border-[#caa771] hover:shadow-xs transition-all flex items-center gap-3.5 group"
            >
              <div className="w-12 h-12 rounded-[6px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Follow Instagram</span>
                <span className="text-sm font-extrabold text-slate-900 group-hover:text-[#8b6914] transition-colors block">@bhaijeweller</span>
                <span className="text-[11px] text-slate-500 block">Watch video collection →</span>
              </div>
            </a>

            {/* TikTok Link */}
            <a
              href="https://www.tiktok.com/@bhaijeweller"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-[8px] bg-gradient-to-r from-[#fdfbf8] to-[#fbf4eb] border border-[#dfcca6] hover:border-black hover:shadow-xs transition-all flex items-center gap-3.5 group"
            >
              <div className="w-12 h-12 rounded-[6px] bg-black text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.77 1.81-.07 3.25-1.55 3.32-3.36.07-2.6.02-5.2.03-7.8.01-4.38.01-8.77.02-13.15z"/>
                </svg>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Follow TikTok</span>
                <span className="text-sm font-extrabold text-slate-900 group-hover:text-black transition-colors block">@bhaijeweller</span>
                <span className="text-[11px] text-slate-500 block">Watch TikTok showcases →</span>
              </div>
            </a>
          </div>
        </div>

      </main>
    </div>
  );
}
