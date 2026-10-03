"use client"

import { useLanguage } from "@/lib/language-context"
import { BlogPost as BlogPostType } from "@/lib/blog-data"
import { Reveal } from "@/components/reveal"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

export function BlogPost({ post }: { post: BlogPostType }) {
  const { language, t } = useLanguage()
  const content = language === "es" ? post.contentEs : post.contentEn
  const blogHref = language === "es" ? "/blog" : "/en/blog"

  const formattedDate = new Date(post.date).toLocaleDateString(
    language === "es" ? "es-ES" : "en-GB",
    { year: "numeric", month: "long", day: "numeric" }
  )

  return (
    <article className="py-[clamp(3rem,6vw,4.5rem)] px-6 md:px-[clamp(1.5rem,5vw,4rem)]">
      <div className="max-w-[760px] mx-auto">
        <Link
          href={blogHref}
          className="inline-flex items-center gap-2 text-[rgba(242,237,230,0.5)] text-sm font-medium no-underline hover:text-[#f2ede6] transition-colors duration-200 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("Volver al blog", "Back to blog")}
        </Link>

        <Reveal>
          <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-8">
            <Image src={post.coverImage} alt="" fill className="object-cover" sizes="760px" priority />
          </div>
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.1em] text-[#d4a853] mb-3 block">
            {language === "es" ? post.categoryLabelEs : post.categoryLabelEn}
          </span>
          <h1 className="font-display font-extrabold text-[clamp(1.9rem,3.8vw,2.8rem)] leading-[1.2] tracking-[-0.015em] mb-4">
            {language === "es" ? post.titleEs : post.titleEn}
          </h1>
          <div className="flex items-center gap-3 text-sm text-[rgba(242,237,230,0.5)] mb-10 pb-10 border-b border-[rgba(255,255,255,0.09)]">
            <span>{formattedDate}</span>
            <span>·</span>
            <span>{post.readMinutes} {t("min de lectura", "min read")}</span>
          </div>
        </Reveal>

        <Reveal delay={100} className="prose-content">
          {content.map((block, i) => {
            if (block.type === "h2") {
              return (
                <h2
                  key={i}
                  className="font-display font-extrabold text-xl md:text-2xl leading-[1.3] mt-10 mb-4 text-[#f2ede6]"
                >
                  {block.text}
                </h2>
              )
            }
            if (block.type === "ul") {
              return (
                <ul key={i} className="mb-6 flex flex-col gap-2.5">
                  {block.items?.map((item, j) => (
                    <li key={j} className="flex items-start gap-3 text-[rgba(242,237,230,0.82)] leading-[1.7]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d4a853] flex-shrink-0 mt-[0.6em]" />
                      {item}
                    </li>
                  ))}
                </ul>
              )
            }
            return (
              <p key={i} className="text-[rgba(242,237,230,0.82)] leading-[1.75] mb-6">
                {block.text}
              </p>
            )
          })}
        </Reveal>
      </div>
    </article>
  )
}
