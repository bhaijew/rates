import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { INITIAL_GOLD_ITEMS, INITIAL_SILVER_ITEMS, BullionProduct } from "@/data/bullion-items";
import { INITIAL_SITE_CONTENT, SiteContent } from "@/data/site-content";

const DATA_FILE = path.join(process.cwd(), "src", "data", "stored-content.json");

interface StoredData {
  goldItems: BullionProduct[];
  silverItems: BullionProduct[];
  siteContent: SiteContent;
  lastUpdated: string;
}

function getStoredData(): StoredData {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      return {
        goldItems: parsed.goldItems || INITIAL_GOLD_ITEMS,
        silverItems: parsed.silverItems || INITIAL_SILVER_ITEMS,
        siteContent: {
          ...INITIAL_SITE_CONTENT,
          ...(parsed.siteContent || {}),
        },
        lastUpdated: parsed.lastUpdated || new Date().toISOString(),
      };
    }
  } catch (err) {
    console.error("Error reading stored content file:", err);
  }

  return {
    goldItems: INITIAL_GOLD_ITEMS,
    silverItems: INITIAL_SILVER_ITEMS,
    siteContent: INITIAL_SITE_CONTENT,
    lastUpdated: new Date().toISOString(),
  };
}

function saveStoredData(data: StoredData): boolean {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing stored content file:", err);
    return false;
  }
}

export async function GET() {
  const data = getStoredData();
  return NextResponse.json({
    success: true,
    data,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const current = getStoredData();

    const updatedData: StoredData = {
      goldItems: body.goldItems || current.goldItems,
      silverItems: body.silverItems || current.silverItems,
      siteContent: body.siteContent
        ? {
            contact: { ...current.siteContent.contact, ...(body.siteContent.contact || {}) },
            findUs: { ...current.siteContent.findUs, ...(body.siteContent.findUs || {}) },
            privacyPolicy: { ...current.siteContent.privacyPolicy, ...(body.siteContent.privacyPolicy || {}) },
          }
        : current.siteContent,
      lastUpdated: new Date().toISOString(),
    };

    const saved = saveStoredData(updatedData);

    if (!saved) {
      return NextResponse.json(
        { success: false, error: "Failed to save data to storage" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Admin content updated successfully",
      data: updatedData,
    });
  } catch (error: any) {
    console.error("Admin update error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update content" },
      { status: 500 }
    );
  }
}

