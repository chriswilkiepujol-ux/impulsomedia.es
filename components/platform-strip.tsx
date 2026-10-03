"use client"

import { useLanguage } from "@/lib/language-context"

export function PlatformStrip() {
  const { t } = useLanguage()

  return (
    <div className="max-w-[1200px] mx-auto px-6 md:px-[clamp(1.5rem,5vw,4rem)] py-8 border-t border-b border-[rgba(255,255,255,0.09)] flex items-center gap-6 md:gap-10 flex-wrap">
      <span className="text-[0.7rem] font-bold uppercase tracking-[0.1em] text-[rgba(242,237,230,0.5)] mr-1">
        {t("También gestionamos campañas en", "We also run campaigns on")}
      </span>

      {/* Meta - official blue #0866FF */}
      <div className="flex items-center gap-2 text-[rgba(242,237,230,0.85)] font-semibold text-[0.88rem]">
        <svg width="20" height="20" viewBox="0 0 36 36" fill="none">
          <path
            fill="#0866FF"
            d="M36 18.098c0-9.94-8.059-18-18-18s-18 8.06-18 18c0 8.98 6.58 16.417 15.187 17.776V23.312h-4.57v-5.214h4.57v-3.973c0-4.513 2.69-7.006 6.802-7.006 1.97 0 4.03.352 4.03.352v4.43h-2.271c-2.238 0-2.937 1.39-2.937 2.816v3.38h5l-.8 5.215h-4.2v12.562C29.42 34.516 36 27.08 36 18.098"
          />
        </svg>
        Meta Ads
      </div>

      {/* TikTok - official black + cyan + pink */}
      <div className="flex items-center gap-2 text-[rgba(242,237,230,0.85)] font-semibold text-[0.88rem]">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path fill="#25F4EE" d="M9.5 8.6v-.9a5 5 0 0 0-.7 0 6.3 6.3 0 0 0-3.6 11.5 6.3 6.3 0 0 1 4.3-10.6z"/>
          <path fill="#FE2C55" d="M9.8 17.6a2.9 2.9 0 0 0 2.9-2.8V2.1h2.3a4.8 4.8 0 0 1-.1-.9h-3.2v12.6a2.9 2.9 0 0 1-4.8 2.1 2.9 2.9 0 0 0 2.9 1.7z"/>
          <path fill="#25F4EE" d="M18.3 6.8v-.9a4.8 4.8 0 0 1-2.6-.8 4.8 4.8 0 0 0 2.6 1.7z"/>
          <path fill="#000" d="M15.7 5.1a4.8 4.8 0 0 1-1.2-3.2V1.2h-2.3v12.6a2.9 2.9 0 0 1-5.2 1.7 2.9 2.9 0 0 1-.7-1.9 2.9 2.9 0 0 1 3.6-2.8V8.6a5 5 0 0 0-4.3 1 6.3 6.3 0 0 0-.9 1.3 6.3 6.3 0 0 0-.6 2.7 6.3 6.3 0 0 0 1.2 3.7 6.3 6.3 0 0 0 1.1 1.1 6.3 6.3 0 0 0 3.9 1.4 6.3 6.3 0 0 0 6.3-6.3V7.7a7.1 7.1 0 0 0 4.1 1.3V6.8a4.8 4.8 0 0 1-2.1-.5 4.8 4.8 0 0 1-2.9-1.2z"/>
        </svg>
        TikTok Ads
      </div>

      {/* Google - official four-color G */}
      <div className="flex items-center gap-2 text-[rgba(242,237,230,0.85)] font-semibold text-[0.88rem]">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path fill="#4285F4" d="M23.52 12.27c0-.85-.07-1.47-.23-2.12H12v3.85h6.6c-.13 1.1-.86 2.76-2.47 3.88l-.02.15 3.59 2.78.25.02c2.28-2.11 3.59-5.21 3.59-8.56"/>
          <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.79-2.94c-1.01.7-2.37 1.19-4.16 1.19-3.18 0-5.87-2.1-6.83-5l-.14.01-3.73 2.89-.05.13C3.26 21.3 7.3 24 12 24"/>
          <path fill="#FBBC05" d="M5.17 14.35A7.3 7.3 0 0 1 4.77 12c0-.82.15-1.62.39-2.35l-.01-.16-3.78-2.94-.12.06A11.98 11.98 0 0 0 0 12c0 1.94.47 3.77 1.29 5.39z"/>
          <path fill="#EA4335" d="M12 4.75c2.26 0 3.78.97 4.65 1.79l3.4-3.31C17.95 1.19 15.24 0 12 0 7.3 0 3.26 2.7 1.25 6.61l3.92 3.04c.98-2.9 3.67-4.9 6.83-4.9"/>
        </svg>
        Google Ads
      </div>

      {/* SEO / GMB - gold, brand-native accent */}
      <div className="flex items-center gap-2 text-[rgba(242,237,230,0.85)] font-semibold text-[0.88rem]">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4a853" strokeWidth="2">
          <circle cx="11" cy="11" r="7"/>
          <path d="M21 21l-4.3-4.3"/>
        </svg>
        SEO / GMB
      </div>
    </div>
  )
}
