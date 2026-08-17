"use client"

import { useLanguage } from "@/lib/language-context"

export function FAQ() {
  const { language } = useLanguage()

  const content = {
    en: {
      tag: "FAQ",
      headline: "Common Questions",
      faqs: [
        {
          question: "Do you work on existing websites?",
          answer: "No. We only build from scratch. If you have an existing site that needs fixing or updating, we're not the right fit. Our model is based on clean foundations — not patching someone else's code."
        },
        {
          question: "How do I get started?",
          answer: "Send us a WhatsApp message. We'll have a quick conversation about your business, your goals, and whether we're a good fit. If we are, we'll send you a simple proposal within 48 hours."
        },
        {
          question: "How much does a website cost?",
          answer: "Every project is scoped and priced based on what it actually needs. No packages, no hidden extras — just a clear quote before anything starts."
        },
        {
          question: "How long does it take?",
          answer: "Most projects take 2–4 weeks from kickoff to launch. Larger or more complex sites may take longer. We'll always give you a realistic timeline before we start."
        },
        {
          question: "Do you offer maintenance?",
          answer: "Yes. We offer optional monthly maintenance packages that include updates, backups, security monitoring, and priority support. Ask us for details."
        },
        {
          question: "What if I need changes after launch?",
          answer: "Small tweaks within the first 30 days are included. After that, we offer hourly support or a maintenance package. We're always just a WhatsApp message away."
        }
      ]
    },
    es: {
      tag: "FAQ",
      headline: "Preguntas Frecuentes",
      faqs: [
        {
          question: "¿Trabajan en sitios web existentes?",
          answer: "No. Solo construimos desde cero. Si tienes un sitio existente que necesita arreglos o actualizaciones, no somos la opción correcta. Nuestro modelo se basa en fundamentos limpios — no en parchear código ajeno."
        },
        {
          question: "¿Cómo empiezo?",
          answer: "Envíanos un mensaje de WhatsApp. Tendremos una conversación rápida sobre tu negocio, tus objetivos y si somos una buena opción. Si lo somos, te enviaremos una propuesta simple en 48 horas."
        },
        {
          question: "¿Cuánto cuesta un sitio web?",
          answer: "Cada proyecto se define y presupuesta según lo que realmente necesita. Sin paquetes, sin extras ocultos — solo un presupuesto claro antes de empezar."
        },
        {
          question: "¿Cuánto tiempo toma?",
          answer: "La mayoría de proyectos toman 2–4 semanas desde el inicio hasta el lanzamiento. Sitios más grandes o complejos pueden tomar más. Siempre te daremos un cronograma realista antes de empezar."
        },
        {
          question: "¿Ofrecen mantenimiento?",
          answer: "Sí. Ofrecemos paquetes de mantenimiento mensual opcionales que incluyen actualizaciones, respaldos, monitoreo de seguridad y soporte prioritario. Pregúntanos por detalles."
        },
        {
          question: "¿Qué pasa si necesito cambios después del lanzamiento?",
          answer: "Pequeños ajustes dentro de los primeros 30 días están incluidos. Después de eso, ofrecemos soporte por hora o un paquete de mantenimiento. Siempre estamos a un mensaje de WhatsApp de distancia."
        }
      ]
    }
  }

  const t = content[language]

  return (
    <section id="faq" className="relative py-24 md:py-32 bg-[#232830]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <span className="inline-block text-[0.72rem] font-medium tracking-[0.2em] uppercase text-[#d4a853] mb-4">
            {t.tag}
          </span>
          <h2 className="font-display font-extrabold text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] text-[#f2ede6]">
            {t.headline}
          </h2>
        </div>

        {/* FAQ Grid - 2 columns on mobile */}
        <div className="grid grid-cols-2 gap-3 md:gap-8">
          {t.faqs.map((faq, index) => (
            <div 
              key={index}
              className="p-4 md:p-8 rounded-xl bg-[#232830] border border-[#2B313B] hover:border-[#d4a853]/20 transition-colors duration-300"
            >
              <h3 className="font-display font-bold text-sm md:text-xl text-[#f2ede6] mb-2 md:mb-4">
                {faq.question}
              </h3>
              <p className="text-[#f2ede6]/60 text-xs md:text-base leading-relaxed font-sans">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
