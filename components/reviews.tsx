"use client"

import { useLanguage } from "@/lib/language-context"
import { PageHero, SectionHead } from "@/components/v2/page"
import { GReviews } from "@/components/v2/greviews"

export function Reviews({ primary = false }: { primary?: boolean } = {}) {
  const { language } = useLanguage()

  const content = {
    en: {
      tag: "What Clients Say",
      headline: "Real reviews, real results",
      googleLabel: "Verified reviews on Google",
      reviews: [
        {
          quote: "Brand new website built completely from scratch, fast and well organised. Direct communication the whole way through.",
          author: "Sotovet",
          role: "Veterinary Clinic",
        },
        {
          quote: "They understood the business from day one. The site reflects exactly what we wanted, and bookings have gone up.",
          author: "Ágora Sotogrande",
          role: "Restaurant & Nightclub",
        },
        {
          quote: "Quick communication and clear results within the first few weeks of going live.",
          author: "Pujol Wilkie",
          role: "Legal Services",
        },
        {
          quote: "The booking flow was exactly what we needed for a UK audience. Everything just works, and updates are turned around fast.",
          author: "Racket Breaks",
          role: "Padel Travel & Booking",
        },
        {
          quote: "Our media kit finally looks as good as our content. Brands take us seriously now, and enquiries have picked up since launch.",
          author: "Nathan & Josh",
          role: "Content Creator Media Kit",
        },
        {
          quote: "The automated content pipeline lets us publish reviews and news at a pace we could never manage manually, without the site feeling generic.",
          author: "OnlineGames.cat",
          role: "Video Game News & Reviews",
        },
      ],
    },
    es: {
      tag: "Lo Que Dicen Nuestros Clientes",
      headline: "Opiniones reales, resultados reales",
      googleLabel: "Reseñas verificadas en Google",
      reviews: [
        {
          quote: "Web totalmente nueva construida desde cero, rápida y bien organizada. Comunicación directa en todo momento.",
          author: "Sotovet",
          role: "Clínica Veterinaria",
        },
        {
          quote: "Entendieron el negocio desde el primer día. La web refleja exactamente lo que queríamos, y las reservas han subido.",
          author: "Ágora Sotogrande",
          role: "Restaurante y Discoteca",
        },
        {
          quote: "Comunicación rápida y resultados claros desde las primeras semanas.",
          author: "Pujol Wilkie",
          role: "Servicios Jurídicos",
        },
        {
          quote: "El flujo de reservas era justo lo que necesitábamos para un público del Reino Unido. Todo funciona, y los cambios se resuelven rápido.",
          author: "Racket Breaks",
          role: "Viajes y Reservas de Pádel",
        },
        {
          quote: "Nuestro media kit por fin luce tan bien como nuestro contenido. Las marcas ahora nos toman en serio y las consultas han aumentado desde el lanzamiento.",
          author: "Nathan & Josh",
          role: "Media Kit de Creadores",
        },
        {
          quote: "El pipeline de contenido automatizado nos permite publicar análisis y noticias a un ritmo que nunca podríamos gestionar manualmente, sin que el sitio se sienta genérico.",
          author: "OnlineGames.cat",
          role: "Noticias y Análisis de Videojuegos",
        },
      ],
    },
  }

  const t = content[language]
  const es = language === 'es'
  const grid = <GReviews es={es} reviews={t.reviews.map((r) => ({ name: r.author, role: r.role, text: r.quote }))} />

  if (primary) {
    return (
      <>
        <PageHero
          eyebrow={t.tag}
          title={es ? <>Opiniones reales, <em>resultados reales</em></> : <>Real reviews, <em>real results</em></>}
          sub={es
            ? 'Lo que dicen los negocios con los que trabajamos. Las reseñas están publicadas y verificadas en nuestro perfil de Google.'
            : 'What the businesses we work with say. The reviews are published and verified on our Google profile.'}
          actions={<>
            <a className="btn" href="https://g.page/r/Cart50OPlmevEBE/review" target="_blank" rel="noopener noreferrer">{es ? 'Ver en Google' : 'See them on Google'} <span className="arr">→</span></a>
            <a className="btn ghost" href={es ? '/proyectos' : '/en/work'}>{es ? 'Ver los proyectos' : 'See the projects'}</a>
          </>}
          aside={
            <div className="rating">
              <div className="eyebrow">{es ? 'Valoración en Google' : 'Google rating'}</div>
              <div className="big" style={{ marginTop: 18 }}>{es ? '5,0' : '5.0'}</div>
              <span className="stars">★★★★★</span>
              <div className="meta">{es ? 'Media de todas las reseñas' : 'Average across all reviews'}</div>
              <div className="bars">
                {[5, 4, 3, 2, 1].map((n) => (
                  <div key={n}><span>{n}</span><i>{n === 5 && <b />}</i><span>{n === 5 ? '100%' : '0%'}</span></div>
                ))}
              </div>
              <a className="btn ghost" href="https://g.page/r/Cart50OPlmevEBE/review" target="_blank" rel="noopener noreferrer">{t.googleLabel}</a>
            </div>
          }
        />
        <section className="section">
          <div className="wrap">
            <SectionHead eyebrow={es ? 'Clientes' : 'Clients'} title={es ? 'En sus palabras' : 'In their words'} />
            {grid}
          </div>
        </section>
      </>
    )
  }

  return (
    <section className="section" style={{ background: 'var(--paper2)' }}>
      <div className="wrap">
        <SectionHead eyebrow={t.tag} title={t.headline} />
        {grid}
      </div>
    </section>
  )
}
