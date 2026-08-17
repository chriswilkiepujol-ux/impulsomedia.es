"use client"

import { useLanguage } from "@/lib/language-context"
import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"

const projects = [
  {
    id: "sotovet",
    name: "Sotovet",
    url: "sotovet.com",
    href: "https://www.sotovet.com",
    industryEn: "Veterinary Clinic",
    industryEs: "Clínica Veterinaria",
    image: "/images/sotovet-screenshot.png",
  },
  {
    id: "agora",
    name: "Ágora Sotogrande",
    url: "agorasotogrande.com",
    href: "https://agorasotogrande.com",
    industryEn: "Restaurant & Nightclub",
    industryEs: "Restaurante & Discoteca",
    image: "/images/agora-screenshot.png",
  },
  {
    id: "pujol-wilkie",
    name: "Pujol Wilkie",
    url: "pujolwilkie.com",
    href: "https://pujolwilkie.com",
    industryEn: "Legal Services",
    industryEs: "Servicios Jurídicos",
    image: "/images/pujol-wilkie-screenshot.png",
  },
  {
    id: "one4one",
    name: "One4One Fitness",
    url: "one4onefc.com",
    href: "https://one4onefc.com",
    industryEn: "Fitness & Gym",
    industryEs: "Fitness & Gimnasio",
    image: "/images/one4one-screenshot.png",
  },
  {
    id: "racketbreaks",
    name: "Racket Breaks",
    url: "racketbreaks.com",
    href: "https://www.racketbreaks.com",
    industryEn: "Padel Travel & Booking",
    industryEs: "Viajes y Reservas de Pádel",
    image: "/images/racketbreaks-screenshot.png",
  },
  {
    id: "nathanjosh",
    name: "Nathan & Josh",
    url: "nathanjosh.com",
    href: "https://www.nathanjosh.com",
    industryEn: "Content Creator Media Kit",
    industryEs: "Media Kit de Creadores",
    image: "/images/nathanjosh-screenshot.png",
  },
  {
    id: "onlinegames",
    name: "OnlineGames.cat",
    url: "onlinegames.cat",
    href: "https://onlinegames.cat",
    industryEn: "Video Game News & Reviews",
    industryEs: "Noticias de Videojuegos",
    image: "/images/onlinegames-screenshot.png",
  },
]

export function WorkCarousel() {
  const { language, t } = useLanguage()
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return
    const cardWidth = scrollRef.current.clientWidth / (window.innerWidth >= 768 ? 3 : 1)
    scrollRef.current.scrollBy({ left: direction === "left" ? -cardWidth : cardWidth, behavior: "smooth" })
  }

  return (
    <section id="work" className="py-[clamp(3rem,8vw,6rem)] px-6 md:px-[clamp(1.5rem,5vw,4rem)] bg-[#1B1F26]">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-6">
          <div>
            <span className="section-label mb-3 block">
              {t("Nuestro Trabajo", "Our Work")}
            </span>
            <h2 className="font-display font-extrabold text-[clamp(1.8rem,4.5vw,3.2rem)] leading-none tracking-[-0.02em]">
              {t("Clientes con los que trabajamos", "Clients we work with")}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={language === "en" ? "/en/work" : "/proyectos"}
              className="inline-flex items-center gap-2 text-[#d4a853] font-semibold text-sm hover:gap-3 transition-all duration-200 whitespace-nowrap mr-2"
            >
              {t("Ver todos", "See all")}
            </Link>
            <button
              onClick={() => scroll("left")}
              aria-label={t("Anterior", "Previous")}
              className="w-10 h-10 rounded-full border border-[rgba(255,255,255,0.13)] flex items-center justify-center hover:border-[#d4a853] hover:text-[#d4a853] transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label={t("Siguiente", "Next")}
              className="w-10 h-10 rounded-full border border-[rgba(255,255,255,0.13)] flex items-center justify-center hover:border-[#d4a853] hover:text-[#d4a853] transition-colors duration-200"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {projects.map((project) => (
            <a
              key={project.id}
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group snap-start shrink-0 w-[85%] md:w-[calc(33.333%-14px)] bg-[#232830] rounded-[4px] overflow-hidden flex flex-col transition-all duration-300 hover:bg-[#2B313B] no-underline text-[#f2ede6]"
            >
              <div className="relative w-full aspect-[16/10] bg-[#2B313B] overflow-hidden">
                <Image
                  src={project.image}
                  alt={`${project.name} website screenshot`}
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 85vw, 33vw"
                />
              </div>
              <div className="p-5">
                <span className="text-[0.65rem] font-medium tracking-[0.18em] uppercase text-[#d4a853] mb-2 block">
                  {language === "es" ? project.industryEs : project.industryEn}
                </span>
                <h3 className="font-display font-extrabold text-lg tracking-[-0.01em]">
                  {project.name}
                </h3>
                <span className="text-[0.75rem] text-[rgba(242,237,230,0.60)]">
                  {project.url}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
