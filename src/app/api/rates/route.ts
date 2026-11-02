import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_RATES, calculateGoldSilverRatio } from "@/lib/rates";

const API_KEY = process.env.GOLD_API_KEY || "goldapi-7a9752a57eb151a0a449a7f057f7265c-io";

// Short 20-second cache to prevent spam while delivering real-time pricing
const CACHE_DURATION_MS = 20 * 1000;

interface RatesResponse {
  goldGbpPerGram: number;
  silverGbpPerGram: number;
  goldOunceGbp: number;
  silverOunceGbp: number;
  goldChange24h: number;
  goldChangePercent24h: number;
  goldLiveHigh: number;
  goldLiveLow: number;
  silverChange24h: number;
  silverChangePercent24h: number;
  silverLiveHigh: number;
  silverLiveLow: number;
  ratio: number;
  lastUpdated: string;
  isLive: boolean;
  source: string;
}

let cachedData: RatesResponse | null = null;
let lastFetchTime = 0;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const forceFresh = searchParams.get("fresh") === "true";
  const now = Date.now();

  const responseHeaders = {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
    "CDN-Cache-Control": "no-store",
    "Pragma": "no-cache",
    "Expires": "0",
  };

  // 1. Return fresh cached rates if within the 20-second window (unless force fresh requested)
  if (!forceFresh && cachedData && now - lastFetchTime < CACHE_DURATION_MS) {
    return NextResponse.json(cachedData, { headers: responseHeaders });
  }

  // 2. PRIMARY: Attempt live fetch from GoldAPI.io
  try {
    const [goldRes, silverRes] = await Promise.all([
      fetch("https://www.goldapi.io/api/XAU/GBP", {
        headers: {
          "x-access-token": API_KEY,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }),
      fetch("https://www.goldapi.io/api/XAG/GBP", {
        headers: {
          "x-access-token": API_KEY,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }),
    ]);

    if (goldRes.ok && silverRes.ok) {
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
        goldChange24h: Number(goldData.ch?.toFixed(2)) || 0,
        goldChangePercent24h: Number(goldData.chp?.toFixed(2)) || 0,
        goldLiveHigh: Number((goldData.high_price / 31.1035).toFixed(2)) || goldGbpPerGram,
        goldLiveLow: Number((goldData.low_price / 31.1035).toFixed(2)) || goldGbpPerGram,
        silverChange24h: Number(silverData.ch?.toFixed(2)) || 0,
        silverChangePercent24h: Number(silverData.chp?.toFixed(2)) || 0,
        silverLiveHigh: Number((silverData.high_price / 31.1035).toFixed(2)) || silverGbpPerGram,
        silverLiveLow: Number((silverData.low_price / 31.1035).toFixed(2)) || silverGbpPerGram,
        ratio,
        lastUpdated: new Date().toISOString(),
        isLive: true,
        source: "goldapi.io (live London fix)",
      };

      lastFetchTime = now;
      return NextResponse.json(cachedData, { headers: responseHeaders });
    }
  } catch (err) {
    console.warn("GoldAPI live fetch error, trying secondary live provider:", err);
  }

  // 3. SECONDARY FALLBACK: Attempt real-time fetch from api.gold-api.com (No token limit, fast)
  try {
    const [goldRes, silverRes] = await Promise.all([
      fetch("https://api.gold-api.com/price/XAU/GBP", { cache: "no-store" }),
      fetch("https://api.gold-api.com/price/XAG/GBP", { cache: "no-store" }),
    ]);

    if (goldRes.ok && silverRes.ok) {
      const goldData = await goldRes.json();
      const silverData = await silverRes.json();

      const goldOunceGbp = Number(goldData.price?.toFixed(2)) || (DEFAULT_RATES.goldOunceGbp ?? 2907.20);
      const silverOunceGbp = Number(silverData.price?.toFixed(2)) || (DEFAULT_RATES.silverOunceGbp ?? 37.26);
      const goldGbpPerGram = Number((goldOunceGbp / 31.1034768).toFixed(2));
      const silverGbpPerGram = Number((silverOunceGbp / 31.1034768).toFixed(2));
      const ratio = calculateGoldSilverRatio(goldGbpPerGram, silverGbpPerGram);

      cachedData = {
        goldGbpPerGram,
        silverGbpPerGram,
        goldOunceGbp,
        silverOunceGbp,
        goldChange24h: 0,
        goldChangePercent24h: 0,
        goldLiveHigh: goldGbpPerGram + 0.15,
        goldLiveLow: goldGbpPerGram - 0.15,
        silverChange24h: 0,
        silverChangePercent24h: 0,
        silverLiveHigh: silverGbpPerGram + 0.02,
        silverLiveLow: silverGbpPerGram - 0.02,
        ratio,
        lastUpdated: new Date().toISOString(),
        isLive: true,
        source: "gold-api.com (live real-time spot)",
      };

      lastFetchTime = now;
      return NextResponse.json(cachedData, { headers: responseHeaders });
    }
  } catch (err) {
    console.warn("Secondary live provider error:", err);
  }

  // 4. Return cached data or default fallback if network fails
  if (cachedData) {
    return NextResponse.json(cachedData, { headers: responseHeaders });
  }

  return NextResponse.json(
    {
      ...DEFAULT_RATES,
      ratio: calculateGoldSilverRatio(DEFAULT_RATES.goldGbpPerGram, DEFAULT_RATES.silverGbpPerGram),
      source: "offline-fallback",
    },
    { headers: responseHeaders }
  );
}
