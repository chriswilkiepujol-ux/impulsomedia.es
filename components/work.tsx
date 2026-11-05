"use client"

import { useLanguage } from "@/lib/language-context"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { PageHero, SectionHead } from "@/components/v2/page"
import { Reveal } from "@/components/v2/shared"

export const projects = [
  {
    id: "sotovet",
    name: "Sotovet",
    url: "sotovet.com",
    href: "https://www.sotovet.com",
    industryEn: "Veterinary Clinic · Sotogrande",
    industryEs: "Clínica Veterinaria · Sotogrande",
    descEn: "Full custom website built from scratch for a veterinary clinic with over 40 years of history. Bilingual (ES/EN), mobile-first, fast-loading, with SEO foundation built in from day one.",
    descEs: "Web personalizada desde cero para una clínica veterinaria con más de 40 años de historia. Bilingüe (ES/EN), mobile-first, carga rápida y base SEO integrada desde el primer día.",
    tags: ["Web Design", "Local SEO", "Bilingual"],
    image: "/images/sotovet-screenshot.png",
  },
  {
    id: "agora",
    name: "Ágora Sotogrande",
    url: "agorasotogrande.com",
    href: "https://agorasotogrande.com",
    industryEn: "Restaurant & Nightclub · Sotogrande",
    industryEs: "Restaurante & Discoteca · Sotogrande",
    descEn: "Immersive website for a premium restaurant and nightclub experience in Sotogrande. Full custom build with video background and booking-focused structure.",
    descEs: "Web inmersiva para un restaurante y club nocturno premium en Sotogrande. Construcción personalizada con vídeo de fondo y estructura orientada a reservas.",
    tags: ["Web Design", "Video", "Bookings"],
    image: "/images/agora-screenshot.png",
  },
  {
    id: "pujol-wilkie",
    name: "Pujol Wilkie",
    url: "pujolwilkie.com",
    href: "https://pujolwilkie.com",
    industryEn: "Legal Services · Sotogrande & Marbella",
    industryEs: "Servicios Jurídicos · Sotogrande & Marbella",
    descEn: "Professional website for an established Spanish lawyer specialising in property law, Golden Visa, and services for international clients.",
    descEs: "Web profesional para una abogada española especializada en derecho inmobiliario, Visa Dorada y servicios para clientes internacionales.",
    tags: ["Web Design", "SEO", "Lead Gen"],
    image: "/images/pujol-wilkie-screenshot.png",
  },
  {
    id: "one4one",
    name: "One4One Fitness",
    url: "one4onefc.com",
    href: "https://one4onefc.com",
    industryEn: "Fitness & Gym · Sotogrande",
    industryEs: "Fitness & Gimnasio · Sotogrande",
    descEn: "Full website for one of Sotogrande's premier fitness centres. Clear pricing, trainer profiles, and class schedules — all built to drive sign-ups.",
    descEs: "Web completa para uno de los principales centros de fitness de Sotogrande. Precios claros, perfiles de entrenadores y horarios de clases.",
    tags: ["Web Design", "Fitness", "Conversion"],
    image: "/images/one4one-screenshot.png",
  },
  {
    id: "racketbreaks",
    name: "Racket Breaks",
    url: "racketbreaks.com",
    href: "https://www.racketbreaks.com",
    industryEn: "Padel Travel & Booking · South of Spain",
    industryEs: "Viajes y Reservas de Pádel · Sur de España",
    descEn: "Custom booking platform for padel holidays across Sotogrande, Marbella, Estepona, Málaga and Almería, built for UK and European travel groups with a tailored quote engine.",
    descEs: "Plataforma de reservas a medida para vacaciones de pádel en Sotogrande, Marbella, Estepona, Málaga y Almería, pensada para grupos de viaje del Reino Unido y Europa con motor de presupuesto personalizado.",
    tags: ["Web Design", "Booking Engine", "Travel"],
    image: "/images/racketbreaks-screenshot.png",
  },
  {
    id: "nathanjosh",
    name: "Nathan & Josh",
    url: "nathanjosh.com",
    href: "https://www.nathanjosh.com",
    industryEn: "Content Creator Media Kit · Dubai & Bali",
    industryEs: "Media Kit de Creadores de Contenido · Dubái y Bali",
    descEn: "Media kit and brand partnership site for a fashion, style and lifestyle content duo based in Dubai and filming in Bali, built to convert brand enquiries into booked collaborations.",
    descEs: "Media kit y web de colaboraciones de marca para un dúo de creadores de contenido de moda y estilo de vida con base en Dubái y grabaciones en Bali, pensada para convertir consultas de marcas en colaboraciones reservadas.",
    tags: ["Web Design", "Influencer Marketing", "Media Kit"],
    image: "/images/nathanjosh-screenshot.png",
  },
  {
    id: "onlinegames",
    name: "OnlineGames.cat",
    url: "onlinegames.cat",
    href: "https://onlinegames.cat",
    industryEn: "Video Game News & Reviews",
    industryEs: "Noticias y Análisis de Videojuegos",
    descEn: "Video game news and review platform with fully automated content production, covering analysis, guides and news across PS5, Xbox, Nintendo, PC and mobile.",
    descEs: "Plataforma de noticias y análisis de videojuegos con producción de contenido totalmente automatizada, cubriendo análisis, guías y noticias de PS5, Xbox, Nintendo, PC y móvil.",
    tags: ["Web Design", "Content Automation", "Publishing"],
    image: "/images/onlinegames-screenshot.png",
  },
]

export function Work({ primary = false }: { primary?: boolean } = {}) {
  const { language } = useLanguage()


  const es = language === 'es'
  const [a, b, c] = [projects[1], projects[2], projects[4]]
  return (
    <>
      {primary && (
        <PageHero
          eyebrow={es ? 'Nuestro trabajo' : 'Our work'}
          title={es ? <>Clientes con los que <em>trabajamos</em></> : <>Clients we <em>work with</em></>}
          sub={es
            ? 'Cada proyecto fue construido desde cero. Distintos sectores, distintos retos, el mismo nivel de exigencia: webs rápidas, bilingües y pensadas para convertir.'
            : 'Every project was built from scratch. Different sectors, different challenges, the same standard: fast, bilingual websites built to convert.'}
          actions={<>
            <a className="btn" href="https://wa.me/34680863229" target="_blank" rel="noopener noreferrer">{es ? 'Quiero una web así' : 'I want a site like this'} <span className="arr">→</span></a>
            <a className="btn ghost" href={es ? '/opiniones' : '/en/reviews'}>{es ? 'Ver opiniones' : 'Read reviews'}</a>
          </>}
          aside={
            <div className="collage" aria-hidden="true">
              {[a, b, c].map((p, i) => (
                <div key={p.id} className={`shot ${['a', 'b', 'c'][i]}`}>
                  <Image src={p.image} alt="" width={1116} height={800} sizes="(max-width: 960px) 60vw, 30vw" priority={i === 1} />
                </div>
              ))}
            </div>
          }
        />
      )}
      <section id="work" className="section">
        <div className="wrap">
          <SectionHead
            eyebrow={es ? 'Casos' : 'Case studies'}
            title={es ? `${projects.length} webs, ${projects.length} retos distintos` : `${projects.length} sites, ${projects.length} different challenges`}
            lead={es ? 'Pasa el ratón por cada captura para recorrer la web. Haz clic para visitarla.' : 'Hover over each screenshot to scroll through the site. Click to visit it.'}
          />
          <div className="cases">
            {projects.map((p, i) => (
              <Reveal key={p.id} as="article" className="case">
                <div className="visual" style={{ background: ['linear-gradient(135deg,#e6ece3,#b9c7b0)', 'linear-gradient(135deg,#1c2026,#3a3f47)', 'linear-gradient(135deg,#f0e6cf,#d9c48f)', 'linear-gradient(135deg,#e4e4ee,#b4b4cc)', 'linear-gradient(135deg,#dfe7ec,#b7c6d1)', 'linear-gradient(135deg,#f1e2e0,#cfa9a4)', 'linear-gradient(135deg,#1c2026,#4a3f5a)'][i % 7] }}>
                  <div className="frame"><Image src={p.image} alt={`${p.name} – ${es ? p.industryEs : p.industryEn}`} width={1116} height={800} sizes="(max-width: 900px) 100vw, 55vw" /></div>
                </div>
                <div className="body">
                  <span className="ind">{es ? p.industryEs : p.industryEn}</span>
                  <h3>{p.name}</h3>
                  <p>{es ? p.descEs : p.descEn}</p>
                  <div className="tags">{p.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  <a className="visit" href={p.href} target="_blank" rel="noopener noreferrer">{p.url} <ArrowUpRight className="w-4 h-4" /></a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
