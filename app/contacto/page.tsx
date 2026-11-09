import type { Metadata } from 'next'
import { ContactoContent } from './contacto-content'

export const metadata: Metadata = {
  title: 'Contacto – Agencia Digital en Sotogrande',
  description: 'Empieza tu proyecto con ImpulsoMedia. Contáctanos por WhatsApp o formulario y te responderemos rápido. Agencia digital en Sotogrande, Cádiz.',
  alternates: {
    canonical: '/contacto',
    languages: {
      'es-ES': 'https://impulsomedia.es/contacto',
      'en-GB': 'https://impulsomedia.es/en/contact',
      'x-default': 'https://impulsomedia.es/contacto',
    },
  },
  openGraph: {
    images: [{ url: '/images/og-image-v2.jpg', width: 1200, height: 630, alt: 'ImpulsoMedia' }],
    title: 'Contacto – Agencia Digital en Sotogrande | ImpulsoMedia',
    description: 'Empieza tu proyecto con ImpulsoMedia. Contáctanos por WhatsApp o formulario.',
    url: 'https://impulsomedia.es/contacto',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Trabajan en sitios web existentes?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sí. Trabajamos con webs nuevas y con las que ya tienes: actualizaciones, mejoras, SEO, velocidad o nuevas secciones. Si vemos algo que se puede mejorar, te lo proponemos con números, pero la decisión siempre es tuya.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cómo empiezo?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Envíanos un mensaje de WhatsApp. Tendremos una conversación rápida sobre tu negocio, tus objetivos y si somos una buena opción. Si lo somos, te enviaremos una propuesta simple en 48 horas.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cuánto cuesta un sitio web?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Cada proyecto se define y presupuesta según lo que realmente necesita. Sin paquetes, sin extras ocultos, solo un presupuesto claro antes de empezar.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cuánto tiempo toma?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'La mayoría de proyectos toman 2 a 4 semanas desde el inicio hasta el lanzamiento. Sitios más grandes o complejos pueden tomar más. Siempre te daremos un cronograma realista antes de empezar.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Ofrecen mantenimiento?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sí. Ofrecemos paquetes de mantenimiento mensual opcionales que incluyen actualizaciones, respaldos, monitoreo de seguridad y soporte prioritario.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Qué pasa si necesito cambios después del lanzamiento?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Pequeños ajustes dentro de los primeros 30 días están incluidos. Después de eso, ofrecemos soporte por hora o un paquete de mantenimiento.',
      },
    },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://impulsomedia.es" },
    { "@type": "ListItem", "position": 2, "name": "Contacto", "item": "https://impulsomedia.es/contacto" }
  ],
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ContactoContent lang="es" />
    </>
  )
}
