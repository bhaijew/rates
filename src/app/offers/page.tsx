"use client";

import React, { useState, useEffect } from "react";

interface OfferItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  price: string;
  stock: string;
  timestampDate: string;
  timestampTime: string;
  topColor: string;
  accent: string;
  type: "pamp-special" | "necklace" | "coin" | "bangles" | "fortuna" | "jhumka" | "bar100g" | "silver" | "choker" | "bar25g" | "chain" | "tola10" | "kada" | "bar50g";
  description: string;
  features: string[];
}

export default function OffersPage() {
  // Start on Offer 3 (0-indexed: index 2) to match user screenshot!
  const [selectedOfferIndex, setSelectedOfferIndex] = useState(2);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // 14 offers matching Shaandar / UK bullion & jewellery showroom
  const offers: OfferItem[] = [
    {
      id: "J-719302",
      title: "22K Royal Bridal Haar Necklace Set",
      subtitle: "68.4g · 22K (916) Pure Asian Gold",
      category: "Bridal Jewellery",
      price: "£6,450.00",
      stock: "Exclusive Piece",
      timestampDate: "27/10/26",
      timestampTime: "09:45am",
      topColor: "#8c1d27",
      accent: "#b91c1c",
      type: "necklace",
      description: "Heirloom handcrafted bridal necklace with matching jhumkas and maang tikka.",
      features: ["Hallmarked 22K Asian Gold", "Matching Earrings & Tikka", "Zero Making Charge Special"],
    },
    {
      id: "C-884210",
      title: "King Charles III Full Sovereign Gold Coin",
      subtitle: "7.98g · 22 Karat (916.7) Crown Gold",
      category: "Gold Coins",
      price: "£498.50",
      stock: "In Stock",
      timestampDate: "27/10/26",
      timestampTime: "10:15am",
      topColor: "#1e3a5f",
      accent: "#2563eb",
      type: "coin",
      description: "Royal Mint UK Legal Tender Sovereign with St George and Dragon reverse. Capital Gains Tax Free.",
      features: ["UK CGT Exempt & VAT Free", "The Royal Mint Struck", "Uncirculated Brilliant Finish"],
    },
    {
      id: "G-958293",
      title: "PAMP 5g Gold Bar – Special Design",
      subtitle: "5g · 999.9 fine gold",
      category: "Gold Bullion",
      price: "£576.14",
      stock: "In Stock",
      timestampDate: "27/10/26",
      timestampTime: "11:01am",
      topColor: "#c21825", // Vibrant rich red matching screenshot!
      accent: "#c21825",
      type: "pamp-special",
      description: "Limited Edition festive CertiPAMP assay card with peacock green filigree motif and Swiss 5g pure gold bar.",
      features: ["Swiss PAMP Suisse Minted", "Pure 24K (999.9) Gold", "Tamper-evident CertiPAMP Seal"],
    },
    {
      id: "B-623819",
      title: "22K Traditional Filigree Bangles (Pair)",
      subtitle: "34.8g · 22 Karat Asian Gold",
      category: "Gold Bangles",
      price: "£3,090.00",
      stock: "2 Pairs Left",
      timestampDate: "27/10/26",
      timestampTime: "11:40am",
      topColor: "#92400e",
      accent: "#d97706",
      type: "bangles",
      description: "Exquisite daily & bridal wear lightweight filigree gold kangan with screw-lock security clasp.",
      features: ["Standard 2.6 & 2.8 Sizes", "Pure 916 Hallmark", "Lifetime Buyback Guarantee"],
    },
    {
      id: "G-751930",
      title: "1 Ounce Lady Fortuna Gold Bar",
      subtitle: "31.1035g · 999.9 Investment Gold",
      category: "Investment Bullion",
      price: "£3,045.50",
      stock: "In Stock",
      timestampDate: "27/10/26",
      timestampTime: "12:15pm",
      topColor: "#1e293b",
      accent: "#0ea5e9",
      type: "fortuna",
      description: "The world's most prestigious bullion bar featuring the Roman Goddess of Fortune with cornucopia.",
      features: ["LBMA Good Delivery", "Individual Serial Number", "Zero VAT in the UK"],
    },
    {
      id: "E-448201",
      title: "22K Heritage Jhumka Earrings",
      subtitle: "18.2g · 22 Karat Gold",
      category: "Gold Earrings",
      price: "£1,620.00",
      stock: "In Stock",
      timestampDate: "27/10/26",
      timestampTime: "01:10pm",
      topColor: "#7c2d12",
      accent: "#ea580c",
      type: "jhumka",
      description: "Dangling royal dome jhumkas with delicate seed pearl tassels and floral studs.",
      features: ["22K (916) British Assay Hallmark", "Comfort Screw Backs", "Traditional Antique Polish"],
    },
    {
      id: "G-109283",
      title: "100g PAMP Suisse Minted Gold Bar",
      subtitle: "100g · 999.9 Fine Investment Gold",
      category: "Gold Bullion",
      price: "£9,680.00",
      stock: "In Stock",
      timestampDate: "27/10/26",
      timestampTime: "01:50pm",
      topColor: "#14532d",
      accent: "#16a34a",
      type: "bar100g",
      description: "High value investment ingot with verifiable QR CertiPAMP packaging.",
      features: ["LBMA Good Delivery", "Highest 99.99% Purity", "Insured UK Courier Delivery"],
    },
    {
      id: "S-512094",
      title: "1kg Fine Silver Cast Ingot (999)",
      subtitle: "1000g · Pure Investment Silver",
      category: "Silver Bullion",
      price: "£1,345.00",
      stock: "In Stock",
      timestampDate: "27/10/26",
      timestampTime: "02:30pm",
      topColor: "#334155",
      accent: "#64748b",
      type: "silver",
      description: "Heavy solid silver cast ingot stamped with manufacturer seal, weight and 999 fineness.",
      features: ["LBMA Approved Refiner", "Solid Cast Finish", "Free Vault Storage Option"],
    },
    {
      id: "J-382910",
      title: "22K Antique Polki & Emerald Choker",
      subtitle: "42.6g · 22 Karat Royal Gold",
      category: "Bridal Jewellery",
      price: "£3,950.00",
      stock: "1 Piece Only",
      timestampDate: "27/10/26",
      timestampTime: "03:15pm",
      topColor: "#064e3b",
      accent: "#059669",
      type: "choker",
      description: "Regal choker necklace adorned with uncut polki stones and Colombian emerald drops.",
      features: ["Adjustable Dori Thread", "Genuine Emerald Beads", "Assay Office Certified"],
    },
    {
      id: "G-293817",
      title: "2.5g Swiss Festive Gold Bar",
      subtitle: "2.5g · 999.9 Pure Gold",
      category: "Gold Bullion",
      price: "£295.00",
      stock: "In Stock",
      timestampDate: "27/10/26",
      timestampTime: "03:45pm",
      topColor: "#831843",
      accent: "#db2777",
      type: "bar25g",
      description: "Affordable gifting gold bar with auspicious motif in sealed tamper-proof blister pack.",
      features: ["Perfect for Gifting & Zakat", "999.9 Pure Gold", "CertiPAMP Guaranteed"],
    },
    {
      id: "C-918234",
      title: "22K Men's Royal Cuban Curb Chain",
      subtitle: "54.0g · 22 Karat Asian Gold",
      category: "Gold Chains",
      price: "£4,780.00",
      stock: "In Stock",
      timestampDate: "27/10/26",
      timestampTime: "04:10pm",
      topColor: "#451a03",
      accent: "#b45309",
      type: "chain",
      description: "Substantial 6mm diamond cut solid cuban link chain with reinforced double box lock.",
      features: ["24-inch Standard Length", "Heavy Solid Links", "Assay UK Hallmarked"],
    },
    {
      id: "G-837192",
      title: "10 Tola TT Bullion Gold Bar",
      subtitle: "116.64g · 999 Fine Gold",
      category: "Gold Bullion",
      price: "£11,260.00",
      stock: "In Stock",
      timestampDate: "27/10/26",
      timestampTime: "04:40pm",
      topColor: "#713f12",
      accent: "#ca8a04",
      type: "tola10",
      description: "Traditional 10 Tola TT Bar (biscuit) highly prized across UK Asian gold markets.",
      features: ["Exact 116.64g (10 Tolas)", "Swiss Minted Purity", "Highest Liquidity"],
    },
    {
      id: "B-552918",
      title: "22K Handcrafted Peacock Kada (Pair)",
      subtitle: "46.2g · 22 Karat Gold",
      category: "Gold Bangles",
      price: "£4,120.00",
      stock: "Exclusive",
      timestampDate: "27/10/26",
      timestampTime: "05:05pm",
      topColor: "#1e1b4b",
      accent: "#6366f1",
      type: "kada",
      description: "Royal peacock head finial openable kadas with meenakari enamelling.",
      features: ["Hand Carved Detailing", "Pure 916 Hallmark", "Screw Lock Mechanism"],
    },
    {
      id: "G-662819",
      title: "50g Umicore Investment Gold Bar",
      subtitle: "50g · 999.9 Fine Gold",
      category: "Gold Bullion",
      price: "£4,845.00",
      stock: "In Stock",
      timestampDate: "27/10/26",
      timestampTime: "05:30pm",
      topColor: "#172554",
      accent: "#3b82f6",
      type: "bar50g",
      description: "European LBMA refiner gold cast bar with individual certificate card.",
      features: ["LBMA Accredited", "0% VAT Bullion", "Direct Showroom Collection"],
    },
  ];

  const currentOffer = offers[selectedOfferIndex];

  // Navigation handlers
  const handlePrev = () => {
    setSelectedOfferIndex((prev) => (prev > 0 ? prev - 1 : offers.length - 1));
  };

  const handleNext = () => {
    setSelectedOfferIndex((prev) => (prev < offers.length - 1 ? prev + 1 : 0));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") setIsZoomModalOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // WhatsApp click handler with pre-populated message
  const whatsappUrl = `https://wa.me/447735727897?text=${encodeURIComponent(
    `Hello Shaandar / Bhai Jewellers, I would like to inquire/buy: ${currentOffer.title} (${currentOffer.price}, Ref: ${currentOffer.id}).`
  )}`;

  return (
    <div className="relative min-h-screen bg-[#faf7f2] font-sans text-stone-800 pb-20 sm:pb-28 overflow-x-hidden">
      
      {/* Warm Golden Bokeh Background Orbs (Replicating Screenshot Atmosphere) */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-96 h-96 rounded-full bg-amber-100/60 blur-3xl opacity-70" />
        <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] rounded-full bg-[#faecd6]/80 blur-3xl opacity-60" />
        <div className="absolute bottom-10 left-1/3 w-[600px] h-[600px] rounded-full bg-[#fcefe2]/70 blur-3xl opacity-50" />
        <div className="absolute top-1/2 left-10 w-80 h-80 rounded-full bg-yellow-100/40 blur-2xl opacity-40" />
        
        {/* Bokeh Circles Pattern */}
        <div className="absolute top-20 right-1/4 w-32 h-32 rounded-full bg-amber-200/25 blur-xl" />
        <div className="absolute bottom-32 right-12 w-48 h-48 rounded-full bg-amber-200/30 blur-2xl" />
        <div className="absolute top-2/3 left-16 w-36 h-36 rounded-full bg-rose-100/40 blur-xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 pt-6 sm:pt-10">
        
        {/* Top Centered Header Matching Screenshot */}
        <div className="text-center space-y-1 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#8c6d26] tracking-tight">
            Today&apos;s Offers
          </h1>
          <p className="text-xs sm:text-[13px] text-[#9c7d36] font-medium">
            Discover our latest jewellery &amp; gold offers
          </p>
        </div>

        {/* 3-Column Layout: Left Thumbnails Rail, Center Big Story Card, Right Action Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start justify-center">
          
          {/* ======================================================== */}
          {/* LEFT COLUMN: Vertical Thumbnail Stories Rail            */}
          {/* ======================================================== */}
          <div className="lg:col-span-2 order-2 lg:order-1 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:max-h-[720px] pr-1 scrollbar-thin scrollbar-thumb-stone-300 pb-2 lg:pb-0">
            {offers.map((offer, idx) => {
              const isSelected = idx === selectedOfferIndex;
              return (
                <button
                  key={offer.id}
                  onClick={() => setSelectedOfferIndex(idx)}
                  className={`group relative flex lg:flex-col items-center justify-center p-1.5 rounded-[8px] transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? "bg-white/95 border-2 border-[#b91c1c] shadow-md ring-2 ring-[#b91c1c]/20 scale-102"
                      : "bg-white/70 border border-stone-200/80 hover:bg-white hover:border-[#dfcca6] hover:shadow-xs"
                  }`}
                  style={{ width: "70px", minHeight: "74px" }}
                  title={`${offer.title} - ${offer.price}`}
                >
                  {/* Thumbnail Preview Visual */}
                  <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
                    <OfferThumbnailView type={offer.type} isSelected={isSelected} />
                  </div>

                  {/* Tiny Item Number / Indicator */}
                  <div className="text-[10px] text-stone-500 font-semibold mt-1">
                    #{idx + 1}
                  </div>
                </button>
              );
            })}
          </div>

          {/* ======================================================== */}
          {/* CENTER COLUMN: Big Instagram Story-Style Card            */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 order-1 lg:order-2 flex justify-center">
            <div className="relative w-full max-w-[440px] sm:max-w-[450px] rounded-[18px] sm:rounded-[22px] overflow-hidden shadow-2xl border border-[#ded4c3] bg-white flex flex-col">
              
              {/* TOP SEGMENT PROGRESS BARS (14 segments for 14 offers) */}
              <div className="absolute top-2.5 left-3.5 right-3.5 z-30 flex gap-1">
                {offers.map((_, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedOfferIndex(i)}
                    className="flex-1 h-[3px] rounded-full cursor-pointer overflow-hidden bg-white/35 backdrop-blur-xs transition-all hover:h-[5px]"
                  >
                    <div
                      className={`h-full transition-all duration-300 ${
                        i <= selectedOfferIndex ? "bg-[#f59e0b] w-full" : "w-0"
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* CARD TOP BANNER (Deep Rich Crimson Red Matching Screenshot) */}
              <div
                className="relative h-44 sm:h-52 w-full transition-colors duration-500 flex items-center justify-center"
                style={{ backgroundColor: currentOffer.topColor }}
              >
                {/* Subtle festive sparkle background */}
                <div className="absolute inset-0 bg-radial from-white/10 via-transparent to-black/20 pointer-events-none" />
              </div>

              {/* FLOATING LEFT & RIGHT NAVIGATION ARROWS */}
              <button
                onClick={handlePrev}
                aria-label="Previous offer"
                className="absolute left-3 top-[44%] -translate-y-1/2 w-8 h-8 rounded-full bg-white/95 text-stone-700 hover:text-stone-900 shadow-md flex items-center justify-center font-bold text-sm z-30 cursor-pointer transition-transform hover:scale-110 active:scale-95 border border-stone-100"
              >
                ‹
              </button>
              <button
                onClick={handleNext}
                aria-label="Next offer"
                className="absolute right-3 top-[44%] -translate-y-1/2 w-8 h-8 rounded-full bg-white/95 text-stone-700 hover:text-stone-900 shadow-md flex items-center justify-center font-bold text-sm z-30 cursor-pointer transition-transform hover:scale-110 active:scale-95 border border-stone-100"
              >
                ›
              </button>

              {/* PRODUCT HERO IMAGE STAGE (Overlapping Top Banner with Realistic Presentation) */}
              <div
                onClick={() => setIsZoomModalOpen(true)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative -mt-28 sm:-mt-32 z-20 flex flex-col items-center justify-center px-6 cursor-pointer group"
              >
                <div className="relative transform transition-transform duration-300 group-hover:scale-105 drop-shadow-2xl">
                  <OfferLargeProductView type={currentOffer.type} />
                </div>
              </div>

              {/* PRODUCT INFORMATION & PRICE SECTION */}
              <div className="pt-4 pb-2 px-6 text-center space-y-1 z-20">
                <h2 className="text-lg sm:text-[20px] font-bold text-[#352712] tracking-tight leading-snug">
                  {currentOffer.title}
                </h2>

                <p className="text-xs sm:text-[13px] text-stone-500 font-medium">
                  {currentOffer.subtitle}
                </p>

                {/* Big Price */}
                <div className="text-3xl sm:text-[36px] font-extrabold text-[#967425] tracking-tight pt-1">
                  {currentOffer.price}
                </div>

                {/* In Stock Badge */}
                <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-600 pt-0.5">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>{currentOffer.stock}</span>
                </div>

                {/* BUY CTA BUTTON (Pill Button Matching Screenshot) */}
                <div className="pt-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 py-2.5 px-9 rounded-full bg-[#7a5a10] hover:bg-[#684c0c] text-white font-bold text-sm transition-all shadow-md hover:scale-103 cursor-pointer"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                    <span>Buy</span>
                  </a>
                </div>
              </div>

              {/* BOTTOM CARD GRADIENT & TIMESTAMP WATERMARK (Matching Screenshot) */}
              <div className="relative pt-6 pb-3 px-4 bg-gradient-to-b from-transparent via-[#f8dfe1]/40 to-[#f3cfd2]/80 mt-auto flex flex-col items-center">
                
                {/* Slanted/Script Timestamp Watermark in lower right */}
                <div className="w-full flex justify-end pr-3">
                  <div className="text-right text-[#a89078] font-serif italic text-xs sm:text-[13px] leading-tight select-none opacity-80">
                    <div>{currentOffer.timestampDate}</div>
                    <div>{currentOffer.timestampTime}</div>
                  </div>
                </div>

                {/* Bottom Center Pill Hint */}
                <div className="mt-2 inline-flex items-center text-[10px] text-stone-500 bg-white/85 backdrop-blur-xs px-3.5 py-1 rounded-full border border-stone-200/70 shadow-xs">
                  Hover the image to zoom · Click to enlarge
                </div>
              </div>

            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: Offer Meta & Direct Actions (Matching)    */}
          {/* ======================================================== */}
          <div className="lg:col-span-3 order-3 space-y-4">
            
            <div className="bg-white/90 backdrop-blur-xs p-5 rounded-[16px] border border-[#dfcca6] shadow-xs space-y-3">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#9c7d36]">
                TODAY&apos;S OFFER
              </div>

              <div>
                <h3 className="text-sm font-semibold text-stone-900 leading-snug">
                  Latest from Shaandar Jewellers
                </h3>
                <div className="text-xs text-stone-500 mt-1">
                  Offer {selectedOfferIndex + 1} of {offers.length}
                </div>
                <div className="text-xs font-mono text-stone-400 mt-0.5">
                  Ref: {currentOffer.id}
                </div>
              </div>

              {/* Contact Us Pill Button */}
              <div className="pt-1">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-[#7a5a10] hover:bg-[#684c0c] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                  </svg>
                  <span>Contact Us</span>
                </a>
              </div>

              {/* Instagram Story Link */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-full border border-stone-200 hover:border-[#dfcca6] bg-[#faf8f5] text-stone-700 text-xs font-medium transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current text-[#E1306C]" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
                </svg>
                <span>Visit Instagram</span>
              </a>

              <div className="text-[11px] text-stone-400 text-center leading-relaxed">
                Hover the image to zoom · Click to enlarge
              </div>
            </div>

            {/* Included Features Box */}
            <div className="bg-white/80 p-4 rounded-[14px] border border-[#e4d8c3] text-xs space-y-2">
              <div className="font-bold text-stone-800">Highlights:</div>
              <ul className="space-y-1.5 text-stone-600 text-[11.5px]">
                {currentOffer.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* HIGH DEFINITION ENLARGED ZOOM MODAL                      */}
      {/* ======================================================== */}
      {isZoomModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsZoomModalOpen(false)}
        >
          <div
            className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl text-center space-y-4 border border-[#dfcca6]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsZoomModalOpen(false)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center cursor-pointer text-sm font-bold"
            >
              ✕
            </button>

            <div className="text-xs font-bold text-[#8c6d26] uppercase tracking-wider">
              Enlarged Product View
            </div>

            <div className="py-4 flex justify-center scale-110 sm:scale-125 my-4">
              <OfferLargeProductView type={currentOffer.type} />
            </div>

            <div className="space-y-1 pt-2">
              <h3 className="text-lg font-bold text-stone-900 font-serif">
                {currentOffer.title}
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                {currentOffer.subtitle}
              </p>
              <div className="text-2xl font-black text-[#8c6d26] pt-1">
                {currentOffer.price}
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed max-w-md mx-auto">
              {currentOffer.description}
            </p>

            <div className="flex gap-2 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 rounded-full bg-[#7a5a10] hover:bg-[#684c0c] text-white text-xs font-bold text-center"
              >
                Inquire on WhatsApp
              </a>
              <button
                onClick={() => setIsZoomModalOpen(false)}
                className="py-2.5 px-5 rounded-full border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// =========================================================================
// HIGH FIDELITY PRODUCT ARTWORK COMPONENT (Matches the PAMP Dual Blister)
// =========================================================================
function OfferLargeProductView({ type }: { type: OfferItem["type"] }) {
  if (type === "pamp-special") {
    return (
      <div className="relative flex items-center justify-center gap-2 select-none">
        {/* LEFT CERTIPAMP CARD (Angled reverse side with assay specs) */}
        <div
          className="relative w-28 h-40 sm:w-32 sm:h-44 rounded-md shadow-2xl overflow-hidden border border-red-800 flex flex-col justify-between p-2 transform -rotate-3 transition-transform hover:rotate-0"
          style={{
            background: "linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)",
          }}
        >
          {/* Card Header */}
          <div className="flex justify-between items-center text-white/90">
            <span className="text-[10px] font-black tracking-widest font-serif">PAMP</span>
            <span className="text-[7px] font-mono tracking-tighter opacity-80">SWITZERLAND</span>
          </div>

          {/* Green Inset Blister Compartment */}
          <div className="relative mx-auto my-1 w-20 h-24 rounded border border-amber-400/60 bg-[#064e3b] p-1.5 flex flex-col items-center justify-center shadow-inner">
            <div className="text-[7px] text-amber-300 font-bold tracking-wider mb-1">CertiPAMP™</div>
            {/* The 5g Gold Ingot */}
            <div className="w-9 h-14 rounded-xs bg-gradient-to-tr from-amber-500 via-yellow-200 to-amber-600 shadow-md border border-amber-300 flex flex-col items-center justify-between py-1 text-[6.5px] font-bold text-stone-900 leading-tight">
              <span>5g</span>
              <span className="text-[5px]">FINE GOLD</span>
              <span className="text-[6px] font-mono">999.9</span>
            </div>
            <div className="text-[6px] text-amber-200/90 font-mono mt-1">№ 958293</div>
          </div>

          {/* Card Footer */}
          <div className="flex justify-between items-center text-[7px] text-white/80 font-mono pt-0.5 border-t border-red-700/60">
            <span>5.00g</span>
            <span>999.9</span>
          </div>
        </div>

        {/* RIGHT CERTIPAMP CARD (Angled obverse side with ornate peacock motif) */}
        <div
          className="relative w-32 h-44 sm:w-36 sm:h-48 rounded-md shadow-2xl overflow-hidden border border-red-800 flex flex-col justify-between p-2 transform rotate-2 z-10 transition-transform hover:rotate-0"
          style={{
            background: "linear-gradient(145deg, #dc2626 0%, #991b1b 100%)",
          }}
        >
          {/* Ornate Gold Filigree Border & Header */}
          <div className="border border-amber-300/80 rounded h-full p-1.5 flex flex-col justify-between bg-gradient-to-b from-[#14532d] via-[#064e3b] to-[#14532d] text-center">
            
            <div className="text-amber-300 text-[9px] font-serif font-black tracking-widest uppercase">
              ✦ PAMP ✦
            </div>

            {/* Central Pure Gold Bar */}
            <div className="relative my-auto flex flex-col items-center">
              <div className="w-11 h-18 rounded-xs bg-gradient-to-tr from-amber-400 via-yellow-100 to-amber-500 shadow-xl border border-yellow-200 flex flex-col items-center justify-center p-1 text-stone-900">
                <div className="text-[6.5px] font-serif font-bold text-amber-900">PAMP</div>
                <div className="text-[8px] font-black">5g</div>
                <div className="text-[5.5px] font-bold">999.9</div>
              </div>
            </div>

            {/* Ornate Base */}
            <div className="text-amber-300/90 text-[7px] font-serif tracking-wider">
              LIMITED EDITION
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "necklace") {
    return (
      <div className="relative w-40 h-40 sm:w-44 sm:h-44 flex items-center justify-center">
        {/* White Jewellery Bust Form */}
        <div className="w-32 h-36 rounded-t-full bg-gradient-to-b from-stone-100 to-stone-300 shadow-xl border border-stone-200 flex flex-col items-center pt-2">
          {/* Ornate Gold Haar SVG */}
          <svg className="w-28 h-28 text-amber-500 drop-shadow-md" viewBox="0 0 100 100" fill="none">
            <path
              d="M20 20 C35 70, 65 70, 80 20"
              stroke="url(#goldGrad)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M26 32 C38 78, 62 78, 74 32"
              stroke="url(#goldGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Hanging Beads / Ruby drops */}
            <circle cx="50" cy="74" r="5" fill="#b91c1c" stroke="#f59e0b" strokeWidth="1.5" />
            <circle cx="42" cy="71" r="3.5" fill="#f59e0b" />
            <circle cx="58" cy="71" r="3.5" fill="#f59e0b" />
            <circle cx="35" cy="65" r="3" fill="#b91c1c" />
            <circle cx="65" cy="65" r="3" fill="#b91c1c" />
            <defs>
              <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#a16207" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    );
  }

  if (type === "coin") {
    return (
      <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center">
        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-200 to-amber-700 shadow-2xl border-4 border-amber-300 flex items-center justify-center p-2 text-stone-900">
          <div className="w-full h-full rounded-full border border-dashed border-amber-700/60 flex flex-col items-center justify-center text-center p-1">
            <span className="text-[7.5px] font-serif font-black tracking-widest text-amber-950">SOVEREIGN</span>
            <span className="text-xl my-0.5">👑</span>
            <span className="text-[7px] font-bold text-amber-950">ROYAL MINT</span>
          </div>
        </div>
      </div>
    );
  }

  if (type === "bangles") {
    return (
      <div className="relative w-40 h-36 flex items-center justify-center gap-1">
        <div className="w-20 h-28 rounded-full border-[7px] border-amber-500 shadow-xl bg-radial from-transparent to-amber-100/30 transform -rotate-12 border-dashed" />
        <div className="w-20 h-28 rounded-full border-[7px] border-yellow-500 shadow-xl bg-radial from-transparent to-yellow-100/30 transform rotate-12 -ml-6 border-dashed" />
      </div>
    );
  }

  // Generic Bullion / Ingot Visual
  return (
    <div className="relative w-32 h-44 rounded-lg bg-gradient-to-tr from-amber-500 via-yellow-100 to-amber-600 shadow-2xl border-2 border-amber-300 flex flex-col items-center justify-between p-3 text-stone-900">
      <div className="text-[10px] font-serif font-black tracking-widest">LBMA</div>
      <div className="w-16 h-20 border border-stone-800/40 rounded flex flex-col items-center justify-center bg-amber-200/40">
        <span className="text-[9px] font-bold">SUISSE</span>
        <span className="text-sm font-black">999.9</span>
        <span className="text-[8px] font-bold">FINE GOLD</span>
      </div>
      <div className="text-[8px] font-mono tracking-wider">№ 847291</div>
    </div>
  );
}

// =========================================================================
// THUMBNAIL COMPONENT FOR LEFT RAIL
// =========================================================================
function OfferThumbnailView({
  type,
  isSelected,
}: {
  type: OfferItem["type"];
  isSelected: boolean;
}) {
  if (type === "pamp-special") {
    return (
      <div className="w-10 h-10 rounded bg-[#b91c1c] border border-red-700 flex items-center justify-center p-0.5 shadow-xs">
        <div className="w-7 h-8 rounded-xs bg-[#064e3b] border border-amber-300 flex items-center justify-center">
          <div className="w-3.5 h-5 bg-gradient-to-tr from-amber-400 to-yellow-200 rounded-2xs" />
        </div>
      </div>
    );
  }

  if (type === "necklace") {
    return (
      <div className="w-10 h-10 rounded bg-stone-100 border border-stone-300 flex items-center justify-center">
        <svg className="w-8 h-8 text-amber-500" viewBox="0 0 100 100" fill="none">
          <path d="M20 25 C35 75, 65 75, 80 25" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
          <circle cx="50" cy="75" r="8" fill="#b91c1c" />
        </svg>
      </div>
    );
  }

  if (type === "coin") {
    return (
      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-200 to-amber-700 border-2 border-amber-400 flex items-center justify-center text-[10px]">
        👑
      </div>
    );
  }

  if (type === "bangles") {
    return (
      <div className="relative w-9 h-9 flex items-center justify-center">
        <div className="w-7 h-7 rounded-full border-3 border-amber-500 absolute" />
        <div className="w-7 h-7 rounded-full border-3 border-yellow-400 absolute left-1" />
      </div>
    );
  }

  if (type === "silver") {
    return (
      <div className="w-7 h-9 rounded bg-gradient-to-tr from-slate-400 via-stone-100 to-slate-500 border border-stone-300 flex flex-col items-center justify-center text-[7px] font-bold text-stone-700">
        AG
      </div>
    );
  }

  // Default gold ingot thumbnail
  return (
    <div className="w-7 h-9 rounded bg-gradient-to-tr from-amber-500 via-yellow-200 to-amber-600 border border-amber-300 flex flex-col items-center justify-center text-[7px] font-bold text-stone-900 shadow-xs">
      AU
    </div>
  );
}
