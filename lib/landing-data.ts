import { Search, MapPin, FileText, Link2, BarChart3, Gauge, Globe, Languages, type LucideIcon } from 'lucide-react'

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
      { name: 'Pujol Wilkie', sector: 'Legal services for foreign buyers', summary: 'Bilingual site for a property and legal firm serving British and international clients buying in the Sotogrande area.', href: 'https://pujolwilkie.com' },
      { name: 'Racket Breaks', sector: 'Padel travel, UK audience', summary: 'Booking platform aimed at UK players travelling to the south of Spain, built and optimised for English-language search.', href: 'https://www.racketbreaks.com' },
      { name: 'Sotovet', sector: 'Veterinary clinic, Sotogrande', summary: 'Local clinic site built from scratch with local SEO foundations for an expat and Spanish client base.', href: 'https://www.sotovet.com' },
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
]

export function getLandingByPath(path: string): LandingPage | undefined {
  return landingPages.find((p) => p.path === path)
}
