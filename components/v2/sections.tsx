"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/lib/language-context'
import { useFreeAuditLive, auditHref } from '@/lib/free-audit-flag'
import { esToEn } from '@/lib/route-map'
import { Reveal, CountUp, Mesh, Logo, GOLD, GOLD2 } from './shared'
import { GReviews, type GReview } from './greviews'

const href = (en: boolean, es: string) => (en ? esToEn[es] ?? es : es)

export function FounderV2() {
  const { t, language } = useLanguage()
  const en = language === 'en'
  return (
    <section className="section">
      <div className="wrap intro">
        <Reveal className="photo">
          <Image src="/images/chris-wilkie.jpg" alt={t('Chris Wilkie, fundador de ImpulsoMedia', 'Chris Wilkie, founder of ImpulsoMedia')} width={1200} height={1500} sizes="(max-width: 900px) 100vw, 45vw" priority={false} />
          <span className="tag">{t('Fundador', 'Founder')}</span>
          <div className="cap"><b>Chris Wilkie</b>{t('Más de 10 años comprando medios para operadores de iGaming. Ahora al servicio de negocios locales y marcas que quieren escalar.', '10+ years buying media for iGaming operators. Now working for local businesses and brands that want to scale.')}</div>
        </Reveal>
        <div>
          <Reveal><div className="eyebrow">{t('Un socio digital, no un proveedor más', 'A digital partner, not another vendor')}</div></Reveal>
          <Reveal><h2>{t('Experiencia de gran agencia, trato de equipo pequeño', 'Big-agency experience, small-team attention')}</h2></Reveal>
          <Reveal><p className="lead">{t('Construyo cada web desde cero y gestiono las campañas personalmente. Sin cuentas pasadas de mano en mano ni informes que nadie lee: resultados que puedes ver y una persona que responde.', 'I build every website from scratch and run the campaigns myself. No accounts passed from hand to hand, no reports nobody reads: results you can see and one person who answers.')}</p></Reveal>
          <Reveal as="div">
            <ul className="checks">
              <li>{t('Webs bilingües, rápidas y preparadas para convertir desde el día uno', 'Bilingual, fast websites built to convert from day one')}</li>
              <li>{t('Campañas con coste por lead medido, no "impresiones"', 'Campaigns measured on cost per lead, not "impressions"')}</li>
              <li>{t('Automatización con IA para reservas, reseñas y contenido', 'AI automation for bookings, reviews and content')}</li>
              <li>{t('Base en Sotogrande, trabajo en toda la Costa del Sol y Gibraltar', 'Based in Sotogrande, working across the Costa del Sol and Gibraltar')}</li>
            </ul>
          </Reveal>
          <Reveal className="stats">
            <div className="stat"><div className="n"><CountUp end={7} gold /></div><div className="l">{t('Clientes activos', 'Active clients')}</div></div>
            <div className="stat"><div className="n"><CountUp end={13} /></div><div className="l">{t('Servicios bajo un mismo techo', 'Services under one roof')}</div></div>
            <div className="stat"><div className="n"><CountUp end={10} suffix="+" /></div><div className="l">{t('Años en marketing de resultados', 'Years in performance marketing')}</div></div>
            <div className="stat"><div className="n"><CountUp end={5} suffix={en ? '.0' : ',0'} /></div><div className="l">{t('Valoración en Google', 'Google rating')}</div></div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export function ServicesV2() {
  const { t, language } = useLanguage()
  const en = language === 'en'
  const go = (es: string, label: string) => <Link href={href(en, es)} className="go">{label} →</Link>
  return (
    <section className="section dark" id="servicios">
      <div className="wrap">
        <Reveal><div className="eyebrow">{t('Lo que hacemos', 'What we do')}</div></Reveal>
        <Reveal><h2>{t('Todo lo que tu negocio necesita para crecer online', 'Everything your business needs to grow online')}</h2></Reveal>
        <Reveal><p className="lead">{t('Dos formas de trabajar juntos: un negocio local que quiere una web profesional y aparecer en Google, o una marca que gestiona presupuestos grandes y necesita performance real.', 'Two ways to work together: a local business that wants a professional website and to show up on Google, or a brand managing larger budgets that needs real performance.')}</p></Reveal>
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true"><defs><linearGradient id="v2ga" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#C9A04A" stopOpacity=".35" /><stop offset="1" stopColor="#C9A04A" stopOpacity="0" /></linearGradient></defs></svg>
        <div className="svc">
          <Reveal as="article" className="wide">
            <span className="num">01</span>
            <div className="art"><div className="w-code">{'<'}<b>section</b>{' class="hero">\n  <'}<b>h1</b>{'>'}{t('Tu negocio', 'Your business')}{'</h1>\n  <'}<b>BookingMap</b>{' live />'}<span className="cur" /></div></div>
            <h3>{t('Diseño y desarrollo web', 'Web design & development')}</h3>
            <p>{t('Next.js o WordPress según lo que necesite tu negocio. Rápidas, bilingües, con SEO técnico perfecto el día del lanzamiento.', 'Next.js or WordPress, whichever your business needs. Fast, bilingual, with flawless technical SEO on launch day.')}</p>
            {go('/servicios/diseno-web', t('Ver diseño web', 'See web design'))}
          </Reveal>
          <Reveal as="article">
            <span className="num">02</span>
            <div className="art"><svg className="w-line" viewBox="0 0 200 100" preserveAspectRatio="none"><path className="area" d="M0 90 L30 80 L60 84 L90 60 L120 55 L150 30 L180 22 L200 8 L200 100 L0 100Z" /><path d="M0 90 L30 80 L60 84 L90 60 L120 55 L150 30 L180 22 L200 8" /></svg></div>
            <h3>{t('SEO y Google Business', 'SEO & Google Business')}</h3>
            <p>{t('Que te encuentren cuando buscan en tu zona.', 'Get found when people search in your area.')}</p>
            {go('/servicios/seo', t('Ver SEO', 'See SEO'))}
          </Reveal>
          <Reveal as="article">
            <span className="num">03</span>
            <div className="art"><div className="w-bars"><i style={{ height: '40%' }} /><i style={{ height: '62%' }} /><i style={{ height: '50%' }} /><i style={{ height: '100%' }} /><i style={{ height: '72%' }} /></div></div>
            <h3>{t('Google, Meta y TikTok Ads', 'Google, Meta & TikTok Ads')}</h3>
            <p>{t('Campañas con presupuesto controlado y coste por lead medido.', 'Campaigns with controlled budgets and a measured cost per lead.')}</p>
            {go('/servicios/publicidad', t('Ver publicidad', 'See paid media'))}
          </Reveal>
          <Reveal as="article">
            <span className="num">04</span>
            <div className="art"><div className="w-bot"><div className="face"><div className="ant" /></div></div></div>
            <h3>{t('Automatización con IA', 'AI automation')}</h3>
            <p>{t('Reservas, reseñas, contenido y procesos que se gestionan solos.', 'Bookings, reviews, content and processes that run themselves.')}</p>
            {go('/servicios/automatizacion-ia', t('Ver IA', 'See AI'))}
          </Reveal>
          <Reveal as="article">
            <span className="num">05</span>
            <div className="art"><div className="w-ads"><span>PPC <b>·</b> {t('Programática', 'Programmatic')}</span><span>{t('Afiliación', 'Affiliate')} <b>·</b> In-app</span><span>ASO <b>·</b> Paid social</span></div></div>
            <h3>{t('Performance a escala', 'Performance at scale')}</h3>
            <p>{t('Para marcas, operadores y apps con presupuestos grandes.', 'For brands, operators and apps with larger budgets.')}</p>
            {go('/servicios/performance', t('Ver performance', 'See performance'))}
          </Reveal>
        </div>
        <Reveal className="partners">
          <div>Google Ads<small>Search · PMax</small></div>
          <div>Meta Ads<small>Facebook · Instagram</small></div>
          <div>TikTok Ads<small>Paid social</small></div>
          <div>WordPress<small>+ WooCommerce</small></div>
          <div>Next.js<small>Vercel</small></div>
          <div>Claude AI<small>{t('Automatización', 'Automation')}</small></div>
        </Reveal>
      </div>
    </section>
  )
}

const projects = [
  { id: 'agora', name: 'Ágora Sotogrande', url: 'agorasotogrande.com', href: 'https://agorasotogrande.com', es: 'Restaurante y discoteca', en: 'Restaurant & nightclub', img: '/images/agora-screenshot.png', w: 1116, h: 904, kpiEs: 'Web + reservas', kpiEn: 'Web + bookings', big: true, c: 'c1' },
  { id: 'pujol', name: 'Pujol Wilkie', url: 'pujolwilkie.com', href: 'https://pujolwilkie.com', es: 'Servicios jurídicos', en: 'Legal services', img: '/images/pujol-wilkie-screenshot.png', w: 800, h: 499, kpiEs: 'Web + SEO', kpiEn: 'Web + SEO', c: 'c2' },
  { id: 'racket', name: 'Racket Breaks', url: 'racketbreaks.com', href: 'https://www.racketbreaks.com', es: 'Viajes de pádel', en: 'Padel travel', img: '/images/racketbreaks-screenshot.png', w: 1352, h: 849, kpiEs: 'Reservas UK', kpiEn: 'UK bookings', c: 'c3' },
  { id: 'sotovet', name: 'Sotovet', url: 'sotovet.com', href: 'https://www.sotovet.com', es: 'Clínica veterinaria', en: 'Veterinary clinic', img: '/images/sotovet-screenshot.png', w: 1116, h: 697, kpiEs: 'Web nueva', kpiEn: 'New website', c: 'c4' },
  { id: 'nathan', name: 'Nathan & Josh', url: 'nathanjosh.com', href: 'https://www.nathanjosh.com', es: 'Media kit de creadores', en: 'Creator media kit', img: '/images/nathanjosh-screenshot.png', w: 1068, h: 932, kpiEs: 'Brand deals', kpiEn: 'Brand deals', c: 'c5' },
  { id: 'one4one', name: 'One4One Fitness', url: 'one4onefc.com', href: 'https://one4onefc.com', es: 'Fitness y gimnasio', en: 'Fitness & gym', img: '/images/one4one-screenshot.png', w: 979, h: 580, kpiEs: 'Web', kpiEn: 'Web', c: 'c6' },
]

export function WorkV2() {
  const { t, language } = useLanguage()
  const en = language === 'en'
  return (
    <section className="section" id="proyectos">
      <div className="wrap">
        <Reveal><div className="eyebrow">{t('Nuestro trabajo', 'Our work')}</div></Reveal>
        <Reveal><h2>{t('Webs lanzadas este año', 'Websites launched this year')}</h2></Reveal>
        <Reveal><p className="lead">{t('Pasa el ratón por cada proyecto para recorrer la web. Todas construidas desde cero, sin plantillas.', 'Hover over a project to scroll through the site. All built from scratch, no templates.')}</p></Reveal>
        <div className="work">
          {projects.map(p => (
            <Reveal key={p.id} as="div">
              <a className={`proj ${p.big ? 'big' : ''} ${p.c}`} href={p.href} target="_blank" rel="noopener noreferrer">
                <div className="shot"><div className="frame"><Image src={p.img} alt={`${p.name} – ${en ? p.en : p.es}`} width={p.w} height={p.h} sizes="(max-width: 900px) 100vw, 33vw" /></div></div>
                <div className="meta"><div><h3>{p.name}</h3><small>{en ? p.en : p.es} · {p.url}</small></div><span className="kpi">{en ? p.kpiEn : p.kpiEs}</span></div>
              </a>
            </Reveal>
          ))}
        </div>
        <Reveal><div style={{ marginTop: 36 }}><Link href={href(en, '/proyectos')} className="btn ghost">{t('Ver todos los proyectos', 'See all projects')}</Link></div></Reveal>
      </div>
    </section>
  )
}

export function ProcessV2() {
  const { t } = useLanguage()
  const steps = [
    [t('SEMANA 0', 'WEEK 0'), t('Descubrimiento', 'Discovery'), t('Llamada de 30 minutos. Entendemos tu negocio, tu cliente y qué tiene que conseguir la web.', 'A 30-minute call. We understand your business, your customer and what the website has to achieve.')],
    [t('SEMANA 1', 'WEEK 1'), t('Propuesta', 'Proposal'), t('Alcance claro, precio cerrado y fases. Sin tarifas ocultas ni sorpresas.', 'Clear scope, fixed price and phases. No hidden fees, no surprises.')],
    [t('SEMANAS 2–4', 'WEEKS 2–4'), t('Diseño y build', 'Design & build'), t('Ves la web en staging mientras se construye y das feedback directo.', 'You watch the site take shape on staging and give feedback directly.')],
    [t('MES 2+', 'MONTH 2+'), t('Lanzamiento y crecimiento', 'Launch & growth'), t('SEO técnico perfecto el día uno. Luego campañas, contenido y mejoras mensuales.', 'Flawless technical SEO on day one. Then campaigns, content and monthly improvements.')],
  ]
  return (
    <section className="section" id="proceso">
      <div className="wrap">
        <Reveal><div className="eyebrow">{t('Cómo trabajamos', 'How we work')}</div></Reveal>
        <Reveal><h2>{t('De la primera llamada al lanzamiento', 'From the first call to launch')}</h2></Reveal>
        <Reveal className="steps">
          {steps.map(([k, h, p]) => <div className="step" key={k}><div className="k">{k}</div><h3>{h}</h3><p>{p}</p></div>)}
        </Reveal>
      </div>
    </section>
  )
}

export function ReviewsV2() {
  const { t, language } = useLanguage()
  const en = language === 'en'
  const reviews: GReview[] = [
    { name: 'Sotovet', role: t('Clínica veterinaria · Sotogrande', 'Veterinary clinic · Sotogrande'), text: t('Web totalmente nueva construida desde cero, rápida y bien organizada. Comunicación directa en todo momento.', 'A completely new website built from scratch, fast and well organised. Direct communication throughout.') },
    { name: 'Ágora Sotogrande', role: t('Restaurante y discoteca', 'Restaurant & nightclub'), text: t('Entendieron el negocio desde el primer día. La web refleja exactamente lo que queríamos, y las reservas han subido.', 'They understood the business from day one. The site reflects exactly what we wanted, and bookings are up.') },
    { name: 'Racket Breaks', role: t('Viajes y reservas de pádel', 'Padel travel & bookings'), text: t('El flujo de reservas era justo lo que necesitábamos para un público del Reino Unido. Los cambios se resuelven rápido.', 'The booking flow was exactly what we needed for a UK audience. Changes get sorted fast.') },
  ]
  return (
    <section className="section" id="opiniones" style={{ background: 'var(--paper2)' }}>
      <div className="wrap">
        <Reveal><div className="eyebrow">{t('Lo que dicen nuestros clientes', 'What our clients say')}</div></Reveal>
        <Reveal><h2>{t('Opiniones de clientes', 'Client reviews')}</h2></Reveal>
        <GReviews reviews={reviews} es={!en} />
        <Reveal><div style={{ marginTop: 28 }}><Link href={href(en, '/opiniones')} className="btn ghost">{t('Leer todas las opiniones', 'Read all reviews')}</Link></div></Reveal>
      </div>
    </section>
  )
}

export function CtaV2() {
  const { t, language } = useLanguage()
  const en = language === 'en'
  const auditLive = useFreeAuditLive()
  return (
    <section className="section" id="contacto" style={{ paddingBottom: 0 }}>
      <div className="wrap">
        <Reveal className="cta">
          <Mesh colors={[GOLD, GOLD2, '90,100,120']} alpha={0.35} speed={1.4} />
          <div className="in">
            <div><div className="eyebrow">{t('Empezamos cuando quieras', 'We start when you are ready')}</div><h2>{t('¿Listo para construir algo real?', 'Ready to build something real?')}</h2></div>
            <div className="side">
              <a className="btn gold" href="https://wa.me/34680863229" target="_blank" rel="noopener noreferrer">{t('Hablemos por WhatsApp', 'Chat on WhatsApp')} <span className="arr" style={{ background: '#fff' }}>→</span></a>
              <Link className="btn ghost" href={href(en, '/contacto')}>{t('Reserva una llamada de 30 min', 'Book a 30-min call')}</Link>
              {auditLive && <Link className="btn ghost" href={auditHref(en)}>{t('Analiza tu web gratis', 'Review your site free')}</Link>}
              <p className="note">chris@impulsomedia.es · +34 680 863 229</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function FooterV2() {
  const { t, language } = useLanguage()
  const en = language === 'en'
  const year = new Date().getFullYear()
  const services = [['/servicios/diseno-web', 'Diseño web', 'Web design'], ['/servicios/seo', 'SEO', 'SEO'], ['/servicios/branding', 'Branding', 'Branding'], ['/servicios/publicidad', 'Google Ads y redes', 'Google Ads & paid social'], ['/servicios/automatizacion-ia', 'Automatización e IA', 'AI automation'], ['/servicios/performance', 'Performance a escala', 'Performance at scale']]
  const company = [['/precios', 'Precios', 'Pricing'], ['/proyectos', 'Proyectos', 'Work'], ['/nosotros', 'Nosotros', 'About'], ['/opiniones', 'Opiniones', 'Reviews'], ['/blog', 'Blog', 'Blog'], ['/contacto', 'Contacto', 'Contact']]
  const areas = en
    ? [['/en/web-design-sotogrande', 'Web design Sotogrande'], ['/en/web-design-gibraltar', 'Web design Gibraltar'], ['/en/seo-gibraltar', 'SEO Gibraltar'], ['/en/digital-marketing-gibraltar', 'Digital marketing Gibraltar'], ['/en/igaming-marketing', 'iGaming marketing']]
    : [['/diseno-web-san-roque', 'Diseño web San Roque y Sotogrande'], ['/diseno-web-algeciras', 'Diseño web Algeciras'], ['/diseno-web-la-linea', 'Diseño web La Línea'], ['/diseno-web-estepona', 'Diseño web Estepona'], ['/seo-algeciras', 'SEO Algeciras'], ['/agencia-marketing-digital-algeciras', 'Marketing digital Algeciras']]
  return (
    <footer>
      <div className="wrap">
        <div className="top">
          <div>
            <Link href={en ? '/en' : '/'} className="logo" aria-label="ImpulsoMedia"><Logo /></Link>
            <p style={{ marginTop: 14, maxWidth: '34ch', lineHeight: 1.6 }}>{t('Agencia digital integral. Diseño web, SEO, publicidad y automatización, construido desde cero. Siempre.', 'Full-service digital agency. Web design, SEO, paid media and automation, built from scratch. Always.')}</p>
            <p style={{ maxWidth: '34ch', lineHeight: 1.6 }}>{t('Con sede en Sotogrande, Cádiz. Servicio en San Roque, Gibraltar, La Línea y todo el Campo de Gibraltar.', 'Based in Sotogrande, Cádiz. Serving San Roque, Gibraltar, La Línea and all of Campo de Gibraltar.')}</p>
          </div>
          <div><h6>{t('Servicios', 'Services')}</h6><ul>{services.map(([h, es, e]) => <li key={h}><Link href={href(en, h)}>{en ? e : es}</Link></li>)}</ul></div>
          <div><h6>{t('Empresa', 'Company')}</h6><ul>{company.map(([h, es, e]) => <li key={h}><Link href={href(en, h)}>{en ? e : es}</Link></li>)}</ul></div>
          <div><h6>{t('Zonas', 'Areas')}</h6><ul>{areas.map(([h, l]) => <li key={h}><Link href={h}>{l}</Link></li>)}</ul></div>
        </div>
        <div className="bottom">
          <span>chris@impulsomedia.es · +34 680 863 229</span>
          <span className="copy">© {year} ImpulsoMedia. {t('Todos los derechos reservados.', 'All rights reserved.')} · <a href={t('/privacidad', '/en/privacy')}>{t('Privacidad', 'Privacy')}</a></span>
        </div>
      </div>
    </footer>
  )
}
