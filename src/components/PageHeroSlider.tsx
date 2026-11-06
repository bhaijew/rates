"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { PageSlide, INITIAL_SITE_CONTENT } from "@/data/site-content";

export default function PageHeroSlider() {
  const [slides, setSlides] = useState<PageSlide[]>(INITIAL_SITE_CONTENT.slides);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch updated slides from admin content
  useEffect(() => {
    fetch("/api/admin/content")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.siteContent?.slides?.length > 0) {
          const activeSlides = data.data.siteContent.slides
            .filter((s: PageSlide) => s.active !== false)
            .sort((a: PageSlide, b: PageSlide) => (a.order || 0) - (b.order || 0));
          if (activeSlides.length > 0) {
            setSlides(activeSlides);
          }
        }
      })
      .catch((err) => console.error("Error loading slider:", err));
  }, []);

  // Auto-play interval
  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slides.length, isPaused]);

  if (slides.length === 0) return null;

  const currentSlide = slides[currentIndex] || slides[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <div
      className="relative w-full rounded-2xl sm:rounded-3xl border-2 border-[#dfcca6] bg-gradient-to-br from-[#faf6ee] via-white to-[#fbf7f0] shadow-[0_8px_30px_rgba(212,175,55,0.12)] overflow-hidden my-6 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Top 24K Metallic Gold Accent Strip */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#d4af37] via-[#f7e799] to-[#aa7c11] z-20" />

      {/* Main Slide Stage */}
      <div className="relative min-h-[260px] sm:min-h-[320px] md:min-h-[340px] flex flex-col md:flex-row items-center justify-between p-5 sm:p-8 md:p-10 gap-6">
        
        {/* Ambient Radial Spotlight */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_rgba(255,255,255,0.95)_0%,_rgba(251,245,234,0.4)_70%,_transparent_100%)] pointer-events-none" />

        {/* Left Side: Slide Details & CTA */}
        <div className="relative z-10 flex-1 max-w-xl text-center md:text-left">
          {currentSlide.tag && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold font-notche uppercase tracking-widest bg-white border border-[#dfcca6] text-[#8b6914] shadow-2xs mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {currentSlide.tag}
            </span>
          )}

          <h2 className="text-xl sm:text-3xl md:text-4xl font-notche font-bold text-slate-900 tracking-tight leading-tight">
            {currentSlide.title}
          </h2>

          <p className="text-xs sm:text-sm text-stone-600 font-medium mt-2 max-w-lg leading-relaxed">
            {currentSlide.subtitle}
          </p>

          <div className="mt-5 flex items-center justify-center md:justify-start gap-3">
            <Link
              href={currentSlide.linkUrl || "/offers"}
              className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-gradient-to-r from-[#7a5d28] via-[#8b6914] to-[#73582a] hover:from-[#664d1f] hover:to-[#5a441e] text-white font-notche font-bold text-xs sm:text-sm tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2"
            >
              <span>{currentSlide.buttonText || "Discover Collection"}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            <a
              href="https://wa.me/447735727897"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 sm:py-3 rounded-xl border border-[#dfcca6] bg-white hover:bg-[#faf5ea] text-stone-800 font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <span>Inquire</span>
            </a>
          </div>
        </div>

        {/* Right Side: Featured Slide Visual */}
        <div className="relative z-10 w-full md:w-auto flex items-center justify-center">
          <div className="relative w-52 h-44 sm:w-64 sm:h-52 md:w-72 md:h-60 rounded-2xl bg-gradient-to-b from-white via-[#faf6ee] to-[#f4ebd9] border-2 border-[#dfcca6]/70 p-3 sm:p-4 shadow-xl flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.9)_0%,_transparent_75%)] pointer-events-none" />
            <img
              src={currentSlide.imageUrl}
              alt={currentSlide.title}
              className="relative z-10 max-h-full max-w-full object-contain filter drop-shadow-lg transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-[#8b6914] border border-[#dfcca6] shadow-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
            aria-label="Previous Slide"
          >
            ‹
          </button>

          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-[#8b6914] border border-[#dfcca6] shadow-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
            aria-label="Next Slide"
          >
            ›
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/15 backdrop-blur-xs px-2.5 py-1 rounded-full">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                currentIndex === idx ? "w-6 bg-[#8b6914]" : "w-1.5 bg-stone-400 hover:bg-stone-600"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
