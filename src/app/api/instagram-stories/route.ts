import { NextRequest, NextResponse } from "next/server";

export interface InstagramStoryItem {
  id: string;
  code: string;
  ref: string;
  title: string;
  imageUrl: string;
  fullPicUrl: string;
  videoUrl: string | null;
  isVideo: boolean;
  link: string;
  date: string;
  dateFormatted: string;
  caption: string;
}

// In-memory cache for 3 minutes
let cachedStories: InstagramStoryItem[] | null = null;
let lastFetchTime = 0;
const CACHE_MS = 3 * 60 * 1000;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const forceFresh = searchParams.get("fresh") === "true";
    const now = Date.now();

    if (!forceFresh && cachedStories && now - lastFetchTime < CACHE_MS) {
      return NextResponse.json({
        success: true,
        count: cachedStories.length,
        username: "bhaijeweller",
        stories: cachedStories,
        cached: true,
      });
    }

    const embedId = "25727414";
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`https://data.accentapi.com/feed/${embedId}.json`, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/json",
      },
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Failed to fetch SociableKIT feed: ${res.status}`);
    }

    const data = await res.json();
    const rawPosts = Array.isArray(data.posts) ? data.posts : [];

    const stories: InstagramStoryItem[] = rawPosts.map((post: any, idx: number) => {
      let dateFormatted = "Showroom Story";
      if (post.date_time_posted) {
        try {
          const d = new Date(post.date_time_posted);
          const day = String(d.getDate()).padStart(2, "0");
          const month = String(d.getMonth() + 1).padStart(2, "0");
          const year = String(d.getFullYear()).slice(-2);
          dateFormatted = `${day}/${month}/${year}`;
        } catch {
          dateFormatted = "Showroom Story";
        }
      }

      const imageUrl =
        post.image_url ||
        post.thumbnail_url ||
        post.full_pic_src ||
        post.pic_src ||
        post.thumbnail ||
        "";

      const fullPicUrl =
        post.full_pic_src ||
        post.pic_src ||
        post.image_url ||
        post.thumbnail_url ||
        "";

      const isVideo =
        post.is_video === "true" ||
        post.is_video === true ||
        Boolean(post.video_url && post.video_url !== "none");

      const videoUrl =
        isVideo && post.video_url && post.video_url !== "none"
          ? post.video_url
          : null;

      const ref = `BJ-${post.code ? post.code.slice(0, 6).toUpperCase() : `ST${idx + 1}`}`;

      return {
        id: post.id || `story-${idx}`,
        code: post.code || "",
        ref,
        title: post.caption || post.pic_text || `Live Showroom Story #${idx + 1}`,
        imageUrl,
        fullPicUrl,
        videoUrl,
        isVideo,
        link: post.link || `https://www.instagram.com/stories/bhaijeweller/${post.code || ""}/`,
        date: post.date_time_posted || "",
        dateFormatted,
        caption: post.caption || post.pic_text || "",
      };
    });

    cachedStories = stories;
    lastFetchTime = now;

    return NextResponse.json({
      success: true,
      count: stories.length,
      username: data.user_info?.username || "bhaijeweller",
      stories,
      cached: false,
    });
  } catch (error: any) {
    if (cachedStories && cachedStories.length > 0) {
      return NextResponse.json({
        success: true,
        count: cachedStories.length,
        username: "bhaijeweller",
        stories: cachedStories,
        stale: true,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to load live stories",
        stories: [],
      },
      { status: 200 }
    );
  }
}
