"use client"

import { useLanguage } from "@/lib/language-context"

export function Hero() {
  const { language } = useLanguage()

  return (
    <section 
      id="hero" 
      className="min-h-screen flex flex-col justify-center px-6 md:px-[clamp(1.5rem,5vw,4rem)] pt-24 md:pt-[68px] relative overflow-hidden"
    >
      {/* Background grid */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)`,
          backgroundSize: '72px 72px'
        }}
      />
      
      {/* Gold glow */}
      <div 
        className="absolute top-[30%] left-[45%] -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[900px] h-[400px] md:h-[500px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(212,168,83,0.07) 0%, transparent 65%)'
        }}
      />

      <div className="max-w-[1200px] mx-auto w-full relative z-10 py-12 md:py-20">
        {/* Tag */}
        <div 
          className="inline-flex items-center gap-3 text-[0.72rem] font-medium tracking-[0.18em] uppercase text-[#d4a853] mb-6 md:mb-8"
        >
          <span className="w-7 h-[1px] bg-[#d4a853]" />
          {language === "en" ? "Digital Agency, Sotogrande" : "Agencia Digital, Sotogrande"}
        </div>

        {/* Main Headline */}
        <h1 
          className="font-display font-extrabold text-[clamp(2.3rem,6vw,5.2rem)] leading-[1.05] tracking-[-0.02em] mb-8 md:mb-12 max-w-[18ch]"
        >
          {language === "en" ? (
            <>
              Websites that convert. <span className="text-[#d4a853]">Campaigns that scale.</span>
            </>
          ) : (
            <>
              Webs que convierten. <span className="text-[#d4a853]">Campañas que escalan.</span>
            </>
          )}
        </h1>

        {/* Bottom section */}
        <div 
          className="grid grid-cols-1 lg:grid-cols-[1fr_auto] items-end gap-8 lg:gap-16"
        >
          <p className="text-[clamp(0.95rem,1.5vw,1.15rem)] text-[rgba(242,237,230,0.82)] font-light leading-[1.75] max-w-[46ch]">
            {language === "en"
              ? "Hand-built websites and results-driven marketing for local businesses and brands that need to manage campaigns at a larger scale. No templates, no middlemen."
              : "Diseño web hecho a mano y marketing de resultados para negocios locales y marcas que necesitan gestionar campañas a mayor escala. Sin plantillas, sin intermediarios."}
          </p>

          <div className="flex flex-col gap-4 items-start lg:items-end">
            <a
              href="https://wa.me/34680863229?text=Hi%2C%20I'd%20like%20to%20start%20a%20project%20with%20ImpulsoMedia"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25d366] text-white px-6 md:px-8 py-4 rounded-[3px] font-display font-bold text-[0.82rem] tracking-[0.07em] uppercase no-underline whitespace-nowrap transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_16px_40px_rgba(37,211,102,0.25)]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.118 1.528 5.855L.057 23.571a.75.75 0 00.918.918l5.716-1.471A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.694-.497-5.24-1.37l-.374-.215-3.872.996.997-3.872-.215-.374A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              {language === "en" ? "Let's Talk on WhatsApp" : "Hablemos por WhatsApp"}
            </a>
            <a
              href={language === "en" ? "/en/work" : "/proyectos"}
              className="inline-flex items-center gap-2 text-[rgba(242,237,230,0.42)] text-[0.75rem] font-normal tracking-[0.08em] uppercase no-underline transition-colors duration-200 hover:text-[#f2ede6]"
            >
              {language === "en" ? "See our work" : "Ver proyectos"}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12l7 7 7-7"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Stats */}
        <div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-x-[clamp(2rem,5vw,5rem)] pt-10 mt-10 border-t border-[rgba(255,255,255,0.06)]"
        >
          <div>
            <div className="font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-extrabold leading-none">
              7<em className="text-[#d4a853] not-italic">+</em>
            </div>
            <div className="text-[0.72rem] tracking-[0.1em] uppercase text-[rgba(242,237,230,0.42)] mt-1">
              {language === "en" ? "Live Clients" : "Clientes Activos"}
            </div>
          </div>
          <div>
            <div className="font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-extrabold leading-none">
              12
            </div>
            <div className="text-[0.72rem] tracking-[0.1em] uppercase text-[rgba(242,237,230,0.42)] mt-1">
              {language === "en" ? "Core Services" : "Servicios Clave"}
            </div>
          </div>
          <div>
            <div className="font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-extrabold leading-none">
              3<em className="text-[#d4a853] not-italic">x</em>
            </div>
            <div className="text-[0.72rem] tracking-[0.1em] uppercase text-[rgba(242,237,230,0.42)] mt-1">
              {language === "en" ? "Markets Served" : "Mercados Cubiertos"}
            </div>
          </div>
          <div>
            <div className="font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-extrabold leading-none">
              100<em className="text-[#d4a853] not-italic">%</em>
            </div>
            <div className="text-[0.72rem] tracking-[0.1em] uppercase text-[rgba(242,237,230,0.42)] mt-1">
              {language === "en" ? "From Scratch" : "Desde Cero"}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
