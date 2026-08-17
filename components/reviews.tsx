"use client"

import { useLanguage } from "@/lib/language-context"
import { Star } from "lucide-react"

export function Reviews() {
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
      ],
    },
  }

  const t = content[language]

  return (
    <section id="reviews" className="relative py-24 md:py-32 bg-[#232830]">
      <div className="max-w-[1100px] mx-auto px-6 md:px-12">
        <div className="max-w-2xl mx-auto text-center mb-14 md:mb-16">
          <span className="inline-block text-[0.72rem] font-medium tracking-[0.2em] uppercase text-[#d4a853] mb-4">
            {t.tag}
          </span>
          <h2 className="font-display font-extrabold text-[clamp(2rem,5vw,3.2rem)] leading-[1.1] text-[#f2ede6]">
            {t.headline}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-10">
          {t.reviews.map((review, index) => (
            <div
              key={index}
              className="bg-[#1B1F26] border border-[rgba(255,255,255,0.09)] rounded-xl p-6 md:p-8"
            >
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#d4a853] text-[#d4a853]" />
                ))}
              </div>
              <p className="text-[#f2ede6]/[0.82] text-sm leading-relaxed mb-6">
                {review.quote}
              </p>
              <div>
                <p className="text-[#f2ede6] font-semibold text-sm">{review.author}</p>
                <p className="text-[#f2ede6]/60 text-xs mt-0.5">{review.role}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-[#f2ede6]/60 text-sm">{t.googleLabel}</p>
      </div>
    </section>
  )
}
