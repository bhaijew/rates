"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "Buy Investment Gold / Silver",
    message: "",
  });
  const [copied, setCopied] = useState(false);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText("+447735727897");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `*New Inquiry via Bhai Jewellers Website*%0A%0A*Name:* ${encodeURIComponent(formData.name || "Customer")}%0A*Phone:* ${encodeURIComponent(formData.phone || "Not provided")}%0A*Subject:* ${encodeURIComponent(formData.service)}%0A*Message:* ${encodeURIComponent(formData.message || "Hello, I would like to inquire about your jewellery / gold bullion rates.")}`;
    window.open(`https://wa.me/447735727897?text=${text}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] font-sans text-slate-800 pb-20 relative overflow-x-hidden">
      
      {/* Background Soft Luxury Marble Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-gradient-to-b from-[#f5ede0]/60 via-[#faf8f5]/30 to-transparent pointer-events-none -z-10" />

      {/* Top Gold Foil Accent Bar */}
      <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#caa771] to-transparent relative z-10 opacity-70" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        
        {/* Breadcrumb & Section Badge */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-[10.5px] font-bold text-[#8b6914] tracking-widest uppercase bg-[#faf5ea] px-3 py-1 rounded-[4px] border border-[#dfcca6] shadow-2xs flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Bradford Flagship Concierge · United Kingdom
          </span>
        </div>

        {/* Page Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto pb-8 border-b border-[#dfcca6]/50">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight font-serif">
            Contact <span className="text-[#8b6914]">Bhai Jewellers</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            Whether you are locking today&apos;s live gold bullion rate, valuing scrap gold, or custom ordering handcrafted 22K bridal jewellery, our Bradford specialists are ready to help.
          </p>
        </div>

        {/* Two-Column Professional Layout: Left Channels & Right Interactive Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
          
          {/* LEFT COLUMN: Direct Official Channels & Social Hub (7 Cols) */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* 1. WHATSAPP PRIORITY CARD */}
            <div className="bg-gradient-to-br from-white via-[#fafdfb] to-[#f4fbf6] border-2 border-emerald-300/80 rounded-[10px] p-5 sm:p-6 shadow-sm relative overflow-hidden group hover:border-emerald-400 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/40 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-[8px] bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base sm:text-lg font-bold text-slate-900">WhatsApp VIP Desk</h2>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Fastest Response
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mt-1 font-semibold flex items-center gap-1.5">
                      <span>+44 7735 727897</span>
                      <span>·</span>
                      <span className="text-emerald-700 font-bold">Instant Price Locking</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyPhone}
                    className="px-3 py-2 text-xs font-semibold rounded-[5px] bg-white border border-stone-200 text-slate-700 hover:bg-stone-50 transition-colors shadow-2xs"
                  >
                    {copied ? "Copied! ✓" : "Copy"}
                  </button>
                  <a
                    href="https://wa.me/447735727897?text=Hello%20Bhai%20Jewellers,%20I%20would%20like%20to%20inquire%20about%20your%20gold%20rates%20and%20jewellery."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[5px] bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all shadow-xs active:scale-95"
                  >
                    <span>Open Chat</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            </div>

            {/* 2. DUAL ROW: LANDLINE & EMAIL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Landline Card */}
              <div className="bg-white border-2 border-[#dfcca6] rounded-[10px] p-5 shadow-xs hover:border-[#caa771] transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-[6px] bg-[#faf5ea] border border-[#dfcca6] text-[#8b6914] flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Bradford Showroom</h3>
                    <p className="text-[11px] text-slate-500">Direct Telephone Desk</p>
                  </div>
                </div>
                <div className="text-base font-extrabold text-slate-900 tracking-tight mb-3">
                  01274 488801
                </div>
                <a
                  href="tel:01274488801"
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-[5px] bg-[#faf5ea] hover:bg-[#8b6914] text-[#8b6914] hover:text-white border border-[#dfcca6] text-xs font-bold transition-all shadow-2xs"
                >
                  <span>Call 01274 488801</span>
                </a>
              </div>

              {/* Email Card */}
              <div className="bg-white border-2 border-[#dfcca6] rounded-[10px] p-5 shadow-xs hover:border-[#caa771] transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-[6px] bg-[#faf5ea] border border-[#dfcca6] text-[#8b6914] flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Email Advisory</h3>
                    <p className="text-[11px] text-slate-500">Written Quotes & Orders</p>
                  </div>
                </div>
                <div className="text-sm font-extrabold text-slate-900 tracking-tight mb-3 truncate">
                  info@bhaijewellers.com
                </div>
                <a
                  href="mailto:info@bhaijewellers.com"
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-[5px] bg-[#faf5ea] hover:bg-[#8b6914] text-[#8b6914] hover:text-white border border-[#dfcca6] text-xs font-bold transition-all shadow-2xs"
                >
                  <span>Send Email</span>
                </a>
              </div>

            </div>

            {/* 3. SOCIAL MEDIA HUB: INSTAGRAM & TIKTOK */}
            <div className="bg-white border-2 border-[#dfcca6] rounded-[10px] p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#dfcca6]/40">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8b6914]">Social Community</span>
                  <span className="text-[10px] text-slate-500 font-medium">· Daily Video Showcases</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Active Feed
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Instagram Button */}
                <a
                  href="https://www.instagram.com/bhaijeweller/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-[8px] bg-gradient-to-r from-[#fdfbf8] to-[#fbf4eb] border border-[#dfcca6] hover:border-[#caa771] hover:shadow-xs transition-all flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-[6px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Instagram</span>
                    <span className="text-xs font-bold text-slate-900 group-hover:text-[#8b6914] transition-colors block">@bhaijeweller</span>
                  </div>
                </a>

                {/* TikTok Button */}
                <a
                  href="https://www.tiktok.com/@bhaijeweller"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-[8px] bg-gradient-to-r from-[#fdfbf8] to-[#fbf4eb] border border-[#dfcca6] hover:border-black hover:shadow-xs transition-all flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-[6px] bg-black text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.77 1.81-.07 3.25-1.55 3.32-3.36.07-2.6.02-5.2.03-7.8.01-4.38.01-8.77.02-13.15z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">TikTok</span>
                    <span className="text-xs font-bold text-slate-900 group-hover:text-black transition-colors block">@bhaijeweller</span>
                  </div>
                </a>
              </div>
            </div>

            {/* 4. PHYSICAL SHOWROOM QUICK BANNER */}
            <div className="p-4 rounded-[8px] bg-[#faf5ea] border border-[#dfcca6] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#8b6914] text-white flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 fill-none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">17 Duckworth Lane, Bradford, BD9 5ER</div>
                  <div className="text-[11px] text-slate-500">Open 7 Days: 11:00 AM – 7:00 PM</div>
                </div>
              </div>
              <Link
                href="/find-us"
                className="text-xs font-bold text-[#8b6914] hover:underline shrink-0 whitespace-nowrap"
              >
                Map & Directions →
              </Link>
            </div>

          </div>

          {/* RIGHT COLUMN: Interactive Direct Consultation Form (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white border-2 border-[#dfcca6] rounded-[10px] p-6 sm:p-7 shadow-sm sticky top-24">
              
              <div className="border-b border-[#dfcca6]/50 pb-4 mb-5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#8b6914] mb-1">
                  <span>✦ Direct Consultation</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-serif">
                  Send An Inquiry
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Submit details below to connect directly with our gold trading desk.
                </p>
              </div>

              <form onSubmit={handleSubmitWhatsApp} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mohammed Khan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#faf8f5] border border-stone-200 rounded-[5px] px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#8b6914] focus:bg-white transition-all"
                  />
                </div>

                {/* Phone / WhatsApp */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 07123 456789"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#faf8f5] border border-stone-200 rounded-[5px] px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#8b6914] focus:bg-white transition-all"
                  />
                </div>

                {/* Subject / Service Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Inquiry Subject
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full bg-[#faf8f5] border border-stone-200 rounded-[5px] px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#8b6914] focus:bg-white transition-all"
                  >
                    <option value="Buy Investment Gold / Silver">Buy Investment Gold / Silver Bars</option>
                    <option value="Sell Scrap Gold Bullion">Sell Your Scrap Gold / Bullion</option>
                    <option value="22K Bridal Jewellery Consultation">22K Bridal Jewellery Consultation</option>
                    <option value="Zakat & Precious Metal Valuation">Zakat & Metal Valuation</option>
                    <option value="Showroom Visit Appointment">Showroom Visit Appointment</option>
                    <option value="General Question">General Inquiry</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Message / Requirements
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Please specify weight, karat or specific designs you require..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#faf8f5] border border-stone-200 rounded-[5px] px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#8b6914] focus:bg-white transition-all resize-none"
                  />
                </div>

                {/* Submit via WhatsApp CTA */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-[6px] bg-gradient-to-r from-[#8b6914] via-[#9c8254] to-[#73582a] hover:from-[#73582a] hover:to-[#57411c] text-white text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  <span>Submit Inquiry On WhatsApp</span>
                </button>
              </form>

              {/* Security & Reassurance Tag */}
              <div className="mt-4 pt-3 border-t border-[#dfcca6]/40 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="text-emerald-600">✓</span> 100% Confidential
                </span>
                <span>Response in ~15 mins</span>
              </div>

            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
