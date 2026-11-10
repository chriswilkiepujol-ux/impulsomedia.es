/**
 * llms.txt (https://llmstxt.org): a Markdown map of the site for AI assistants.
 * /llms.txt      → summary + links to every important page (ES and EN)
 * /llms-full.txt → the full text of the service, local and blog pages
 * Generated from the page data at build time, so new pages appear automatically.
 */
import { servicePillars, areaLinks } from '@/lib/areas'
import { allLandingPages, getLandingByPath, type LandingPage } from '@/lib/landing-data'
import { blogPosts, type BlogBlock } from '@/lib/blog-data'
import { projects } from '@/lib/projects-data'
import { reviewsEs } from '@/lib/reviews-data'
import { SITE } from '@/lib/schema'

const url = (p: string) => `${SITE}${p}`
const desc = (p: string) => getLandingByPath(p)?.metaDescription

const ABOUT_ES = `ImpulsoMedia es una agencia digital bilingüe (español e inglés) con base en Sotogrande (San Roque, Cádiz), a 15 minutos de Gibraltar. Fundada por Chris Wilkie, con experiencia previa en marketing de resultados en el sector iGaming. Diseña webs a medida (sin plantillas), hace SEO local e internacional, gestiona Google Ads y publicidad en redes, crea identidad de marca y automatiza procesos con IA. Trabaja con negocios locales del Campo de Gibraltar y la Costa del Sol y con empresas internacionales que operan desde Gibraltar.`

const ABOUT_EN = `ImpulsoMedia is a bilingual (Spanish and English) digital agency based in Sotogrande (San Roque, Cádiz, Spain), 15 minutes from Gibraltar. Founded by Chris Wilkie, with a background in performance marketing in iGaming. It builds custom websites (no templates), runs local and international SEO, manages Google Ads and paid social, creates brand identities and automates business processes with AI. It works with local businesses across the Campo de Gibraltar and the Costa del Sol and with international companies operating from Gibraltar.`

const CONTACT = `- Email: chris@impulsomedia.es
- Teléfono / WhatsApp: +34 680 863 229
- Zona: Sotogrande, San Roque, Gibraltar, La Línea, Algeciras, Estepona, Manilva, Marbella
- Idiomas / Languages: español, English
- Auditoría web gratuita / Free website audit: ${url('/auditoria-web-gratis')} · ${url('/en/free-website-audit')}`

function line(label: string, path: string, d?: string) {
  return `- [${label}](${url(path)})${d ? `: ${d}` : ''}`
}

export function buildLlmsTxt(): string {
  const posts = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date))
  return [
    '# ImpulsoMedia',
    '',
    `> ${ABOUT_EN}`,
    '',
    ABOUT_ES,
    '',
    '## Contacto / Contact',
    CONTACT,
    '',
    '## Servicios (español)',
    ...servicePillars.map((p) => line(p.labelEs, p.es, desc(p.es))),
    '',
    '## Services (English)',
    ...servicePillars.map((p) => line(p.labelEn, p.en, desc(p.en))),
    '',
    '## Páginas locales / Local pages',
    ...areaLinks.map((a) => line(a.lang === 'es' ? a.labelEs : a.labelEn, a.href, desc(a.href))),
    '',
    '## Proyectos / Client work',
    ...projects.map((p) => `- [${p.name}](${p.href}): ${p.descEn}`),
    line('Proyectos', '/proyectos'),
    line('Projects', '/en/work'),
    '',
    '## Opiniones / Reviews',
    ...reviewsEs.map((r) => `- ${r.author} (${r.role}): "${r.quote}"`),
    line('Opiniones', '/opiniones'),
    line('Reviews', '/en/reviews'),
    '',
    '## Blog',
    ...posts.flatMap((p) => [
      line(p.titleEs, `/blog/${p.slugEs}`, p.excerptEs),
      line(p.titleEn, `/en/blog/${p.slugEn}`, p.excerptEn),
    ]),
    '',
    '## Optional',
    line('Inicio', '/'),
    line('Home (English)', '/en'),
    line('Sobre nosotros', '/nosotros'),
    line('About', '/en/about'),
    line('Cómo calculamos los precios', '/precios'),
    line('How we price', '/en/pricing'),
    line('Contacto', '/contacto'),
    line('Contact', '/en/contact'),
    line('Texto completo para IA / Full text for AI', '/llms-full.txt'),
    '',
  ].join('\n')
}

function landingText(p: LandingPage): string {
  return [
    `## ${p.h1}`,
    `URL: ${url(p.path)}`,
    '',
    p.lead,
    '',
    ...p.problem.map((x) => `- ${x}`),
    '',
    `### ${p.servicesTitle}`,
    ...p.services.map((s) => `- **${s.title}**: ${s.desc}`),
    '',
    `### ${p.processTitle}`,
    ...p.steps.map((s) => `${s.num}. **${s.title}**: ${s.desc}`),
    '',
    `### ${p.casesTitle}`,
    ...p.cases.map((c) => `- **${c.name}** (${c.sector}): ${c.summary} ${c.href}`),
    '',
    `### ${p.faqTitle}`,
    ...p.faqs.flatMap((f) => [`**${f.q}**`, f.a, '']),
  ].join('\n')
}

function blogText(blocks: BlogBlock[]): string {
  return blocks
    .map((b) => {
      if (b.type === 'h2') return `### ${b.text}`
      if (b.type === 'ul') return (b.items || []).map((i) => `- ${i}`).join('\n')
      if (b.type === 'stats') return (b.stats || []).map((s) => `- ${s.value}: ${s.label}`).join('\n')
      return b.text || ''
    })
    .join('\n\n')
    .replace(/\[([^\]]+)\]\((\/[^)]*)\)/g, (_, t, p) => `[${t}](${url(p)})`)
}

export function buildLlmsFullTxt(): string {
  const posts = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date))
  return [
    '# ImpulsoMedia: texto completo / full text',
    '',
    `> ${ABOUT_EN}`,
    '',
    ABOUT_ES,
    '',
    '## Contacto / Contact',
    CONTACT,
    '',
    ...allLandingPages.map(landingText),
    ...posts.flatMap((p) => [
      `## ${p.titleEs}`,
      `URL: ${url(`/blog/${p.slugEs}`)} · ${p.date}`,
      '',
      blogText(p.contentEs),
      '',
      `## ${p.titleEn}`,
      `URL: ${url(`/en/blog/${p.slugEn}`)} · ${p.date}`,
      '',
      blogText(p.contentEn),
      '',
    ]),
  ].join('\n')
}
