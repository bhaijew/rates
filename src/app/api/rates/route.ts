import { NextResponse } from "next/server";
import { DEFAULT_RATES, calculateGoldSilverRatio } from "@/lib/rates";

const API_KEY = process.env.GOLD_API_KEY || "goldapi-7a9752a57eb151a0a449a7f057f7265c-io";

// Smart In-Memory Cache (15 minutes = 900,000 ms) to conserve free tier quota
const CACHE_DURATION_MS = 15 * 60 * 1000;

interface RatesResponse {
  goldGbpPerGram: number;
  silverGbpPerGram: number;
  goldOunceGbp: number;
  silverOunceGbp: number;
  ratio: number;
  lastUpdated: string;
  isLive: boolean;
  source: string;
}

let cachedData: RatesResponse | null = null;
let lastFetchTime = 0;

export async function GET() {
  const now = Date.now();

  // 1. Return fresh cached rates if within the 15-minute window
  if (cachedData && now - lastFetchTime < CACHE_DURATION_MS) {
    return NextResponse.json(cachedData);
  }

  // 2. Fetch live Gold and Silver in GBP concurrently from GoldAPI.io
  try {
    const [goldRes, silverRes] = await Promise.all([
      fetch("https://www.goldapi.io/api/XAU/GBP", {
        headers: {
          "x-access-token": API_KEY,
          "Content-Type": "application/json",
        },
        next: { revalidate: 900 },
      }),
      fetch("https://www.goldapi.io/api/XAG/GBP", {
        headers: {
          "x-access-token": API_KEY,
          "Content-Type": "application/json",
        },
        next: { revalidate: 900 },
      }),
    ]);

    if (!goldRes.ok || !silverRes.ok) {
      console.warn("GoldAPI status:", goldRes.status, silverRes.status);
      if (cachedData) return NextResponse.json(cachedData);
      return NextResponse.json({
        ...DEFAULT_RATES,
        goldOunceGbp: DEFAULT_RATES.goldGbpPerGram * 31.1035,
        silverOunceGbp: DEFAULT_RATES.silverGbpPerGram * 31.1035,
        ratio: calculateGoldSilverRatio(DEFAULT_RATES.goldGbpPerGram, DEFAULT_RATES.silverGbpPerGram),
        isLive: true,
        source: "default-fallback",
      });
    }

    const goldData = await goldRes.json();
    const silverData = await silverRes.json();

    const goldGbpPerGram = Number(goldData.price_gram_24k?.toFixed(2)) || DEFAULT_RATES.goldGbpPerGram;
    const silverGbpPerGram = Number(silverData.price_gram_24k?.toFixed(2)) || DEFAULT_RATES.silverGbpPerGram;
    const ratio = calculateGoldSilverRatio(goldGbpPerGram, silverGbpPerGram);

    cachedData = {
      goldGbpPerGram,
      silverGbpPerGram,
      goldOunceGbp: Number(goldData.price?.toFixed(2)) || Number((goldGbpPerGram * 31.1035).toFixed(2)),
      silverOunceGbp: Number(silverData.price?.toFixed(2)) || Number((silverGbpPerGram * 31.1035).toFixed(2)),
      ratio,
      lastUpdated: new Date().toISOString(),
      isLive: true,
      source: "goldapi.io",
    };

    lastFetchTime = now;
    return NextResponse.json(cachedData);
  } catch (error) {
    console.error("GoldAPI fetch error:", error);
    if (cachedData) return NextResponse.json(cachedData);
    return NextResponse.json({
      ...DEFAULT_RATES,
      goldOunceGbp: DEFAULT_RATES.goldGbpPerGram * 31.1035,
      silverOunceGbp: DEFAULT_RATES.silverGbpPerGram * 31.1035,
      ratio: calculateGoldSilverRatio(DEFAULT_RATES.goldGbpPerGram, DEFAULT_RATES.silverGbpPerGram),
      isLive: true,
      source: "error-fallback",
    });
  }
}
