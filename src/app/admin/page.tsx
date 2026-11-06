"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BullionProduct, INITIAL_GOLD_ITEMS, INITIAL_SILVER_ITEMS } from "@/data/bullion-items";
import { SiteContent, INITIAL_SITE_CONTENT } from "@/data/site-content";

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
  // Authentication PIN state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<"bullion" | "contact" | "findUs" | "privacy">("bullion");
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
          if (res.data.siteContent) setSiteContent(res.data.siteContent);
        }
      })
      .catch((err) => console.error("Error loading admin content:", err));
  }, []);

  // PIN validation handler
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === "7860" || pinInput.toLowerCase() === "bhai786") {
      setIsAuthenticated(true);
      sessionStorage.setItem("bhai_admin_auth", "true");
      setPinError(false);
    } else {
      setPinError(true);
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

  // ----------------------------------------------------
  // LOGIN SCREEN (PIN PROTECTION)
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Luxury Glow Background */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-[#dfcca6]/40 via-[#d4af37]/20 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="relative w-full max-w-md bg-white/90 backdrop-blur-xl border-2 border-[#dfcca6] rounded-3xl p-8 sm:p-10 shadow-[0_16px_50px_-10px_rgba(139,105,20,0.2)] text-center">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#d4af37] via-[#f7e799] to-[#aa7c11] rounded-t-3xl" />

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#faf5ea] to-[#eedbb9] border border-[#d4af37]/60 flex items-center justify-center text-[#8b6914] mx-auto mb-5 shadow-sm">
            <svg className="w-8 h-8 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <h1 className="text-2xl sm:text-3xl font-notche font-bold text-slate-900 tracking-tight">
            Bhai Jeweller Admin
          </h1>
          <p className="text-xs text-stone-500 mt-1 mb-6">
            Enter authorized master PIN to access showroom management desk.
          </p>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter PIN (e.g. 7860)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className={`w-full px-4 py-3 text-center text-lg font-numbers tracking-widest rounded-xl border ${
                  pinError ? "border-rose-500 bg-rose-50" : "border-[#dfcca6] bg-[#faf8f5]"
                } focus:outline-none focus:ring-2 focus:ring-[#8b6914]`}
                autoFocus
              />
              {pinError && (
                <p className="text-xs text-rose-500 mt-1.5 font-medium">
                  Invalid PIN. Hint: Use 7860 or bhai786
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#7a5d28] via-[#8b6914] to-[#73582a] hover:from-[#664d1f] hover:to-[#5a441e] text-white font-notche font-bold tracking-wider text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
            >
              UNLOCK CONTROL PANEL
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
            <Link href="/" className="hover:text-[#8b6914] transition-colors">
              ← Return to Live Website
            </Link>
            <span className="font-numbers">v2.4 Pro</span>
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
                Live Pricing & Showroom Content Management
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
        {/* TAB 2: CONTACT & CHANNELS                                */}
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
        {/* TAB 3: FIND US & STORE HOURS                             */}
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
        {/* TAB 4: PRIVACY POLICY                                    */}
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
      {/* RICH EDIT BULLION ITEM MODAL WITH LIVE CARD PREVIEW      */}
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
      {/* ADD NEW BULLION ITEM MODAL                               */}
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
    </div>
  );
}

// ----------------------------------------------------
// DUAL-PANE PRODUCT EDITOR MODAL (CARD PREVIEW + AUTO-PRICING)
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
          
          {/* ======================================================== */}
          {/* LEFT COLUMN: LIVE VISUAL CARD PREVIEW                    */}
          {/* ======================================================== */}
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

          {/* ======================================================== */}
          {/* RIGHT COLUMN: EDIT PRODUCT FORM                          */}
          {/* ======================================================== */}
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
                  Weight (Grams) — Price Auto Updates
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

            {/* BUTTON TEXT & IMAGE URL */}
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
                  Image URL
                </label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-[#faf8f5] focus:outline-none focus:ring-1 focus:ring-[#8b6914]"
                />
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
