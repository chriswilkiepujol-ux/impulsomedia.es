"use client"

import { Globe, TrendingUp, Target, Sparkles, BarChart3, Handshake, Smartphone, Store, Instagram, Megaphone, Wrench, Briefcase, type LucideIcon } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { esToEn } from '@/lib/route-map'

type Item = { es: string; en: string; icon?: LucideIcon; href?: string }

// Inner ring: the four core pillars (dark chips, link to their page)
const CORE: Item[] = [
  { es: 'Diseño web', en: 'Web design', icon: Globe, href: '/servicios/diseno-web' },
  { es: 'SEO', en: 'SEO', icon: TrendingUp, href: '/servicios/seo' },
  { es: 'Publicidad', en: 'Paid ads', icon: Target, href: '/servicios/publicidad' },
  { es: 'IA', en: 'AI', icon: Sparkles, href: '/servicios/automatizacion-ia' },
]
// Middle ring: the rest of the service range
const MORE: Item[] = [
  { es: 'Redes', en: 'Social', icon: Instagram },
  { es: 'Programática', en: 'Programmatic', icon: BarChart3 },
  { es: 'Afiliación', en: 'Affiliate', icon: Handshake },
  { es: 'In-app', en: 'In-app', icon: Smartphone },
  { es: 'ASO', en: 'ASO', icon: Store },
  { es: 'Influencers', en: 'Influencers', icon: Megaphone },
  { es: 'Soporte', en: 'Support', icon: Wrench },
  { es: 'Consultoría', en: 'Consultancy', icon: Briefcase },
]
// Outer ring: platforms we work on (plain wordmarks, no third-party logos)
const PLATFORMS = ['Google', 'Meta', 'TikTok', 'WordPress', 'Next.js', 'Claude AI', 'Shopify', 'YouTube']

// Three layered rings turning at different speeds/directions; labels pass in front of/behind each other by depth.
function place(i: number, n: number, r: number, offset = 0) {
  const a = (i / n) * Math.PI * 2 + offset - Math.PI / 2
  return { left: `${50 + Math.cos(a) * r}%`, top: `${50 + Math.sin(a) * r}%` }
}

export function ServiceOrbit() {
  const { language } = useLanguage()
  const en = language === 'en'
  const link = (h?: string) => (h ? (en ? esToEn[h] ?? h : h) : undefined)

  return (
    <div className="orbit" role="img" aria-label={en ? 'All the services and platforms we work with' : 'Todos los servicios y plataformas con los que trabajamos'}>
      <div className="orbit-ring r3" />
      <div className="orbit-ring r2" />
      <div className="orbit-ring r1" />

      <div className="orbit-spin s3">
        {PLATFORMS.map((p, i) => (
          <span key={p} className="orbit-item" style={place(i, PLATFORMS.length, 50, 0)}>
            <span className="chip plat"><i />{p}</span>
          </span>
        ))}
      </div>
      <div className="orbit-spin s2">
        {MORE.map((m, i) => {
          const Icon = m.icon!
          return (
            <span key={m.es} className="orbit-item" style={place(i, MORE.length, 42, Math.PI / 8)}>
              <span className="chip more"><Icon strokeWidth={1.8} />{en ? m.en : m.es}</span>
            </span>
          )
        })}
      </div>
      <div className="orbit-spin s1">
        {CORE.map((c, i) => {
          const Icon = c.icon!
          return (
            <span key={c.es} className="orbit-item" style={place(i, CORE.length, 26, 0)}>
              <a className="chip core" href={link(c.href)}><Icon strokeWidth={1.8} />{en ? c.en : c.es}</a>
            </span>
          )
        })}
      </div>

      <div className="orbit-core">
        <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <circle cx="16" cy="16" r="14" stroke="#c9a04a" strokeWidth="2" />
          <path d="M6 16 L10 16 L12 10 L16 22 L20 8 L22 16 L26 16" stroke="#c9a04a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}
