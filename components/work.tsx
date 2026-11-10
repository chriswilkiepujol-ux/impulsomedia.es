"use client"

import { useLanguage } from "@/lib/language-context"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { PageHero, SectionHead } from "@/components/v2/page"
import { Reveal } from "@/components/v2/shared"

import { projects } from '@/lib/projects-data'
export { projects }

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
