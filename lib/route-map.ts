export const esToEn: Record<string, string> = {
  '/': '/en',
  '/servicios': '/en/services',
  '/servicios/negocio-local': '/en/services/local-business',
  '/servicios/performance': '/en/services/performance',
  '/proyectos': '/en/work',
  '/nosotros': '/en/about',
  '/contacto': '/en/contact',
}

export const enToEs: Record<string, string> = Object.fromEntries(
  Object.entries(esToEn).map(([es, en]) => [en, es])
)

export function getAlternatePath(pathname: string): string {
  if (pathname === '/en' || pathname.startsWith('/en/') || pathname.startsWith('/en#')) {
    const base = pathname.split('#')[0]
    return enToEs[base] || '/'
  }
  const base = pathname.split('#')[0]
  return esToEn[base] || '/en'
}
