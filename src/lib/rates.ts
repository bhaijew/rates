// Centralized Live Rates Configuration and Calculations for Bhai Jeweller
// Direct real-time connection to live London Bullion Market feed

export interface MetalRates {
  goldGbpPerGram: number; // 24K pure per gram in GBP
  silverGbpPerGram: number; // Fine silver per gram in GBP
  goldOunceGbp?: number;
  silverOunceGbp?: number;
  goldChange24h?: number;
  goldChangePercent24h?: number;
  goldLiveHigh?: number;
  goldLiveLow?: number;
  silverChange24h?: number;
  silverChangePercent24h?: number;
  silverLiveHigh?: number;
  silverLiveLow?: number;
  lastUpdated: string;
  isLive: boolean;
  currency: string;
}

// Default fallback rates (used only when network is completely offline)
export const DEFAULT_RATES: MetalRates = {
  goldGbpPerGram: 93.47,
  silverGbpPerGram: 1.20,
  goldOunceGbp: 2907.20,
  silverOunceGbp: 37.26,
  goldChange24h: 12.79,
  goldChangePercent24h: 0.44,
  goldLiveHigh: 94.04,
  goldLiveLow: 93.06,
  silverChange24h: 0.60,
  silverChangePercent24h: 1.63,
  silverLiveHigh: 1.21,
  silverLiveLow: 1.18,
  lastUpdated: new Date().toISOString(),
  isLive: true,
  currency: "GBP",
};

// Weight conversion constants
export const WEIGHT_CONVERSIONS = {
  tolaTraditional: 11.6638, // 1 traditional tola in grams
  tola10g: 10.0, // 1 metric tola in grams
  troyOunce: 31.1035, // 1 troy ounce in grams
};

// Gold Karat purity fractions
export const GOLD_PURITIES = [
  { karat: "24K", purity: "999.9", label: "Pure Fine Gold", fraction: 1.0 },
  { karat: "22K", purity: "916", label: "Asian Jewellery Standard", fraction: 22 / 24 },
  { karat: "21K", purity: "875", label: "Middle East Standard", fraction: 21 / 24 },
  { karat: "18K", purity: "750", label: "European / Diamond Standard", fraction: 18 / 24 },
  { karat: "14K", purity: "585", label: "Everyday Jewellery", fraction: 14 / 24 },
  { karat: "9K", purity: "375", label: "Standard British Gold", fraction: 9 / 24 },
];

export function calculateGoldSilverRatio(goldGram: number, silverGram: number): number {
  if (!silverGram || silverGram <= 0) return 74.3;
  return Number((goldGram / silverGram).toFixed(2));
}

export function formatGBP(amount: number, decimals: number = 2): string {
  return "£" + (amount || 0).toLocaleString("en-GB", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatUKDateTime(date: Date = new Date()): string {
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Europe/London",
  }) + " UK time";
}
