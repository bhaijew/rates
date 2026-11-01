"use client";

import React from "react";

interface BLogoProps {
  className?: string;
  size?: number | string;
  showBadge?: boolean;
}

export default function BLogo({
  className = "w-6 h-6",
  showBadge = false,
}: BLogoProps) {
  if (showBadge) {
    return (
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[5px] border-2 border-[#dfcca6] bg-white hover:bg-[#faf7f2] p-1 flex items-center justify-center shadow-xs transition-all duration-200">
        <div className="w-full h-full rounded-[3px] bg-[#fdfbf7] flex items-center justify-center">
          <BLetter className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>
      </div>
    );
  }

  return <BLetter className={className} />;
}

export function BLetter({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="bLogoGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#eedbb9" />
          <stop offset="30%" stopColor="#c5a059" />
          <stop offset="70%" stopColor="#9c8254" />
          <stop offset="100%" stopColor="#73582a" />
        </linearGradient>
        <filter id="bLetterShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.15" floodColor="#73582a" />
        </filter>
      </defs>
      <path
        d="M 26 22 H 48 C 59 22 68 26.5 68 36 C 68 43 62 47.5 53 49 C 63 51 72 56 72 65.5 C 72 75 62 80 49 80 H 26 V 73.5 H 32 V 28.5 H 26 Z M 39 29.5 V 45.5 H 47.5 C 54.5 45.5 59.5 42 59.5 37.5 C 59.5 33 54.5 29.5 47.5 29.5 Z M 39 52 V 72.5 H 48.5 C 56.5 72.5 63 68 63 62.5 C 63 56.5 56.5 52 48.5 52 Z"
        fill="url(#bLogoGoldGrad)"
        fillRule="evenodd"
        filter="url(#bLetterShadow)"
      />
    </svg>
  );
}

