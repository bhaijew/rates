"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { BullionProduct, INITIAL_GOLD_ITEMS, INITIAL_SILVER_ITEMS } from "@/data/bullion-items";
import { SiteContent, INITIAL_SITE_CONTENT, PageSlide } from "@/data/site-content";

// Helper function to calculate real-time price & specs
export function getBullionCalculatedPrice(
  item: Partial<BullionProduct>,
  goldGram: number,
  silverGram: number
) {
  const isFixed = item.priceMode === "fixed" && !!item.customPriceOverride && item.customPriceOverride > 0;
  if (isFixed) {
    return {
      finalPrice: item.customPriceOverride as number,
      isAuto: false,
      rawMetal: 0,
      markupAmount: 0,
    };
  }

  const spotRate = item.metal === "silver" ? silverGram : goldGram;
  const purityFactor = (item.purity || "").includes("22K") ? 22 / 24 : 1.0;
  const weight = item.weightGrams || 0;
  const rawMetal = weight * spotRate * purityFactor;
  const markup = item.premiumPercentage || 0;
  const markupAmount = rawMetal * markup;
  const finalPrice = Math.round((rawMetal + markupAmount) * 100) / 100;

  return {
    finalPrice,
    isAuto: true,
    rawMetal,
    markupAmount,
  };
}

export default function AdminDashboardPage() {
  // Authentication Password state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<"bullion" | "sliders" | "contact" | "findUs" | "privacy">("bullion");
  const [bullionSubTab, setBullionSubTab] = useState<"gold" | "silver">("gold");

  // State for data
  const [goldItems, setGoldItems] = useState<BullionProduct[]>(INITIAL_GOLD_ITEMS);
  const [silverItems, setSilverItems] = useState<BullionProduct[]>(INITIAL_SILVER_ITEMS);
  const [siteContent, setSiteContent] = useState<SiteContent>(INITIAL_SITE_CONTENT);

  // Live spot rates
  const [goldGram, setGoldGram] = useState<number>(96.5);
  const [silverGram, setSilverGram] = useState<number>(1.12);

  // Search & filter
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "bar" | "coin">("all");

  // Edit / Add modal state for Bullion
  const [editingItem, setEditingItem] = useState<BullionProduct | null>(null);
  const [isNewItemModal, setIsNewItemModal] = useState(false);

  // Edit / Add modal state for Sliders
  const [editingSlide, setEditingSlide] = useState<PageSlide | null>(null);
  const [isNewSlideModal, setIsNewSlideModal] = useState(false);

  // Status message
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Check auth from sessionStorage
  useEffect(() => {
    const auth = sessionStorage.getItem("bhai_admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch live market rates
  useEffect(() => {
    fetch("/api/rates")
      .then((r) => r.json())
      .then((d) => {
        if (d && d.goldGbpPerGram) setGoldGram(d.goldGbpPerGram);
        if (d && d.silverGbpPerGram) setSilverGram(d.silverGbpPerGram);
      })
      .catch((err) => console.error("Error loading live rates in admin:", err));
  }, []);

  // Fetch current stored data
  useEffect(() => {
    fetch("/api/admin/content")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          if (Array.isArray(res.data.goldItems)) setGoldItems(res.data.goldItems);
          if (Array.isArray(res.data.silverItems)) setSilverItems(res.data.silverItems);
          if (res.data.siteContent) {
            setSiteContent({
              ...INITIAL_SITE_CONTENT,
              ...res.data.siteContent,
              slides: Array.isArray(res.data.siteContent.slides)
                ? res.data.siteContent.slides
                : INITIAL_SITE_CONTENT.slides,
            });
          }
        }
      })
      .catch((err) => console.error("Error loading admin content:", err));
  }, []);

  // Password validation handler
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = passwordInput.trim().toLowerCase();
    // Authorized password: bhaijew90
    if (clean === "bhaijew90") {
      setIsAuthenticated(true);
      sessionStorage.setItem("bhai_admin_auth", "true");
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  // Toast notification helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Save all changes to the server API
  const handleSaveAll = async () => {
    try {
      setIsSaving(true);
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goldItems,
          silverItems,
          siteContent,
        }),
      });

      const json = await res.json();
      if (json.success) {
        showToast("Changes successfully saved to live server!");
      } else {
        showToast(`Save failed: ${json.error || "Unknown error"}`);
      }
    } catch (err: any) {
      showToast(`Error saving: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Bullion editing helpers
  const currentList = bullionSubTab === "gold" ? goldItems : silverItems;
  const setCurrentList = (updater: (prev: BullionProduct[]) => BullionProduct[]) => {
    if (bullionSubTab === "gold") {
      setGoldItems(updater);
    } else {
      setSilverItems(updater);
    }
  };

  const handleUpdateBullionItem = (updated: BullionProduct) => {
    setCurrentList((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
    setEditingItem(null);
    showToast(`Updated ${updated.name}`);
  };

  const handleAddBullionItem = (newItem: BullionProduct) => {
    setCurrentList((prev) => [newItem, ...prev]);
    setIsNewItemModal(false);
    showToast(`Added new item ${newItem.name}`);
  };

  const handleDeleteBullionItem = (id: string) => {
    if (confirm("Are you sure you want to remove this item?")) {
      setCurrentList((prev) => prev.filter((item) => item.id !== id));
      showToast("Item deleted");
    }
  };

  // Filtered bullion list
  const filteredBullion = currentList.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.refiner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Slider editing helpers
  const handleSaveSlide = (slide: PageSlide) => {
    const existingIndex = siteContent.slides.findIndex((s) => s.id === slide.id);
    let updatedSlides = [...siteContent.slides];
    if (existingIndex >= 0) {
      updatedSlides[existingIndex] = slide;
    } else {
      updatedSlides.push(slide);
    }
    setSiteContent({ ...siteContent, slides: updatedSlides });
    setEditingSlide(null);
    setIsNewSlideModal(false);
    showToast(`Slide "${slide.title}" saved`);
  };

  const handleDeleteSlide = (id: string) => {
    if (confirm("Are you sure you want to remove this slide?")) {
      setSiteContent({
        ...siteContent,
        slides: siteContent.slides.filter((s) => s.id !== id),
      });
      showToast("Slide removed");
    }
  };

  // ----------------------------------------------------
  // EXECUTIVE LUXURY LOGIN SCREEN
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0e1015] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Subtle Ambient Gold Atmosphere */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.15)_0%,_transparent_70%)] blur-2xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(25,28,36,0.8)_0%,_#0e1015_100%)] pointer-events-none" />

        <div className="relative w-full max-w-sm sm:max-w-md bg-[#161922]/90 backdrop-blur-2xl border border-[#d4af37]/35 rounded-3xl p-7 sm:p-9 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] text-center text-white">
          {/* Top 24K Gold Accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent rounded-t-3xl" />

          {/* Emblem Monogram */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-[#242016] to-[#16140e] border border-[#d4af37]/50 flex items-center justify-center text-[#d4af37] mx-auto mb-4 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
            <span className="font-notche font-bold text-2xl tracking-tighter">B</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-notche font-bold tracking-tight text-white">
            Bhai Jewellers
          </h1>
          <p className="text-[11px] text-stone-400 mt-1 uppercase tracking-widest font-semibold">
            Showroom Admin Studio
          </p>

          <form onSubmit={handlePasswordSubmit} className="mt-7 space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (authError) setAuthError(false);
                }}
                className={`w-full px-4 py-3.5 pr-11 text-center text-sm font-numbers tracking-widest rounded-xl border ${
                  authError
                    ? "border-rose-500/80 bg-rose-950/20 text-rose-300 focus:ring-rose-500"
                    : "border-stone-700/80 bg-[#1e222d] text-white focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
                } focus:outline-none transition-all`}
                autoFocus
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            {authError && (
              <div className="py-2 px-3 rounded-lg bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs font-medium animate-in fade-in">
                Access Denied. Incorrect password.
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#8b6914] via-[#b8933b] to-[#73582a] hover:from-[#9c781d] hover:to-[#856631] text-white font-notche font-bold tracking-wider text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all active:scale-[0.98] cursor-pointer"
            >
              AUTHENTICATE ACCESS
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-stone-800/70 flex items-center justify-between text-xs text-stone-500">
            <Link href="/" className="hover:text-stone-300 transition-colors">
              ← Return to Site
            </Link>
            <span className="font-numbers text-[11px] text-stone-600">Secure Core</span>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // MAIN ADMIN CONTROL PANEL
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-[#faf7f2] text-slate-800 pb-24 relative font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-amber-400/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#dfcca6] px-4 sm:px-8 py-3.5 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#faf5ea] to-[#eedbb9] border border-[#d4af37]/60 flex items-center justify-center text-[#8b6914] font-notche font-bold text-lg shadow-xs">
              B
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-notche font-bold text-slate-900 tracking-tight leading-none">
                  Bhai Jewellers
                </h1>
                <span className="text-[10px] font-notche font-bold bg-[#fbf5ea] text-[#8b6914] px-2 py-0.5 rounded border border-[#dfcca6] uppercase tracking-wider">
                  Admin Studio
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium">
                Live Pricing, Sliders & Showroom Content Management
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            <div className="hidden md:flex items-center gap-3 text-xs text-stone-500 bg-[#faf8f5] px-3 py-1.5 rounded-lg border border-[#dfcca6]">
              <span className="flex items-center gap-1 font-numbers">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Gold: <strong className="text-slate-800">£{goldGram.toFixed(2)}/g</strong>
              </span>
              <span className="text-stone-300">|</span>
              <span className="flex items-center gap-1 font-numbers">
                Silver: <strong className="text-slate-800">£{silverGram.toFixed(2)}/g</strong>
              </span>
            </div>

            <Link
              href="/"
              target="_blank"
              className="text-xs font-semibold px-3 py-2 rounded-lg border border-[#dfcca6] bg-[#faf8f5] hover:bg-white text-stone-700 transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <span>View Site</span>
              <svg className="w-3.5 h-3.5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>

            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#7a5d28] via-[#8b6914] to-[#73582a] hover:from-[#664d1f] hover:to-[#5a441e] text-white font-notche font-bold text-xs tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>SAVING...</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm2 16H5V5h11.17L19 7.83V19zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM6 6h9v4H6z" />
                  </svg>
                  <span>SAVE ALL CHANGES</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                sessionStorage.removeItem("bhai_admin_auth");
                setIsAuthenticated(false);
              }}
              className="text-xs text-stone-400 hover:text-rose-600 px-2 py-1 transition-colors"
              title="Logout"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6">
        <div className="flex items-center gap-2 border-b border-[#dfcca6]/60 pb-3 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("bullion")}
            className={`px-4 py-2.5 rounded-xl font-notche font-bold text-xs sm:text-sm tracking-wide transition-all cursor-pointer shrink-0 flex items-center gap-2 ${
              activeTab === "bullion"
                ? "bg-[#8b6914] text-white shadow-md"
                : "bg-white/70 hover:bg-white text-stone-700 border border-[#dfcca6]"
            }`}
          >
            <span>🪙 Gold & Silver Bullion</span>
            <span className="font-numbers text-xs bg-black/20 px-1.5 py-0.2 rounded">
              {goldItems.length + silverItems.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("sliders")}
            className={`px-4 py-2.5 rounded-xl font-notche font-bold text-xs sm:text-sm tracking-wide transition-all cursor-pointer shrink-0 flex items-center gap-2 ${
              activeTab === "sliders"
                ? "bg-[#8b6914] text-white shadow-md"
                : "bg-white/70 hover:bg-white text-stone-700 border border-[#dfcca6]"
            }`}
          >
            <span>🎠 Page Sliders</span>
            <span className="font-numbers text-xs bg-black/20 px-1.5 py-0.2 rounded">
              {siteContent.slides?.length || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("contact")}
            className={`px-4 py-2.5 rounded-xl font-notche font-bold text-xs sm:text-sm tracking-wide transition-all cursor-pointer shrink-0 flex items-center gap-2 ${
              activeTab === "contact"
                ? "bg-[#8b6914] text-white shadow-md"
                : "bg-white/70 hover:bg-white text-stone-700 border border-[#dfcca6]"
            }`}
          >
            <span>📞 Contact & Channels</span>
          </button>

          <button
            onClick={() => setActiveTab("findUs")}
            className={`px-4 py-2.5 rounded-xl font-notche font-bold text-xs sm:text-sm tracking-wide transition-all cursor-pointer shrink-0 flex items-center gap-2 ${
              activeTab === "findUs"
                ? "bg-[#8b6914] text-white shadow-md"
                : "bg-white/70 hover:bg-white text-stone-700 border border-[#dfcca6]"
            }`}
          >
            <span>📍 Find Us & Hours</span>
          </button>

          <button
            onClick={() => setActiveTab("privacy")}
            className={`px-4 py-2.5 rounded-xl font-notche font-bold text-xs sm:text-sm tracking-wide transition-all cursor-pointer shrink-0 flex items-center gap-2 ${
              activeTab === "privacy"
                ? "bg-[#8b6914] text-white shadow-md"
                : "bg-white/70 hover:bg-white text-stone-700 border border-[#dfcca6]"
            }`}
          >
            <span>📜 Privacy Policy</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 mt-6">
        {/* ======================================================== */}
        {/* TAB 1: BULLION CATALOG (GOLD & SILVER)                   */}
        {/* ======================================================== */}
        {activeTab === "bullion" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Top Subnav & Search Controls */}
            <div className="bg-white border border-[#dfcca6] rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Gold / Silver switch */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <button
                  onClick={() => setBullionSubTab("gold")}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-xl font-notche font-bold text-xs tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    bullionSubTab === "gold"
                      ? "bg-[#8b6914] text-white shadow-xs"
                      : "bg-[#faf8f5] text-stone-700 border border-[#dfcca6] hover:bg-white"
                  }`}
                >
                  <span>🟡 Gold Catalog</span>
                  <span className="font-numbers text-[11px] bg-black/15 px-1.5 rounded">
                    {goldItems.length}
                  </span>
                </button>

                <button
                  onClick={() => setBullionSubTab("silver")}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-xl font-notche font-bold text-xs tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    bullionSubTab === "silver"
                      ? "bg-slate-800 text-white shadow-xs"
                      : "bg-[#faf8f5] text-stone-700 border border-[#dfcca6] hover:bg-white"
                  }`}
                >
                  <span>⚪ Silver Catalog</span>
                  <span className="font-numbers text-[11px] bg-black/15 px-1.5 rounded">
                    {silverItems.length}
                  </span>
                </button>
              </div>

              {/* Type Filter & Search Bar */}
              <div className="flex items-center gap-2.5 w-full md:w-auto">
                <div className="flex bg-[#faf8f5] p-1 rounded-xl border border-[#dfcca6]">
                  {(["all", "bar", "coin"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTypeFilter(t)}
                      className={`px-3 py-1 text-xs font-bold rounded-lg capitalize transition-all cursor-pointer ${
                        typeFilter === t
                          ? "bg-white text-stone-900 shadow-2xs font-notche"
                          : "text-stone-500 hover:text-stone-800"
                      }`}
                    >
                      {t === "all" ? "All" : `${t}s`}
                    </button>
                  ))}
                </div>

                <div className="relative flex-1 md:w-56">
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#dfcca6] bg-[#faf8f5] focus:outline-none focus:ring-1 focus:ring-[#8b6914]"
                  />
                  <svg className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                <button
                  onClick={() => setIsNewItemModal(true)}
                  className="px-3.5 py-1.5 bg-[#8b6914] hover:bg-[#a67c1e] text-white font-notche font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <span>+</span>
                  <span className="hidden sm:inline">Add Product</span>
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBullion.map((item) => {
                const priceInfo = getBullionCalculatedPrice(item, goldGram, silverGram);

                return (
                  <div
                    key={item.id}
                    className="bg-white border border-[#dfcca6]/80 rounded-2xl p-4 shadow-2xs hover:shadow-md transition-shadow relative flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono font-bold bg-[#faf5ea] text-[#8b6914] px-2 py-0.5 rounded border border-[#dfcca6] uppercase">
                          {item.id}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {item.popular && (
                            <span className="text-[9px] font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded uppercase">
                              Best Seller
                            </span>
                          )}
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                              item.inStock !== false
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {item.inStock !== false ? "In Stock" : "Sold Out"}
                          </span>
                        </div>
                      </div>

                      {/* Product Name & Refiner */}
                      <h3 className="font-notche font-bold text-slate-900 text-sm sm:text-base leading-snug">
                        {item.name}
                      </h3>
                      <p className="text-xs text-stone-500 font-medium mt-0.5">
                        {item.refiner} · {item.purity}
                      </p>
                    </div>

                    {/* Specifications & Real-time Pricing Info */}
                    <div className="mt-4 pt-3 border-t border-stone-100 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-stone-400 block text-[10px] uppercase">Weight:</span>
                        <span className="font-numbers font-bold text-stone-800">
                          {item.weightGrams}g
                        </span>
                      </div>

                      <div>
                        <span className="text-stone-400 block text-[10px] uppercase">Markup:</span>
                        <span className="font-numbers font-semibold text-stone-800">
                          +{(item.premiumPercentage * 100).toFixed(1)}%
                        </span>
                      </div>

                      <div className="col-span-2 mt-1 bg-[#faf8f5] p-2.5 rounded-xl border border-[#dfcca6]/60 flex items-center justify-between">
                        <div>
                          <span className="text-stone-400 block text-[9.5px] uppercase font-bold">
                            {priceInfo.isAuto ? "⚡ Auto Spot Rate" : "🔒 Fixed Deal Price"}
                          </span>
                          <span className="font-numbers font-bold text-base text-[#8b6914]">
                            £{priceInfo.finalPrice.toFixed(2)}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {item.vatStatus || "0% VAT Exempt"}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="flex-1 py-1.5 px-3 rounded-lg border border-[#dfcca6] bg-[#faf8f5] hover:bg-[#8b6914] hover:text-white text-stone-700 font-notche text-xs font-bold transition-all cursor-pointer text-center"
                      >
                        EDIT CARD & AUTO-PRICE
                      </button>

                      <button
                        onClick={() => handleDeleteBullionItem(item.id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Item"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredBullion.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-[#dfcca6]">
                <p className="text-sm text-stone-500 font-medium">No bullion items found matching your filter.</p>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: PAGE SLIDERS & BANNERS                            */}
        {/* ======================================================== */}
        {activeTab === "sliders" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white border border-[#dfcca6] rounded-2xl p-5 shadow-2xs flex items-center justify-between">
              <div>
                <h2 className="text-lg font-notche font-bold text-slate-900">
                  Page Slides & Featured Showcases
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Manage the interactive hero slider displayed across the website pages.
                </p>
              </div>

              <button
                onClick={() => setIsNewSlideModal(true)}
                className="px-4 py-2 bg-[#8b6914] hover:bg-[#a67c1e] text-white font-notche font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>+</span>
                <span>Add New Slide</span>
              </button>
            </div>

            {/* Slides List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {siteContent.slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className="bg-white border border-[#dfcca6]/80 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="p-4 space-y-3">
                    {/* Slide Top Details */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold font-numbers bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                        Slide #{index + 1}
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          const updated = siteContent.slides.map((s) =>
                            s.id === slide.id ? { ...s, active: !s.active } : s
                          );
                          setSiteContent({ ...siteContent, slides: updated });
                          showToast(`Slide ${slide.active ? "disabled" : "activated"}`);
                        }}
                        className={`text-[9.5px] font-bold px-2 py-0.5 rounded cursor-pointer transition-colors ${
                          slide.active !== false
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-stone-200 text-stone-600"
                        }`}
                      >
                        {slide.active !== false ? "Active on Site" : "Hidden"}
                      </button>
                    </div>

                    {/* Image Preview Stage */}
                    <div className="relative w-full h-36 rounded-xl bg-gradient-to-b from-[#faf6ee] to-[#f4ebd9] border border-[#dfcca6]/50 p-2 flex items-center justify-center overflow-hidden">
                      <img
                        src={slide.imageUrl}
                        alt={slide.title}
                        className="max-h-full max-w-full object-contain filter drop-shadow-md"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/offers/offer-1.jpg";
                        }}
                      />
                      {slide.tag && (
                        <span className="absolute top-2 left-2 bg-white/95 text-[#8b6914] text-[9px] font-bold font-notche px-2 py-0.5 rounded border border-[#dfcca6]">
                          {slide.tag}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div>
                      <h3 className="font-notche font-bold text-slate-900 text-sm leading-snug line-clamp-1">
                        {slide.title}
                      </h3>
                      <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                        {slide.subtitle}
                      </p>
                    </div>

                    <div className="text-[11px] text-stone-400 flex items-center justify-between pt-1 border-t border-stone-100">
                      <span>CTA: <strong className="text-stone-700">{slide.buttonText || "Discover"}</strong></span>
                      <span className="truncate max-w-[120px] font-mono">{slide.linkUrl}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-3 bg-[#faf8f5] border-t border-stone-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setEditingSlide(slide)}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-white border border-[#dfcca6] hover:bg-[#8b6914] hover:text-white text-stone-700 font-notche text-xs font-bold transition-all cursor-pointer text-center"
                    >
                      EDIT SLIDE
                    </button>

                    <button
                      onClick={() => handleDeleteSlide(slide.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Slide"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {siteContent.slides.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-[#dfcca6]">
                <p className="text-sm text-stone-500 font-medium">No slides created yet.</p>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: CONTACT & CHANNELS                                */}
        {/* ======================================================== */}
        {activeTab === "contact" && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
            <div className="bg-white border border-[#dfcca6] rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h2 className="text-lg sm:text-xl font-notche font-bold text-slate-900">
                  Official Concierge & Contact Settings
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Update customer communication lines, phone numbers, and WhatsApp links across the site.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Showroom Name
                  </label>
                  <input
                    type="text"
                    value={siteContent.contact.showroomName}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        contact: { ...siteContent.contact, showroomName: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#dfcca6] bg-[#faf8f5] focus:outline-none focus:ring-1 focus:ring-[#8b6914]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Bradford Phone Number
                  </label>
                  <input
                    type="text"
                    value={siteContent.contact.phone}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        contact: { ...siteContent.contact, phone: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#dfcca6] bg-[#faf8f5] font-numbers font-semibold focus:outline-none focus:ring-1 focus:ring-[#8b6914]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Official WhatsApp (+44 format)
                  </label>
                  <input
                    type="text"
                    value={siteContent.contact.whatsapp}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        contact: { ...siteContent.contact, whatsapp: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#dfcca6] bg-[#faf8f5] font-numbers font-semibold focus:outline-none focus:ring-1 focus:ring-[#8b6914]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Customer Support Email
                  </label>
                  <input
                    type="email"
                    value={siteContent.contact.email}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        contact: { ...siteContent.contact, email: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#dfcca6] bg-[#faf8f5] focus:outline-none focus:ring-1 focus:ring-[#8b6914]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Instagram Handle
                  </label>
                  <input
                    type="text"
                    value={siteContent.contact.instagramHandle}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        contact: { ...siteContent.contact, instagramHandle: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#dfcca6] bg-[#faf8f5] focus:outline-none focus:ring-1 focus:ring-[#8b6914]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Instagram URL
                  </label>
                  <input
                    type="text"
                    value={siteContent.contact.instagramUrl}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        contact: { ...siteContent.contact, instagramUrl: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#dfcca6] bg-[#faf8f5] focus:outline-none focus:ring-1 focus:ring-[#8b6914]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Showroom Hours Summary
                  </label>
                  <input
                    type="text"
                    value={siteContent.contact.openingHoursSummary}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        contact: { ...siteContent.contact, openingHoursSummary: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#dfcca6] bg-[#faf8f5] focus:outline-none focus:ring-1 focus:ring-[#8b6914]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex justify-end">
                <button
                  onClick={handleSaveAll}
                  className="px-6 py-2.5 rounded-xl bg-[#8b6914] hover:bg-[#a67c1e] text-white font-notche font-bold text-xs tracking-wider shadow transition-all cursor-pointer"
                >
                  SAVE CONTACT DETAILS
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: FIND US & STORE HOURS                             */}
        {/* ======================================================== */}
        {activeTab === "findUs" && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
            <div className="bg-white border border-[#dfcca6] rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h2 className="text-lg sm:text-xl font-notche font-bold text-slate-900">
                  Location, Schedule & Map
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Update the Bradford showroom address, weekly schedule, and Google Maps embed frame.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Showroom Full Address
                  </label>
                  <input
                    type="text"
                    value={siteContent.findUs.addressFull}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        findUs: { ...siteContent.findUs, addressFull: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#dfcca6] bg-[#faf8f5] focus:outline-none"
                    placeholder="17 Duckworth Lane, Bradford, West Yorkshire, BD9 5ER"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Google Maps Embed URL (iframe src)
                  </label>
                  <input
                    type="text"
                    value={siteContent.findUs.mapsEmbedUrl}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        findUs: { ...siteContent.findUs, mapsEmbedUrl: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#dfcca6] bg-[#faf8f5] focus:outline-none font-mono"
                  />
                </div>

                {/* Opening Hours Schedule */}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-2">
                    Showroom Schedule (Monday - Sunday)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {siteContent.findUs.openingHours.map((item, idx) => (
                      <div
                        key={item.day}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-[#dfcca6]/60 bg-[#faf8f5] text-xs"
                      >
                        <span className="font-bold text-stone-800 w-28">{item.day}</span>
                        <input
                          type="text"
                          value={item.hours}
                          onChange={(e) => {
                            const newHours = [...siteContent.findUs.openingHours];
                            newHours[idx] = { ...newHours[idx], hours: e.target.value };
                            setSiteContent({
                              ...siteContent,
                              findUs: { ...siteContent.findUs, openingHours: newHours },
                            });
                          }}
                          className="px-2 py-1 bg-white rounded border border-stone-200 text-stone-800 font-numbers text-right text-xs focus:outline-none flex-1 ml-2"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex justify-end">
                <button
                  onClick={handleSaveAll}
                  className="px-6 py-2.5 rounded-xl bg-[#8b6914] hover:bg-[#a67c1e] text-white font-notche font-bold text-xs tracking-wider shadow transition-all cursor-pointer"
                >
                  SAVE LOCATION & HOURS
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: PRIVACY POLICY                                    */}
        {/* ======================================================== */}
        {activeTab === "privacy" && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
            <div className="bg-white border border-[#dfcca6] rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="border-b border-stone-100 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-notche font-bold text-slate-900">
                    Showroom Privacy Policy
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Manage compliance disclosures, clauses, and policy text.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newSec = {
                      id: `sec-${Date.now()}`,
                      title: "New Policy Section",
                      content: "Enter your legal clause description here...",
                    };
                    setSiteContent({
                      ...siteContent,
                      privacyPolicy: {
                        ...siteContent.privacyPolicy,
                        sections: [...siteContent.privacyPolicy.sections, newSec],
                      },
                    });
                  }}
                  className="px-3 py-1.5 bg-[#8b6914] text-white text-xs font-bold rounded-lg hover:bg-[#a67c1e] transition-colors cursor-pointer"
                >
                  + Add Section
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                      Last Updated Date
                    </label>
                    <input
                      type="text"
                      value={siteContent.privacyPolicy.lastUpdated}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          privacyPolicy: {
                            ...siteContent.privacyPolicy,
                            lastUpdated: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#dfcca6] bg-[#faf8f5] font-numbers focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                      Page Subtitle
                    </label>
                    <input
                      type="text"
                      value={siteContent.privacyPolicy.subtitle}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          privacyPolicy: {
                            ...siteContent.privacyPolicy,
                            subtitle: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#dfcca6] bg-[#faf8f5] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Sections List */}
                <div className="space-y-4 pt-2">
                  {siteContent.privacyPolicy.sections.map((sec, idx) => (
                    <div
                      key={sec.id}
                      className="p-4 rounded-xl border border-[#dfcca6]/60 bg-[#faf8f5] space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={sec.title}
                          onChange={(e) => {
                            const newSecs = [...siteContent.privacyPolicy.sections];
                            newSecs[idx] = { ...newSecs[idx], title: e.target.value };
                            setSiteContent({
                              ...siteContent,
                              privacyPolicy: {
                                ...siteContent.privacyPolicy,
                                sections: newSecs,
                              },
                            });
                          }}
                          className="flex-1 px-3 py-1.5 text-xs font-bold text-slate-900 rounded-lg border border-stone-200 bg-white focus:outline-none"
                        />

                        <button
                          onClick={() => {
                            const newSecs = siteContent.privacyPolicy.sections.filter(
                              (_, i) => i !== idx
                            );
                            setSiteContent({
                              ...siteContent,
                              privacyPolicy: {
                                ...siteContent.privacyPolicy,
                                sections: newSecs,
                              },
                            });
                          }}
                          className="text-stone-400 hover:text-rose-600 p-1"
                          title="Remove Section"
                        >
                          ✕
                        </button>
                      </div>

                      <textarea
                        rows={3}
                        value={sec.content}
                        onChange={(e) => {
                          const newSecs = [...siteContent.privacyPolicy.sections];
                          newSecs[idx] = { ...newSecs[idx], content: e.target.value };
                          setSiteContent({
                            ...siteContent,
                            privacyPolicy: {
                              ...siteContent.privacyPolicy,
                              sections: newSecs,
                            },
                          });
                        }}
                        className="w-full px-3 py-2 text-xs text-stone-700 rounded-lg border border-stone-200 bg-white focus:outline-none leading-relaxed"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex justify-end">
                <button
                  onClick={handleSaveAll}
                  className="px-6 py-2.5 rounded-xl bg-[#8b6914] hover:bg-[#a67c1e] text-white font-notche font-bold text-xs tracking-wider shadow transition-all cursor-pointer"
                >
                  SAVE PRIVACY POLICY
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* RICH EDIT BULLION ITEM MODAL WITH IMAGE UPLOAD           */}
      {/* ======================================================== */}
      {editingItem && (
        <BullionProductEditorModal
          initialItem={editingItem}
          goldGram={goldGram}
          silverGram={silverGram}
          onClose={() => setEditingItem(null)}
          onSave={handleUpdateBullionItem}
        />
      )}

      {/* ======================================================== */}
      {/* ADD NEW BULLION ITEM MODAL WITH IMAGE UPLOAD             */}
      {/* ======================================================== */}
      {isNewItemModal && (
        <BullionProductEditorModal
          initialItem={{
            id: `${Date.now()}-${bullionSubTab}`,
            name: bullionSubTab === "gold" ? "New Minted Gold Bar" : "New Minted Silver Bar",
            metal: bullionSubTab,
            weightGrams: bullionSubTab === "gold" ? 10 : 100,
            purity: bullionSubTab === "gold" ? "999.9 (24K)" : "999 Fine Silver",
            type: "bar",
            premiumPercentage: 0.05,
            priceMode: "auto",
            refiner: "LBMA Certified Refiner",
            badge: "LBMA Good Delivery",
            perk: bullionSubTab === "gold" ? "Free Vault Storage" : "Secure Delivery",
            vatStatus: bullionSubTab === "gold" ? "0% VAT Exempt" : "20% Standard VAT",
            buttonText: "Inquire / Lock Price",
            imageUrl: bullionSubTab === "gold" ? "/bullion/gold-bar-10g.webp" : "/bullion/silver-bar-100g.webp",
            inStock: true,
          }}
          goldGram={goldGram}
          silverGram={silverGram}
          isNew
          onClose={() => setIsNewItemModal(false)}
          onSave={handleAddBullionItem}
        />
      )}

      {/* ======================================================== */}
      {/* SLIDE EDITOR MODAL (ADD / EDIT)                          */}
      {/* ======================================================== */}
      {(editingSlide || isNewSlideModal) && (
        <SlideEditorModal
          initialSlide={
            editingSlide || {
              id: `slide-${Date.now()}`,
              title: "New Showroom Announcement",
              subtitle: "Exclusive fine jewellery collection and bullion offers in Bradford.",
              tag: "NEW ARRIVAL",
              imageUrl: "/offers/offer-1.jpg",
              linkUrl: "/offers",
              buttonText: "Discover Now",
              active: true,
              order: (siteContent.slides?.length || 0) + 1,
            }
          }
          onClose={() => {
            setEditingSlide(null);
            setIsNewSlideModal(false);
          }}
          onSave={handleSaveSlide}
        />
      )}
    </div>
  );
}

// ----------------------------------------------------
// DUAL-PANE PRODUCT EDITOR MODAL WITH IMAGE UPLOAD
// ----------------------------------------------------
function BullionProductEditorModal({
  initialItem,
  goldGram,
  silverGram,
  isNew = false,
  onClose,
  onSave,
}: {
  initialItem: BullionProduct;
  goldGram: number;
  silverGram: number;
  isNew?: boolean;
  onClose: () => void;
  onSave: (item: BullionProduct) => void;
}) {
  const [formData, setFormData] = useState<BullionProduct>({
    ...initialItem,
    badge: initialItem.badge || (initialItem.type === "coin" ? "The Royal Mint" : "LBMA Good Delivery"),
    perk: initialItem.perk || (initialItem.metal === "silver" ? "Secure Delivery" : "Free Vault Storage"),
    vatStatus: initialItem.vatStatus || (initialItem.metal === "silver" ? "20% Standard VAT" : "0% VAT Exempt"),
    buttonText: initialItem.buttonText || "Inquire / Lock Price",
    priceMode: initialItem.priceMode || (initialItem.customPriceOverride ? "fixed" : "auto"),
  });

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle direct file upload from computer
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Local preview immediately
      const localUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, imageUrl: localUrl }));

      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: data,
      });

      const json = await res.json();
      if (json.success && json.url) {
        setFormData((prev) => ({ ...prev, imageUrl: json.url }));
      } else {
        // Fallback: convert to base64 Data URL
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setFormData((prev) => ({ ...prev, imageUrl: reader.result as string }));
          }
        };
        reader.readAsDataURL(file);
      }
    } catch {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setFormData((prev) => ({ ...prev, imageUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  // Calculate live preview price automatically as user changes weight or markup
  const priceInfo = getBullionCalculatedPrice(formData, goldGram, silverGram);
  const currentSpot = formData.metal === "silver" ? silverGram : goldGram;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-6 animate-in fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-white rounded-3xl border-2 border-[#dfcca6] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gold Accent */}
        <div className="h-1.5 bg-gradient-to-r from-[#d4af37] via-[#f7e799] to-[#aa7c11] shrink-0" />

        {/* Modal Header */}
        <div className="px-5 sm:px-7 py-4 border-b border-stone-100 flex items-center justify-between bg-[#faf8f5] shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold font-notche uppercase tracking-wider px-2 py-0.5 rounded bg-[#f5ecdc] text-[#8b6914] border border-[#dfcca6]">
                {formData.metal.toUpperCase()} BULLION
              </span>
              <h3 className="font-notche font-bold text-slate-900 text-base sm:text-lg">
                {isNew ? "Add New Bullion Product" : `Edit Product Card: ${formData.name || formData.id}`}
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Edit product card details. Price calculates dynamically based on live spot rate.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Body: 2 Columns on Desktop */}
        <div className="p-5 sm:p-7 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
          
          {/* LEFT COLUMN: LIVE VISUAL CARD PREVIEW */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 font-notche flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Card Preview
              </span>
              <span className="text-[10px] text-stone-400 font-medium">As shown to client</span>
            </div>

            {/* Exactly the user-uploaded Bullion Card */}
            <div className="w-full max-w-[300px] bg-gradient-to-b from-white via-[#fdfbf9] to-[#fbf7f0] border-2 border-[#dfcca6] rounded-2xl p-4 shadow-[0_8px_30px_rgba(212,175,55,0.18)] relative overflow-hidden flex flex-col justify-between">
              {/* Metallic Accent Strip */}
              <div
                className={`absolute top-0 left-0 right-0 h-1.5 ${
                  formData.metal === "silver"
                    ? "bg-gradient-to-r from-slate-400 via-slate-200 to-slate-500"
                    : "bg-gradient-to-r from-[#d4af37] via-[#f7e799] to-[#aa7c11]"
                }`}
              />

              {/* Best Seller / Popular Badge */}
              {formData.popular && (
                <span className="absolute top-3 right-3 bg-gradient-to-r from-[#9c8254] to-[#73582a] text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs z-10 flex items-center gap-1 font-notche">
                  ✦ Popular
                </span>
              )}

              <div>
                {/* Image Stage */}
                <div className="relative w-full h-40 rounded-xl bg-gradient-to-b from-[#faf6ee] via-[#f4ebd9] to-[#faf6ee] border border-[#dfcca6]/50 p-3 flex items-center justify-center mb-3 overflow-hidden shadow-inner">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.95)_0%,_rgba(244,235,217,0.35)_70%,_transparent_100%)] pointer-events-none" />
                  
                  <img
                    src={formData.imageUrl || "/bullion/gold-bar-1g.webp"}
                    alt={formData.name}
                    className="relative z-10 h-full max-w-full object-contain filter drop-shadow-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/bullion/gold-bar-1g.webp";
                    }}
                  />

                  {/* Certification Badge over image */}
                  <span className="absolute bottom-2 left-2 z-10 bg-white/95 backdrop-blur-xs text-[#8b6914] text-[9.5px] font-bold px-1.5 py-0.5 rounded border border-[#dfcca6]/60 shadow-2xs font-notche">
                    {formData.badge || "LBMA Good Delivery"}
                  </span>
                </div>

                {/* Purity & Refiner */}
                <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                  <span
                    className={`text-[9.5px] font-black text-white px-2 py-0.5 rounded shadow-2xs uppercase tracking-wider font-notche ${
                      formData.metal === "silver"
                        ? "bg-slate-700"
                        : "bg-gradient-to-r from-[#8b6914] to-[#aa7c11]"
                    }`}
                  >
                    {formData.purity}
                  </span>
                  <span className="text-[11px] text-slate-500 font-semibold truncate max-w-[130px]">
                    {formData.refiner}
                  </span>
                </div>

                {/* Product Title */}
                <h3 className="text-sm font-notche font-bold text-slate-900 leading-snug line-clamp-2 min-h-[2.4rem]">
                  {formData.name || "Untitled Product"}
                </h3>

                {/* Weight & Perk */}
                <div className="mt-1 flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                  <span>Weight: <strong className="text-slate-800 font-numbers">{formData.weightGrams}g</strong></span>
                  <span>·</span>
                  <span className="text-emerald-700 font-bold">{formData.perk || "Free Vault Storage"}</span>
                </div>
              </div>

              {/* Price & Action Section */}
              <div className="mt-3 pt-3 border-t border-[#dfcca6]/50">
                <div className="flex items-end justify-between gap-1 mb-2">
                  <div>
                    <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block font-notche">
                      {priceInfo.isAuto ? "LIVE SPOT PRICE" : "SHOWROOM DEAL PRICE"}
                    </span>
                    <span className="text-2xl font-numbers font-bold text-[#8b6914] tracking-tight">
                      £{priceInfo.finalPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] text-slate-400 font-semibold block">VAT Status</span>
                    <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      {formData.vatStatus || "0% VAT Exempt"}
                    </span>
                  </div>
                </div>

                {/* WhatsApp Button */}
                <div className="w-full py-2 rounded-xl bg-gradient-to-r from-[#9c8254] via-[#caa771] to-[#8b6914] text-white text-xs font-notche font-bold tracking-wider shadow-sm flex items-center justify-center gap-1.5 cursor-pointer">
                  <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  <span>{formData.buttonText || "Inquire / Lock Price"}</span>
                </div>
              </div>
            </div>

            {/* Price Calculation Explainer Banner */}
            <div className="w-full mt-3 p-3 rounded-xl bg-[#fbf8f2] border border-[#dfcca6] text-[11px] text-stone-600 space-y-1">
              <div className="flex items-center justify-between font-bold text-stone-800">
                <span>⚡ Pricing Calculation:</span>
                <span className="font-numbers text-[#8b6914] font-bold">
                  {priceInfo.isAuto ? "Auto Live Sync" : "Manual Fixed"}
                </span>
              </div>
              <p className="text-[10.5px] leading-tight text-stone-500">
                {priceInfo.isAuto
                  ? `Formula: ${formData.weightGrams}g × £${currentSpot.toFixed(2)}/g + ${(formData.premiumPercentage * 100).toFixed(1)}% Markup = £${priceInfo.finalPrice.toFixed(2)}`
                  : `Locked at custom showroom price £${formData.customPriceOverride}. Market rate changes won't affect this price.`}
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: EDIT PRODUCT FORM */}
          <div className="md:col-span-7 space-y-4 text-xs">
            
            {/* PRICING MODE SELECTOR */}
            <div className="p-3.5 rounded-2xl border-2 border-[#dfcca6] bg-[#faf8f5] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-notche font-bold text-slate-900 text-xs uppercase tracking-wide">
                  Pricing Mode & Auto Spot Sync
                </span>
                <span className="font-numbers text-[11px] text-[#8b6914] font-bold">
                  Live Spot: £{currentSpot.toFixed(2)}/g
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      priceMode: "auto",
                      customPriceOverride: undefined,
                    })
                  }
                  className={`py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    formData.priceMode !== "fixed"
                      ? "bg-emerald-600 text-white shadow-xs font-notche"
                      : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  <span>⚡ Auto Spot Price</span>
                  <span className="text-[10px] bg-black/20 px-1 rounded font-normal">Auto</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      priceMode: "fixed",
                      customPriceOverride: formData.customPriceOverride || priceInfo.finalPrice,
                    })
                  }
                  className={`py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    formData.priceMode === "fixed"
                      ? "bg-[#8b6914] text-white shadow-xs font-notche"
                      : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  <span>🔒 Fixed Deal Price</span>
                  <span className="text-[10px] bg-black/20 px-1 rounded font-normal">Fixed</span>
                </button>
              </div>

              {formData.priceMode === "fixed" ? (
                <div className="pt-1">
                  <label className="block font-bold text-stone-700 mb-1">
                    Fixed Showroom Price (£ Override)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.customPriceOverride || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customPriceOverride: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 text-sm rounded-xl border border-[#8b6914] bg-white font-numbers font-bold text-[#8b6914] focus:outline-none focus:ring-2 focus:ring-[#8b6914]"
                    placeholder="e.g. 108.50"
                  />
                  <p className="text-[10px] text-stone-400 mt-1">
                    To revert to auto changing price, click "⚡ Auto Spot Price" above.
                  </p>
                </div>
              ) : (
                <div className="pt-1 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Markup / Premium % (e.g. 0.12 = 12%)
                    </label>
                    <input
                      type="number"
                      step="0.005"
                      value={formData.premiumPercentage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          premiumPercentage: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-numbers font-semibold focus:outline-none focus:ring-1 focus:ring-[#8b6914]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Quick Markup Presets</label>
                    <div className="flex items-center gap-1">
                      {[0.03, 0.05, 0.07, 0.1, 0.12].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setFormData({ ...formData, premiumPercentage: pct })}
                          className={`flex-1 py-1 text-[10.5px] font-numbers font-bold rounded-lg border cursor-pointer transition-colors ${
                            formData.premiumPercentage === pct
                              ? "bg-[#8b6914] text-white border-[#8b6914]"
                              : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                          }`}
                        >
                          {(pct * 100).toFixed(0)}%
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* PRODUCT TITLE */}
            <div>
              <label className="block font-bold text-stone-700 mb-1 uppercase text-[11px]">
                Product Title (Name)
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-[#faf8f5] focus:outline-none focus:ring-1 focus:ring-[#8b6914] font-medium"
                placeholder="e.g. 1 Gram Minted Gold Bar"
              />
            </div>

            {/* WEIGHT & PURITY */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1 uppercase text-[11px]">
                  Weight (Grams) — Auto Updates Price
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={formData.weightGrams}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      weightGrams: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-[#faf8f5] font-numbers font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#8b6914]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1 uppercase text-[11px]">
                  Purity / Fineness
                </label>
                <input
                  type="text"
                  value={formData.purity}
                  onChange={(e) => setFormData({ ...formData, purity: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-[#faf8f5] focus:outline-none focus:ring-1 focus:ring-[#8b6914]"
                  placeholder="e.g. 999.9 (24K) or 916.7 (22K)"
                />
              </div>
            </div>

            {/* IMAGE UPLOAD SECTION */}
            <div className="p-3.5 rounded-2xl border border-[#dfcca6] bg-[#faf8f5] space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="block font-bold text-stone-800 uppercase text-[11px]">
                  Product Image (Upload from Computer or enter URL)
                </label>
                {isUploading && (
                  <span className="text-[10px] text-[#8b6914] font-bold animate-pulse flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#8b6914] animate-ping" />
                    Uploading...
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageFileChange}
                  accept="image/*"
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-4 py-2 rounded-xl bg-white border border-[#dfcca6] hover:bg-[#8b6914] hover:text-white text-stone-800 font-notche font-bold text-xs transition-all shadow-2xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span>Choose Photo from Device</span>
                </button>

                <span className="text-[11px] text-stone-400">or enter link:</span>

                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="/bullion/gold-bar-1g.webp"
                  className="flex-1 px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs font-mono focus:outline-none"
                />
              </div>
            </div>

            {/* REFINER / MINT & CERTIFICATION BADGE */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1 uppercase text-[11px]">
                  Refiner / Mint
                </label>
                <input
                  type="text"
                  value={formData.refiner}
                  onChange={(e) => setFormData({ ...formData, refiner: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-[#faf8f5] focus:outline-none focus:ring-1 focus:ring-[#8b6914]"
                  placeholder="e.g. PAMP Suisse / Metalor"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1 uppercase text-[11px]">
                  Image Badge (on card)
                </label>
                <input
                  type="text"
                  value={formData.badge || ""}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-[#faf8f5] focus:outline-none focus:ring-1 focus:ring-[#8b6914]"
                  placeholder="e.g. LBMA Good Delivery"
                />
              </div>
            </div>

            {/* PERK / FEATURE TEXT & VAT STATUS */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1 uppercase text-[11px]">
                  Card Perk (Next to Weight)
                </label>
                <input
                  type="text"
                  value={formData.perk || ""}
                  onChange={(e) => setFormData({ ...formData, perk: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-[#faf8f5] focus:outline-none focus:ring-1 focus:ring-[#8b6914]"
                  placeholder="e.g. Free Vault Storage"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1 uppercase text-[11px]">
                  VAT Exemption Status
                </label>
                <input
                  type="text"
                  value={formData.vatStatus || ""}
                  onChange={(e) => setFormData({ ...formData, vatStatus: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-[#faf8f5] focus:outline-none focus:ring-1 focus:ring-[#8b6914]"
                  placeholder="e.g. 0% VAT Exempt"
                />
              </div>
            </div>

            {/* BUTTON TEXT & TYPE */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1 uppercase text-[11px]">
                  Action Button Label
                </label>
                <input
                  type="text"
                  value={formData.buttonText || ""}
                  onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-[#faf8f5] focus:outline-none focus:ring-1 focus:ring-[#8b6914]"
                  placeholder="Inquire / Lock Price"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1 uppercase text-[11px]">
                  Category Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as "bar" | "coin" })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-[#faf8f5] focus:outline-none"
                >
                  <option value="bar">Bullion Bar</option>
                  <option value="coin">Bullion Coin</option>
                </select>
              </div>
            </div>

            {/* TOGGLES: IN STOCK & POPULAR */}
            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.inStock !== false}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  className="w-4 h-4 text-[#8b6914] rounded cursor-pointer"
                />
                <span className="font-bold text-stone-700">In Stock for Sale</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(formData.popular)}
                  onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                  className="w-4 h-4 text-[#8b6914] rounded cursor-pointer"
                />
                <span className="font-bold text-stone-700">Best Seller / Popular Badge</span>
              </label>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-7 py-3.5 border-t border-stone-200 bg-[#faf8f5] flex items-center justify-between shrink-0">
          <div className="text-xs text-stone-500">
            <span>Price Result: </span>
            <strong className="font-numbers text-base text-[#8b6914]">
              £{priceInfo.finalPrice.toFixed(2)}
            </strong>
            <span className="ml-1 text-[11px]">
              ({priceInfo.isAuto ? "Auto dynamic" : "Fixed override"})
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-300 text-stone-600 font-semibold text-xs hover:bg-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onSave(formData)}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#7a5d28] via-[#8b6914] to-[#73582a] hover:from-[#664d1f] hover:to-[#5a441e] text-white font-notche font-bold text-xs tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              {isNew ? "ADD PRODUCT" : "UPDATE PRODUCT CARD"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// SLIDE EDITOR MODAL WITH IMAGE UPLOAD
// ----------------------------------------------------
function SlideEditorModal({
  initialSlide,
  onClose,
  onSave,
}: {
  initialSlide: PageSlide;
  onClose: () => void;
  onSave: (slide: PageSlide) => void;
}) {
  const [slideData, setSlideData] = useState<PageSlide>(initialSlide);
  const [isUploading, setIsUploading] = useState(false);
  const slideFileInputRef = useRef<HTMLInputElement>(null);

  const handleSlideImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const localUrl = URL.createObjectURL(file);
      setSlideData((prev) => ({ ...prev, imageUrl: localUrl }));

      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: data,
      });

      const json = await res.json();
      if (json.success && json.url) {
        setSlideData((prev) => ({ ...prev, imageUrl: json.url }));
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setSlideData((prev) => ({ ...prev, imageUrl: reader.result as string }));
          }
        };
        reader.readAsDataURL(file);
      }
    } catch {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setSlideData((prev) => ({ ...prev, imageUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-6 animate-in fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-3xl border-2 border-[#dfcca6] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1.5 bg-gradient-to-r from-[#d4af37] via-[#f7e799] to-[#aa7c11] shrink-0" />

        <div className="px-5 sm:px-7 py-4 border-b border-stone-100 flex items-center justify-between bg-[#faf8f5] shrink-0">
          <div>
            <h3 className="font-notche font-bold text-slate-900 text-base sm:text-lg">
              Slide Editor
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Configure homepage / showcase slide visuals, text, and link.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-5 sm:p-7 overflow-y-auto space-y-4 text-xs">
          {/* Live Preview Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#faf6ee] to-[#f4ebd9] border border-[#dfcca6] flex items-center gap-4">
            <div className="w-24 h-24 rounded-xl bg-white border border-[#dfcca6]/60 p-2 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
              <img
                src={slideData.imageUrl}
                alt={slideData.title}
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/offers/offer-1.jpg";
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              {slideData.tag && (
                <span className="text-[9.5px] font-bold font-notche px-2 py-0.5 rounded bg-white text-[#8b6914] border border-[#dfcca6] inline-block mb-1">
                  {slideData.tag}
                </span>
              )}
              <h4 className="font-notche font-bold text-slate-900 text-sm truncate">
                {slideData.title || "Untitled Slide"}
              </h4>
              <p className="text-[11px] text-stone-600 line-clamp-2 mt-0.5">
                {slideData.subtitle || "No description provided."}
              </p>
              <div className="mt-2 text-[10px] text-[#8b6914] font-bold font-notche flex items-center gap-1">
                <span>Button: {slideData.buttonText || "Discover"}</span>
                <span>→</span>
                <span className="text-stone-400 font-mono font-normal truncate max-w-[150px]">{slideData.linkUrl}</span>
              </div>
            </div>
          </div>

          {/* Form fields */}
          <div>
            <label className="block font-bold text-stone-700 mb-1 uppercase text-[11px]">
              Slide Title
            </label>
            <input
              type="text"
              value={slideData.title}
              onChange={(e) => setSlideData({ ...slideData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-[#faf8f5] focus:outline-none focus:ring-1 focus:ring-[#8b6914] font-medium"
              placeholder="e.g. Royal 22K Bridal & Filigree Jewellery"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1 uppercase text-[11px]">
              Slide Subtitle / Description
            </label>
            <textarea
              rows={2}
              value={slideData.subtitle}
              onChange={(e) => setSlideData({ ...slideData, subtitle: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-[#faf8f5] focus:outline-none focus:ring-1 focus:ring-[#8b6914] leading-relaxed"
              placeholder="e.g. Handcrafted heirloom bridal sets fresh from our Bradford artisan workshop."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1 uppercase text-[11px]">
                Tag Badge
              </label>
              <input
                type="text"
                value={slideData.tag || ""}
                onChange={(e) => setSlideData({ ...slideData, tag: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-[#faf8f5] focus:outline-none focus:ring-1 focus:ring-[#8b6914]"
                placeholder="e.g. SHOWROOM ARRIVALS"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1 uppercase text-[11px]">
                Display Order
              </label>
              <input
                type="number"
                value={slideData.order || 1}
                onChange={(e) => setSlideData({ ...slideData, order: parseInt(e.target.value) || 1 })}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-[#faf8f5] font-numbers focus:outline-none focus:ring-1 focus:ring-[#8b6914]"
              />
            </div>
          </div>

          {/* IMAGE UPLOAD SECTION */}
          <div className="p-3.5 rounded-2xl border border-[#dfcca6] bg-[#faf8f5] space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block font-bold text-stone-800 uppercase text-[11px]">
                Slide Image (Upload or enter URL)
              </label>
              {isUploading && (
                <span className="text-[10px] text-[#8b6914] font-bold animate-pulse">
                  Uploading...
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <input
                type="file"
                ref={slideFileInputRef}
                onChange={handleSlideImageUpload}
                accept="image/*"
                className="hidden"
              />

              <button
                type="button"
                onClick={() => slideFileInputRef.current?.click()}
                disabled={isUploading}
                className="px-4 py-2 rounded-xl bg-white border border-[#dfcca6] hover:bg-[#8b6914] hover:text-white text-stone-800 font-notche font-bold text-xs transition-all shadow-2xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                📁 Upload Photo from Device
              </button>

              <input
                type="text"
                value={slideData.imageUrl}
                onChange={(e) => setSlideData({ ...slideData, imageUrl: e.target.value })}
                placeholder="/offers/offer-1.jpg"
                className="flex-1 px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs font-mono focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1 uppercase text-[11px]">
                Button CTA Text
              </label>
              <input
                type="text"
                value={slideData.buttonText}
                onChange={(e) => setSlideData({ ...slideData, buttonText: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-[#faf8f5] focus:outline-none focus:ring-1 focus:ring-[#8b6914]"
                placeholder="View Today's Offers"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1 uppercase text-[11px]">
                Target Link URL
              </label>
              <input
                type="text"
                value={slideData.linkUrl}
                onChange={(e) => setSlideData({ ...slideData, linkUrl: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-[#faf8f5] focus:outline-none focus:ring-1 focus:ring-[#8b6914]"
                placeholder="/offers or /gold-bars"
              />
            </div>
          </div>

          <div className="pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={slideData.active !== false}
                onChange={(e) => setSlideData({ ...slideData, active: e.target.checked })}
                className="w-4 h-4 text-[#8b6914] rounded cursor-pointer"
              />
              <span className="font-bold text-stone-700">Display this slide on website</span>
            </label>
          </div>
        </div>

        <div className="px-5 sm:px-7 py-3.5 border-t border-stone-200 bg-[#faf8f5] flex items-center justify-end gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-stone-300 text-stone-600 font-semibold text-xs hover:bg-white cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave(slideData)}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#7a5d28] via-[#8b6914] to-[#73582a] hover:from-[#664d1f] hover:to-[#5a441e] text-white font-notche font-bold text-xs tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            SAVE SLIDE
          </button>
        </div>
      </div>
    </div>
  );
}
