import React from "react";
import BLogo from "@/components/BLogo";

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white px-4">
      <div className="flex flex-col items-center gap-4">
        {/* Animated Gold B Emblem */}
        <div className="w-16 h-16 rounded-[8px] border-2 border-[#dfcca6] bg-white p-1.5 flex items-center justify-center shadow-md animate-pulse">
          <div className="w-full h-full rounded-[5px] bg-[#fdfbf7] flex items-center justify-center">
            <BLogo className="w-9 h-9" />
          </div>
        </div>

        {/* Brand Name */}
        <div className="flex flex-col items-center text-center">
          <span className="text-lg font-bold tracking-tight text-gray-900">
            Bhai Jeweller
          </span>
          <span className="text-xs font-medium text-[#9c8254] tracking-wider uppercase mt-0.5">
            Loading Rates...
          </span>
        </div>

        {/* Loading Spinner */}
        <div className="w-6 h-6 border-2 border-[#dfcca6] border-t-[#9c8254] rounded-full animate-spin mt-1" />
      </div>
    </div>
  );
}
