import type { Metadata, Viewport } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { GoogleAnalytics } from '@/components/google-analytics'
import { headers } from 'next/headers'
import './globals.css'

const syne = Syne({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  weight: ['300', '400', '500'],
  variable: '--font-sans',
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#d4a853',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://impulsomedia.es'),
  title: {
    default: 'ImpulsoMedia | Diseño Web y Marketing Digital en España',
    template: '%s | ImpulsoMedia'
  },
  description: 'Agencia digital especializada en diseño web, redes sociales e identidad visual. Creamos sitios web desde cero para negocios en España. Sin plantillas, sin parches. Solo resultados.',
  keywords: ['diseño web', 'marketing digital', 'redes sociales', 'identidad visual', 'desarrollo web', 'España', 'Sotogrande', 'agencia digital', 'web design', 'digital agency', 'social media'],
  authors: [{ name: 'ImpulsoMedia', url: 'https://impulsomedia.es' }],
  creator: 'ImpulsoMedia',
  publisher: 'ImpulsoMedia',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    alternateLocale: 'en_GB',
    url: 'https://impulsomedia.es',
    siteName: 'ImpulsoMedia',
    title: 'ImpulsoMedia | Diseño Web y Marketing Digital',
    description: 'Creamos sitios web desde cero para negocios en España. Sin plantillas, sin parches. Solo resultados.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ImpulsoMedia - Agencia Digital',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ImpulsoMedia | Diseño Web y Marketing Digital',
    description: 'Creamos sitios web desde cero para negocios en España. Sin plantillas, sin parches.',
    images: ['/images/og-image.jpg'],
    creator: '@impulsomedia',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes when ready
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
  category: 'technology',
}

// JSON-LD Structured Data
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'ImpulsoMedia',
  description: 'Agencia digital especializada en diseño web, SEO, PPC, paid social, programática, afiliación, ASO y consultoría. Creamos sitios web desde cero para negocios locales y marcas a mayor escala.',
  url: 'https://impulsomedia.es',
  logo: 'https://impulsomedia.es/images/impulsomedia-logo.svg',
  image: 'https://impulsomedia.es/images/og-image.jpg',
  telephone: '+34680863229',
  email: 'info@impulsomedia.es',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Sotogrande',
    addressRegion: 'Cádiz',
    addressCountry: 'ES',
  },
  areaServed: [
    { '@type': 'Place', name: 'Sotogrande' },
    { '@type': 'Place', name: 'San Roque' },
    { '@type': 'Place', name: 'Gibraltar' },
    { '@type': 'Place', name: 'La Línea de la Concepción' },
    { '@type': 'Place', name: 'Marbella' },
    { '@type': 'Place', name: 'Estepona' },
    { '@type': 'Place', name: 'Casares' },
    { '@type': 'Place', name: 'Manilva' },
    { '@type': 'Country', name: 'Spain' },
    { '@type': 'Country', name: 'United Kingdom' },
  ],
  serviceType: [
    'Web Design', 'SEO', 'PPC', 'Paid Social', 'Programmatic Advertising',
    'Affiliate Marketing', 'In-App Marketing', 'ASO', 'Social Media Management',
    'Influencer Marketing', 'Web Maintenance', 'Digital Marketing Consultancy',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Servicios ImpulsoMedia',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Diseño Web' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'SEO' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'PPC' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Paid Social' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Programática' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Afiliación' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'In-App Marketing' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'ASO' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Redes Sociales' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Marketing de Influencers' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Mantenimiento Web' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Consultoría' } },
    ],
  },
  priceRange: '$$',
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '18:00',
  },
  knowsLanguage: ['Spanish', 'English'],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headersList = await headers()
  const locale = headersList.get('x-locale') === 'en' ? 'en' : 'es'

  return (
    <html lang={locale} className={`${syne.variable} ${dmSans.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="font-sans antialiased bg-[#1B1F26] text-[#f2ede6]">
        {children}
        <Analytics />
        <GoogleAnalytics />
      </body>
    </html>
  )
}
