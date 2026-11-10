/**
 * Structured data (schema.org JSON-LD) for listing pages. Built from the same
 * data files the pages render, so markup and visible content never drift.
 * The business node itself lives in app/layout.tsx (@id below).
 */
import { servicePillars } from '@/lib/areas'
import { getLandingByPath } from '@/lib/landing-data'
import { blogPosts } from '@/lib/blog-data'
import { projects } from '@/lib/projects-data'
import { reviewsEn, reviewsEs } from '@/lib/reviews-data'

export const SITE = 'https://impulsomedia.es'
export const BUSINESS_ID = `${SITE}/#business`
export const WEBSITE_ID = `${SITE}/#website`

type Lang = 'es' | 'en'

export function servicesItemList(lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: lang === 'es' ? 'Servicios de ImpulsoMedia' : 'ImpulsoMedia services',
    itemListElement: servicePillars.map((p, i) => {
      const path = lang === 'es' ? p.es : p.en
      const page = getLandingByPath(path)
      return {
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Service',
          name: lang === 'es' ? p.labelEs : p.labelEn,
          url: `${SITE}${path}`,
          ...(page ? { description: page.metaDescription } : {}),
          provider: { '@id': BUSINESS_ID },
        },
      }
    }),
  }
}

export function blogItemList(lang: Lang) {
  const posts = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date))
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: lang === 'es' ? 'Artículos del blog de ImpulsoMedia' : 'ImpulsoMedia blog articles',
    itemListElement: posts.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'BlogPosting',
        headline: lang === 'es' ? p.titleEs : p.titleEn,
        url: lang === 'es' ? `${SITE}/blog/${p.slugEs}` : `${SITE}/en/blog/${p.slugEn}`,
        datePublished: p.date,
        inLanguage: lang === 'es' ? 'es-ES' : 'en-GB',
        author: { '@type': 'Person', name: 'Chris Wilkie' },
        publisher: { '@id': BUSINESS_ID },
      },
    })),
  }
}

export function projectsItemList(lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: lang === 'es' ? 'Proyectos de ImpulsoMedia' : 'ImpulsoMedia projects',
    itemListElement: projects.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'WebSite',
        name: p.name,
        url: p.href,
        description: lang === 'es' ? p.descEs : p.descEn,
        creator: { '@id': BUSINESS_ID },
      },
    })),
  }
}

/** Client testimonials as Review nodes about the business (no star values: the
 *  rating on the business node is the Google one). */
export function reviewsSchema(lang: Lang) {
  const list = lang === 'es' ? reviewsEs : reviewsEn
  return {
    '@context': 'https://schema.org',
    '@graph': list.map((r) => ({
      '@type': 'Review',
      itemReviewed: { '@type': 'ProfessionalService', '@id': BUSINESS_ID, name: 'ImpulsoMedia' },
      author: { '@type': 'Organization', name: r.author, description: r.role },
      reviewBody: r.quote,
      inLanguage: lang === 'es' ? 'es-ES' : 'en-GB',
    })),
  }
}
