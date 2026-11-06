"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { INITIAL_SITE_CONTENT, SiteContent } from "@/data/site-content";

export default function ContactPage() {
  const [content, setContent] = useState<SiteContent>(INITIAL_SITE_CONTENT);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "Buy Investment Gold / Silver",
    message: "",
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data?.siteContent) {
          setContent(res.data.siteContent);
        }
      })
      .catch(() => {});
  }, []);

  const contact = content.contact;

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(contact.whatsapp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanWa = contact.whatsapp.replace(/[^0-9]/g, "");
    const text = `*New Inquiry via Bhai Jewellers Website*%0A%0A*Name:* ${encodeURIComponent(
      formData.name || "Customer"
    )}%0A*Phone:* ${encodeURIComponent(formData.phone || "Not provided")}%0A*Subject:* ${encodeURIComponent(
      formData.service
    )}%0A*Message:* ${encodeURIComponent(
      formData.message || "Hello, I would like to inquire about your jewellery / gold bullion rates."
    )}`;
    window.open(`https://wa.me/${cleanWa}?text=${text}`, "_blank");
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
          <span className="text-[10.5px] font-bold text-[#8b6914] tracking-widest uppercase bg-[#faf5ea] px-3 py-1 rounded-[4px] border border-[#dfcca6] shadow-2xs flex items-center gap-1.5 font-notche">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Bradford Flagship Concierge · United Kingdom
          </span>
        </div>

        {/* Page Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto pb-8 border-b border-[#dfcca6]/50">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-notche font-bold text-slate-900 tracking-tight">
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
                      <h2 className="text-base sm:text-lg font-notche font-bold text-slate-900">WhatsApp VIP Desk</h2>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Fastest Response
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mt-1 font-semibold flex items-center gap-1.5 font-numbers">
                      <span>{contact.whatsapp}</span>
                      <span>·</span>
                      <span className="text-emerald-700 font-bold">Instant Price Locking</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyPhone}
                    className="px-3 py-2 text-xs font-semibold rounded-[5px] bg-white border border-stone-200 text-slate-700 hover:bg-stone-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    {copied ? "Copied! ✓" : "Copy"}
                  </button>
                  <a
                    href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, "")}?text=Hello%20Bhai%20Jewellers,%20I%20would%20like%20to%20inquire%20about%20your%20gold%20rates%20and%20jewellery.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[5px] bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-notche font-bold tracking-wider transition-all shadow-xs active:scale-95 cursor-pointer"
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
                    <h3 className="text-sm font-notche font-bold text-slate-900">Bradford Showroom</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Direct Telephone</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <a
                    href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                    className="text-base sm:text-lg font-numbers font-bold text-slate-900 hover:text-[#8b6914] transition-colors block"
                  >
                    {contact.phone}
                  </a>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    {contact.openingHoursSummary}
                  </p>
                </div>
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
                    <h3 className="text-sm font-notche font-bold text-slate-900">Email Inquiries</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Bullion Desk</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-sm sm:text-base font-bold text-slate-900 hover:text-[#8b6914] transition-colors block truncate"
                  >
                    {contact.email}
                  </a>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Formal invoices & B2B trade inquiries
                  </p>
                </div>
              </div>

            </div>

            {/* 3. SHOWROOM LOCATION SUMMARY */}
            <div className="bg-white border border-[#dfcca6] rounded-[10px] p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-[#8b6914] uppercase tracking-wider block font-notche">
                  Flagship Showroom
                </span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {contact.addressLine1}, {contact.city}, {contact.postcode}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Walk-ins & appointments welcome. Free street parking available.
                </p>
              </div>

              <Link
                href="/find-us"
                className="px-4 py-2 rounded-lg border border-[#dfcca6] bg-[#faf8f5] hover:bg-white text-slate-800 text-xs font-notche font-bold tracking-wider transition-colors shrink-0 shadow-2xs"
              >
                View Directions & Map →
              </Link>
            </div>

          </div>

          {/* RIGHT COLUMN: Interactive Form */}
          <div className="lg:col-span-5">
            <div className="bg-white border-2 border-[#dfcca6] rounded-[12px] p-6 sm:p-7 shadow-sm">
              <h2 className="text-lg sm:text-xl font-notche font-bold text-slate-900 mb-1">
                Send Direct Inquiry
              </h2>
              <p className="text-xs text-slate-500 mb-5">
                Fill the details below to start a verified WhatsApp session with our Bradford team.
              </p>

              <form onSubmit={handleSubmitWhatsApp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariq Ahmed"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#dfcca6] bg-[#faf8f5] focus:outline-none focus:ring-1 focus:ring-[#8b6914]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Phone / Contact Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 07700 900123"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#dfcca6] bg-[#faf8f5] font-numbers focus:outline-none focus:ring-1 focus:ring-[#8b6914]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Subject / Service Required
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#dfcca6] bg-[#faf8f5] focus:outline-none focus:ring-1 focus:ring-[#8b6914]"
                  >
                    <option>Buy Investment Gold / Silver</option>
                    <option>Sell Scrap Gold (Scrap Valuation)</option>
                    <option>22K Bridal Jewellery Consultation</option>
                    <option>Live Spot Rate Lock-In</option>
                    <option>Zakat Calculation Assistance</option>
                    <option>Other Showroom Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Message / Item Details
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Please specify weight, karat, or any questions..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-[#dfcca6] bg-[#faf8f5] focus:outline-none focus:ring-1 focus:ring-[#8b6914]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7a5d28] via-[#8b6914] to-[#73582a] hover:from-[#664d1f] hover:to-[#5a441e] text-white font-notche font-bold tracking-wider text-xs shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  <span>CONNECT ON WHATSAPP</span>
                </button>
              </form>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
