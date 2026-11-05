import { Target, PenTool, Type, MessageSquare, Camera, Globe, Share2, BookOpen } from 'lucide-react'
import type { LandingPage } from './landing-data'

/**
 * Branding pillar page (ES + EN). Written natively in each language, not
 * translated: the two entries share structure, not sentences.
 * Target query: "branding en sotogrande" / "branding in sotogrande".
 */
export const servicePages3: LandingPage[] = [
  // ================================================================ BRANDING · ES
  {
    slug: 'branding',
    lang: 'es',
    path: '/servicios/branding',
    alternatePath: '/en/services/branding',
    metaTitle: 'Branding en Sotogrande: Identidad de Marca',
    metaDescription:
      'Branding en Sotogrande y el Campo de Gibraltar: logotipo, identidad visual y tono de marca para tu negocio, aplicados a web y redes. Pide una llamada.',
    breadcrumb: 'Branding',
    serviceType: 'Branding and Visual Identity Design',
    areaServed: ['Sotogrande', 'San Roque', 'Estepona', 'Campo de Gibraltar', 'Gibraltar', 'Costa del Sol'],
    heroImage: '/images/service-branding-cover.svg',
    heroAlt: 'Tablero de marca con logotipo, paleta de color y tipografía en tonos carbón y dorado',
    label: 'Branding · Sotogrande',
    h1: 'Branding en Sotogrande: una marca que se reconoce y se recuerda',
    lead:
      'Un logotipo bonito no es una marca. Una marca es que te reconozcan en la fachada, en Instagram, en la factura y en Google, y que un cliente de Sotogrande, de Estepona o de Gibraltar entienda en dos segundos qué vendes y por qué mereces lo que cobras. Diseñamos identidades para negocios de la zona y las llevamos hasta donde se ven de verdad: tu web, tus redes y tu documentación.',
    stats: [
      { value: '1 sistema', label: 'logotipo, color, tipografía y tono, todo coherente' },
      { value: 'ES + EN', label: 'una marca pensada para los dos públicos de la zona' },
      { value: 'Web + redes', label: 'la identidad aplicada, no solo un PDF' },
    ],
    problemTitle: 'Por qué tantas marcas de la zona se parecen',
    problem: [
      'En Sotogrande, Estepona o el Campo de Gibraltar el cliente es exigente: residentes internacionales, golf, segunda vivienda, hostelería de nivel, gente que te compara con lo que ve en Marbella, en Londres o en Madrid. Aun así, la mayoría de negocios lleva un logotipo hecho con prisa, tres tipos de letra distintos y fotos de banco de imágenes. El cliente no sabría explicar por qué, pero lo nota: eso no transmite confianza para pagar un precio alto.',
      'El segundo problema es que la marca se queda en una carpeta. El logo está en un PDF, la web usa otros colores, Instagram otro estilo y el presupuesto otro más. Cada pieza parece de un negocio distinto. Una identidad que funciona se define una sola vez (color, tipografía, forma de hablar, cómo se usan las fotos) y se aplica igual en todas partes.',
      'Nosotros empezamos por el negocio, no por el logotipo: a quién le vendes, qué te distingue de los dos o tres competidores que tu cliente también mira y cómo quieres que te describan. Después diseñamos, y lo dejamos funcionando en tu web, tus redes y tus documentos, con una guía corta para que cualquiera pueda mantenerlo.',
    ],
    servicesTitle: 'Qué incluye una identidad de marca',
    services: [
      { icon: Target, title: 'Estrategia y posicionamiento', desc: 'A quién te diriges, qué te diferencia de tu competencia directa y cómo quieres que te describan. La base de cada decisión de diseño.' },
      { icon: PenTool, title: 'Logotipo y variantes', desc: 'Un logotipo principal y sus versiones: horizontal, vertical, icono para redes y una sola tinta, listos para web, impresión y rótulo.' },
      { icon: Type, title: 'Color y tipografía', desc: 'Una paleta y una pareja de tipos que funcionan en pantalla y en papel, con buen contraste y legibles en el móvil.' },
      { icon: MessageSquare, title: 'Tono de marca', desc: 'Cómo habla tu negocio, en español y en inglés: más formal o más cercano, y qué palabras sí y cuáles no. Los textos de la web y las redes salen de la misma voz.' },
      { icon: Camera, title: 'Dirección de fotografía', desc: 'Qué fotos usar y cómo: estilo, encuadre y luz, para que nada parezca de banco de imágenes. Pautas para tu sesión o criterio para elegir lo que ya tienes.' },
      { icon: Globe, title: 'Identidad aplicada a la web', desc: 'La marca llevada a una web a medida: color, tipografía y componentes coherentes, no una plantilla con tu logo encima.' },
      { icon: Share2, title: 'Redes sociales', desc: 'Plantillas y estilo visual para Instagram y LinkedIn, para que cada publicación se reconozca antes de leer el nombre.' },
      { icon: BookOpen, title: 'Guía de marca', desc: 'Un documento corto con las reglas de uso (logo, color, tipografía, tono y ejemplos) para que tú, tu equipo o un proveedor la apliquéis igual.' },
    ],
    processTitle: 'Cómo trabajamos',
    steps: [
      { num: '01', title: 'Conversación y diagnóstico', desc: 'Una llamada de 30 minutos y un repaso de lo que tienes hoy: qué funciona, qué sobra y con quién te compara tu cliente.' },
      { num: '02', title: 'Propuesta cerrada', desc: 'Qué incluye (logotipo, guía, plantillas, web), plazos y precio. Por escrito y sin sorpresas.' },
      { num: '03', title: 'Diseño por rondas', desc: 'Te enseñamos el camino elegido aplicado a cosas reales (una página web, una publicación, una tarjeta), no solo un logo sobre fondo blanco. Rondas de ajuste incluidas.' },
      { num: '04', title: 'Entrega y puesta en marcha', desc: 'Archivos finales, guía de marca y la identidad ya aplicada en tu web y tus redes. Te acompañamos para que se use igual en todas partes.' },
    ],
    casesTitle: 'Marcas de la zona con las que trabajamos',
    cases: [
      { name: 'Sotovet', sector: 'Clínica veterinaria · Sotogrande', summary: 'Identidad y web de una clínica de Sotogrande, diseñadas a la vez para que la marca se reconozca en cada pantalla y genere confianza en clientes españoles y extranjeros.', href: 'https://www.sotovet.com', image: '/images/sotovet-screenshot.png' },
      { name: 'Racket Breaks', sector: 'Viajes de pádel', summary: 'Marca y plataforma de reservas para jugadores británicos que viajan al sur de España, con una imagen coherente de la primera página a la confirmación de la reserva.', href: 'https://www.racketbreaks.com', image: '/images/racketbreaks-screenshot.png' },
      { name: 'Pujol Wilkie', sector: 'Servicios jurídicos', summary: 'Identidad modernizada y web nueva para un despacho que atiende a compradores extranjeros: una imagen más sobria y actual, en español e inglés.', href: 'https://pujolwilkie.com', image: '/images/pujol-wilkie-screenshot.png' },
    ],
    faqTitle: 'Preguntas sobre branding',
    faqs: [
      { q: '¿Qué incluye exactamente un servicio de branding?', a: 'Estrategia y posicionamiento, logotipo con sus variantes, color, tipografía, tono de marca y una guía de uso. Lo ampliamos con la aplicación a web, redes sociales y material impreso según lo que necesites. En la llamada vemos qué paquete tiene sentido para el momento de tu negocio.' },
      { q: '¿Necesito rehacer el logotipo o podéis mejorar el que tengo?', a: 'Depende. Si tu logotipo funciona y solo está mal aplicado, lo ordenamos y construimos el sistema a su alrededor. Si te limita frente a tu clientela, lo rediseñamos. Te lo decimos con criterio después de ver lo que tienes, sin venderte un rediseño que no hace falta.' },
      { q: '¿Hacéis la web y la marca juntas?', a: 'Sí, y es lo más eficaz: la identidad se diseña sabiendo cómo se verá en pantalla y la web nace ya con ella. También trabajamos solo la identidad si ya tienes web, o aplicamos una marca existente a una web nueva.' },
      { q: '¿La marca puede estar en español y en inglés?', a: 'Sí, y en esta zona casi siempre hace falta. Definimos el tono en los dos idiomas y los nombres, lemas y textos se escriben directamente en cada uno, no se traducen.' },
      { q: '¿Cuánto cuesta?', a: 'Depende de lo que haga falta: una identidad completa con guía no es lo mismo que un retoque del logotipo. Tras una llamada de 30 minutos recibes una propuesta cerrada con alcance, plazo y precio.' },
      { q: '¿Trabajáis con negocios de fuera de Sotogrande?', a: 'Sí. Estamos en Sotogrande y nos movemos por San Roque, Estepona, el Campo de Gibraltar y Gibraltar, pero el trabajo de marca se puede hacer perfectamente a distancia con clientes de toda España.' },
    ],
    cta: {
      headline: '¿Tu marca está a la altura de tu negocio?',
      sub: 'Mándanos tu logotipo y tu web por WhatsApp y te decimos qué mantendríamos, qué cambiaríamos y por dónde empezar. Sin formularios.',
      whatsappText: 'Hola, quiero hablar del branding de mi negocio',
      heroLabel: 'Hablar de mi marca por WhatsApp',
    },
  },
  // ================================================================ BRANDING · EN
  {
    slug: 'branding',
    lang: 'en',
    path: '/en/services/branding',
    alternatePath: '/servicios/branding',
    metaTitle: 'Branding in Sotogrande: Brand Identity Studio',
    metaDescription:
      'Brand identity design in Sotogrande and Campo de Gibraltar: logo, visual identity and tone of voice, applied to your website and social. Book a call.',
    breadcrumb: 'Branding',
    serviceType: 'Branding and Visual Identity Design',
    areaServed: ['Sotogrande', 'San Roque', 'Estepona', 'Campo de Gibraltar', 'Gibraltar', 'Costa del Sol'],
    heroImage: '/images/service-branding-cover.svg',
    heroAlt: 'Brand board with a logo mark, colour palette and typography in charcoal and gold',
    label: 'Branding · Sotogrande',
    h1: 'Brand identity in Sotogrande for businesses that want to be remembered',
    lead:
      'A good-looking logo is not a brand. A brand is being recognised on the shopfront, on Instagram, on the invoice and in Google results, and a customer in Sotogrande, Estepona or Gibraltar understanding in two seconds what you sell and why you are worth the price. We design identities for businesses on this coast and take them as far as they are actually seen: your website, your social channels and your documents.',
    stats: [
      { value: 'One system', label: 'logo, colour, type and tone that all agree' },
      { value: 'EN + ES', label: 'a brand built for both audiences here' },
      { value: 'Web + social', label: 'identity in use, not just a PDF' },
    ],
    problemTitle: 'Why so many brands on this coast look alike',
    problem: [
      'Businesses in Sotogrande, Estepona and Campo de Gibraltar are judged by demanding customers: international residents, golfers, second-home owners, high-end hospitality, people who compare you with what they see in Marbella, London or Madrid. Yet most logos were made in a hurry, with three different fonts and stock photos on top. Customers could not tell you why, but they feel it: it does not look like somewhere that deserves a premium price.',
      'The second problem is that the brand lives in a folder. The logo sits in a PDF, the website uses other colours, Instagram has another style and the quote yet another. Every piece looks like it belongs to a different company. An identity that works is defined once (colour, type, how you speak, how photos are used) and then applied the same way everywhere.',
      'We start with the business, not the logo: who you sell to, what separates you from the two or three competitors your customer is also looking at, and how you want to be described. Then we design, and we leave it working on your website, social channels and paperwork, with a short guide so anyone can keep it consistent.',
    ],
    servicesTitle: 'What a brand identity includes',
    services: [
      { icon: Target, title: 'Strategy and positioning', desc: 'Who you are for, what sets you apart from direct competitors and how you want to be described. The foundation for every design decision.' },
      { icon: PenTool, title: 'Logo and variations', desc: 'A primary logo and its versions: horizontal, stacked, a social icon and a single-colour version, ready for web, print and signage.' },
      { icon: Type, title: 'Colour and typography', desc: 'A palette and a type pairing that work on screen and on paper, with good contrast and legibility on a phone.' },
      { icon: MessageSquare, title: 'Tone of voice', desc: 'How your business speaks, in English and Spanish, formal or friendly, and which words you use and avoid. Website and social copy all come from the same voice.' },
      { icon: Camera, title: 'Photography direction', desc: 'Which photos to use and how: style, framing and light, so nothing looks like stock. Guidance for a shoot, or a clear eye for choosing what you already have.' },
      { icon: Globe, title: 'Identity on your website', desc: 'The brand carried into a custom site: consistent colour, type and components, not a template with your logo dropped on top.' },
      { icon: Share2, title: 'Social media', desc: 'Templates and a visual style for Instagram and LinkedIn, so every post is recognisable before anyone reads the name.' },
      { icon: BookOpen, title: 'Brand guide', desc: 'A short document with the rules (logo, colour, type, tone and examples) so you, your team or a supplier all apply it the same way.' },
    ],
    processTitle: 'How we work',
    steps: [
      { num: '01', title: 'Conversation and review', desc: 'A 30-minute call and a look at what you have today: what works, what to drop and who your customers compare you with.' },
      { num: '02', title: 'Fixed proposal', desc: 'What is included (logo, guide, templates, website), timings and price. In writing, with no surprises.' },
      { num: '03', title: 'Design in rounds', desc: 'We show the chosen direction applied to real things (a web page, a social post, a business card), not just a logo on white. Revision rounds are included.' },
      { num: '04', title: 'Handover and rollout', desc: 'Final files, a brand guide and the identity already set up on your website and social channels. We stay close so it is used consistently.' },
    ],
    casesTitle: 'Local brands we work with',
    cases: [
      { name: 'Sotovet', sector: 'Veterinary clinic · Sotogrande', summary: 'Identity and website for a Sotogrande clinic, designed together so the brand is recognisable on every screen and builds trust with both Spanish and international clients.', href: 'https://www.sotovet.com', image: '/images/sotovet-screenshot.png' },
      { name: 'Racket Breaks', sector: 'Padel travel, UK audience', summary: 'Brand and booking platform for UK players travelling to southern Spain, with a consistent look from the first page to the booking confirmation.', href: 'https://www.racketbreaks.com', image: '/images/racketbreaks-screenshot.png' },
      { name: 'Pujol Wilkie', sector: 'Legal services', summary: 'A modernised identity and a new website for a firm serving international buyers: a sharper, more current image, in English and Spanish.', href: 'https://pujolwilkie.com', image: '/images/pujol-wilkie-screenshot.png' },
    ],
    faqTitle: 'Branding questions we get asked',
    faqs: [
      { q: 'What does a branding service actually include?', a: 'Strategy and positioning, a logo with its variations, colour, typography, tone of voice and a usage guide. We extend it to your website, social media and printed material as needed. On the call we work out which package suits the stage your business is at.' },
      { q: 'Do I need a new logo, or can you improve mine?', a: 'It depends. If your logo works and is simply applied badly, we tidy it up and build the system around it. If it limits how customers see you, we redesign it. You get a straight answer after we review what you have, not a redesign you do not need.' },
      { q: 'Can you do the website and the brand together?', a: 'Yes, and it works best: the identity is designed knowing how it will look on screen, and the site is born with it. We can also work on identity alone if you already have a site, or apply an existing brand to a new one.' },
      { q: 'Can the brand work in English and Spanish?', a: 'Yes, and on this coast it usually has to. We define the tone in both languages, and names, taglines and copy are written natively in each, never translated.' },
      { q: 'How much does it cost?', a: 'It depends on what is needed: a full identity with a guide is not the same job as a logo refresh. After a 30-minute call you get a fixed proposal with scope, timing and price.' },
      { q: 'Do you work with businesses outside Sotogrande?', a: 'Yes. We are based in Sotogrande and regularly meet clients in San Roque, Estepona, Campo de Gibraltar and Gibraltar, but brand work runs perfectly well remotely for clients anywhere in Spain or the UK.' },
    ],
    cta: {
      headline: 'Does your brand match your business?',
      sub: 'Send us your logo and website on WhatsApp and we will tell you what we would keep, what we would change and where to start. No forms.',
      whatsappText: "Hi, I'd like to talk about branding for my business",
      heroLabel: 'Talk about my brand on WhatsApp',
    },
  },
]
