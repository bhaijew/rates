"use client";

import React, { useState, useEffect } from "react";
import { INITIAL_SITE_CONTENT, SiteContent } from "@/data/site-content";

export default function PrivacyPolicyPage() {
  const [content, setContent] = useState<SiteContent>(INITIAL_SITE_CONTENT);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data?.siteContent) {
          setContent(res.data.siteContent);
        }
      })
      .catch(() => {});
  }, []);

  const privacy = content.privacyPolicy;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 pb-20">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14">
        
        <div className="border-b border-[#dfcca6]/50 pb-5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-notche font-bold text-[#8b6914] uppercase tracking-wider bg-[#faf5ea] px-2 py-0.5 rounded border border-[#dfcca6]">
              Legal & Compliance
            </span>
            <span className="text-xs text-stone-400 font-numbers font-medium">
              · Last Updated: {privacy.lastUpdated}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-notche font-bold tracking-tight text-slate-900 mt-2">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            {privacy.subtitle}
          </p>
        </div>

        <div className="mt-8 space-y-6 text-sm text-slate-600 leading-relaxed">
          {privacy.sections.map((sec) => (
            <section key={sec.id} className="p-5 rounded-2xl bg-[#faf8f5]/60 border border-[#dfcca6]/40 shadow-2xs">
              <h2 className="text-base sm:text-lg font-notche font-bold text-slate-900 mb-2">
                {sec.title}
              </h2>
              <p className="leading-relaxed text-stone-700 whitespace-pre-line">
                {sec.content}
              </p>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
