"use client"

import { useState } from 'react'
import { Plus } from 'lucide-react'

export interface FaqItem {
  q: string
  a: string
}

/**
 * Stacked FAQ: one question per row, click to expand. Uses a native
 * <button> + aria-expanded so it is keyboard-friendly, and the answer stays
 * in the DOM (collapsed with a grid trick) so the FAQPage schema and Google
 * still see the full text.
 */
export function FaqAccordion({ items, defaultOpen = 0 }: { items: FaqItem[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen)

  return (
    <div className="border-t border-[rgba(255,255,255,0.1)]">
      {items.map((f, i) => {
        const isOpen = open === i
        const id = `faq-${i}`
        return (
          <div key={f.q} className="border-b border-[rgba(255,255,255,0.1)]">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={id}
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-start justify-between gap-4 py-4 md:py-5 text-left bg-transparent border-0 cursor-pointer group"
            >
              <span className="font-display font-bold text-[0.95rem] md:text-lg text-[#f2ede6] leading-[1.3] group-hover:text-[#d4a853] transition-colors">
                {f.q}
              </span>
              <Plus
                className={`w-5 h-5 shrink-0 mt-0.5 text-[#d4a853] transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
                strokeWidth={2}
              />
            </button>
            <div
              id={id}
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <p className="text-[#f2ede6]/65 text-sm md:text-base leading-relaxed pb-4 md:pb-5 pr-9">{f.a}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
