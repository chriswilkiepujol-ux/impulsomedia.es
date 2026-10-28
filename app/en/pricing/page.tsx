import type { Metadata } from 'next'
import { PreciosContent } from '../../precios/precios-content'

export const metadata: Metadata = {
  title: 'Web Design and Digital Marketing Pricing',
  description: 'What determines the price of a website or a marketing service: pages, features, languages and timeline. Indicative examples and a proposal after a free call.',
  alternates: {
    canonical: '/en/pricing',
    languages: {
      'es-ES': 'https://impulsomedia.es/precios',
      'en-GB': 'https://impulsomedia.es/en/pricing',
      'x-default': 'https://impulsomedia.es/precios',
    },
  },
  openGraph: {
    title: 'Web Design and Digital Marketing Pricing | ImpulsoMedia',
    description: 'What determines the price of a website or a marketing service, with indicative examples. Fixed proposal after a free call.',
    url: 'https://impulsomedia.es/en/pricing',
    locale: 'en_GB',
  },
}

const schema = [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://impulsomedia.es/en' },
      { '@type': 'ListItem', position: 2, name: 'Pricing', item: 'https://impulsomedia.es/en/pricing' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'How much does a website cost?', acceptedAnswer: { '@type': 'Answer', text: 'It depends on the number of pages, the type of design, functionality and automations, whether we start from scratch or from an existing site, the languages and the timeline. As a guide, a 4-5 page presentation site starts from €950, an 8-12 page bilingual corporate site from €1,800 and a site with bookings or a shop from €3,000. The final price goes in a written, fixed proposal after a free call.' } },
      { '@type': 'Question', name: 'Why is there no fixed price list?', acceptedAnswer: { '@type': 'Answer', text: 'Because two sites with the same number of pages can cost twice as much as each other depending on design, integrations and what they have to achieve. The proposal is fitted to the project, not the other way round.' } },
      { '@type': 'Question', name: 'How do you invoice?', acceptedAnswer: { '@type': 'Answer', text: 'For websites, 50% to start and the rest at launch. For monthly services, monthly in advance with no minimum term.' } },
      { '@type': 'Question', name: 'How much do SEO or ads management cost?', acceptedAnswer: { '@type': 'Answer', text: 'They are scoped by channels, sector, competition and media budget. Ad spend is paid directly to Google or Meta from the client account; the agency fee is the management, calculated as a percentage of spend on larger accounts.' } },
    ],
  },
]

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <PreciosContent lang="en" />
    </>
  )
}
