import type { Metadata } from 'next'
import { PreciosContent } from './precios-content'

export const metadata: Metadata = {
  title: 'Precios de Diseño Web y Marketing Digital: cómo se calcula tu presupuesto',
  description: 'Qué determina el precio de una web o un servicio de marketing digital: páginas, diseño, funcionalidades, automatizaciones, idiomas y plazos. Ejemplos orientativos desde 950 € y propuesta cerrada tras una llamada gratuita.',
  alternates: {
    canonical: '/precios',
    languages: {
      'es-ES': 'https://impulsomedia.es/precios',
      'en-GB': 'https://impulsomedia.es/en/pricing',
      'x-default': 'https://impulsomedia.es/precios',
    },
  },
  openGraph: {
    title: 'Precios | Cómo se calcula tu presupuesto | ImpulsoMedia',
    description: 'Qué determina el precio de una web o un servicio de marketing digital, con ejemplos orientativos. Propuesta cerrada tras una llamada gratuita.',
    url: 'https://impulsomedia.es/precios',
  },
}

const schema = [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://impulsomedia.es' },
      { '@type': 'ListItem', position: 2, name: 'Precios', item: 'https://impulsomedia.es/precios' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: '¿Cuánto cuesta una página web?', acceptedAnswer: { '@type': 'Answer', text: 'Depende del número de páginas, del tipo de diseño, de las funcionalidades y automatizaciones, de si se parte de cero o de una web existente, de los idiomas y del plazo. Como orientación, una web de presentación de 4-5 páginas parte de 950 €, una corporativa bilingüe de 8-12 páginas desde 1.800 € y una web con reservas o tienda desde 3.000 €. El precio definitivo va por escrito en una propuesta cerrada tras una llamada gratuita.' } },
      { '@type': 'Question', name: '¿Por qué no hay una lista de precios cerrada?', acceptedAnswer: { '@type': 'Answer', text: 'Porque dos webs con el mismo número de páginas pueden costar el doble una que otra según el diseño, las integraciones y lo que tengan que conseguir. La propuesta se adapta al proyecto, no al revés.' } },
      { '@type': 'Question', name: '¿Cómo se paga?', acceptedAnswer: { '@type': 'Answer', text: 'En proyectos de web, el 50 % al empezar y el resto al publicar. En servicios mensuales, por adelantado cada mes y sin permanencia.' } },
      { '@type': 'Question', name: '¿Cuánto cuestan el SEO o la gestión de anuncios?', acceptedAnswer: { '@type': 'Answer', text: 'Se presupuestan según canales, sector, competencia e inversión publicitaria. La inversión en Google o Meta se paga aparte desde la cuenta del cliente; la tarifa de la agencia es la gestión, y en cuentas grandes se calcula como porcentaje de la inversión.' } },
    ],
  },
]

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <PreciosContent lang="es" />
    </>
  )
}
