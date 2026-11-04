"use client";

import React, { useEffect } from "react";

interface InstagramStoriesWidgetProps {
  widgetId?: string;
}

export default function InstagramStoriesWidget({ widgetId }: InstagramStoriesWidgetProps) {
  const activeWidgetId = widgetId || process.env.NEXT_PUBLIC_SOCIABLEKIT_WIDGET_ID || "";

  useEffect(() => {
    if (!activeWidgetId) return;

    const scriptId = "sociablekit-widget-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://widgets.sociablekit.com/assets/javascripts/widget.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, [activeWidgetId]);

  if (!activeWidgetId) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-[#dfcca6] bg-[#faf8f5] p-6 sm:p-10 text-center">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5 mx-auto mb-4">
          <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-slate-800">
            <svg className="w-6 h-6 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </div>
        </div>
        <h3 className="text-base sm:text-lg font-bold text-slate-900">
          Instagram Stories Feed Ready
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1 leading-relaxed">
          SociableKIT Instagram Stories widget code setup ho chuka hai. Client se SociableKIT Widget ID lekar add karte hi yahan 24-hour stories automatically live display ho jayengi.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl bg-white border border-[#dfcca6]/60 p-4 sm:p-6 shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Live Instagram Stories
        </span>
      </div>
      <div className="sk-ww-instagram-stories" data-sk-widget-id={activeWidgetId} />
    </div>
  );
}

