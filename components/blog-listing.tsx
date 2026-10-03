"use client"

import { useLanguage } from "@/lib/language-context"
import { blogPosts } from "@/lib/blog-data"
import { Reveal } from "@/components/reveal"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

export function BlogListing() {
  const { language, t } = useLanguage()

  return (
    <section className="py-[clamp(3rem,6vw,4.5rem)] px-6 md:px-[clamp(1.5rem,5vw,4rem)]">
      <div className="max-w-[1100px] mx-auto">
        <Reveal className="max-w-2xl mb-10 md:mb-14">
          <span className="section-label mb-3 block">{t("Blog", "Blog")}</span>
          <h1 className="font-display font-extrabold text-[clamp(1.9rem,3.8vw,2.8rem)] leading-[1.2] tracking-[-0.015em] mb-4">
            {t("Notas sobre SEO, campañas y proyectos reales", "Notes on SEO, campaigns and real projects")}
          </h1>
          <p className="text-[rgba(242,237,230,0.72)] leading-[1.7]">
            {t(
              "Lo que aprendemos trabajando con negocios locales y marcas a mayor escala, sin relleno.",
              "What we learn working with local businesses and larger-scale brands, no filler."
            )}
          </p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5">
          {blogPosts.map((post, i) => {
            const slug = language === "es" ? post.slugEs : post.slugEn
            const href = language === "es" ? `/blog/${slug}` : `/en/blog/${slug}`
            return (
              <Reveal key={post.id} delay={i * 80}>
                <Link
                  href={href}
                  className="group block h-full bg-[#2E3542] border border-[rgba(255,255,255,0.09)] rounded-xl overflow-hidden no-underline text-[#f2ede6] transition-colors duration-200 hover:bg-[#36404E]"
                >
                  <div className="relative w-full aspect-[16/9] overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-6">
                  <span className="text-[0.68rem] font-bold uppercase tracking-[0.1em] text-[#d4a853] mb-3 block">
                    {language === "es" ? post.categoryLabelEs : post.categoryLabelEn}
                  </span>
                  <h2 className="font-display font-extrabold text-lg leading-[1.3] mb-3">
                    {language === "es" ? post.titleEs : post.titleEn}
                  </h2>
                  <p className="text-sm text-[rgba(242,237,230,0.65)] leading-[1.6] mb-5">
                    {language === "es" ? post.excerptEs : post.excerptEn}
                  </p>
                  <span className="inline-flex items-center gap-2 text-[#d4a853] font-semibold text-sm group-hover:gap-3 transition-all duration-200">
                    {t("Leer más", "Read more")}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                  </div>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
