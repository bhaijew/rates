import { NextResponse } from "next/server";
import { DEFAULT_RATES, calculateGoldSilverRatio } from "@/lib/rates";

// To connect your Live Gold API:
// 1. Add your API key or endpoint below or in .env.local (e.g. GOLD_API_KEY=your_key)
// 2. This route caches results to optimize performance and prevent rate limiting.

export async function GET() {
  try {
    // If you have an external API key configured, fetch live data here:
    const apiKey = process.env.GOLD_API_KEY;
    const apiUrl = process.env.GOLD_API_URL;

    if (apiKey && apiUrl) {
      const res = await fetch(apiUrl, {
        headers: { "x-access-token": apiKey },
        next: { revalidate: 60 }, // Cache for 60 seconds
      });

      if (res.ok) {
        const data = await res.json();
        // Customize according to your specific API response shape:
        const goldGbpPerGram = data.gold_price_per_gram || data.price_gram_24k || DEFAULT_RATES.goldGbpPerGram;
        const silverGbpPerGram = data.silver_price_per_gram || data.price_gram_silver || DEFAULT_RATES.silverGbpPerGram;

        return NextResponse.json({
          goldGbpPerGram,
          silverGbpPerGram,
          ratio: calculateGoldSilverRatio(goldGbpPerGram, silverGbpPerGram),
          lastUpdated: new Date().toISOString(),
          isLive: true,
          source: "live-api",
        });
      }
    }

    // Default rates fallback
    return NextResponse.json({
      ...DEFAULT_RATES,
      ratio: calculateGoldSilverRatio(DEFAULT_RATES.goldGbpPerGram, DEFAULT_RATES.silverGbpPerGram),
      source: "system-rates",
    });
  } catch (error) {
    return NextResponse.json({
      ...DEFAULT_RATES,
      ratio: calculateGoldSilverRatio(DEFAULT_RATES.goldGbpPerGram, DEFAULT_RATES.silverGbpPerGram),
      isLive: false,
      source: "fallback",
    });
  }
}
