"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import BLogo from "@/components/BLogo";

export default function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsDrawerOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isDrawerOpen]);

  // Clean, classic outline icons matching user reference
  const sliderMenuItems = [
    {
      label: "Live Rate",
      href: "/",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 17l6-6 4 4 8-8m0 0h-6m6 0v6" />
        </svg>
      ),
    },
    {
      label: "Gold Bars / Coins",
      href: "/gold-bars",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="8" cy="8" r="6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M18.09 10.37A6 6 0 1 1 10.34 18" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M7 6h1v4" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="m16.71 13.88.7.71-2.82 2.82" />
        </svg>
      ),
    },
    {
      label: "Sell Bullion",
      href: "/sell-bullion",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" />
          <circle cx="16" cy="9" r="2.8" strokeWidth="1.8" />
        </svg>
      ),
    },
    {
      label: "Sell Your Scrap Gold",
      href: "/sell-your-gold",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="2" y="6" width="20" height="12" rx="2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="2.5" strokeWidth="1.8" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M6 12h.01M18 12h.01" />
        </svg>
      ),
    },
    {
      label: "Silver Bars / Coins",
      href: "/silver",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      ),
    },
    {
      label: "Offers",
      href: "/offers",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M7.5 7.5h.01M3 13.5V6a3 3 0 013-3h7.5a3 3 0 012.12.88l6.5 6.5a3 3 0 010 4.24l-6.5 6.5a3 3 0 01-4.24 0L3.88 15.62A3 3 0 013 13.5z" />
        </svg>
      ),
    },
    {
      label: "Zakat Calculator",
      href: "/zakat",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 3v17m-6-12l-3 5h6l-3-5zm12 0l-3 5h6l-3-5zM3 16a3 3 0 006 0m6 0a3 3 0 006 0M6 20h12" />
        </svg>
      ),
    },
    {
      label: "Contact Us",
      href: "/contact",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
    },
    {
      label: "Find Us",
      href: "/find-us",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 21s-6-5.686-6-10a6 6 0 1112 0c0 4.314-6 10-6 10z" />
          <circle cx="12" cy="11" r="2.5" strokeWidth="1.8" />
        </svg>
      ),
    },
    {
      label: "Privacy Policy",
      href: "/privacy-policy",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 3s7 3 7 8c0 5-4 8.5-7 10-3-1.5-7-5-7-10 0-5 7-8 7-8z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9.5 12l2 2 3.5-3.5" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Top Header: Simple White Theme, ONLY Home Link & Slider Button */}
      <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-40" suppressHydrationWarning>
        <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 sm:h-20 flex items-center justify-between" suppressHydrationWarning>
          
          {/* Left: Square 5px Slider Button + Shop Name */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Square 5px Slider Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open Slider Menu"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-[5px] border-2 border-[#dfcca6] bg-white hover:bg-[#faf7f2] flex flex-col items-center justify-center gap-[4.5px] p-2 transition-all duration-200 shadow-xs hover:scale-105 active:scale-95 group focus:outline-none shrink-0"
            >
              <span className="w-5 h-[2.5px] rounded-[1px] bg-[#9c8254] group-hover:bg-[#856b3e] transition-colors" />
              <span className="w-5 h-[2.5px] rounded-[1px] bg-[#9c8254] group-hover:bg-[#856b3e] transition-colors" />
              <span className="w-5 h-[2.5px] rounded-[1px] bg-[#9c8254] group-hover:bg-[#856b3e] transition-colors" />
            </button>

            {/* B Letter Logo + Shop Name */}
            <Link
              href="/"
              aria-label="Bhai Jeweller Home"
              className="flex items-center gap-2.5 sm:gap-3 group transition-transform duration-200 hover:opacity-90 shrink-0"
            >
              <BLogo showBadge />
              <span className="text-base sm:text-2xl font-bold tracking-tight text-gray-900 group-hover:text-[#9c8254] transition-colors truncate">
                Bhai Jeweller
              </span>
            </Link>
          </div>

          {/* Navigation Bar: ONLY Home link as requested */}
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className={`text-xs sm:text-sm font-semibold transition-colors ${
                (mounted && pathname === "/") ? "text-[#8b6914] font-bold" : "text-gray-800 hover:text-[#9c8254]"
              }`}
            >
              Home
            </Link>
          </nav>

          {/* Right: Contact CTA */}
          <div className="flex items-center gap-2">
            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm font-semibold px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-[5px] bg-black hover:bg-[#9c8254] text-white transition-colors duration-200 shadow-xs whitespace-nowrap"
            >
              Contact
            </a>
          </div>

        </div>
      </header>

      {/* Side Slider / Drawer Backdrop Overlay */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isDrawerOpen
            ? "opacity-100 pointer-events-auto bg-black/40 backdrop-blur-xs"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Side Drawer: Fully Mobile Responsive & Square 5px UI */}
      <aside
        suppressHydrationWarning
        className={`fixed top-0 left-0 h-full w-[85vw] max-w-[320px] sm:w-[330px] bg-white z-50 shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-in-out border-r border-gray-100 ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 pb-3 flex items-center justify-between border-b border-gray-100 shrink-0">
          
          {/* Brand Emblem */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[5px] border-2 border-[#dfcca6] bg-white p-1 flex items-center justify-center shadow-xs">
              <div className="w-full h-full rounded-[3px] bg-[#fdfbf7] flex items-center justify-center">
                <BLogo className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
            </div>
            <div>
              <div className="font-bold text-gray-900 text-sm leading-snug">
                Bhai Jeweller
              </div>
              <div className="text-[11px] text-gray-400 font-medium">Bhai Jeweller UK</div>
            </div>
          </div>

          {/* Square 5px Close Button */}
          <button
            onClick={() => setIsDrawerOpen(false)}
            aria-label="Close slider"
            className="w-9 h-9 rounded-[5px] border border-[#dfcca6] bg-white text-gray-600 hover:text-black hover:border-gray-400 flex items-center justify-center transition-all duration-200 shadow-xs"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer Menu Links - Active state becomes solid gold pill like screenshot */}
        <div 
          className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {sliderMenuItems.map((item) => {
            const isActive = mounted ? (pathname === item.href) : false;

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsDrawerOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-2.5 rounded-[5px] text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-[#8b6914] text-white shadow-xs"
                    : "text-gray-700 hover:text-[#8b6914] hover:bg-[#faf7f2]"
                }`}
              >
                {/* Clean Outline Icon */}
                <span className={`shrink-0 ${isActive ? "text-white" : "text-gray-600"}`}>
                  {item.icon}
                </span>

                {/* Item Label */}
                <span className="flex-1 text-[13.5px]">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Drawer Footer with UK Live Rate Summary & Square 5px Button */}
        <div className="p-4 border-t border-gray-100 bg-white shrink-0 space-y-2.5">
          {/* Quick UK Gold Rate Pill */}
          <div className="p-2.5 rounded-[5px] bg-[#faf8f5] border border-[#dfcca6]/60">
            <div className="flex items-center justify-between text-[11px] font-semibold text-gray-500">
              <span className="flex items-center gap-1.5 text-gray-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Gold Spot (GBP)
              </span>
              <span className="text-[#8b6914] font-bold">£96.61 / g</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-600 mt-1">
              <span>Per tola (11.66g):</span>
              <span className="font-bold text-gray-900">£1,126.84</span>
            </div>
          </div>

          <a
            href="https://wa.me/923001234567"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#9c8254] hover:bg-[#856b3e] text-white py-2.5 rounded-[5px] text-xs font-semibold shadow-xs transition-colors"
          >
            <span>WhatsApp UK Helpline</span>
          </a>
        </div>
      </aside>
    </>
  );
}
