"use client";

import React from "react";

export default function ContactPage() {
  // Realistic SVG QR Code Placeholder Pattern
  const QRCodePlaceholder = ({ seed = 1 }: { seed?: number }) => (
    <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white rounded-xl p-2 border border-stone-200 shadow-xs flex items-center justify-center mx-auto">
      <svg className="w-full h-full text-stone-900" viewBox="0 0 100 100" fill="currentColor">
        {/* Top-Left Position Detection Pattern */}
        <rect x="5" y="5" width="26" height="26" rx="2" fill="none" stroke="currentColor" strokeWidth="3" />
        <rect x="11" y="11" width="14" height="14" rx="1" />
        
        {/* Top-Right Position Detection Pattern */}
        <rect x="69" y="5" width="26" height="26" rx="2" fill="none" stroke="currentColor" strokeWidth="3" />
        <rect x="75" y="11" width="14" height="14" rx="1" />
        
        {/* Bottom-Left Position Detection Pattern */}
        <rect x="5" y="69" width="26" height="26" rx="2" fill="none" stroke="currentColor" strokeWidth="3" />
        <rect x="11" y="75" width="14" height="14" rx="1" />

        {/* Dummy Data Matrix Grid Nodes */}
        <rect x="36" y="8" width="5" height="5" />
        <rect x="46" y="8" width="5" height="5" />
        <rect x="56" y="8" width="5" height="5" />
        <rect x="36" y="18" width="5" height="5" />
        <rect x="46" y="24" width="8" height="5" />
        <rect x="58" y="16" width="6" height="6" />

        <rect x="8" y="36" width="5" height="5" />
        <rect x="16" y="42" width="6" height="6" />
        <rect x="24" y="36" width="5" height="5" />
        <rect x="8" y="52" width="6" height="6" />
        <rect x="20" y="54" width="6" height="6" />

        <rect x="36" y="36" width="7" height="7" />
        <rect x="48" y="36" width="5" height="5" />
        <rect x="58" y="36" width="6" height="6" />
        <rect x="36" y="48" width="6" height="6" />
        <rect x="46" y="46" width="8" height="8" />
        <rect x="58" y="48" width="6" height="6" />

        <rect x="69" y="38" width="6" height="6" />
        <rect x="80" y="42" width="8" height="5" />
        <rect x="72" y="52" width="6" height="6" />
        <rect x="84" y="52" width="5" height="5" />

        <rect x="38" y="68" width="5" height="5" />
        <rect x="48" y="68" width="6" height="6" />
        <rect x="58" y="74" width="6" height="6" />
        <rect x="40" y="80" width="8" height="5" />
        <rect x="52" y="82" width="6" height="6" />

        <rect x="70" y="68" width="6" height="6" />
        <rect x="80" y="70" width="6" height="6" />
        <rect x="72" y="80" width="6" height="6" />
        <rect x="82" y="80" width="6" height="6" />
        <rect x="90" y="72" width="5" height="12" />
      </svg>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#faf8f4] font-sans text-stone-800 pb-24 sm:pb-32">
      
      {/* Background Soft Luxury Marble Glow */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-[#f3ece0]/60 via-[#f8f4ed]/30 to-transparent pointer-events-none -z-10" />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16">
        
        {/* Header Section (Matching Image) */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#745511] font-serif tracking-tight">
            Contact Us
          </h1>
          <div className="text-[11px] sm:text-xs font-bold tracking-widest text-stone-400 uppercase">
            CONNECT WITH BHAI JEWELLERS
          </div>
          <div className="text-amber-600 text-sm py-0.5">
            ✦
          </div>
          <p className="text-xs sm:text-sm text-stone-600 font-medium max-w-md mx-auto">
            We&apos;re here to help with your jewellery, gold and bullion enquiries.
          </p>
        </div>

        {/* Top 3 Cards Grid: WhatsApp, Instagram, TikTok */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-6 mt-16 sm:mt-20">
          
          {/* 1. WHATSAPP CARD */}
          <div className="relative bg-gradient-to-b from-[#fbf9f5] to-[#f6f1e7] border-2 border-[#dfcca6] rounded-[20px] p-6 pt-9 text-center shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            {/* Top Floating Circular Badge (Real WhatsApp Logo) */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-md border-2 border-white">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-stone-900">WhatsApp</h3>
              <p className="text-xs text-stone-500 font-semibold tracking-wide">+44 7735 727897</p>
            </div>

            {/* Action Button */}
            <div className="my-4">
              <a
                href="https://wa.me/447735727897"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold transition-colors shadow-xs"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                </svg>
                <span>Message Us</span>
              </a>
            </div>

            {/* QR Code Container */}
            <div className="space-y-2">
              <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white rounded-xl p-2 border border-stone-200 shadow-xs flex items-center justify-center mx-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https%3A%2F%2Fwa.me%2F447735727897"
                  alt="WhatsApp QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-[10px] font-bold tracking-widest text-stone-400 uppercase">
                SCAN TO CHAT
              </div>
            </div>
          </div>

          {/* 2. INSTAGRAM CARD */}
          <div className="relative bg-gradient-to-b from-[#fbf9f5] to-[#f6f1e7] border-2 border-[#dfcca6] rounded-[20px] p-6 pt-9 text-center shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            {/* Top Floating Circular Badge (Real Instagram Logo) */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shadow-md border-2 border-white">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-stone-900">Instagram</h3>
              <p className="text-xs text-[#8b6914] font-bold tracking-wide">@bhaijeweller</p>
            </div>

            {/* Action Button */}
            <div className="my-4">
              <a
                href="https://www.instagram.com/bhaijeweller/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-5 rounded-full bg-gradient-to-r from-[#dc2743] to-[#bc1888] hover:opacity-90 text-white text-xs font-bold transition-opacity shadow-xs"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
                </svg>
                <span>Follow @bhaijeweller</span>
              </a>
            </div>

            {/* QR Code Container */}
            <div className="space-y-2">
              <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white rounded-xl p-2 border border-stone-200 shadow-xs flex items-center justify-center mx-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https%3A%2F%2Fwww.instagram.com%2Fbhaijeweller%2F"
                  alt="Instagram QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-[10px] font-bold tracking-widest text-stone-400 uppercase">
                SCAN TO FOLLOW
              </div>
            </div>
          </div>

          {/* 3. TIKTOK CARD */}
          <div className="relative bg-gradient-to-b from-[#fbf9f5] to-[#f6f1e7] border-2 border-[#dfcca6] rounded-[20px] p-6 pt-9 text-center shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            {/* Top Floating Circular Badge (Real TikTok Logo) */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#010101] text-white flex items-center justify-center shadow-md border-2 border-white">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.77 1.81-.07 3.25-1.55 3.32-3.36.07-2.6.02-5.2.03-7.8.01-4.38.01-8.77.02-13.15z"/>
              </svg>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-stone-900">TikTok</h3>
              <p className="text-xs text-[#8b6914] font-bold tracking-wide">@bhaijeweller</p>
            </div>

            {/* Action Button */}
            <div className="my-4">
              <a
                href="https://www.tiktok.com/@bhaijeweller"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-5 rounded-full bg-black hover:bg-stone-800 text-white text-xs font-bold transition-colors shadow-xs"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.77 1.81-.07 3.25-1.55 3.32-3.36.07-2.6.02-5.2.03-7.8.01-4.38.01-8.77.02-13.15z"/>
                </svg>
                <span>Follow on TikTok</span>
              </a>
            </div>

            {/* QR Code Container */}
            <div className="space-y-2">
              <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white rounded-xl p-2 border border-stone-200 shadow-xs flex items-center justify-center mx-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https%3A%2F%2Fwww.tiktok.com%2F%40bhaijeweller"
                  alt="TikTok QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-[10px] font-bold tracking-widest text-stone-400 uppercase">
                SCAN TO FOLLOW
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Cards Grid: Landline, Email & Bradford Store Address */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-6 mt-12 sm:mt-16 max-w-5xl mx-auto">
          
          {/* 4. LANDLINE CARD */}
          <div className="relative bg-gradient-to-b from-[#fbf9f5] to-[#f6f1e7] border-2 border-[#dfcca6] rounded-[20px] p-6 pt-9 text-center shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            {/* Top Floating Circular Badge */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#9c8254] text-white flex items-center justify-center shadow-md border-2 border-white">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1.02 1.02 0 00-1.02.24l-2.2 2.2a15.045 15.045 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.25-1A11.36 11.36 0 018.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1zM19 12h2a9 9 0 00-9-9v2a7 7 0 017 7zm-4 0h2a5 5 0 00-5-5v2a3 3 0 013 3z"/>
              </svg>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-stone-900">Bradford Landline</h3>
              <p className="text-xs text-stone-600 font-bold tracking-wide">01274 488801</p>
            </div>

            {/* Action Button */}
            <div className="mt-4">
              <a
                href="tel:01274488801"
                className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-5 rounded-full bg-[#7a5b13] hover:bg-[#63480a] text-white text-xs font-bold transition-colors shadow-xs"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                <span>Call 01274 488801</span>
              </a>
            </div>
          </div>

          {/* 5. EMAIL CARD */}
          <div className="relative bg-gradient-to-b from-[#fbf9f5] to-[#f6f1e7] border-2 border-[#dfcca6] rounded-[20px] p-6 pt-9 text-center shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            {/* Top Floating Circular Badge */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#9c8254] text-white flex items-center justify-center shadow-md border-2 border-white">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-stone-900">Email Us</h3>
              <p className="text-xs text-stone-500 font-semibold tracking-wide">info@bhaijewellers.com</p>
            </div>

            {/* Action Button */}
            <div className="mt-4">
              <a
                href="mailto:info@bhaijewellers.com"
                className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-5 rounded-full bg-[#7a5b13] hover:bg-[#63480a] text-white text-xs font-bold transition-colors shadow-xs"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <span>Email Us</span>
              </a>
            </div>
          </div>

          {/* 6. BRADFORD SHOWROOM ADDRESS CARD */}
          <div className="relative bg-gradient-to-b from-[#fbf9f5] to-[#f6f1e7] border-2 border-[#dfcca6] rounded-[20px] p-6 pt-9 text-center shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            {/* Top Floating Circular Badge */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#8b6914] text-white flex items-center justify-center shadow-md border-2 border-white">
              <svg className="w-5 h-5 fill-none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-stone-900">Bradford Showroom</h3>
              <p className="text-xs text-stone-600 font-semibold leading-relaxed">
                17 Duckworth Lane, Bradford, BD9 5ER
              </p>
            </div>

            {/* Action Button */}
            <div className="mt-4">
              <a
                href="/find-us"
                className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-5 rounded-full bg-[#7a5b13] hover:bg-[#63480a] text-white text-xs font-bold transition-colors shadow-xs"
              >
                <span>View Real Location & Map →</span>
              </a>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
