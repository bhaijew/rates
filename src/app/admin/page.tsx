"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BullionProduct, INITIAL_GOLD_ITEMS, INITIAL_SILVER_ITEMS } from "@/data/bullion-items";
import { SiteContent, INITIAL_SITE_CONTENT } from "@/data/site-content";

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
    // Default executive PIN: 7860 or bhai786
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
          {/* Top Gold Accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#d4af37] via-[#f7e799] to-[#aa7c11] rounded-t-3xl" />

          {/* Emblem */}
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
            <span>📍 Find Us & Timings</span>
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

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 mt-6">
        
        {/* ======================================================== */}
        {/* TAB 1: BULLION & PRODUCTS (GOLD & SILVER)               */}
        {/* ======================================================== */}
        {activeTab === "bullion" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Bullion Subheader & Switcher */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/80 border border-[#dfcca6] rounded-2xl p-4 sm:p-5 shadow-2xs">
              
              {/* Metal Toggle */}
              <div className="flex items-center gap-2 bg-[#faf8f5] p-1 rounded-xl border border-[#dfcca6]">
                <button
                  onClick={() => setBullionSubTab("gold")}
                  className={`px-4 py-2 rounded-lg font-notche font-bold text-xs transition-all cursor-pointer flex items-center gap-2 ${
                    bullionSubTab === "gold"
                      ? "bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-white shadow"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <span>✨ 24K Gold Bars & Coins</span>
                  <span className="font-numbers text-xs font-bold">({goldItems.length})</span>
                </button>

                <button
                  onClick={() => setBullionSubTab("silver")}
                  className={`px-4 py-2 rounded-lg font-notche font-bold text-xs transition-all cursor-pointer flex items-center gap-2 ${
                    bullionSubTab === "silver"
                      ? "bg-gradient-to-r from-slate-600 to-slate-800 text-white shadow"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <span>🥈 Fine Silver Bars & Coins</span>
                  <span className="font-numbers text-xs font-bold">({silverItems.length})</span>
                </button>
              </div>

              {/* Filters & Add Item Button */}
              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search item, refiner, weight..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-3.5 py-2 text-xs rounded-xl border border-[#dfcca6] bg-white focus:outline-none focus:ring-1 focus:ring-[#8b6914] w-full sm:w-60"
                />

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as any)}
                  className="px-3 py-2 text-xs rounded-xl border border-[#dfcca6] bg-white focus:outline-none cursor-pointer"
                >
                  <option value="all">All Types</option>
                  <option value="bar">Bars Only</option>
                  <option value="coin">Coins Only</option>
                </select>

                <button
                  onClick={() => {
                    setIsNewItemModal(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#8b6914] hover:bg-[#a67c1e] text-white font-notche font-bold text-xs tracking-wider transition-colors shadow cursor-pointer whitespace-nowrap ml-auto sm:ml-0"
                >
                  + ADD NEW ITEM
                </button>
              </div>

            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBullion.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-[#dfcca6]/80 rounded-2xl p-4 shadow-2xs hover:shadow-md transition-shadow relative flex flex-col justify-between"
                >
                  {/* Top Header */}
                  <div>
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

                  {/* Specifications & Pricing Info */}
                  <div className="mt-4 pt-3 border-t border-stone-100 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase">Weight:</span>
                      <span className="font-numbers font-bold text-stone-800">
                        {item.weightGrams}g
                      </span>
                    </div>

                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase">Premium Markup:</span>
                      <span className="font-numbers font-semibold text-stone-800">
                        +{(item.premiumPercentage * 100).toFixed(1)}%
                      </span>
                    </div>

                    <div className="col-span-2 mt-1 bg-[#faf8f5] p-2 rounded-lg border border-[#dfcca6]/50 flex items-center justify-between">
                      <span className="text-stone-500 text-[11px]">Pricing Mode:</span>
                      {item.customPriceOverride ? (
                        <span className="font-numbers font-bold text-emerald-700">
                          Fixed £{item.customPriceOverride}
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-[#8b6914]">
                          Auto Live Spot + {(item.premiumPercentage * 100).toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="flex-1 py-1.5 px-3 rounded-lg border border-[#dfcca6] bg-[#faf8f5] hover:bg-[#8b6914] hover:text-white text-stone-700 font-notche text-xs font-bold transition-all cursor-pointer text-center"
                    >
                      EDIT DETAILS & PRICE
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
              ))}
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
                  SAVE CONTACT INFO
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: FIND US & TIMINGS                                 */}
        {/* ======================================================== */}
        {activeTab === "findUs" && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
            <div className="bg-white border border-[#dfcca6] rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
              
              <div className="border-b border-stone-100 pb-4">
                <h2 className="text-lg sm:text-xl font-notche font-bold text-slate-900">
                  Showroom Location & Opening Hours
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Update your flagship Bradford location address, daily schedule, and map embed.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Full Physical Address
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
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#dfcca6] bg-[#faf8f5] focus:outline-none focus:ring-1 focus:ring-[#8b6914]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Google Maps Embed Link (iframe src)
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
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#dfcca6] bg-[#faf8f5] focus:outline-none focus:ring-1 focus:ring-[#8b6914]"
                  />
                </div>

                {/* Day-by-day Opening Hours Table */}
                <div className="pt-2">
                  <h3 className="text-xs font-bold text-stone-700 uppercase mb-2">
                    Daily Opening Schedule
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {siteContent.findUs.openingHours.map((oh, idx) => (
                      <div
                        key={oh.day}
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-[#faf8f5] border border-[#dfcca6]/60"
                      >
                        <span className="w-24 text-xs font-bold text-slate-800">{oh.day}:</span>
                        <input
                          type="text"
                          value={oh.hours}
                          onChange={(e) => {
                            const newHours = [...siteContent.findUs.openingHours];
                            newHours[idx] = { ...newHours[idx], hours: e.target.value };
                            setSiteContent({
                              ...siteContent,
                              findUs: { ...siteContent.findUs, openingHours: newHours },
                            });
                          }}
                          className="flex-1 px-2.5 py-1 text-xs rounded-lg border border-stone-200 bg-white font-numbers font-medium focus:outline-none"
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
                    Privacy Policy & Regulatory Compliance
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Edit compliance statements, AML/KYC notices, and customer data terms.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newSection = {
                      id: `sec-${Date.now()}`,
                      title: `${siteContent.privacyPolicy.sections.length + 1}. New Policy Clause`,
                      content: "Enter policy text here...",
                    };
                    setSiteContent({
                      ...siteContent,
                      privacyPolicy: {
                        ...siteContent.privacyPolicy,
                        sections: [...siteContent.privacyPolicy.sections, newSection],
                      },
                    });
                  }}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg border border-[#dfcca6] bg-[#faf8f5] hover:bg-white text-[#8b6914] cursor-pointer"
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
      {/* EDIT BULLION ITEM MODAL                                  */}
      {/* ======================================================== */}
      {editingItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in"
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl border border-[#dfcca6] p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-notche font-bold text-slate-900 text-base">
                Edit Bullion Item: {editingItem.id}
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-stone-400 hover:text-stone-800 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Item Title</label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#faf8f5] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Weight (Grams)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={editingItem.weightGrams}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, weightGrams: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#faf8f5] font-numbers focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Purity</label>
                  <input
                    type="text"
                    value={editingItem.purity}
                    onChange={(e) => setEditingItem({ ...editingItem, purity: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#faf8f5] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Premium Markup (e.g. 0.05 = 5%)
                  </label>
                  <input
                    type="number"
                    step="0.005"
                    value={editingItem.premiumPercentage}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        premiumPercentage: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#faf8f5] font-numbers focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Custom Fixed Price (£ Override)
                  </label>
                  <input
                    type="number"
                    placeholder="Leave 0 for auto spot"
                    value={editingItem.customPriceOverride || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        customPriceOverride: e.target.value ? parseFloat(e.target.value) : undefined,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#faf8f5] font-numbers focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Refiner / Mint</label>
                <input
                  type="text"
                  value={editingItem.refiner}
                  onChange={(e) => setEditingItem({ ...editingItem, refiner: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#faf8f5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={editingItem.imageUrl}
                  onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#faf8f5] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.inStock !== false}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, inStock: e.target.checked })
                    }
                    className="w-4 h-4 text-[#8b6914] rounded"
                  />
                  <span className="font-bold text-stone-700">In Stock</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingItem.popular)}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, popular: e.target.checked })
                    }
                    className="w-4 h-4 text-[#8b6914] rounded"
                  />
                  <span className="font-bold text-stone-700">Best Seller Badge</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 rounded-lg border border-stone-300 text-stone-600 font-medium text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateBullionItem(editingItem)}
                className="px-5 py-2 rounded-lg bg-[#8b6914] hover:bg-[#a67c1e] text-white font-notche font-bold text-xs tracking-wider shadow cursor-pointer"
              >
                UPDATE ITEM
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ADD NEW BULLION ITEM MODAL                               */}
      {/* ======================================================== */}
      {isNewItemModal && (
        <NewBullionItemModal
          metal={bullionSubTab}
          onClose={() => setIsNewItemModal(false)}
          onAdd={handleAddBullionItem}
        />
      )}

    </div>
  );
}

// Subcomponent: Add New Bullion Item Modal
function NewBullionItemModal({
  metal,
  onClose,
  onAdd,
}: {
  metal: "gold" | "silver";
  onClose: () => void;
  onAdd: (item: BullionProduct) => void;
}) {
  const [formData, setFormData] = useState<BullionProduct>({
    id: `${Date.now()}-${metal}`,
    name: "",
    metal,
    weightGrams: 10,
    purity: metal === "gold" ? "999.9 (24K)" : "999 Fine Silver",
    type: "bar",
    premiumPercentage: 0.05,
    refiner: "LBMA Certified",
    imageUrl: metal === "gold" ? "/bullion/gold-bar-10g.webp" : "/bullion/silver-bar-100g.webp",
    inStock: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return alert("Please enter item name");
    onAdd(formData);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in"
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white rounded-2xl border border-[#dfcca6] p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h3 className="font-notche font-bold text-slate-900 text-base">
            Add New {metal === "gold" ? "Gold" : "Silver"} Item
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-800 text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-stone-700 mb-1">Item Title</label>
            <input
              type="text"
              placeholder="e.g. 50g Minted Gold Bar"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#faf8f5] focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as "bar" | "coin" })
                }
                className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#faf8f5] focus:outline-none"
              >
                <option value="bar">Bar</option>
                <option value="coin">Coin</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Weight (Grams)</label>
              <input
                type="number"
                step="0.001"
                value={formData.weightGrams}
                onChange={(e) =>
                  setFormData({ ...formData, weightGrams: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#faf8f5] font-numbers focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Purity</label>
              <input
                type="text"
                value={formData.purity}
                onChange={(e) => setFormData({ ...formData, purity: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#faf8f5] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Premium Markup (0.05 = 5%)</label>
              <input
                type="number"
                step="0.005"
                value={formData.premiumPercentage}
                onChange={(e) =>
                  setFormData({ ...formData, premiumPercentage: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#faf8f5] font-numbers focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Refiner / Mint</label>
            <input
              type="text"
              value={formData.refiner}
              onChange={(e) => setFormData({ ...formData, refiner: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#faf8f5] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Image URL</label>
            <input
              type="text"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#faf8f5] focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-stone-300 text-stone-600 font-medium text-xs cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-[#8b6914] hover:bg-[#a67c1e] text-white font-notche font-bold text-xs tracking-wider shadow cursor-pointer"
          >
            ADD ITEM
          </button>
        </div>
      </form>
    </div>
  );
}
