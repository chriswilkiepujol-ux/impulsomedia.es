"use client"

import { useLanguage } from "@/lib/language-context"
import { blogPosts } from "@/lib/blog-data"
import { Reveal } from "@/components/v2/shared"
import { PageHero, WidgetStack } from "@/components/v2/page"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

export function BlogListing() {
  const { language, t } = useLanguage()

  const es = language === "es"
  const [first, ...rest] = blogPosts
  const card = (post: typeof blogPosts[number], big = false) => {
    const slug = es ? post.slugEs : post.slugEn
    const href = es ? `/blog/${slug}` : `/en/blog/${slug}`
    return (
      <Reveal key={post.id} as="div">
        <Link href={href} className={`proj ${big ? "big" : ""}`} style={{ height: "100%" }}>
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: big ? "16/8" : "16/9" }}>
            <Image src={post.coverImage} alt="" fill className="object-cover transition-transform duration-500 hover:scale-105" sizes={big ? "(max-width: 900px) 100vw, 66vw" : "(max-width: 900px) 100vw, 33vw"} />
          </div>
          <div style={{ padding: "22px 24px 26px", display: "grid", gap: 10 }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "#8a6a28" }}>{es ? post.categoryLabelEs : post.categoryLabelEn}</span>
            <h2 style={{ fontSize: big ? "clamp(24px, 2.8vw, 34px)" : 20, lineHeight: 1.15 }}>{es ? post.titleEs : post.titleEn}</h2>
            <p style={{ margin: 0, color: "var(--ink2)", fontSize: 15, lineHeight: 1.55 }}>{es ? post.excerptEs : post.excerptEn}</p>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 14, color: "#8a6a28", marginTop: 4 }}>{t("Leer más", "Read more")} <ArrowRight className="w-4 h-4" /></span>
          </div>
        </Link>
      </Reveal>
    )
  }

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title={es ? <>Notas sobre SEO, campañas y <em>proyectos reales</em></> : <>Notes on SEO, campaigns and <em>real projects</em></>}
        sub={t(
          "Lo que aprendemos trabajando con negocios locales y marcas a mayor escala, sin relleno.",
          "What we learn working with local businesses and larger-scale brands, no filler."
        )}
        aside={
          <WidgetStack kicker={t("Último artículo", "Latest article")} label={es ? first.titleEs : first.titleEn}>
            <div className="widget" style={{ left: 0, top: 0 }}>
              <div className="k">{t("Artículos", "Articles")}</div>
              <div className="v">{blogPosts.length}</div>
            </div>
            <div className="widget" style={{ right: 0, top: "30%", animationDelay: "-2s" }}>
              <div className="k">{t("Temas", "Topics")}</div>
              <div className="v" style={{ fontSize: 18 }}>SEO · Ads · Web</div>
            </div>
          </WidgetStack>
        }
      />
      <section className="section">
        <div className="wrap">
          <div className="work" style={{ marginTop: 0 }}>
            {card(first, true)}
            {rest.map((p) => card(p))}
          </div>
        </div>
      </section>
    </>
  )
}
