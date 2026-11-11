import { blogPosts } from './blog-data'

export const esToEn: Record<string, string> = {
  '/': '/en',
  '/servicios': '/en/services',
  '/servicios/negocio-local': '/en/services/local-business',
  '/servicios/performance': '/en/services/performance',
  '/servicios/diseno-web': '/en/services/web-design',
  '/servicios/seo': '/en/services/seo',
  '/servicios/publicidad': '/en/services/paid-media',
  '/servicios/automatizacion-ia': '/en/services/ai-automation',
  '/servicios/branding': '/en/services/branding',
  '/precios': '/en/pricing',
  '/proyectos': '/en/work',
  '/nosotros': '/en/about',
  '/contacto': '/en/contact',
  '/opiniones': '/en/reviews',
  '/blog': '/en/blog',
  '/auditoria-web-gratis': '/en/free-website-audit',
  '/zonas': '/en/areas',
  '/privacidad': '/en/privacy',
}

export const enToEs: Record<string, string> = {
  ...Object.fromEntries(Object.entries(esToEn).map(([es, en]) => [en, es])),
  // City × service landings that only exist in one language fall back to the
  // matching service page in the other language, never to another city.
  '/en/seo-gibraltar': '/servicios/seo',
  '/en/web-design-gibraltar': '/servicios/diseno-web',
  '/en/digital-marketing-gibraltar': '/servicios/publicidad',
  '/en/igaming-marketing': '/servicios/performance',
  '/en/web-design-sotogrande': '/diseno-web-san-roque',
}

// ES-only landings: the EN switcher goes to the matching EN service page, never to another city (Chris, 10 nov 2026).
esToEn['/diseno-web-algeciras'] = '/en/services/web-design'
esToEn['/diseno-web-la-linea'] = '/en/services/web-design'
esToEn['/diseno-web-san-roque'] = '/en/web-design-sotogrande'
esToEn['/seo-algeciras'] = '/en/services/seo'
esToEn['/diseno-web-estepona'] = '/en/services/web-design'
esToEn['/agencia-marketing-digital-algeciras'] = '/en/services/paid-media'

/**
 * Looks up the matching translated URL for a dynamic blog post path,
 * e.g. /blog/seo-local-sotogrande-campo-gibraltar ->
 *      /en/blog/local-seo-sotogrande-campo-gibraltar
 * Each post has its own real translated slug, not a mirrored one, so
 * this can't be a static route-map entry - it has to look the post up.
 */
function getBlogAlternatePath(pathname: string): string | null {
  const esMatch = pathname.match(/^\/blog\/([^/]+)\/?$/)
  if (esMatch) {
    const post = blogPosts.find((p) => p.slugEs === esMatch[1])
    return post ? `/en/blog/${post.slugEn}` : '/en/blog'
  }

  const enMatch = pathname.match(/^\/en\/blog\/([^/]+)\/?$/)
  if (enMatch) {
    const post = blogPosts.find((p) => p.slugEn === enMatch[1])
    return post ? `/blog/${post.slugEs}` : '/blog'
  }

  return null
}

export function getAlternatePath(pathname: string): string {
  const base = pathname.split('#')[0]

  const blogAlternate = getBlogAlternatePath(base)
  if (blogAlternate) return blogAlternate

  if (pathname === '/en' || pathname.startsWith('/en/') || pathname.startsWith('/en#')) {
    return enToEs[base] || '/'
  }
  return esToEn[base] || '/en'
}
