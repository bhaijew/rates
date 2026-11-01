"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import BLogo from "./BLogo";

export default function SiteLoader() {
  const [loading, setLoading] = useState(true);
  const [navigating, setNavigating] = useState(false);
  const pathname = usePathname();

  // Initial site load animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 650);

    return () => clearTimeout(timer);
  }, []);

  // Quick top progress line on route navigation
  useEffect(() => {
    setNavigating(true);
    const navTimer = setTimeout(() => {
      setNavigating(false);
    }, 400);

    return () => clearTimeout(navTimer);
  }, [pathname]);

  return (
    <>
      {/* Top Navigation Progress Bar */}
      {navigating && (
        <div className="fixed top-0 left-0 right-0 h-[3px] z-[99999] overflow-hidden bg-transparent pointer-events-none">
          <div className="h-full bg-gradient-to-r from-[#eedbb9] via-[#9c8254] to-[#73582a] animate-[shimmer_1s_infinite] w-full" />
        </div>
      )}

      {/* Initial Site Splash Loader */}
      <div
        aria-hidden={!loading}
        className={`fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center transition-all duration-500 ease-out ${
          loading
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none invisible"
        }`}
      >
        <div className="flex flex-col items-center gap-4">
          {/* Animated Gold B Emblem */}
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[8px] border-2 border-[#dfcca6] bg-white p-1.5 flex items-center justify-center shadow-md animate-pulse">
              <div className="w-full h-full rounded-[5px] bg-[#fdfbf7] flex items-center justify-center">
                <BLogo className="w-9 h-9 sm:w-11 sm:h-11" />
              </div>
            </div>
            {/* Subtle Gold Shimmer Ring */}
            <div className="absolute -inset-1.5 rounded-[10px] border border-[#dfcca6]/50 animate-ping pointer-events-none opacity-25" />
          </div>

          {/* Brand Name */}
          <div className="flex flex-col items-center text-center mt-1">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
              Bhai Jeweller
            </span>
            <span className="text-xs sm:text-sm font-medium text-[#9c8254] tracking-widest uppercase mt-0.5">
              Live Gold & Silver Rates
            </span>
          </div>

          {/* Luxury Shimmer Loading Bar */}
          <div className="w-40 h-1 bg-[#f0e8d9] rounded-full overflow-hidden mt-2 relative">
            <div className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#dfcca6] via-[#9c8254] to-[#73582a] w-1/2 rounded-full animate-[loaderSlide_1.2s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
    </>
  );
}

