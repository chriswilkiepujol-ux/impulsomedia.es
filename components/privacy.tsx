"use client"

import { LanguageProvider } from '@/lib/language-context'
import { HeaderV2 as Header } from '@/components/v2/header'
import { FooterV2 as Footer } from '@/components/v2/sections'

const ES = [
  ['Quién trata tus datos', 'ImpulsoMedia (Chris Wilkie), San Roque (Cádiz), España. Contacto: chris@impulsomedia.es. Somos el responsable del tratamiento de los datos que nos facilitas a través de esta web.'],
  ['Qué datos recogemos', 'Los que escribes en nuestros formularios (nombre, email, empresa, puesto, dirección de tu web y el mensaje o respuestas que nos dejas) y, si pides la revisión web gratuita, los resultados técnicos de analizar la dirección que indicas. También datos técnicos de uso (páginas vistas, dispositivo, origen de la visita) mediante Google Analytics, de forma agregada.'],
  ['Para qué los usamos', 'Para responder a tu consulta, enviarte el resultado de la revisión que has pedido, contactarte sobre ella y, si nos lo autorizas, proponerte nuestros servicios. La base legal es tu consentimiento (al marcar la casilla del formulario) y, en su caso, el interés legítimo en atender tu petición. Nunca vendemos ni cedemos tus datos a terceros con fines comerciales.'],
  ['Quién más los ve', 'Proveedores que necesitamos para operar y que tratan los datos por nuestra cuenta: alojamiento web (Vercel), base de datos (Supabase), envío de email (Resend), analítica (Google). Algunos están fuera de la UE con garantías adecuadas (cláusulas contractuales tipo).'],
  ['Cuánto tiempo', 'Mientras dure la relación o la conversación contigo y, como máximo, dos años desde el último contacto, salvo que nos pidas borrarlos antes o la ley obligue a conservarlos más.'],
  ['Tus derechos', 'Puedes acceder a tus datos, corregirlos, pedir que los borremos, limitar u oponerte al tratamiento y solicitar su portabilidad escribiendo a chris@impulsomedia.es. También puedes reclamar ante la Agencia Española de Protección de Datos (aepd.es). Para dejar de recibir correos, responde “baja” a cualquiera de ellos.'],
  ['Cookies', 'Usamos cookies técnicas necesarias y, si lo aceptas, cookies de analítica (Google Analytics) para saber cómo se usa la web. Puedes bloquearlas desde tu navegador.'],
]
const EN = [
  ['Who processes your data', 'ImpulsoMedia (Chris Wilkie), San Roque (Cádiz), Spain. Contact: chris@impulsomedia.es. We are the data controller for the information you give us through this website.'],
  ['What we collect', 'What you type into our forms (name, email, company, role, your website address and the message or answers you leave) and, if you request the free website review, the technical results of analysing the address you provide. Also aggregated usage data (pages viewed, device, source of the visit) through Google Analytics.'],
  ['What we use it for', 'To answer your enquiry, send you the review result you asked for, contact you about it and, if you allow it, propose our services. The legal basis is your consent (ticking the box on the form) and, where relevant, our legitimate interest in handling your request. We never sell or pass your data to third parties for marketing.'],
  ['Who else sees it', 'Providers we need to operate and who process data on our behalf: web hosting (Vercel), database (Supabase), email delivery (Resend), analytics (Google). Some are outside the EU with appropriate safeguards (standard contractual clauses).'],
  ['How long', 'For as long as our relationship or conversation lasts and at most two years from the last contact, unless you ask us to delete it sooner or the law requires us to keep it longer.'],
  ['Your rights', 'You can access your data, correct it, ask us to delete it, restrict or object to processing and request portability by writing to chris@impulsomedia.es. You can also complain to the Spanish Data Protection Agency (aepd.es). To stop receiving emails, reply “unsubscribe” to any of them.'],
  ['Cookies', 'We use necessary technical cookies and, if you accept them, analytics cookies (Google Analytics) to understand how the site is used. You can block them in your browser.'],
]

export function Privacy({ lang }: { lang: 'es' | 'en' }) {
  const rows = lang === 'es' ? ES : EN
  return (
    <LanguageProvider initialLanguage={lang}>
      <div className="min-h-screen bg-[#ffffff]">
        <Header />
        <main>
          <section className="section">
            <div className="wrap" style={{ maxWidth: 760 }}>
              <div className="eyebrow">{lang === 'es' ? 'Legal' : 'Legal'}</div>
              <h1 style={{ fontSize: 'clamp(30px,4vw,48px)', marginTop: 14 }}>{lang === 'es' ? 'Política de privacidad' : 'Privacy policy'}</h1>
              <p className="lead">{lang === 'es' ? 'En lenguaje normal: qué datos recogemos, para qué y qué puedes hacer al respecto. Última actualización: noviembre de 2026.' : 'In plain language: what data we collect, what for, and what you can do about it. Last updated: November 2026.'}</p>
              {rows.map(([h, p]) => <div key={h} style={{ marginTop: 28 }}><h2 style={{ fontSize: 22 }}>{h}</h2><p style={{ marginTop: 8, color: 'var(--ink2)', lineHeight: 1.6 }}>{p}</p></div>)}
              <p className="note" style={{ marginTop: 32 }}><a href={lang === 'es' ? '/en/privacy' : '/privacidad'}>{lang === 'es' ? 'This page in English →' : 'Esta página en español →'}</a></p>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  )
}
