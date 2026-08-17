import type { Metadata } from 'next'
import { ContactoContent } from '../../contacto/contacto-content'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Start your project with ImpulsoMedia. Contact us over WhatsApp or via the form and we will respond quickly. Digital agency in Sotogrande, Cádiz.',
  alternates: {
    canonical: '/en/contact',
    languages: {
      'es-ES': 'https://impulsomedia.es/contacto',
      'en-GB': 'https://impulsomedia.es/en/contact',
      'x-default': 'https://impulsomedia.es/contacto',
    },
  },
  openGraph: {
    title: 'Contact | ImpulsoMedia',
    description: 'Start your project with ImpulsoMedia. Contact us over WhatsApp or via the form.',
    url: 'https://impulsomedia.es/en/contact',
    locale: 'en_GB',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Do you work on existing websites?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "No. We only build from scratch. If you have an existing site that needs fixing or updating, we're not the right fit. Our model is based on clean foundations, not patching someone else's code.",
      },
    },
    {
      '@type': 'Question',
      name: 'How do I get started?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Send us a WhatsApp message. We'll have a quick conversation about your business, your goals, and whether we're a good fit. If we are, we'll send you a simple proposal within 48 hours.",
      },
    },
    {
      '@type': 'Question',
      name: 'How much does a website cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Every project is scoped and priced based on what it actually needs. No packages, no hidden extras, just a clear quote before anything starts.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does it take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Most projects take 2 to 4 weeks from kickoff to launch. Larger or more complex sites may take longer. We'll always give you a realistic timeline before we start.",
      },
    },
    {
      '@type': 'Question',
      name: 'Do you offer maintenance?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. We offer optional monthly maintenance packages that include updates, backups, security monitoring, and priority support.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if I need changes after launch?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Small tweaks within the first 30 days are included. After that, we offer hourly support or a maintenance package.",
      },
    },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://impulsomedia.es/en" },
    { "@type": "ListItem", "position": 2, "name": "Contact", "item": "https://impulsomedia.es/en/contact" }
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
      <ContactoContent lang="en" />
    </>
  )
}
