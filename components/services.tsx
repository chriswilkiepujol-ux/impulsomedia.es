"use client"

import { useLanguage } from '@/lib/language-context'
import { Globe, Smartphone, Palette, TrendingUp, Wrench, Package, MessageCircle, Target, Share2, BarChart3, Handshake, Store, Instagram, Megaphone, Briefcase } from 'lucide-react'

const services = [
  {
    num: '01',
    icon: Globe,
    titleEs: 'Diseño Web',
    titleEn: 'Web Design',
    descEs: 'Sitios web únicos construidos desde cero. Sin plantillas, sin WordPress. Código limpio y diseño que convierte visitantes en clientes.',
    descEn: 'Unique websites built from scratch. No templates, no WordPress. Clean code and design that converts visitors into clients.',
    tagsEs: ['Diseño UI/UX', 'Desarrollo', 'Responsive', 'SEO técnico'],
    tagsEn: ['UI/UX Design', 'Development', 'Responsive', 'Technical SEO'],
  },
  {
    num: '02',
    icon: TrendingUp,
    titleEs: 'SEO',
    titleEn: 'SEO',
    descEs: 'Posicionamiento local y nacional. Contenido, técnica y estrategia para aparecer donde tus clientes buscan.',
    descEn: 'Local and national search positioning. Content, technical SEO and strategy to show up where your clients search.',
    tagsEs: ['SEO Local', 'Técnico', 'Contenido', 'Google Business'],
    tagsEn: ['Local SEO', 'Technical', 'Content', 'Google Business'],
  },
  {
    num: '03',
    icon: Target,
    titleEs: 'PPC',
    titleEn: 'PPC',
    descEs: 'Campañas de Google Ads gestionadas para convertir, con seguimiento claro de coste por lead y retorno.',
    descEn: 'Google Ads campaigns managed to convert, with clear tracking on cost per lead and return.',
    tagsEs: ['Google Ads', 'Búsqueda', 'Display', 'Remarketing'],
    tagsEn: ['Google Ads', 'Search', 'Display', 'Remarketing'],
  },
  {
    num: '04',
    icon: Share2,
    titleEs: 'Paid Social',
    titleEn: 'Paid Social',
    descEs: 'Campañas pagadas en Meta, TikTok y Snapchat diseñadas para generar demanda y captar clientes.',
    descEn: 'Paid campaigns on Meta, TikTok and Snapchat designed to build demand and capture new clients.',
    tagsEs: ['Meta Ads', 'TikTok', 'Snapchat', 'Creatividades'],
    tagsEn: ['Meta Ads', 'TikTok', 'Snapchat', 'Creative'],
  },
  {
    num: '05',
    icon: BarChart3,
    titleEs: 'Programática',
    titleEn: 'Programmatic',
    descEs: 'Compra de medios a escala para marcas y operadores con presupuestos mayores y objetivos de alcance.',
    descEn: 'Media buying at scale for brands and operators with larger budgets and reach objectives.',
    tagsEs: ['Media Buying', 'DSP', 'Display', 'Video'],
    tagsEn: ['Media Buying', 'DSP', 'Display', 'Video'],
  },
  {
    num: '06',
    icon: Handshake,
    titleEs: 'Afiliación',
    titleEn: 'Affiliate Marketing',
    descEs: 'Gestión y optimización de programas de afiliados, con foco en calidad de tráfico y rendimiento real.',
    descEn: 'Management and optimization of affiliate programs, focused on traffic quality and real performance.',
    tagsEs: ['Gestión de Red', 'Tracking', 'Optimización', 'Reporting'],
    tagsEn: ['Network Management', 'Tracking', 'Optimization', 'Reporting'],
  },
  {
    num: '07',
    icon: Smartphone,
    titleEs: 'In-App Marketing',
    titleEn: 'In-App Marketing',
    descEs: 'Estrategias de adquisición y retención dentro de apps, pensadas para maximizar el valor de cada usuario.',
    descEn: 'Acquisition and retention strategies inside apps, built to maximize the value of every user.',
    tagsEs: ['Adquisición', 'Retención', 'Push', 'Segmentación'],
    tagsEn: ['Acquisition', 'Retention', 'Push', 'Segmentation'],
  },
  {
    num: '08',
    icon: Store,
    titleEs: 'ASO',
    titleEn: 'ASO',
    descEs: 'Optimización en App Store y Google Play para mejorar visibilidad, descargas y conversión.',
    descEn: 'App Store and Google Play optimization to improve visibility, downloads and conversion.',
    tagsEs: ['App Store', 'Google Play', 'Keywords', 'Conversión'],
    tagsEn: ['App Store', 'Google Play', 'Keywords', 'Conversion'],
  },
  {
    num: '09',
    icon: Instagram,
    titleEs: 'Redes Sociales',
    titleEn: 'Social Media',
    descEs: 'Estrategias de contenido y gestión de redes que construyen comunidad y generan engagement real.',
    descEn: 'Content strategies and social management that build community and generate real engagement.',
    tagsEs: ['Estrategia', 'Contenido', 'Community', 'Análisis'],
    tagsEn: ['Strategy', 'Content', 'Community', 'Analytics'],
  },
  {
    num: '10',
    icon: Megaphone,
    titleEs: 'Marketing de Influencers',
    titleEn: 'Influencer Marketing',
    descEs: 'Colaboraciones con creadores de contenido para ampliar alcance y credibilidad de marca.',
    descEn: 'Collaborations with content creators to extend reach and brand credibility.',
    tagsEs: ['Sourcing', 'Gestión', 'Campañas', 'Reporting'],
    tagsEn: ['Sourcing', 'Management', 'Campaigns', 'Reporting'],
  },
  {
    num: '11',
    icon: Palette,
    titleEs: 'Identidad Visual',
    titleEn: 'Visual Identity',
    descEs: 'Branding coherente que comunica tu esencia. Logos, paletas de color y guías de estilo que hacen tu marca memorable.',
    descEn: 'Coherent branding that communicates your essence. Logos, color palettes and style guides that make your brand memorable.',
    tagsEs: ['Logo', 'Branding', 'Guía de estilo', 'Tipografía'],
    tagsEn: ['Logo', 'Branding', 'Style Guide', 'Typography'],
  },
  {
    num: '12',
    icon: Wrench,
    titleEs: 'Mantenimiento Web',
    titleEn: 'Web Maintenance',
    descEs: 'Actualizaciones, seguridad, backups y soporte técnico continuo para que tu sitio siempre funcione al máximo.',
    descEn: 'Updates, security, backups and ongoing technical support to keep your site running at peak performance.',
    tagsEs: ['Actualizaciones', 'Seguridad', 'Backups', 'Soporte'],
    tagsEn: ['Updates', 'Security', 'Backups', 'Support'],
  },
  {
    num: '13',
    icon: Briefcase,
    titleEs: 'Consultoría',
    titleEn: 'Consultancy',
    descEs: 'Estrategia y asesoría a medida por proyecto, tarifa diaria o retainer, según lo que tu equipo necesite.',
    descEn: 'Tailored strategy and advisory work, billed by project, day rate or retainer, based on what your team needs.',
    tagsEs: ['Estrategia', 'Auditoría', 'A medida', 'Bajo SOW'],
    tagsEn: ['Strategy', 'Audit', 'Tailored', 'Under SOW'],
  },
]

export function Services() {
  const { t, language } = useLanguage()

  return (
    <section id="services" className="py-[clamp(4rem,10vw,9rem)] px-6 md:px-[clamp(1.5rem,5vw,4rem)] bg-[#232830]">
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-[clamp(3rem,6vw,5rem)] gap-6 md:gap-8">
          <div>
            <span className="section-label mb-4 md:mb-5 block">
              {t('Lo que hacemos', 'What we do')}
            </span>
            <h2 className="font-display font-extrabold text-[clamp(2rem,5vw,4.2rem)] leading-none tracking-[-0.02em]">
              {t('Servicios que ', 'Services that ')}
              <em className="text-[#d4a853] not-italic">{t('funcionan', 'work')}</em>
            </h2>
          </div>
          <p className="max-w-[36ch] text-[rgba(242, 237, 230, 0.82)] text-base font-light leading-[1.7]">
            {t(
              'Soluciones digitales completas para hacer crecer tu negocio.',
              'Complete digital solutions to grow your business.'
            )}
          </p>
        </div>

        {/* Services Grid - 5 cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-[1.5px] bg-[rgba(255,255,255,0.06)] mb-6">
          {services.map((service) => {
            const IconComponent = service.icon
            return (
              <div
                key={service.num}
                className="group bg-[#232830] p-6 md:p-[clamp(2rem,4vw,3rem)] relative overflow-hidden transition-colors duration-300 hover:bg-[#2B313B]"
              >
                {/* Gold top line on hover */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#d4a853] to-transparent scale-x-0 origin-left transition-transform duration-400 group-hover:scale-x-100" />

                {/* Number */}
                <span className="font-display text-[0.65rem] font-bold tracking-[0.2em] text-[#d4a853] mb-4 md:mb-6 block">
                  {service.num}
                </span>

                {/* Icon */}
                <div className="mb-4 md:mb-5">
                  <IconComponent className="w-8 h-8 text-[#d4a853]" strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h3 className="font-display font-extrabold text-[clamp(1.2rem,2.5vw,1.8rem)] tracking-[-0.01em] mb-3 leading-[1.1]">
                  {language === 'es' ? service.titleEs : service.titleEn}
                </h3>

                {/* Description */}
                <p className="text-[0.9rem] text-[rgba(242, 237, 230, 0.60)] leading-[1.7] mb-5 md:mb-6">
                  {language === 'es' ? service.descEs : service.descEn}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {(language === 'es' ? service.tagsEs : service.tagsEn).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[0.68rem] font-medium tracking-[0.08em] uppercase px-3 py-1 border border-[rgba(255,255,255,0.13)] rounded-full text-[rgba(242, 237, 230, 0.60)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
          
          {/* Highlighted Package Card */}
          <div className="group bg-gradient-to-br from-[#d4a853] to-[#b8923f] p-6 md:p-[clamp(2rem,4vw,3rem)] relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-[#d4a853]/20">
            {/* Number */}
            <span className="font-display text-[0.65rem] font-bold tracking-[0.2em] text-[#1B1F26]/60 mb-4 md:mb-6 block">
              PACK
            </span>

            {/* Icon */}
            <div className="mb-4 md:mb-5">
              <Package className="w-8 h-8 text-[#1B1F26]" strokeWidth={1.5} />
            </div>

            {/* Title */}
            <h3 className="font-display font-extrabold text-[clamp(1.2rem,2.5vw,1.8rem)] tracking-[-0.01em] mb-3 leading-[1.1] text-[#1B1F26]">
              {language === 'es' ? 'Paquete Digital Completo' : 'Full Digital Package'}
            </h3>

            {/* Description */}
            <p className="text-[0.9rem] text-[#1B1F26]/70 leading-[1.7] mb-5 md:mb-6">
              {language === 'es' 
                ? 'Todo incluido: web, branding, redes sociales y mantenimiento. La solución completa para lanzar o renovar tu presencia digital.' 
                : 'All-inclusive: web, branding, social media and maintenance. The complete solution to launch or renew your digital presence.'}
            </p>

            {/* CTA Button */}
            <a
              href="https://wa.me/34680863229"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#1B1F26] text-[#f2ede6] font-semibold text-sm tracking-wide rounded-full hover:bg-[#2B313B] transition-colors duration-300"
            >
              <MessageCircle className="w-4 h-4" />
              {language === 'es' ? 'Solicitar info' : 'Request info'}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
