"use client"

import { useLanguage } from "@/lib/language-context"
import Image from "next/image"

const projects = [
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
]

export function Work() {
  const { language } = useLanguage()

  return (
    <section id="work" className="py-[clamp(4rem,10vw,9rem)] px-6 md:px-[clamp(1.5rem,5vw,4rem)] bg-[#1B1F26]">
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-[clamp(3rem,6vw,5rem)] gap-6 md:gap-8">
          <div>
            <span className="inline-flex items-center gap-2.5 text-[0.7rem] font-medium tracking-[0.2em] uppercase text-[#d4a853] mb-4 md:mb-5">
              <span className="w-5 h-[1px] bg-[#d4a853]" />
              {language === "en" ? "Our Work" : "Nuestro Trabajo"}
            </span>
            <h2 className="font-display font-extrabold text-[clamp(2rem,5vw,4.2rem)] leading-none tracking-[-0.02em]">
              {language === "en" ? "Clients we work with" : "Clientes con los que trabajamos"}
            </h2>
          </div>
          <p className="max-w-[38ch] text-[rgba(242, 237, 230, 0.82)] text-base font-light leading-[1.7]">
            {language === "en" 
              ? "Every project here was built from scratch. Different industries, different challenges — same standard of work."
              : "Cada proyecto fue construido desde cero. Distintos sectores, distintos retos — el mismo nivel de exigencia."
            }
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {projects.map((project) => (
            <a
              key={project.id}
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-[#232830] rounded-[4px] overflow-hidden relative flex flex-col transition-all duration-300 hover:bg-[#2B313B] no-underline text-[#f2ede6] hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
            >
              {/* Image Preview Area */}
              <div className="relative w-full aspect-[16/10] bg-[#2B313B] overflow-hidden">
                {/* Actual Screenshot */}
                <Image
                  src={project.image}
                  alt={`${project.name} website screenshot`}
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                
                {/* Gradient overlay for better text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#232830] via-transparent to-transparent opacity-60" />
                
                {/* View site indicator */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-[#d4a853] text-[#1B1F26] px-4 py-2 rounded-[3px] font-display font-bold text-xs tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  {language === "en" ? "View Site" : "Ver Web"}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M7 17L17 7M17 7H7M17 7V17"/>
                  </svg>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                {/* Industry */}
                <span className="text-[0.68rem] font-medium tracking-[0.18em] uppercase text-[#d4a853] mb-3">
                  {language === "es" ? project.industryEs : project.industryEn}
                </span>

                {/* Title & URL */}
                <div className="mb-3">
                  <h3 className="font-display font-extrabold text-[clamp(1.3rem,2.5vw,1.8rem)] tracking-[-0.01em] leading-[1.1]">
                    {project.name}
                  </h3>
                  <span className="text-[0.75rem] text-[rgba(242, 237, 230, 0.60)]">
                    {project.url}
                  </span>
                </div>

                {/* Description */}
                <p className="text-[0.88rem] text-[rgba(242, 237, 230, 0.82)] leading-[1.65] mb-5 flex-1">
                  {language === "es" ? project.descEs : project.descEn}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[0.65rem] font-medium tracking-[0.08em] uppercase px-3 py-1 border border-[rgba(255,255,255,0.13)] rounded-full text-[rgba(242, 237, 230, 0.60)] transition-colors duration-200 group-hover:border-[rgba(212,168,83,0.3)] group-hover:text-[rgba(242,237,230,0.6)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Gold bottom line on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#d4a853] to-transparent scale-x-0 origin-left transition-transform duration-400 group-hover:scale-x-100" />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
