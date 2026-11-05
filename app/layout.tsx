import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/react'
import { GoogleAnalytics } from '@/components/google-analytics'
import { headers } from 'next/headers'
import './globals.css'
import './v2.css'

const syne = localFont({
  src: './fonts/syne-800.woff2',
  weight: '800',
  variable: '--font-display',
  display: 'swap',
})

// v2 fonts are self-hosted (app/fonts) so builds never depend on fetching Google Fonts.
const bricolage = localFont({
  src: './fonts/bricolage-grotesque.woff2',
  weight: '200 800',
  variable: '--font-v2-display',
  display: 'swap',
})

const manrope = localFont({
  src: './fonts/manrope.woff2',
  weight: '200 800',
  variable: '--font-v2-body',
  display: 'swap',
})

const dmMono = localFont({
  src: [
    { path: './fonts/dm-mono-400.woff2', weight: '400', style: 'normal' },
    { path: './fonts/dm-mono-500.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--font-v2-mono',
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#c9a04a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://impulsomedia.es'),
  title: {
    default: 'Diseño Web y SEO en Sotogrande | ImpulsoMedia',
    template: '%s | ImpulsoMedia'
  },
  description: 'Agencia digital en Sotogrande: diseño web a medida, SEO, Google Ads y automatización con IA para negocios de Sotogrande, Gibraltar y el Campo de Gibraltar.',
  keywords: ['diseño web Sotogrande', 'agencia marketing digital Campo de Gibraltar', 'diseño web Algeciras', 'SEO Gibraltar', 'agencia SEO Cádiz', 'web design Sotogrande', 'digital agency Gibraltar'],
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
    title: 'ImpulsoMedia | Diseño Web y Marketing Digital en Sotogrande',
    description: 'Diseño web, SEO y publicidad para negocios de Sotogrande, Gibraltar y el Campo de Gibraltar. Sin plantillas, sin parches. Solo resultados.',
    images: [
      {
        url: '/images/og-image-v2.jpg',
        width: 1200,
        height: 630,
        alt: 'ImpulsoMedia - Agencia Digital',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ImpulsoMedia | Diseño Web y Marketing Digital en Sotogrande',
    description: 'Diseño web, SEO y publicidad para negocios de Sotogrande, Gibraltar y el Campo de Gibraltar. Sin plantillas, sin parches.',
    images: ['/images/og-image-v2.jpg'],
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
  image: 'https://impulsomedia.es/images/og-image-v2.jpg',
  telephone: '+34680863229',
  email: 'chris@impulsomedia.es',
  '@id': 'https://impulsomedia.es/#business',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Sotogrande, San Roque',
    addressRegion: 'Cádiz',
    postalCode: '11310',
    addressCountry: 'ES',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 36.2833,
    longitude: -5.2833,
  },
  hasMap: 'https://g.page/r/Cart50OPlmevEBE',
  sameAs: ['https://g.page/r/Cart50OPlmevEBE'],
  founder: { '@type': 'Person', name: 'Chris Wilkie' },
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
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    reviewCount: '5',
    bestRating: '5',
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
    <html lang={locale} className={`${syne.variable} ${bricolage.variable} ${manrope.variable} ${dmMono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="v2 font-sans antialiased bg-white text-[#111418]">
        {children}
        <Analytics />
        <GoogleAnalytics />
      </body>
    </html>
  )
}
