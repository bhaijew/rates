"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { DAILY_OFFERS, OfferItem } from "@/data/offers";
import { InstagramStoryItem } from "@/app/api/instagram-stories/route";

interface UnifiedShowcaseItem {
  id: string;
  ref: string;
  title: string;
  specs: string;
  priceFormatted?: string;
  date: string;
  imageUrl: string;
  fullPicUrl: string;
  videoUrl?: string | null;
  isVideo: boolean;
  link: string;
  source: "instagram" | "catalogue";
  description?: string;
  category?: string;
}

export default function OffersShowcase() {
  const [liveStories, setLiveStories] = useState<UnifiedShowcaseItem[]>([]);
  const [catalogueItems, setCatalogueItems] = useState<UnifiedShowcaseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(1);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const thumbnailContainerRef = useRef<HTMLDivElement>(null);
  const mainStageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Initialize catalogue offers
  useEffect(() => {
    const mappedCatalogue: UnifiedShowcaseItem[] = DAILY_OFFERS.map((item: OfferItem) => ({
      id: `cat-${item.id}`,
      ref: item.ref,
      title: item.title,
      specs: item.specs,
      priceFormatted: item.formattedPrice,
      date: item.date,
      imageUrl: item.image,
      fullPicUrl: item.image,
      videoUrl: null,
      isVideo: false,
      link: "https://www.instagram.com/bhaijeweller",
      source: "catalogue",
      description: item.description,
      category: item.category,
    }));
    setCatalogueItems(mappedCatalogue);
  }, []);

  // Fetch real Instagram stories from @bhaijeweller
  useEffect(() => {
    let isMounted = true;
    async function fetchStories() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/instagram-stories");
        if (!res.ok) throw new Error("Failed to fetch stories");
        const data = await res.json();

        if (isMounted && data.success && Array.isArray(data.stories) && data.stories.length > 0) {
          const mapped: UnifiedShowcaseItem[] = data.stories.map(
            (story: InstagramStoryItem, idx: number) => ({
              id: story.id,
              ref: story.ref || `BJ-ST${idx + 1}`,
              title: story.caption ? story.caption.slice(0, 40) : `Live Showroom Story #${idx + 1}`,
              specs: story.isVideo ? "Video Story · Bradford Showroom" : "22K/24K Jewellery Story",
              date: story.dateFormatted,
              imageUrl: story.imageUrl,
              fullPicUrl: story.fullPicUrl || story.imageUrl,
              videoUrl: story.videoUrl,
              isVideo: story.isVideo,
              link: story.link || "https://www.instagram.com/bhaijeweller",
              source: "instagram",
              description:
                story.caption ||
                "Live showroom daily update from Bhai Jewellers Bradford. Inquire directly on WhatsApp for availability and current spot price.",
            })
          );
          setLiveStories(mapped);
          setActiveIndex(0);
        }
      } catch (err) {
        console.warn("Could not load live stories, fallback to catalogue:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchStories();
    return () => {
      isMounted = false;
    };
  }, []);

  // Current items list: Live Instagram stories (with backup if offline)
  const items = liveStories.length > 0 ? liveStories : catalogueItems;
  const currentItem = items[activeIndex] || items[0];
  const totalItems = items.length;

  // WhatsApp click handler
  const getWhatsAppUrl = useCallback((item: UnifiedShowcaseItem) => {
    const isLive = item.source === "instagram";
    const message = encodeURIComponent(
      `Hello Bhai Jewellers,\n\nI saw your ${
        isLive ? "live Instagram story" : "Today's Offer"
      } on your website:\n• Ref: ${item.ref}\n• Item: ${item.title}\n• Date: ${item.date}${
        item.priceFormatted ? `\n• Price: ${item.priceFormatted}` : ""
      }\n\nIs this piece currently available in your Bradford showroom? Thank you!`
    );
    return `https://wa.me/447735727897?text=${message}`;
  }, []);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
  }, [totalItems]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
  }, [totalItems]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") {
        setIsLightboxOpen(false);
        setLightboxZoom(1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  // Scroll active thumbnail into view
  useEffect(() => {
    if (thumbnailContainerRef.current) {
      const activeEl = thumbnailContainerRef.current.querySelector(
        `[data-thumb-index="${activeIndex}"]`
      ) as HTMLElement | null;
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [activeIndex]);

  // Auto-play timer (stories mode)
  useEffect(() => {
    if (!isAutoPlay || isLightboxOpen || isZooming) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5500);
    return () => clearInterval(timer);
  }, [isAutoPlay, isLightboxOpen, isZooming, handleNext]);

  // Mouse move handler for hover zoom
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mainStageRef.current || currentItem?.isVideo) return;
    const rect = mainStageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  return (
    <section className="relative w-full py-6 sm:py-10 overflow-hidden">
      {/* Golden Luxury Bokeh Lights Background - exactly like Image 2 */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-gradient-to-tr from-[#dfcca6]/35 to-transparent blur-3xl opacity-70" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#d4af37]/25 to-transparent blur-3xl opacity-60" />
        <div className="absolute top-1/2 right-10 w-72 h-72 rounded-full bg-[#fbf5ea]/80 blur-2xl opacity-80" />
        
        {/* Subtle bokeh light orbs */}
        <div className="absolute top-16 right-[20%] w-24 h-24 rounded-full bg-white/40 blur-xl" />
        <div className="absolute top-40 right-[15%] w-16 h-16 rounded-full bg-[#caa771]/20 blur-lg" />
        <div className="absolute bottom-24 right-[10%] w-32 h-32 rounded-full bg-white/35 blur-2xl" />
        <div className="absolute bottom-1/3 left-[5%] w-20 h-20 rounded-full bg-[#dfcca6]/30 blur-xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Subtitle at top: "Discover our latest jewellery & gold offers" with Notche font */}
        <div className="text-center mb-6">
          <p className="text-xs sm:text-sm text-[#7a5d28] font-notche uppercase tracking-[0.22em] font-bold">
            Discover our latest jewellery & gold offers
          </p>
        </div>

        {/* Loading State Skeleton */}
        {isLoading && liveStories.length === 0 ? (
          <div className="w-full h-96 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-3 border-[#caa771] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-stone-600 font-medium">Loading live Instagram stories...</p>
            </div>
          </div>
        ) : (
          /* Main 3-Column Luxury Showcase (Image 2 Replica) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            {/* ======================================================== */}
            {/* LEFT COLUMN: Vertical Thumbnail Gallery                  */}
            {/* ======================================================== */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <div
                ref={thumbnailContainerRef}
                className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto max-h-[480px] sm:max-h-[580px] p-1.5 scrollbar-thin scrollbar-thumb-[#dfcca6]/80 scrollbar-track-transparent"
              >
                {items.map((item, idx) => {
                  const isSelected = idx === activeIndex;

                  return (
                    <button
                      key={item.id}
                      data-thumb-index={idx}
                      onClick={() => setActiveIndex(idx)}
                      className={`group relative shrink-0 w-16 h-22 sm:w-20 sm:h-26 lg:w-full lg:h-28 rounded-xl overflow-hidden transition-all duration-300 text-left cursor-pointer border ${
                        isSelected
                          ? "border-[#8b6914] ring-2 ring-[#d4af37]/60 shadow-md scale-[1.03] z-10"
                          : "border-stone-200/80 bg-white/60 hover:border-[#caa771] hover:scale-[1.01] opacity-75 hover:opacity-100"
                      }`}
                      title={`${item.title} - ${item.ref}`}
                    >
                      <div className="relative w-full h-full bg-[#faf6f0]">
                        {/* Real Story Thumbnail Image */}
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />

                        {/* Video Story Indicator */}
                        {item.isVideo && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/70 backdrop-blur-xs flex items-center justify-center text-white">
                            <svg className="w-2.5 h-2.5 fill-current ml-0.5" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        )}

                        {/* Price or Ref Watermark */}
                        <div className="absolute bottom-1 right-1 bg-black/65 backdrop-blur-xs text-[9px] font-bold text-amber-200 px-1 py-0.5 rounded leading-none font-numbers">
                          {item.priceFormatted || item.ref}
                        </div>

                        {/* Active Selection Indicator */}
                        {isSelected && (
                          <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 rounded-full bg-[#8b6914] ring-2 ring-white animate-pulse" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ======================================================== */}
            {/* MIDDLE COLUMN: Featured Image/Video Story Stage           */}
            {/* ======================================================== */}
            <div className="lg:col-span-6 order-1 lg:order-2 flex justify-center">
              <div className="relative w-full max-w-[420px] aspect-[9/13.5] bg-[#faf6f0] rounded-2xl sm:rounded-3xl border-2 border-[#dfcca6]/80 shadow-[0_12px_40px_-10px_rgba(139,105,20,0.18)] overflow-hidden group select-none">
                
                {/* Story Dash Progress Bar at Top (Instagram Stories style) */}
                <div className="absolute top-2.5 left-3 right-3 z-30 flex gap-1 pointer-events-none">
                  {Array.from({ length: Math.min(20, totalItems) }).map((_, idx) => {
                    const isPast = idx < activeIndex;
                    const isCurrent = idx === activeIndex;
                    return (
                      <div
                        key={idx}
                        className="h-1 flex-1 rounded-full overflow-hidden bg-white/45 backdrop-blur-xs"
                      >
                        <div
                          className={`h-full transition-all duration-300 ${
                            isPast
                              ? "bg-amber-400 w-full"
                              : isCurrent
                              ? "bg-amber-400 w-full animate-pulse"
                              : "w-0"
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Video Mute / Unmute Toggle (if video story) */}
                {currentItem?.isVideo && currentItem?.videoUrl && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMuted(!isMuted);
                      if (videoRef.current) {
                        videoRef.current.muted = !isMuted;
                      }
                    }}
                    className="absolute top-6 right-3 z-30 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-all cursor-pointer"
                    title={isMuted ? "Unmute audio" : "Mute audio"}
                  >
                    {isMuted ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    )}
                  </button>
                )}

                {/* Main Media Container */}
                <div
                  ref={mainStageRef}
                  onMouseEnter={() => !currentItem?.isVideo && setIsZooming(true)}
                  onMouseLeave={() => setIsZooming(false)}
                  onMouseMove={handleMouseMove}
                  onClick={() => setIsLightboxOpen(true)}
                  className={`relative w-full h-full overflow-hidden ${
                    currentItem?.isVideo ? "cursor-pointer" : "cursor-zoom-in"
                  }`}
                >
                  {/* Video Story Rendering */}
                  {currentItem?.isVideo && currentItem?.videoUrl ? (
                    <video
                      ref={videoRef}
                      key={currentItem.id}
                      src={currentItem.videoUrl}
                      poster={currentItem.imageUrl}
                      playsInline
                      autoPlay
                      muted={isMuted}
                      loop
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    /* High-Res Image with Smooth Interactive Hover Zoom */
                    <div
                      className="relative w-full h-full transition-transform duration-100 ease-out"
                      style={{
                        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                        transform: isZooming ? "scale(2.2)" : "scale(1)",
                      }}
                    >
                      <img
                        src={currentItem?.fullPicUrl || currentItem?.imageUrl}
                        alt={currentItem?.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Ambient Soft Vignette Gradient */}
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/25 via-transparent to-black/40" />

                  {/* Overlaid Details on Card (Screenshot Style) */}
                  <div className="absolute inset-0 pointer-events-none p-5 sm:p-6 flex flex-col justify-between z-20">
                    {/* Top Row: Title & Specs */}
                    <div className="pt-4 text-center">
                      <span className="inline-block text-xs sm:text-sm font-notche font-bold tracking-wide text-stone-900 drop-shadow-xs bg-white/85 backdrop-blur-xs px-3.5 py-1 rounded-full border border-stone-200/80">
                        {currentItem?.title}
                      </span>
                      <p className="text-[10px] sm:text-xs text-stone-700 font-sans font-medium mt-1 drop-shadow-xs">
                        {currentItem?.specs}
                      </p>
                    </div>

                    {/* Bottom Row: Date on Left, Price / Ref on Right */}
                    <div className="flex items-end justify-between text-stone-800">
                      <div className="text-[11px] sm:text-xs font-numbers font-semibold bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded border border-stone-200/80">
                        {currentItem?.date}
                      </div>

                      {currentItem?.priceFormatted ? (
                        <div className="text-right">
                          <div className="text-2xl sm:text-3xl lg:text-4xl font-numbers font-bold text-[#73582a] drop-shadow-xs tracking-tight bg-white/85 backdrop-blur-xs px-3 py-0.5 rounded-lg border border-amber-200/80">
                            {currentItem.priceFormatted}
                          </div>
                        </div>
                      ) : (
                        <div className="text-right">
                          <span className="text-[11px] font-numbers font-bold text-amber-900 bg-amber-100/90 backdrop-blur-xs px-2.5 py-1 rounded border border-amber-300">
                            {currentItem?.ref}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Center Pill: "Hover to zoom · Click to enlarge" */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/85 backdrop-blur-md border border-stone-200/80 text-[10px] sm:text-[11px] font-medium text-stone-700 shadow-sm">
                      <svg className="w-3.5 h-3.5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="7" strokeWidth="2" />
                        <path strokeLinecap="round" strokeWidth="2" d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
                      </svg>
                      <span>
                        {currentItem?.isVideo
                          ? "Click to play in fullscreen"
                          : "Hover to zoom · Click to enlarge"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Left Arrow Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  aria-label="Previous story"
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white text-stone-800 flex items-center justify-center shadow-lg backdrop-blur-sm transition-all hover:scale-105 active:scale-95 cursor-pointer border border-stone-200"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 -ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Right Arrow Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  aria-label="Next story"
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white text-stone-800 flex items-center justify-center shadow-lg backdrop-blur-sm transition-all hover:scale-105 active:scale-95 cursor-pointer border border-stone-200"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 -mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* ======================================================== */}
            {/* RIGHT COLUMN: Details & Actions                          */}
            {/* ======================================================== */}
            <div className="lg:col-span-4 order-3 text-center lg:text-left space-y-4">
              
              {/* Tag: TODAY'S OFFER or LIVE INSTAGRAM STORY */}
              <div>
                <span className="text-[11px] sm:text-xs font-bold tracking-[0.25em] text-[#8b6914] uppercase font-notche">
                  {currentItem?.source === "instagram" ? "LIVE INSTAGRAM STORY" : "TODAY'S OFFER"}
                </span>
              </div>

              {/* Title: Latest from Bhai Jewellers with Notche font */}
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-notche font-bold text-slate-900 tracking-tight leading-tight">
                Latest from Bhai Jewellers
              </h2>

              {/* Counter & Reference Code with custom numbers font */}
              <div className="space-y-1 text-xs sm:text-sm text-stone-600">
                <p className="font-medium text-stone-700">
                  {currentItem?.source === "instagram" ? "Story" : "Offer"}{" "}
                  <span className="font-numbers font-bold text-stone-900 text-sm">
                    {activeIndex + 1}
                  </span>{" "}
                  of{" "}
                  <span className="font-numbers font-bold text-stone-900 text-sm">
                    {totalItems}
                  </span>
                </p>
                <p className="font-numbers text-stone-500 font-semibold tracking-wide">
                  Ref <span className="font-numbers tracking-wider text-stone-700">{currentItem?.ref}</span>
                </p>
              </div>

              {/* Quick Specs / Details Card */}
              <div className="p-3.5 rounded-xl bg-white/80 border border-[#dfcca6]/60 text-xs text-stone-700 space-y-1.5 shadow-2xs max-w-sm mx-auto lg:mx-0">
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Source:</span>
                  <span className="font-semibold text-stone-900">
                    {currentItem?.source === "instagram" ? "@bhaijeweller Stories" : "Showroom Catalogue"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Date Posted:</span>
                  <span className="font-numbers font-semibold text-stone-800">{currentItem?.date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Showroom:</span>
                  <span className="inline-block bg-[#fbf5ea] border border-[#dfcca6] text-[#8b6914] text-[10px] font-bold px-1.5 py-0.5 rounded">
                    17 Duckworth Lane, Bradford
                  </span>
                </div>
                {currentItem?.priceFormatted && (
                  <div className="flex justify-between items-center">
                    <span className="text-stone-500">Offer Price:</span>
                    <span className="font-numbers font-bold text-xl text-[#73582a]">
                      {currentItem.priceFormatted}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-3 max-w-sm mx-auto lg:mx-0">
                {/* Primary Contact Us Button (WhatsApp) */}
                <a
                  href={getWhatsAppUrl(currentItem)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#7a5d28] via-[#8b6914] to-[#73582a] hover:from-[#664d1f] hover:to-[#5a441e] text-white text-sm font-semibold tracking-wide shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
                >
                  <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" />
                    <circle cx="8" cy="10" r="1.2" />
                    <circle cx="12" cy="10" r="1.2" />
                    <circle cx="16" cy="10" r="1.2" />
                  </svg>
                  <span>Contact Us</span>
                </a>

                {/* Direct Link to Instagram Story / Profile */}
                <div className="flex items-center justify-center lg:justify-start gap-4 pt-1">
                  <a
                    href={currentItem?.link || "https://www.instagram.com/bhaijeweller"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-stone-700 hover:text-[#8b6914] transition-colors"
                  >
                    <svg className="w-4 h-4 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="2" y="2" width="20" height="20" rx="5" strokeWidth="1.8" />
                      <circle cx="12" cy="12" r="4" strokeWidth="1.8" />
                      <circle cx="18" cy="6" r="1" fill="currentColor" stroke="none" />
                    </svg>
                    <span>
                      {currentItem?.source === "instagram" ? "View Story on Instagram" : "Visit Instagram"}
                    </span>
                  </a>
                </div>

                {/* Subtext Tip */}
                <p className="text-[11px] text-stone-400 font-sans italic text-center lg:text-left">
                  {currentItem?.isVideo
                    ? "Click to play in fullscreen · Inquire on WhatsApp"
                    : "Hover the image to zoom · Click to enlarge"}
                </p>
              </div>

              {/* Slide Flipping & Autoplay Controls */}
              <div className="pt-2 flex items-center justify-center lg:justify-start gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-3 py-1.5 rounded-lg border border-[#dfcca6] bg-white/70 hover:bg-white text-stone-700 text-xs font-medium cursor-pointer transition-all"
                >
                  ← Prev
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-3 py-1.5 rounded-lg border border-[#dfcca6] bg-white/70 hover:bg-white text-stone-700 text-xs font-medium cursor-pointer transition-all"
                >
                  Next →
                </button>
                <button
                  type="button"
                  onClick={() => setIsAutoPlay(!isAutoPlay)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                    isAutoPlay
                      ? "bg-[#8b6914] text-white border-[#8b6914]"
                      : "border-[#dfcca6] bg-white/70 hover:bg-white text-stone-700"
                  }`}
                  title="Auto-play story slides"
                >
                  {isAutoPlay ? "⏸ Pause" : "▶ Play Stories"}
                </button>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* LIGHTBOX MODAL (Click to Enlarge / Play Video)           */}
      {/* ======================================================== */}
      {isLightboxOpen && currentItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => {
            setIsLightboxOpen(false);
            setLightboxZoom(1);
          }}
        >
          <div
            className="relative max-w-2xl w-full max-h-[92vh] bg-stone-950 rounded-2xl overflow-hidden border border-amber-400/30 flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-black/60 border-b border-stone-800 text-white">
              <div>
                <span className="text-[10px] font-bold text-amber-400 tracking-widest uppercase font-numbers">
                  Ref: {currentItem.ref} · {currentItem.date}
                </span>
                <h3 className="text-sm sm:text-base font-notche font-bold text-white">
                  {currentItem.title}
                </h3>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  setIsLightboxOpen(false);
                  setLightboxZoom(1);
                }}
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Media Body */}
            <div className="relative flex-1 min-h-[380px] sm:min-h-[500px] bg-black flex items-center justify-center overflow-hidden">
              {currentItem.isVideo && currentItem.videoUrl ? (
                <video
                  src={currentItem.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[500px] w-auto max-w-full object-contain"
                />
              ) : (
                <div
                  className="relative w-full h-[380px] sm:h-[500px] transition-transform duration-200"
                  style={{ transform: `scale(${lightboxZoom})` }}
                >
                  <img
                    src={currentItem.fullPicUrl || currentItem.imageUrl}
                    alt={currentItem.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              {/* Prev / Next in Modal */}
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center backdrop-blur-sm cursor-pointer border border-white/20 text-xl"
                aria-label="Previous story"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center backdrop-blur-sm cursor-pointer border border-white/20 text-xl"
                aria-label="Next story"
              >
                ›
              </button>

              {/* Zoom controls for image */}
              {!currentItem.isVideo && (
                <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white text-xs">
                  <button
                    type="button"
                    onClick={() => setLightboxZoom((z) => Math.max(1, z - 0.25))}
                    className="px-1.5 py-0.5 hover:text-amber-400 cursor-pointer font-bold"
                  >
                    −
                  </button>
                  <span className="font-numbers">{Math.round(lightboxZoom * 100)}%</span>
                  <button
                    type="button"
                    onClick={() => setLightboxZoom((z) => Math.min(2.5, z + 0.25))}
                    className="px-1.5 py-0.5 hover:text-amber-400 cursor-pointer font-bold"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => setLightboxZoom(1)}
                    className="ml-1 text-[10px] text-stone-400 hover:text-white cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer / WhatsApp Inquiry */}
            <div className="px-5 py-4 bg-stone-900 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <p className="text-stone-400 text-xs line-clamp-2">
                  {currentItem.description}
                </p>
                {currentItem.priceFormatted && (
                  <p className="text-amber-300 font-numbers font-bold text-2xl">{currentItem.priceFormatted}</p>
                )}
              </div>

              <a
                href={getWhatsAppUrl(currentItem)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#8b6914] hover:bg-[#a67c1e] text-white text-xs sm:text-sm font-bold shadow transition-all cursor-pointer whitespace-nowrap"
              >
                <span>Inquire on WhatsApp</span>
                <span className="text-amber-200">→</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
