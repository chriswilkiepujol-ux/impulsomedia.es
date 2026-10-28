import { Search, MapPin, Link2, BarChart3, Gauge, Languages, Smartphone, ShieldCheck, Wrench, PenTool, FileText, Globe, Eye, Target, Share2, Megaphone, Layers, Cpu, Workflow, Mail, Bot, Database, RefreshCw, Sparkles, Calendar, TrendingUp, Handshake } from 'lucide-react'
import type { LandingPage } from './landing-data'

/**
 * Service pillar pages (no city): /servicios/diseno-web, /servicios/seo,
 * /servicios/publicidad, /servicios/automatizacion-ia and their EN twins.
 * Same template as the city landings. The city pages hang off these.
 */
export const servicePages: LandingPage[] = [
  // ================================================================ IA · ES
  {
    slug: 'automatizacion-ia',
    lang: 'es',
    path: '/servicios/automatizacion-ia',
    alternatePath: '/en/services/ai-automation',
    metaTitle: 'Automatización de Procesos con IA',
    metaDescription:
      'Automatizamos procesos con IA: de correos y contenido a leads, informes y asistentes internos. Agencia en Sotogrande. Cuéntanos tu proceso.',
    breadcrumb: 'Automatización e IA',
    serviceType: 'Business Process Automation',
    areaServed: ['Sotogrande', 'Campo de Gibraltar', 'Gibraltar', 'Costa del Sol', 'España'],
    heroImage: '/images/service-ai-cover.svg',
    heroAlt: 'Flujo de automatización: correo entrante, IA, borrador revisado, publicación en web y redes',
    label: 'Automatización e IA',
    h1: 'Automatización con IA que quita trabajo de verdad a tu equipo',
    lead:
      'No vendemos "transformación digital". Cogemos las tareas repetitivas que hoy hace una persona (leer correos, clasificar, redactar, publicar, pasar datos de un sitio a otro, hacer el informe del lunes) y montamos un sistema que las hace solo, con revisión humana donde importa, conectado a las herramientas que ya tienes. Lo construimos nosotros, lo mantenemos nosotros y se mide en horas ahorradas.',
    stats: [
      { value: '24/7', label: 'el sistema trabaja; tu equipo revisa' },
      { value: '0', label: 'herramientas nuevas que aprender' },
      { value: '+', label: 'cada corrección mejora el siguiente resultado' },
    ],
    problemTitle: 'Qué automatizamos (ejemplos reales)',
    problem: [
      'Redacción de noticias y contenido. Para un grupo editorial local: los correos con notas de prensa y comunicados de ayuntamientos entran en un buzón, la IA los clasifica, descarta lo irrelevante y redacta un borrador en el tono de la casa con imagen, lo deja en WordPress para que un periodista lo revise y, al publicar, lo adapta y lo publica en Instagram, Facebook y TikTok. Decenas de comunicados al mes sin que nadie copie y pegue.',
      'Captación y seguimiento de leads. Formularios y WhatsApp que entran en el CRM ya clasificados, con la respuesta inicial enviada en segundos en el idioma del cliente, recordatorios automáticos y aviso al comercial solo cuando el lead está caliente. Para inmobiliarias, clínicas, despachos y cualquier negocio que pierde clientes por tardar en contestar.',
      'Informes y datos. El informe de Google Ads, Search Console, ventas o reservas que alguien monta cada lunes a mano, generado solo y enviado con un resumen en lenguaje normal. Y asistentes internos que responden a tu equipo sobre procedimientos, precios o inventario a partir de tus propios documentos.',
    ],
    servicesTitle: 'Qué podemos construir',
    services: [
      { icon: Mail, title: 'Gestión de correo con IA', desc: 'Clasificación, extracción de datos, respuesta automática a lo rutinario y escalado a una persona de lo que no lo es.' },
      { icon: FileText, title: 'Contenido asistido por IA', desc: 'Borradores de noticias, fichas de producto, descripciones de inmuebles o posts en tu tono, con revisión humana antes de publicar.' },
      { icon: Share2, title: 'Publicación multicanal', desc: 'De un borrador aprobado a WordPress, Instagram, Facebook, TikTok y LinkedIn con el formato y el tono de cada plataforma.' },
      { icon: Database, title: 'Leads al CRM', desc: 'Formularios, WhatsApp y llamadas que entran clasificados en tu CRM, con primera respuesta automática y seguimiento.' },
      { icon: BarChart3, title: 'Informes automáticos', desc: 'Datos de anuncios, web, reservas o ventas recogidos solos y resumidos en lenguaje normal, cada semana o cada mes.' },
      { icon: Bot, title: 'Asistentes internos', desc: 'Un chat para tu equipo que responde con tus documentos, procedimientos y precios. El conocimiento deja de irse con la gente.' },
      { icon: Workflow, title: 'Integraciones', desc: 'Conectamos lo que ya usas: Google Workspace, WordPress, HubSpot, Notion, Stripe, hojas de cálculo, APIs propias. Sin cambiar de herramientas.' },
      { icon: RefreshCw, title: 'Sistemas que aprenden', desc: 'Cada corrección de tu equipo mejora el siguiente resultado. No es un escenario de Make fijo: es un sistema con memoria.' },
    ],
    processTitle: 'Cómo lo hacemos',
    steps: [
      { num: '01', title: 'Mapeo del proceso', desc: 'Una sesión con quien hace la tarea hoy. Qué entra, qué sale, qué decisiones se toman por el camino y cuánto tiempo lleva.' },
      { num: '02', title: 'Propuesta cerrada', desc: 'Qué automatizamos, qué queda en manos humanas, qué herramientas tocamos, coste de construcción y coste mensual de mantenimiento. Por escrito.' },
      { num: '03', title: 'Construcción y pruebas', desc: 'Lo montamos en paralelo a tu proceso actual, con datos reales, hasta que el resultado es mejor que el manual. Entonces se activa.' },
      { num: '04', title: 'Mantenimiento y mejora', desc: 'Lo vigilamos, corregimos lo que falla y ampliamos a nuevas marcas o procesos sobre el mismo sistema. Cuota mensual, sin permanencia.' },
    ],
    casesTitle: 'Automatizaciones que ya funcionan',
    cases: [
      { name: 'OnlineGames.cat', sector: 'Medio digital de videojuegos', summary: 'Pipeline de contenido automatizado que publica noticias y análisis a un ritmo imposible de gestionar a mano, sin que el sitio suene genérico.', href: 'https://onlinegames.cat', image: '/images/onlinegames-screenshot.png' },
      { name: 'Racket Breaks', sector: 'Plataforma de reservas', summary: 'Flujo de reserva y presupuesto automatizado para un público británico: de la solicitud al correo de confirmación sin intervención manual.', href: 'https://www.racketbreaks.com', image: '/images/racketbreaks-screenshot.png' },
      { name: 'Ágora Sotogrande', sector: 'Restaurante y eventos', summary: 'Reservas online conectadas al sistema del local y consultas de eventos que llegan clasificadas al equipo.', href: 'https://agorasotogrande.com', image: '/images/agora-screenshot.png' },
    ],
    faqTitle: 'Preguntas sobre automatización e IA',
    faqs: [
      { q: '¿Qué procesos merece la pena automatizar?', a: 'Los que son repetitivos, tienen reglas claras y consumen horas cada semana: correo, contenido, datos entre sistemas, informes, primeras respuestas a clientes. Si una tarea la hace siempre la misma persona de la misma forma, es candidata. Lo que requiere criterio se queda con una persona, y el sistema se lo prepara.' },
      { q: '¿Qué herramientas usáis?', a: 'Las que ya tengas más lo mínimo necesario: modelos de IA (OpenAI, Anthropic, Google), integraciones directas por API, y cuando conviene, plataformas como Make o n8n. No te vendemos una herramienta nueva: te conectamos las tuyas.' },
      { q: '¿Y si la IA se equivoca?', a: 'Por eso hay revisión humana donde una decisión importa: un borrador se aprueba antes de publicarse, un lead dudoso lo mira una persona. El sistema registra cada corrección y la usa para mejorar. Con el tiempo, las revisiones bajan.' },
      { q: '¿Qué pasa con mis datos?', a: 'Se quedan en tus cuentas. Las integraciones se hacen con tus credenciales, los datos no se usan para entrenar modelos públicos y, si hay información sensible, se procesa en modelos con esas garantías. Lo dejamos por escrito en la propuesta.' },
      { q: '¿Cuánto cuesta?', a: 'Depende de cuántos procesos, cuántas integraciones y cuánta revisión necesita. Normalmente es un coste de construcción más una cuota mensual de mantenimiento y mejora, siempre por debajo de lo que cuesta la persona-hora que sustituye. Propuesta cerrada tras la sesión de mapeo.' },
      { q: '¿Trabajáis con empresas fuera de la zona?', a: 'Sí. La automatización se hace en remoto; estamos en Sotogrande y nos vemos en persona con empresas del Campo de Gibraltar, Gibraltar y la Costa del Sol, pero trabajamos con clientes en toda España.' },
    ],
    cta: {
      headline: '¿Qué tarea te gustaría no volver a hacer a mano?',
      sub: 'Cuéntanosla por WhatsApp en dos líneas y te decimos si se puede automatizar, cómo, y qué ahorraría. Sin formularios.',
      whatsappText: 'Hola, quiero automatizar un proceso de mi empresa con IA',
      heroLabel: 'Cuéntanos el proceso por WhatsApp',
    },
  },
  // ================================================================ IA · EN
  {
    slug: 'ai-automation',
    lang: 'en',
    path: '/en/services/ai-automation',
    alternatePath: '/servicios/automatizacion-ia',
    metaTitle: 'AI Process Automation for Business',
    metaDescription:
      'We automate business processes with AI: email, content, lead capture, reports and internal assistants. Sotogrande agency. Tell us your process.',
    breadcrumb: 'AI automation',
    serviceType: 'Business Process Automation',
    areaServed: ['Sotogrande', 'Gibraltar', 'Campo de Gibraltar', 'Costa del Sol', 'Spain', 'United Kingdom'],
    heroImage: '/images/service-ai-cover.svg',
    heroAlt: 'Automation flow: incoming email, AI, reviewed draft, published to web and social',
    label: 'AI automation',
    h1: 'AI automation that takes real work off your team',
    lead:
      'We do not sell "digital transformation". We take the repetitive tasks a person does today (reading and sorting email, drafting, publishing, moving data between systems, building the Monday report) and build a system that does them, with human review where it matters, connected to the tools you already have. We build it, we maintain it, and it is measured in hours saved.',
    stats: [
      { value: '24/7', label: 'the system works; your team reviews' },
      { value: '0', label: 'new tools to learn' },
      { value: '+', label: 'every correction improves the next result' },
    ],
    problemTitle: 'What we automate (real examples)',
    problem: [
      'News and content production. For a local publishing group: press releases and council communiqués land in an inbox, the AI classifies them, discards the irrelevant, drafts an article in the house tone with an image, leaves it in WordPress for a journalist to review and, on publish, adapts and posts it to Instagram, Facebook and TikTok. Dozens of releases a month with nobody copying and pasting.',
      'Lead capture and follow-up. Forms and WhatsApp messages land in the CRM already classified, with a first reply sent in seconds in the customer’s language, automatic reminders and a nudge to the salesperson only when the lead is warm. For estate agents, clinics, law firms and any business that loses customers by replying late.',
      'Reports and data. The Google Ads, Search Console, sales or bookings report someone builds by hand every Monday, generated automatically and sent with a plain-language summary. And internal assistants that answer your team’s questions about procedures, prices or stock from your own documents.',
    ],
    servicesTitle: 'What we can build',
    services: [
      { icon: Mail, title: 'AI email handling', desc: 'Classification, data extraction, automatic replies to the routine and escalation to a person for the rest.' },
      { icon: FileText, title: 'AI-assisted content', desc: 'Drafts of news, product sheets, property descriptions or posts in your tone, with human review before publishing.' },
      { icon: Share2, title: 'Multi-channel publishing', desc: 'From an approved draft to WordPress, Instagram, Facebook, TikTok and LinkedIn in each platform’s format and tone.' },
      { icon: Database, title: 'Leads into your CRM', desc: 'Forms, WhatsApp and calls arrive classified in your CRM, with an automatic first reply and follow-up.' },
      { icon: BarChart3, title: 'Automatic reporting', desc: 'Ads, web, bookings or sales data collected automatically and summarised in plain language, weekly or monthly.' },
      { icon: Bot, title: 'Internal assistants', desc: 'A chat for your team that answers from your documents, procedures and prices. Knowledge stops leaving with staff.' },
      { icon: Workflow, title: 'Integrations', desc: 'We connect what you already use: Google Workspace, WordPress, HubSpot, Notion, Stripe, spreadsheets, your own APIs. No tool switching.' },
      { icon: RefreshCw, title: 'Systems that learn', desc: 'Every correction your team makes improves the next result. Not a fixed Make scenario: a system with memory.' },
    ],
    processTitle: 'How we do it',
    steps: [
      { num: '01', title: 'Process mapping', desc: 'A session with whoever does the task today. What comes in, what goes out, which decisions are made along the way and how long it takes.' },
      { num: '02', title: 'Fixed proposal', desc: 'What we automate, what stays with people, which tools we touch, build cost and monthly maintenance cost. In writing.' },
      { num: '03', title: 'Build and test', desc: 'We run it alongside your current process, on real data, until the output beats the manual version. Then it goes live.' },
      { num: '04', title: 'Maintain and extend', desc: 'We monitor it, fix what breaks and extend it to new brands or processes on the same system. Monthly fee, no minimum term.' },
    ],
    casesTitle: 'Automations already running',
    cases: [
      { name: 'OnlineGames.cat', sector: 'Gaming media', summary: 'Automated content pipeline publishing news and reviews at a volume impossible to manage by hand, without the site reading like a content farm.', href: 'https://onlinegames.cat', image: '/images/onlinegames-screenshot.png' },
      { name: 'Racket Breaks', sector: 'Booking platform', summary: 'Automated booking and quote flow for a UK audience: from request to confirmation email with no manual step.', href: 'https://www.racketbreaks.com', image: '/images/racketbreaks-screenshot.png' },
      { name: 'Ágora Sotogrande', sector: 'Restaurant and events', summary: 'Online bookings connected to the venue’s system and event enquiries arriving classified to the team.', href: 'https://agorasotogrande.com', image: '/images/agora-screenshot.png' },
    ],
    faqTitle: 'AI automation: common questions',
    faqs: [
      { q: 'Which processes are worth automating?', a: 'The repetitive ones with clear rules that eat hours every week: email, content, data between systems, reports, first replies to customers. If the same person does a task the same way every time, it is a candidate. Anything that needs judgement stays with a person, and the system prepares it for them.' },
      { q: 'Which tools do you use?', a: 'The ones you already have plus the minimum necessary: AI models (OpenAI, Anthropic, Google), direct API integrations and, where it fits, platforms like Make or n8n. We do not sell you a new tool; we connect yours.' },
      { q: 'What if the AI gets it wrong?', a: 'That is why there is human review wherever a decision matters: a draft is approved before publishing, a doubtful lead is checked by a person. The system logs every correction and uses it to improve. Over time, reviews go down.' },
      { q: 'What about our data?', a: 'It stays in your accounts. Integrations run on your credentials, data is not used to train public models and, where information is sensitive, it is processed on models with those guarantees. It is all written into the proposal.' },
      { q: 'How much does it cost?', a: 'It depends on how many processes, integrations and how much review it needs. Usually a build cost plus a monthly maintenance and improvement fee, always below the cost of the person-hours it replaces. Fixed proposal after the mapping session.' },
      { q: 'Do you work with companies outside the area?', a: 'Yes. Automation is remote work; we are in Sotogrande and meet in person with companies in the Campo de Gibraltar, Gibraltar and the Costa del Sol, but we work with clients across Spain and the UK.' },
    ],
    cta: {
      headline: 'Which task would you like to never do by hand again?',
      sub: 'Describe it in two lines on WhatsApp and we will tell you whether it can be automated, how, and what it would save. No forms.',
      whatsappText: "Hi, I'd like to automate a business process with AI",
      heroLabel: 'Describe the process on WhatsApp',
    },
  },
]
