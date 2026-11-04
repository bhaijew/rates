"use client";

import React, { useEffect } from "react";

interface InstagramStoriesWidgetProps {
  embedId?: string;
}

export default function InstagramStoriesWidget({ embedId = "25727414" }: InstagramStoriesWidgetProps) {
  useEffect(() => {
    const scriptId = "sociablekit-stories-script";
    // Check if script already exists
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://widgets.sociablekit.com/instagram-stories/widget.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, [embedId]);

  return (
    <div className="w-full overflow-hidden rounded-2xl bg-white border-2 border-[#dfcca6] p-4 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
            Live Instagram Stories
          </span>
        </div>
        <span className="text-[10px] font-bold text-[#8b6914] bg-[#fbf5ea] px-2 py-0.5 rounded border border-[#dfcca6]">
          Showroom Updates
        </span>
      </div>

      {/* SociableKIT Instagram Stories Embed Container */}
      <div className="sk-ww-instagram-stories" data-embed-id={embedId} />
    </div>
  );
}
