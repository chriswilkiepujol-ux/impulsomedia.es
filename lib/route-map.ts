import { blogPosts } from './blog-data'

export const esToEn: Record<string, string> = {
  '/': '/en',
  '/servicios': '/en/services',
  '/servicios/negocio-local': '/en/services/local-business',
  '/servicios/performance': '/en/services/performance',
  '/precios': '/en/pricing',
  '/proyectos': '/en/work',
  '/nosotros': '/en/about',
  '/contacto': '/en/contact',
  '/opiniones': '/en/reviews',
  '/blog': '/en/blog',
}

export const enToEs: Record<string, string> = Object.fromEntries(
  Object.entries(esToEn).map(([es, en]) => [en, es])
)

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
