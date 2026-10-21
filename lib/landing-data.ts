import { Search, MapPin, FileText, Link2, BarChart3, Gauge, Globe, Languages, Smartphone, ShieldCheck, Wrench, PenTool, type LucideIcon } from 'lucide-react'

/**
 * City × service landing pages.
 *
 * Each entry is ONE page in ONE language (the EN and ES versions of the same
 * service are separate entries that point at each other through
 * `alternatePath`). Every page must be unique: its own case, its own FAQ, its
 * own angle. Never clone an entry and swap the city name.
 */

export interface LandingFaq {
  q: string
  a: string
}

export interface LandingService {
  icon: LucideIcon
  title: string
  desc: string
}

export interface LandingStep {
  num: string
  title: string
  desc: string
}

export interface LandingCase {
  name: string
  sector: string
  summary: string
  href: string
  /** Screenshot in /public/images */
  image: string
}

export interface LandingPage {
  slug: string
  lang: 'es' | 'en'
  path: string
  /** Same page in the other language, once it exists. Omit until it does. */
  alternatePath?: string
  /** Shown in Google: ~60 chars. The layout appends " | ImpulsoMedia". */
  metaTitle: string
  metaDescription: string
  breadcrumb: string
  /** Schema.org Service */
  serviceType: string
  areaServed: string[]
  /** Brand-style SVG cover in /public/images (16:9), like the blog covers */
  heroImage: string
  heroAlt: string
  label: string
  h1: string
  lead: string
  stats: { value: string; label: string }[]
  problemTitle: string
  problem: string[]
  servicesTitle: string
  services: LandingService[]
  processTitle: string
  steps: LandingStep[]
  casesTitle: string
  cases: LandingCase[]
  faqTitle: string
  faqs: LandingFaq[]
  cta: { headline: string; sub: string; whatsappText: string }
}

export const landingPages: LandingPage[] = [
  {
    slug: 'seo-gibraltar',
    lang: 'en',
    path: '/en/seo-gibraltar',
    metaTitle: 'SEO Agency in Gibraltar | Local & Cross-Border SEO Services',
    metaDescription:
      'SEO services for Gibraltar businesses from an agency 15 minutes up the road in Sotogrande. Rank on Google in Gibraltar and Spain, in English and Spanish. Local SEO, technical SEO and content, with iGaming experience.',
    breadcrumb: 'SEO Gibraltar',
    serviceType: 'Search Engine Optimization',
    areaServed: ['Gibraltar', 'La Línea de la Concepción', 'Sotogrande', 'San Roque', 'Campo de Gibraltar'],
    heroImage: '/images/landing-seo-gibraltar-cover.svg',
    heroAlt: 'Silhouette of the Rock of Gibraltar seen from the bay, with the frontier line at La Línea',
    label: 'SEO services · Gibraltar',
    h1: 'SEO for Gibraltar businesses that sell on both sides of the frontier',
    lead:
      'Most "Gibraltar SEO" pages belong to UK agencies that have never crossed the runway. We are based in Sotogrande, 15 minutes away, we work in English and Spanish, and we know that your customers search on google.com.gi, google.es and google.co.uk at the same time.',
    stats: [
      { value: '15 min', label: 'from Sotogrande to Main Street' },
      { value: 'EN + ES', label: 'content written natively in both' },
      { value: '8+ yrs', label: 'performance marketing for iGaming operators' },
    ],
    problemTitle: 'Why SEO in Gibraltar is a different job',
    problem: [
      'Gibraltar is its own Google market. Searches from the Rock default to google.com.gi, results are weighted for Gibraltar, and a .gi domain or a Gibraltar Business Profile matters more than it would in Málaga. But a big share of your customers live in La Línea, San Roque or Sotogrande and search on google.es, in Spanish. A page that only targets one side loses the other.',
      'The competition for "SEO Gibraltar" is mostly UK agencies with a single landing page and offshore outsourcing firms. Very few local businesses have a properly optimised site, which is good news: in most sectors on the Rock, a few months of correct work puts you ahead.',
      'If you are in iGaming, finance or insurance, the rules change again: affiliate competition, regulated-sector ad policies and brand searches that go to comparison sites. That is the world we come from, and it is why we do not treat a Gibraltar operator like a local café.',
    ],
    servicesTitle: 'What our Gibraltar SEO service includes',
    services: [
      { icon: Search, title: 'SEO audit and keyword map', desc: 'A real list of the searches your customers make in Gibraltar and in Spain, in both languages, with volumes and the pages you need to win them.' },
      { icon: MapPin, title: 'Local SEO and Google Business Profile', desc: 'Profile set up for Gibraltar as a territory, categories, posts, reviews, and citations in the directories that actually rank on the Rock.' },
      { icon: Languages, title: 'Bilingual content', desc: 'Service pages and articles written natively in English and Spanish with correct hreflang, not translated with a plugin.' },
      { icon: Gauge, title: 'Technical SEO', desc: 'Speed, Core Web Vitals, indexing, schema, hreflang and the .gi / .es / .com decisions that most agencies get wrong.' },
      { icon: Link2, title: 'Links and digital PR', desc: 'Mentions in Gibraltar and Campo de Gibraltar media, chambers, directories and partner sites. No bought links, no networks.' },
      { icon: BarChart3, title: 'Monthly reporting that means something', desc: 'Rankings per country, clicks, calls and WhatsApp leads from Search Console and analytics. One page, no jargon.' },
      { icon: Globe, title: 'Cross-border strategy', desc: 'Which audience to win first, which language per page, and how Gibraltar, La Línea and Sotogrande fit in one site without duplicate content.' },
      { icon: FileText, title: 'iGaming and regulated sectors', desc: 'SEO for operators, affiliates and B2B suppliers: brand protection, affiliate SERPs and content that passes compliance.' },
    ],
    processTitle: 'How it works',
    steps: [
      { num: '01', title: 'Discovery call', desc: 'Thirty minutes on WhatsApp or in person. Who your customers are, where they are, and what "working" means for you: calls, bookings, enquiries.' },
      { num: '02', title: 'Audit and plan', desc: 'Within a week you get a keyword map by country and language, a technical audit and a prioritised plan. If your site cannot rank as it is, we tell you before you pay for a retainer.' },
      { num: '03', title: 'Month one: foundations', desc: 'Technical fixes, Google Business Profile, service pages and the first content. Everything tracked in Search Console from day one.' },
      { num: '04', title: 'Monthly: content, links, reporting', desc: 'Two articles or pages a month, citations and outreach, and a one-page report. You see what moved and what we are doing next.' },
    ],
    casesTitle: 'Work from both sides of the frontier',
    cases: [
      { name: 'Pujol Wilkie', sector: 'Legal services for foreign buyers', summary: 'Bilingual site for a property and legal firm serving British and international clients buying in the Sotogrande area.', href: 'https://pujolwilkie.com', image: '/images/pujol-wilkie-screenshot.png' },
      { name: 'Racket Breaks', sector: 'Padel travel, UK audience', summary: 'Booking platform aimed at UK players travelling to the south of Spain, built and optimised for English-language search.', href: 'https://www.racketbreaks.com', image: '/images/racketbreaks-screenshot.png' },
      { name: 'Sotovet', sector: 'Veterinary clinic, Sotogrande', summary: 'Local clinic site built from scratch with local SEO foundations for an expat and Spanish client base.', href: 'https://www.sotovet.com', image: '/images/sotovet-screenshot.png' },
    ],
    faqTitle: 'Gibraltar SEO: questions we get asked',
    faqs: [
      { q: 'Should my Gibraltar business use a .gi, .es or .com domain?', a: 'If you only sell in Gibraltar, .gi is a strong local signal. If you also serve Spain, a .com with Gibraltar and Spanish sections, or a .gi plus a .es, usually works better. We decide this in the audit based on where your customers actually are; moving a domain later is expensive.' },
      { q: 'Do I need content in Spanish?', a: 'If any of your customers live in La Línea, San Roque, Algeciras or Sotogrande, yes. A large part of the Campo de Gibraltar searches in Spanish on google.es even when they then speak to you in English. We write both versions natively, not with a translation plugin.' },
      { q: 'How long does SEO take in Gibraltar?', a: 'Local terms in Gibraltar are less competitive than in Málaga or Marbella. For most service businesses we expect visible movement in 6 to 8 weeks and page-one positions for the main local terms within 3 to 5 months. iGaming and finance terms take longer and need a link strategy.' },
      { q: 'Can you work with iGaming operators and affiliates?', a: 'Yes. Our background is performance marketing for licensed operators: PPC, affiliates, programmatic and SEO under regulatory restrictions. We understand brand-term protection, affiliate SERPs and content that compliance will sign off.' },
      { q: 'How much does SEO cost?', a: 'Retainers start at €350 per month for local SEO (Google Business Profile, citations, two pieces of content and a monthly report). Technical fixes or a site rebuild are quoted separately. You get a fixed proposal after the discovery call, not an estimate that grows.' },
      { q: 'Do you come to Gibraltar?', a: 'Yes. We are in Sotogrande, 15 minutes away, and we meet clients in Gibraltar regularly. Day to day we work over WhatsApp and video calls so you are not paying for travel time.' },
    ],
    cta: {
      headline: 'Want to know where your site stands in Gibraltar?',
      sub: 'Send us your URL on WhatsApp and we will reply with the three things holding it back. No forms, no sales deck.',
      whatsappText: "Hi, I'd like a free SEO check for my Gibraltar business",
    },
  },
  {
    slug: 'diseno-web-algeciras',
    lang: 'es',
    path: '/diseno-web-algeciras',
    metaTitle: 'Diseño Web en Algeciras | Páginas web a medida desde 950 €',
    metaDescription:
      'Diseño web en Algeciras y el Campo de Gibraltar: páginas web a medida, rápidas y preparadas para salir en Google. Desde 950 €, bilingüe si lo necesitas, sin plantillas ni cuotas raras. Agencia de Sotogrande, a 25 minutos.',
    breadcrumb: 'Diseño web Algeciras',
    serviceType: 'Web Design',
    areaServed: ['Algeciras', 'Los Barrios', 'La Línea de la Concepción', 'San Roque', 'Tarifa', 'Campo de Gibraltar'],
    heroImage: '/images/landing-web-algeciras-cover.svg',
    heroAlt: 'Grúas del puerto de Algeciras con una ventana de navegador y el Peñón al fondo',
    label: 'Diseño web · Algeciras',
    h1: 'Diseño web en Algeciras para negocios que quieren que les encuentren',
    lead:
      'Una página web que carga rápido, se entiende en diez segundos y sale en Google cuando alguien busca lo que haces en Algeciras. Hecha a medida desde Sotogrande, a 25 minutos, sin plantillas de WordPress ni mantenimientos que nadie explica.',
    stats: [
      { value: '950 €', label: 'desde, web de hasta 5 páginas' },
      { value: '2-4 sem.', label: 'de la llamada al lanzamiento' },
      { value: 'ES + EN', label: 'bilingüe si tu cliente lo es' },
    ],
    problemTitle: 'Qué le falta a la mayoría de webs de Algeciras',
    problem: [
      'Algeciras es la ciudad más grande del Campo de Gibraltar y la que más búsquedas genera: "fontanero Algeciras", "abogado Algeciras", "transporte Algeciras". Muchas de esas búsquedas acaban en una ficha de Google sin web, o en una web de 2015 que no se puede leer en el móvil. Ahí está el hueco.',
      'La mayoría de webs locales se hacen con una plantilla, un constructor y quince plugins. Cargan lento, Google lo penaliza y cada año hay que pagar a alguien para que las actualice. Nosotros construimos desde cero, con la misma tecnología que usan las webs grandes, y la entregamos sin cuotas obligatorias.',
      'Si trabajas con el puerto, con transportistas o con clientes británicos de Gibraltar, tu web tiene que estar en español y en inglés de verdad, no traducida con un botón. Lo escribimos nativo en los dos idiomas.',
    ],
    servicesTitle: 'Qué incluye una web nuestra',
    services: [
      { icon: PenTool, title: 'Diseño a medida', desc: 'Sin plantilla. Diseñamos tu web para tu negocio y tu cliente, con tu marca, no con una demo que usan otros cien negocios.' },
      { icon: Gauge, title: 'Velocidad real', desc: 'Construida en Next.js y alojada en Vercel: carga en menos de un segundo. Google lo premia y tus clientes no se van.' },
      { icon: Smartphone, title: 'Móvil primero', desc: 'Más del 70 % de las búsquedas locales se hacen desde el móvil. Diseñamos primero para la pantalla pequeña.' },
      { icon: Search, title: 'SEO on page incluido', desc: 'Títulos, descripciones, estructura, schema y sitemap listos para posicionar "tu servicio + Algeciras" desde el primer día.' },
      { icon: MapPin, title: 'Google Business Profile', desc: 'Configuramos o arreglamos tu ficha de Google para que la web y el mapa trabajen juntos.' },
      { icon: Languages, title: 'Bilingüe ES/EN', desc: 'Si tienes clientes de Gibraltar o extranjeros, versión en inglés escrita por alguien que lo habla, con hreflang correcto.' },
      { icon: ShieldCheck, title: 'Sin cuotas obligatorias', desc: 'La web es tuya. El mantenimiento es opcional y se contrata cuando lo quieres, no para que la web siga funcionando.' },
      { icon: Wrench, title: 'Formulario y WhatsApp', desc: 'Formularios que llegan a tu correo, botón de WhatsApp, llamada directa. Lo que convierte visitas en clientes.' },
    ],
    processTitle: 'Cómo trabajamos',
    steps: [
      { num: '01', title: 'Llamada de 30 minutos', desc: 'Por WhatsApp, videollamada o en persona en Algeciras. Qué vendes, a quién y qué tiene que conseguir la web.' },
      { num: '02', title: 'Propuesta cerrada', desc: 'En 48 horas: páginas, textos, precio y plazo. Sin letra pequeña. El 50 % al empezar y el resto al publicar.' },
      { num: '03', title: 'Diseño y construcción', desc: 'Te enseñamos la web en un enlace privado según avanza. Una o dos rondas de cambios, según el paquete.' },
      { num: '04', title: 'Lanzamiento y 30 días de ajustes', desc: 'Dominio, hosting, Search Console y Google Business conectados. Los retoques del primer mes van incluidos.' },
    ],
    casesTitle: 'Webs hechas para negocios de la comarca',
    cases: [
      { name: 'Sotovet', sector: 'Clínica veterinaria', summary: 'Web nueva desde cero para una clínica de Sotogrande: rápida, bien organizada y con las reservas y el teléfono a un toque.', href: 'https://www.sotovet.com', image: '/images/sotovet-screenshot.png' },
      { name: 'Ágora Sotogrande', sector: 'Restaurante y discoteca', summary: 'Web para un local de eventos con reservas online: entendimos el negocio desde el primer día y las reservas han subido.', href: 'https://agorasotogrande.com', image: '/images/agora-screenshot.png' },
      { name: 'Pujol Wilkie', sector: 'Servicios jurídicos', summary: 'Web bilingüe para un despacho que atiende a compradores extranjeros en la zona. Comunicación rápida y resultados claros.', href: 'https://pujolwilkie.com', image: '/images/pujol-wilkie-screenshot.png' },
    ],
    faqTitle: 'Preguntas sobre diseño web en Algeciras',
    faqs: [
      { q: '¿Cuánto cuesta una página web en Algeciras?', a: 'Nuestra web Essential (hasta 5 páginas, bilingüe, SEO básico, ficha de Google) parte de 950 €. La Growth (hasta 10 páginas, blog, casos de éxito, SEO técnico completo) parte de 1.800 €. Tiendas online y sistemas de reserva se presupuestan aparte. Siempre con propuesta cerrada antes de empezar.' },
      { q: '¿Cuánto tarda?', a: 'Entre 2 y 4 semanas desde que tenemos los textos y las fotos. Si no los tienes, te ayudamos a prepararlos y el plazo se ajusta.' },
      { q: '¿Tengo que pagar una cuota mensual?', a: 'No. La web es tuya y funciona sin nosotros. El mantenimiento (actualizaciones, copias, soporte) es opcional, y el hosting en Vercel es gratuito para la mayoría de webs corporativas.' },
      { q: '¿Hacéis webs en WordPress?', a: 'No. Construimos desde cero en Next.js. Es más rápido, más seguro y no depende de plugins. Si ya tienes una web en WordPress, no la parcheamos: la rehacemos.' },
      { q: '¿Venís a Algeciras?', a: 'Sí. Estamos en Sotogrande, a 25 minutos, y nos reunimos en Algeciras cuando hace falta. El día a día va por WhatsApp para no cobrarte desplazamientos.' },
      { q: '¿Me ayudáis a salir en Google después?', a: 'La web sale con el SEO on page hecho. Si quieres posicionar en serio ("tu servicio + Algeciras", Los Barrios, La Línea), tenemos un servicio de SEO local desde 350 € al mes.' },
    ],
    cta: {
      headline: '¿Quieres saber qué le falta a tu web actual?',
      sub: 'Mándanos tu web por WhatsApp y te decimos las tres cosas que la frenan. Sin formularios ni reuniones de venta.',
      whatsappText: 'Hola, quiero presupuesto para una web en Algeciras',
    },
  },
  {
    slug: 'web-design-gibraltar',
    lang: 'en',
    path: '/en/web-design-gibraltar',
    metaTitle: 'Web Design in Gibraltar | Custom Websites from €950',
    metaDescription:
      'Web design for Gibraltar businesses from a bilingual agency 15 minutes away in Sotogrande. Custom-built, fast, mobile-first websites in English and Spanish, with SEO built in. From €950, no templates, no compulsory monthly fees.',
    breadcrumb: 'Web design Gibraltar',
    serviceType: 'Web Design',
    areaServed: ['Gibraltar', 'La Línea de la Concepción', 'Sotogrande', 'San Roque', 'Campo de Gibraltar'],
    heroImage: '/images/landing-web-gibraltar-cover.svg',
    heroAlt: 'A phone showing a website next to the silhouette of the Rock of Gibraltar',
    label: 'Web design · Gibraltar',
    h1: 'Web design in Gibraltar that works on the Rock and across the frontier',
    lead:
      'A website that loads in under a second, reads well on a phone and shows up when someone in Gibraltar, La Línea or Sotogrande searches for what you do. Built from scratch by a bilingual agency 15 minutes up the road, not a template with your logo on it.',
    stats: [
      { value: '€950', label: 'from, up to 5 pages, bilingual' },
      { value: '2-4 wks', label: 'from first call to launch' },
      { value: '< 1 s', label: 'typical load time on Next.js + Vercel' },
    ],
    problemTitle: 'Why most Gibraltar websites are losing business',
    problem: [
      'Walk down Main Street and search for the shops you pass. Half have no website, and many of the rest have a site built years ago on a page builder that takes six seconds to load on a phone. Gibraltar is a small, dense market where word of mouth still matters, but the first thing a new customer does is Google you. If the site looks old, so do you.',
      'Gibraltar businesses also serve two audiences at once: locals and the thousands of people who cross from La Línea, San Roque and Sotogrande every day. Most sites are English-only or machine-translated. Ours are written natively in both languages, with the correct technical setup so Google in Spain and Google in Gibraltar each show the right version.',
      'And then there is the hosting trap: a monthly fee you pay to keep a site you do not own online. We build on Next.js, host on Vercel (free for most business sites) and hand you the keys. Maintenance is optional, not a ransom.',
    ],
    servicesTitle: 'What you get',
    services: [
      { icon: PenTool, title: 'Custom design', desc: 'Designed for your business and your customers, with your brand. No theme, no demo content, nothing you have seen on another site.' },
      { icon: Gauge, title: 'Speed that Google notices', desc: 'Built in Next.js and served from Vercel’s edge network. Sub-second loads, which is now a ranking factor and a conversion factor.' },
      { icon: Smartphone, title: 'Mobile first', desc: 'Most local searches in Gibraltar happen on a phone, often while walking. We design for the small screen first and scale up.' },
      { icon: Languages, title: 'English and Spanish, written properly', desc: 'Both versions written by people who speak the language, with hreflang set up so the right one ranks in each country.' },
      { icon: Search, title: 'SEO built in', desc: 'Titles, descriptions, structured data, sitemap and a page structure that can rank for “your service + Gibraltar” from day one.' },
      { icon: MapPin, title: 'Google Business Profile', desc: 'We set up or fix your Google profile so the map listing and the website work together for local searches.' },
      { icon: ShieldCheck, title: 'You own it', desc: 'Domain, code and hosting in your name. No compulsory monthly fee, no lock-in, no plugin updates to pay for.' },
      { icon: Wrench, title: 'Bookings, forms, WhatsApp', desc: 'Contact forms to your inbox, WhatsApp click-to-chat, booking or quote flows where the business needs them.' },
    ],
    processTitle: 'How we work',
    steps: [
      { num: '01', title: 'A 30-minute call', desc: 'WhatsApp, video or in person in Gibraltar. What you sell, who buys it, and what the site has to achieve: calls, bookings, enquiries, trust.' },
      { num: '02', title: 'A fixed proposal in 48 hours', desc: 'Pages, copy, price and timeline. 50% to start, the rest at launch. What is not in the proposal is not charged without agreeing it first.' },
      { num: '03', title: 'Design and build', desc: 'You follow progress on a private link as the site takes shape. One or two rounds of revisions depending on the package.' },
      { num: '04', title: 'Launch and 30 days of tweaks', desc: 'Domain, hosting, Search Console and Google Business connected. Small changes in the first month are included.' },
    ],
    casesTitle: 'Sites built for this part of the world',
    cases: [
      { name: 'Racket Breaks', sector: 'Padel travel, UK audience', summary: 'Booking platform for UK players coming to the south of Spain. The booking flow was exactly what a British audience needed.', href: 'https://www.racketbreaks.com', image: '/images/racketbreaks-screenshot.png' },
      { name: 'Pujol Wilkie', sector: 'Legal services for foreign buyers', summary: 'Bilingual site for a property and legal firm serving British and international clients in the Sotogrande area.', href: 'https://pujolwilkie.com', image: '/images/pujol-wilkie-screenshot.png' },
      { name: 'Sotovet', sector: 'Veterinary clinic, Sotogrande', summary: 'A brand-new site built from scratch for an expat and Spanish client base: fast, well organised, direct contact throughout.', href: 'https://www.sotovet.com', image: '/images/sotovet-screenshot.png' },
    ],
    faqTitle: 'Web design in Gibraltar: common questions',
    faqs: [
      { q: 'How much does a website cost in Gibraltar?', a: 'Our Essential site (up to 5 pages, bilingual, basic SEO, Google Business setup) starts at €950. The Growth site (up to 10 pages, blog, case studies, full technical SEO) starts at €1,800. E-commerce and booking systems are quoted per project. We invoice in euros or pounds, whichever suits you.' },
      { q: 'Should I use a .gi domain?', a: 'If your customers are mainly in Gibraltar, yes: a .gi domain is a clear local signal to Google. If you also serve Spain, we usually recommend a .com with proper language sections, or a .gi plus a .es. We will tell you which in the proposal, because changing later is expensive.' },
      { q: 'Do I need a Spanish version?', a: 'If any of your customers live across the frontier, or you want frontier workers and Campo de Gibraltar residents to find you, yes. Around a third of the people who shop in Gibraltar search in Spanish on google.es. We write it natively, not with a plugin.' },
      { q: 'Do you work with WordPress or Wix?', a: 'No. We build from scratch in Next.js, which is faster, more secure and does not depend on plugins. If you have an existing WordPress or Wix site, we do not patch it; we rebuild it and migrate your content and rankings properly.' },
      { q: 'Can you handle iGaming, finance or insurance sites?', a: 'Yes. Our background is performance marketing for licensed iGaming operators, so we know the compliance constraints, the landing-page rules and what a regulated brand site needs. For B2B suppliers and service firms in those sectors we build the site and can run the marketing afterwards.' },
      { q: 'Do you come to Gibraltar?', a: 'Yes. We are based in Sotogrande, 15 minutes away, and meet clients in Gibraltar regularly. Day to day we work over WhatsApp and video so you are not paying for travel.' },
    ],
    cta: {
      headline: 'Want an honest opinion on your current site?',
      sub: 'Send us the URL on WhatsApp and we will reply with the three things costing you customers. No forms, no sales call.',
      whatsappText: "Hi, I'd like a quote for a new website for my Gibraltar business",
    },
  },
]

import { landingPages2 } from './landing-data-2'

export const allLandingPages: LandingPage[] = [...landingPages, ...landingPages2]

export function getLandingByPath(path: string): LandingPage | undefined {
  return allLandingPages.find((p) => p.path === path)
}
