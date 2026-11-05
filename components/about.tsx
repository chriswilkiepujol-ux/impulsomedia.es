"use client"

import { useLanguage } from "@/lib/language-context"
import { Hammer, Target, Handshake, Languages } from "lucide-react"
import Image from "next/image"
import { PageHero } from "@/components/v2/page"
import { Reveal, CountUp } from "@/components/v2/shared"

export function About({ primary = false }: { primary?: boolean } = {}) {
  const { language } = useLanguage()

  const content = {
    en: {
      tag: "About Us",
      headline: "Small team. Big standards.",
      story: [
        "ImpulsoMedia was founded on a simple belief: most websites are built wrong. They're bloated, slow, hard to update, and built on top of shaky foundations.",
        "We do things differently. Every website we build starts from scratch — no templates, no page builders, no inherited problems. Just clean code, clear strategy, and a direct line to the person doing the work.",
        "Based in Sotogrande, we serve clients across Spain, Gibraltar, and beyond. We're bilingual by default, fast by design, and selective about who we work with — because that's how we deliver results."
      ],
      values: [
        {
          icon: Hammer,
          title: "Made to Measure",
          description: "New builds or improvements to the site you already have, always tailored to your business and built for performance."
        },
        {
          icon: Target,
          title: "Results First",
          description: "We build websites that convert visitors into customers — not just digital brochures."
        },
        {
          icon: Handshake,
          title: "Direct Relationship",
          description: "You work directly with the person building your site. No layers, no delays."
        },
        {
          icon: Languages,
          title: "Bilingual by Default",
          description: "English and Spanish built in from day one. Reach more customers, effortlessly."
        }
      ]
    },
    es: {
      tag: "Sobre Nosotros",
      headline: "Equipo pequeño. Grandes estándares.",
      story: [
        "ImpulsoMedia se fundó con una creencia simple: la mayoría de los sitios web están mal construidos. Son pesados, lentos, difíciles de actualizar y construidos sobre cimientos inestables.",
        "Hacemos las cosas diferente. Cada sitio web que construimos empieza desde cero — sin plantillas, sin constructores de páginas, sin problemas heredados. Solo código limpio, estrategia clara y línea directa con quien hace el trabajo.",
        "Con sede en Sotogrande, servimos a clientes en toda España, Gibraltar y más allá. Somos bilingües por defecto, rápidos por diseño y selectivos con quién trabajamos — porque así es como entregamos resultados."
      ],
      values: [
        {
          icon: Hammer,
          title: "Hecho a Medida",
          description: "Webs nuevas o mejoras sobre la que ya tienes, siempre adaptadas a tu negocio y pensadas para rendir."
        },
        {
          icon: Target,
          title: "Resultados Primero",
          description: "Construimos sitios que convierten visitantes en clientes — no solo folletos digitales."
        },
        {
          icon: Handshake,
          title: "Relación Directa",
          description: "Trabajas directamente con quien construye tu sitio. Sin capas, sin retrasos."
        },
        {
          icon: Languages,
          title: "Bilingüe por Defecto",
          description: "Inglés y español integrados desde el día uno. Alcanza más clientes, sin esfuerzo."
        }
      ]
    }
  }

  const t = content[language]
  const es = language === 'es'
  const [title1, title2] = t.headline.split('. ')
  return (
    <>
      <PageHero
        eyebrow={t.tag}
        title={<>{title1}. <em>{title2}</em></>}
        sub={t.story[0]}
        actions={<>
          <a className="btn" href="https://wa.me/34680863229" target="_blank" rel="noopener noreferrer">{es ? 'Hablemos' : "Let's talk"} <span className="arr">→</span></a>
          <a className="btn ghost" href={es ? '/proyectos' : '/en/work'}>{es ? 'Ver proyectos' : 'See our work'}</a>
        </>}
        aside={
          <div className="photo" style={{ maxWidth: 440, marginLeft: 'auto' }}>
            <Image src="/images/chris-wilkie.jpg" alt={es ? 'Chris Wilkie, fundador de ImpulsoMedia' : 'Chris Wilkie, founder of ImpulsoMedia'} width={1200} height={1500} sizes="(max-width: 960px) 90vw, 440px" priority />
            <span className="tag">{es ? 'Fundador' : 'Founder'}</span>
            <div className="cap"><b>Chris Wilkie</b>{es ? 'Más de 10 años comprando medios para operadores de iGaming. Ahora al servicio de negocios locales y marcas que quieren escalar.' : '10+ years buying media for iGaming operators. Now working for local businesses and brands that want to scale.'}</div>
          </div>
        }
      />
      <section id="about" className="section">
        <div className="wrap">
          <div className="story">
            <Reveal><div className="eyebrow">{es ? 'Nuestra historia' : 'Our story'}</div><h2 style={{ fontSize: 'clamp(30px, 4vw, 48px)', marginTop: 18 }}>{es ? 'Por qué existe ImpulsoMedia' : 'Why ImpulsoMedia exists'}</h2></Reveal>
            <Reveal className="txt">{t.story.slice(1).map((p, i) => <p key={i}>{p}</p>)}</Reveal>
          </div>
          <div className="band" style={{ marginTop: 56 }}>
            <Reveal className="stat"><div className="n"><CountUp end={7} gold /></div><div className="l">{es ? 'Clientes activos' : 'Active clients'}</div></Reveal>
            <Reveal className="stat"><div className="n"><CountUp end={10} suffix="+" /></div><div className="l">{es ? 'Años en marketing de resultados' : 'Years in performance marketing'}</div></Reveal>
            <Reveal className="stat"><div className="n">ES + EN</div><div className="l">{es ? 'Bilingües por defecto' : 'Bilingual by default'}</div></Reveal>
            <Reveal className="stat"><div className="n"><CountUp end={5} suffix={es ? ',0' : '.0'} /></div><div className="l">{es ? 'Valoración en Google' : 'Google rating'}</div></Reveal>
          </div>
          <div className="tiles">
            {t.values.map((v, i) => (
              <Reveal key={v.title} as="div">
                <div className="tile" style={{ height: '100%' }}>
                  <span className="n">{String(i + 1).padStart(2, '0')}</span>
                  <span className="ic"><v.icon strokeWidth={1.6} /></span>
                  <h3>{v.title}</h3>
                  <p>{v.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
