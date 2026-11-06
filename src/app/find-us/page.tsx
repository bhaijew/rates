"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { INITIAL_SITE_CONTENT, SiteContent } from "@/data/site-content";

export default function FindUsPage() {
  const [content, setContent] = useState<SiteContent>(INITIAL_SITE_CONTENT);
  const [currentDayName, setCurrentDayName] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCurrentDayName(new Date().toLocaleDateString("en-US", { weekday: "long" }));
    fetch("/api/admin/content")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data?.siteContent) {
          setContent(res.data.siteContent);
        }
      })
      .catch(() => {});
  }, []);

  const findUs = content.findUs;
  const contact = content.contact;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(findUs.addressFull);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] font-sans text-slate-800 pb-20 relative overflow-x-hidden">
      
      {/* Background Soft Luxury Marble Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-gradient-to-b from-[#f5ede0]/60 via-[#faf8f5]/30 to-transparent pointer-events-none -z-10" />

      {/* Top Gold Foil Accent Bar */}
      <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#caa771] to-transparent relative z-10 opacity-70" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        
        {/* Section Pill Badge */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-[10.5px] font-bold text-[#8b6914] tracking-widest uppercase bg-[#faf5ea] px-3 py-1 rounded-[4px] border border-[#dfcca6] shadow-2xs flex items-center gap-1.5 font-notche">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Flagship Bullion & Jewellery Showroom · Bradford, UK
          </span>
        </div>

        {/* Page Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto pb-8 border-b border-[#dfcca6]/50">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-notche font-bold text-slate-900 tracking-tight">
            Visit Our <span className="text-[#8b6914]">Bradford Showroom</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            17 Duckworth Lane, Bradford. Walk-ins & private VIP appointments welcome for gold bullion purchases, jewellery viewings, and instant scrap valuations.
          </p>
        </div>

        {/* Main Grid: Left Details & Right Google Maps */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
          
          {/* LEFT COLUMN: Showroom Details & Schedule (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Showroom Address Card */}
            <div className="bg-white border-2 border-[#dfcca6] rounded-2xl p-6 shadow-sm">
              <span className="text-[10px] font-bold text-[#8b6914] uppercase tracking-wider block font-notche">
                Flagship Destination
              </span>
              <h2 className="text-xl font-notche font-bold text-slate-900 mt-1">
                {findUs.addressFull}
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Located on Duckworth Lane. Ample free street parking & secure client entrance.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={handleCopyAddress}
                  className="px-4 py-2 rounded-lg bg-[#faf8f5] hover:bg-white border border-[#dfcca6] text-xs font-semibold text-stone-700 transition-colors shadow-2xs cursor-pointer"
                >
                  {copied ? "Address Copied! ✓" : "Copy Full Address"}
                </button>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(findUs.addressFull)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-[#8b6914] hover:bg-[#a67c1e] text-white text-xs font-notche font-bold tracking-wider transition-colors shadow-sm cursor-pointer"
                >
                  Get Directions in Google Maps →
                </a>
              </div>
            </div>

            {/* Opening Hours Schedule */}
            <div className="bg-white border-2 border-[#dfcca6] rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-100">
                <h3 className="font-notche font-bold text-slate-900 text-base">
                  Weekly Opening Schedule
                </h3>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Open Today
                </span>
              </div>

              <div className="space-y-2">
                {findUs.openingHours.map((item) => {
                  const isToday = item.day.toLowerCase() === currentDayName.toLowerCase();
                  return (
                    <div
                      key={item.day}
                      className={`flex items-center justify-between p-2.5 rounded-xl transition-colors ${
                        isToday
                          ? "bg-[#faf5ea] border border-[#dfcca6] font-bold"
                          : "hover:bg-stone-50 text-stone-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold">{item.day}</span>
                        {isToday && (
                          <span className="text-[9px] font-bold text-[#8b6914] bg-white px-1.5 py-0.2 rounded border border-[#dfcca6] uppercase font-notche">
                            Today
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-numbers font-semibold text-slate-900">
                        {item.hours}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Showroom Amenities */}
            <div className="grid grid-cols-2 gap-3">
              {findUs.amenities.map((amenity) => (
                <div
                  key={amenity.id}
                  className="p-3.5 rounded-xl bg-white border border-[#dfcca6]/60 shadow-2xs space-y-1"
                >
                  <div className="text-xl">{amenity.icon}</div>
                  <h4 className="text-xs font-notche font-bold text-slate-900">
                    {amenity.title}
                  </h4>
                  <p className="text-[11px] text-stone-500 leading-snug">
                    {amenity.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>

          {/* RIGHT COLUMN: Google Maps Embed (6 Cols) */}
          <div className="lg:col-span-6">
            <div className="sticky top-20 bg-white border-2 border-[#dfcca6] rounded-2xl overflow-hidden shadow-md">
              <div className="p-4 border-b border-[#dfcca6]/60 bg-[#faf8f5] flex items-center justify-between">
                <div>
                  <h3 className="font-notche font-bold text-slate-900 text-sm">
                    Interactive Bradford Map
                  </h3>
                  <p className="text-[11px] text-stone-500">17 Duckworth Lane, BD9 5ER</p>
                </div>
                <a
                  href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                  className="text-xs font-numbers font-bold text-[#8b6914] hover:underline"
                >
                  Call: {contact.phone}
                </a>
              </div>

              <div className="relative w-full h-[450px] sm:h-[550px] bg-stone-100">
                <iframe
                  title="Bhai Jewellers Location Map"
                  src={findUs.mapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
