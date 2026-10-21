import type { Metadata } from 'next'
import { PreciosContent } from './precios-content'

export const metadata: Metadata = {
  title: 'Precios de Diseño Web y Marketing Digital 2026: tarifas reales',
  description: 'Cuánto cuesta una página web y un servicio de SEO, Google Ads o redes sociales en 2026. Webs desde 950 €, SEO desde 350 €/mes, PPC desde 400 €/mes. Tarifas orientativas de una agencia de Sotogrande, propuesta cerrada tras una llamada.',
  alternates: {
    canonical: '/precios',
    languages: {
      'es-ES': 'https://impulsomedia.es/precios',
      'en-GB': 'https://impulsomedia.es/en/pricing',
      'x-default': 'https://impulsomedia.es/precios',
    },
  },
  openGraph: {
    title: 'Precios de Diseño Web y Marketing Digital 2026 | ImpulsoMedia',
    description: 'Precios orientativos para diseño web, SEO, PPC, paid social y redes sociales. Propuesta a medida tras una llamada de descubrimiento gratuita.',
    url: 'https://impulsomedia.es/precios',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://impulsomedia.es" },
    { "@type": "ListItem", "position": 2, "name": "Precios", "item": "https://impulsomedia.es/precios" }
  ],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Cuánto cuesta una página web en 2026?',
      acceptedAnswer: { '@type': 'Answer', text: 'Una web corporativa a medida de hasta 5 páginas, bilingüe y con SEO básico, parte de 950 €. Una web de hasta 10 páginas con blog, casos de éxito y SEO técnico completo parte de 1.800 €. Tiendas online, sistemas de reserva y funcionalidad a medida se presupuestan por proyecto.' },
    },
    {
      '@type': 'Question',
      name: '¿Cuánto cuesta el SEO al mes?',
      acceptedAnswer: { '@type': 'Answer', text: 'El SEO local parte de 350 € al mes e incluye optimización de Google Business Profile, hasta 15 citas locales, 2 artículos al mes, SEO on page y un informe mensual. Sectores muy competidos o SEO nacional requieren una propuesta a medida.' },
    },
    {
      '@type': 'Question',
      name: '¿Cuánto cuesta gestionar Google Ads o anuncios en redes sociales?',
      acceptedAnswer: { '@type': 'Answer', text: 'La gestión de Google Ads parte de 400 € al mes (1 campaña, hasta 20 palabras clave, informe mensual) y la de anuncios en Meta, TikTok o Snapchat también parte de 400 € al mes con hasta 8 creatividades. La inversión publicitaria se paga aparte a la plataforma; en cuentas grandes la tarifa es un porcentaje de la inversión.' },
    },
    {
      '@type': 'Question',
      name: '¿Los precios son cerrados o pueden subir?',
      acceptedAnswer: { '@type': 'Answer', text: 'Después de una llamada de descubrimiento gratuita enviamos una propuesta cerrada con alcance, precio y plazos. Lo que no está en la propuesta no se cobra sin acordarlo antes.' },
    },
    {
      '@type': 'Question',
      name: '¿Por qué una web a medida cuesta más que una plantilla de WordPress?',
      acceptedAnswer: { '@type': 'Answer', text: 'Porque se construye desde cero en Next.js, carga más rápido, no depende de plugins que hay que actualizar y se diseña para convertir en tu sector. El coste inicial es mayor, pero el mantenimiento y los problemas posteriores son menores.' },
    },
  ],
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, faqSchema]) }}
      />
      <PreciosContent lang="es" />
    </>
  )
}
