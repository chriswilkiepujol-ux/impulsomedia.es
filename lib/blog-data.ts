export interface BlogBlock {
  type: 'p' | 'h2' | 'ul' | 'stats'
  text?: string
  items?: string[]
  stats?: { value: string; label: string }[]
}

export interface BlogPost {
  id: string
  category: 'local-seo' | 'case-study' | 'industry'
  categoryLabelEs: string
  categoryLabelEn: string
  slugEs: string
  slugEn: string
  titleEs: string
  titleEn: string
  excerptEs: string
  excerptEn: string
  date: string
  readMinutes: number
  coverImage: string
  /** Optional - for case study posts: a real screenshot of the client site and a link to visit it */
  caseStudy?: {
    screenshot: string
    siteUrl: string
    siteLabel: string
  }
  contentEs: BlogBlock[]
  contentEn: BlogBlock[]
}

export const blogPosts: BlogPost[] = [
  {
    id: 'local-seo-sotogrande',
    category: 'local-seo',
    categoryLabelEs: 'SEO Local',
    categoryLabelEn: 'Local SEO',
    slugEs: 'seo-local-sotogrande-campo-gibraltar',
    slugEn: 'local-seo-sotogrande-campo-gibraltar',
    titleEs: 'Guía de SEO local para negocios en Sotogrande y el Campo de Gibraltar',
    titleEn: 'Local SEO guide for businesses in Sotogrande and Campo de Gibraltar',
    excerptEs: 'Qué funciona realmente para aparecer en Google cuando alguien busca un negocio en Sotogrande, San Roque o Gibraltar. Sin teoría genérica, solo lo que aplicamos con clientes reales.',
    excerptEn: 'What actually works to show up on Google when someone searches for a business in Sotogrande, San Roque or Gibraltar. No generic theory, just what we apply with real clients.',
    date: '2026-10-04',
    readMinutes: 6,
    coverImage: '/images/blog-local-seo-cover.svg',
    contentEs: [
      { type: 'p', text: 'La mayoría de guías de SEO local están escritas para cualquier ciudad del mundo. Aquí hablamos específicamente de Sotogrande, San Roque, Gibraltar y el resto del Campo de Gibraltar, una zona con una mezcla particular de búsquedas en español e inglés, mucho tráfico de residentes extranjeros y negocios que compiten tanto a nivel local como con agencias de Marbella o Málaga.' },
      { type: 'h2', text: 'Empieza por tu ficha de Google Business' },
      { type: 'p', text: 'Antes de tocar nada en la web, revisa tu ficha de Google Business Profile. Es lo primero que ve alguien que busca "veterinario Sotogrande" o "abogado San Roque", y para negocios locales suele importar más que el posicionamiento orgánico de la web.' },
      { type: 'ul', items: [
        'Categoría principal correcta, no la más genérica disponible',
        'Área de servicio bien definida si trabajas en varias localidades',
        'Fotos reales del negocio, no imágenes de stock',
        'Reseñas de clientes reales, pedidas directamente después de cada proyecto o venta',
      ]},
      { type: 'h2', text: 'El bilingüismo no es opcional aquí' },
      { type: 'p', text: 'Una búsqueda en español y la misma búsqueda en inglés no siempre tienen el mismo volumen ni la misma intención. "Diseño web Sotogrande" y "web design Sotogrande" atraen a públicos distintos: el primero suele ser una empresa española local, el segundo con frecuencia un residente extranjero o una empresa con sede en Gibraltar. Si tu web solo existe en un idioma, estás descartando automáticamente la mitad del mercado real de la zona.' },
      { type: 'p', text: 'Esto no significa traducir literalmente. Significa tener páginas separadas e indexables para cada idioma, con palabras clave que reflejen cómo busca de verdad cada público, no una traducción directa de la versión en español.' },
      { type: 'h2', text: 'Las citas locales siguen importando' },
      { type: 'p', text: 'Aparecer de forma consistente en directorios locales, cámaras de comercio y páginas del sector sigue siendo una señal real para Google, especialmente en una zona con menos competencia digital que una gran ciudad. La clave es la consistencia: mismo nombre, misma dirección o zona de servicio, mismo teléfono en todas partes.' },
      { type: 'h2', text: 'Lo que realmente marca la diferencia' },
      { type: 'p', text: 'Por experiencia trabajando con negocios de la zona, lo que más impacto tiene no es un truco técnico puntual, sino la combinación constante de: ficha de Google optimizada, reseñas reales llegando de forma regular, contenido verdaderamente bilingüe y una web que carga rápido y deja claro en segundos qué ofreces y a quién. El SEO local en una zona pequeña como esta recompensa la constancia, no la perfección técnica aislada.' },
    ],
    contentEn: [
      { type: 'p', text: 'Most local SEO guides are written for any city in the world. This one is about Sotogrande, San Roque, Gibraltar and the rest of Campo de Gibraltar specifically, an area with a particular mix of Spanish and English search traffic, a lot of expat residents, and businesses competing both locally and against agencies in Marbella or Málaga.' },
      { type: 'h2', text: 'Start with your Google Business listing' },
      { type: 'p', text: "Before touching anything on your website, check your Google Business Profile. It's the first thing someone sees when they search 'vet Sotogrande' or 'lawyer San Roque', and for local businesses it often matters more than organic website rankings." },
      { type: 'ul', items: [
        'Correct primary category, not the broadest one available',
        'A properly defined service area if you cover multiple towns',
        'Real photos of the business, not stock images',
        'Genuine customer reviews, asked for directly after each project or sale',
      ]},
      { type: 'h2', text: "Bilingual isn't optional here" },
      { type: 'p', text: "A Spanish search and the equivalent English search don't always carry the same volume or intent. 'Diseño web Sotogrande' and 'web design Sotogrande' attract different audiences: the first is usually a local Spanish business, the second is often an expat resident or a Gibraltar-based company. If your site only exists in one language, you're automatically cutting out half the real market in this area." },
      { type: 'p', text: "This doesn't mean literal translation. It means having separate, indexable pages per language, with keywords that reflect how each audience actually searches, not a direct translation of the Spanish version." },
      { type: 'h2', text: 'Local citations still matter' },
      { type: 'p', text: "Showing up consistently in local directories, chambers of commerce and industry pages remains a real signal to Google, especially in an area with less digital competition than a major city. The key is consistency: same name, same address or service area, same phone number everywhere." },
      { type: 'h2', text: 'What actually moves the needle' },
      { type: 'p', text: "From working with businesses in this area, what has the most impact isn't a single technical trick, it's the steady combination of a well-optimised Google listing, genuine reviews coming in regularly, truly bilingual content, and a site that loads fast and makes it clear within seconds what you offer and to whom. Local SEO in a small market like this rewards consistency over isolated technical perfection." },
    ],
  },
  {
    id: 'racket-breaks-case-study',
    category: 'case-study',
    categoryLabelEs: 'Caso de Éxito',
    categoryLabelEn: 'Case Study',
    slugEs: 'caso-racket-breaks-plataforma-reservas-padel',
    slugEn: 'racket-breaks-case-study-padel-booking-platform',
    titleEs: 'Cómo construimos la plataforma de reservas de Racket Breaks',
    titleEn: "Building Racket Breaks' padel booking platform",
    excerptEs: 'Web de ~50 páginas construida en dos semanas para un público británico y europeo. Más de 10 nuevos leads en el primer mes tras el lanzamiento.',
    excerptEn: 'A ~50-page website built in two weeks for a UK and European audience. Over 10 new leads in the first month after launch.',
    date: '2026-10-04',
    readMinutes: 5,
    coverImage: '/images/blog-racket-breaks-cover.svg',
    caseStudy: {
      screenshot: '/images/racketbreaks-screenshot.png',
      siteUrl: 'https://www.racketbreaks.com',
      siteLabel: 'racketbreaks.com',
    },
    contentEs: [
      { type: 'p', text: 'Racket Breaks organiza vacaciones de pádel en el sur de España: Sotogrande, Marbella, Estepona, Málaga y Almería. El negocio ya funcionaba bien por recomendación y contacto directo, pero necesitaban una web que reflejara el nivel del servicio y que permitiera a un cliente del Reino Unido entender en segundos qué estaban comprando.' },
      { type: 'h2', text: 'El problema real' },
      { type: 'p', text: 'Un paquete de vacaciones de pádel tiene muchas variables: destino, duración, alojamiento, pistas, nivel de coaching. La mayoría de webs de este tipo de negocio acaban siendo un catálogo confuso o un simple formulario de contacto sin contexto. Queríamos algo intermedio: suficiente estructura para que el visitante entienda las opciones, sin forzarle a rellenar un formulario largo antes de saber si le interesa.' },
      { type: 'h2', text: 'El enfoque' },
      { type: 'ul', items: [
        'Construcción desde cero, sin plantillas, pensada específicamente para cómo busca y decide un cliente británico unas vacaciones deportivas',
        'Páginas por destino (Sotogrande, Marbella, Estepona, Málaga, Almería) para captar búsquedas específicas de cada zona',
        'Un motor de presupuesto simple como primer paso, en vez de un formulario de contacto genérico',
        'Diseño bilingüe pensado principalmente para el mercado de habla inglesa, con opción en español',
      ]},
      { type: 'h2', text: 'Por qué importaban las páginas de destino' },
      { type: 'p', text: 'Alguien que busca unas vacaciones de pádel en Sotogrande no es necesariamente la misma persona que busca en Estepona. Cada zona atrae a un perfil ligeramente distinto. Tener una página dedicada por destino, en vez de una sola página genérica de "vacaciones de pádel en España", permite que cada una compita por su propia búsqueda específica en Google.' },
      { type: 'h2', text: 'Resultado' },
      { type: 'p', text: 'La web se construyó en dos semanas, con cerca de 50 páginas cubriendo destinos, alojamientos, ofertas y paquetes concretos, no una estructura genérica de cuatro secciones. Se lanzó a tiempo para la temporada 2026 con cobertura completa de los cinco destinos.' },
      { type: 'stats', stats: [
        { value: '2 semanas', label: 'De la construcción al lanzamiento' },
        { value: '~50 páginas', label: 'Destinos, ofertas y paquetes' },
        { value: '10+ leads', label: 'Nuevos clientes en el primer mes' },
      ]},
      { type: 'p', text: 'En el primer mes desde el lanzamiento, la web generó más de 10 nuevos leads de clientes reales, sin necesidad de campañas pagadas adicionales en ese periodo. Seguimos trabajando con Racket Breaks de forma activa, ampliando contenido por destino y afinando el motor de presupuesto según el feedback real de quienes han reservado a través de la web.' },
    ],
    contentEn: [
      { type: 'p', text: 'Racket Breaks organises padel holidays across the south of Spain: Sotogrande, Marbella, Estepona, Málaga and Almería. The business was already running well on referral and direct contact, but needed a website that matched the quality of the service and let a UK client understand what they were buying within seconds.' },
      { type: 'h2', text: 'The real problem' },
      { type: 'p', text: "A padel holiday package has a lot of moving parts: destination, length of stay, accommodation, courts, coaching level. Most websites for this kind of business end up either a confusing catalogue or a bare contact form with no context. We wanted something in between: enough structure for a visitor to understand the options, without forcing a long form before they even know if it's for them." },
      { type: 'h2', text: 'The approach' },
      { type: 'ul', items: [
        'Built from scratch, no templates, designed specifically around how a UK client searches for and decides on a sports holiday',
        'Dedicated pages per destination (Sotogrande, Marbella, Estepona, Málaga, Almería) to capture location-specific searches',
        'A simple quote engine as the first step, instead of a generic contact form',
        'Bilingual design aimed primarily at the English-speaking market, with a Spanish option',
      ]},
      { type: 'h2', text: 'Why the destination pages mattered' },
      { type: 'p', text: "Someone searching for a padel holiday in Sotogrande isn't necessarily the same person searching in Estepona. Each area attracts a slightly different profile. Having a dedicated page per destination, instead of one generic 'padel holidays in Spain' page, lets each one compete for its own specific search on Google." },
      { type: 'h2', text: 'Result' },
      { type: 'p', text: "The site was built in two weeks, with close to 50 pages covering destinations, accommodation, offers and specific packages, not a generic four-section structure. It launched in time for the 2026 season with full coverage across all five destinations." },
      { type: 'stats', stats: [
        { value: '2 weeks', label: 'From build to launch' },
        { value: '~50 pages', label: 'Destinations, offers and packages' },
        { value: '10+ leads', label: 'New clients in the first month' },
      ]},
      { type: 'p', text: 'In the first month after launch, the site generated over 10 new client leads, without needing additional paid campaigns in that period. We continue working with Racket Breaks actively, expanding destination content and refining the quote engine based on real feedback from people booking through the site.' },
    ],
  },
  {
    id: 'igaming-performance-marketing',
    category: 'industry',
    categoryLabelEs: 'Industria',
    categoryLabelEn: 'Industry Insights',
    slugEs: 'experiencia-igaming-marketing-resultados',
    slugEn: 'igaming-experience-performance-marketing',
    titleEs: 'Lo que el iGaming nos enseñó sobre el marketing de resultados',
    titleEn: 'What iGaming taught us about performance marketing',
    excerptEs: 'Años gestionando campañas para operadores de apuestas y casino dejan una forma muy concreta de entender el marketing de resultados. Esto es lo que aplicamos ahora a clientes fuera del sector.',
    excerptEn: 'Years running media buying for betting and casino operators leave a particular way of thinking about performance marketing. Here is what we now apply to clients outside the sector.',
    date: '2026-10-04',
    readMinutes: 5,
    coverImage: '/images/blog-igaming-cover.svg',
    contentEs: [
      { type: 'p', text: 'Antes de fundar ImpulsoMedia, pasamos años gestionando campañas para operadores de iGaming: apuestas deportivas, casino online, afiliación. Es un sector que exige un nivel de exigencia que pocos otros alcanzan, porque cada euro invertido en captar un cliente se compara directamente con lo que ese cliente acaba generando. No hay margen para suposiciones del tipo "esto parece que funciona".' },
      { type: 'h2', text: 'Aquí todo se mide por el coste real de cada cliente' },
      { type: 'p', text: 'En iGaming no existe eso de lanzar una campaña "para dar a conocer la marca" sin métricas claras detrás. Cada canal, cada creatividad, cada público se analiza según cuánto cuesta conseguir un cliente y cuánto genera ese cliente con el tiempo. Aplicamos esa misma exigencia a cualquier cliente, ya sea un restaurante de la zona o una marca con presupuestos mayores: antes de escalar una campaña, hay que saber de verdad cuánto está costando cada resultado.' },
      { type: 'h2', text: 'Trabajar en un sector regulado cambia cómo gestionas el riesgo' },
      { type: 'p', text: 'En un sector regulado aprendes a entender restricciones publicitarias, cumplimiento normativo y gestión del riesgo de cuenta de una forma que la mayoría de agencias nunca llega a necesitar. Esa experiencia se traslada directamente a cualquier cliente que mueva presupuestos grandes en plataformas publicitarias, donde una cuenta mal gestionada se puede perder de un día para otro.' },
      { type: 'h2', text: 'La afiliación y el in-app no son un extra, son un canal más' },
      { type: 'p', text: 'En muchas agencias, afiliación e in-app marketing son algo puntual que se toca de vez en cuando. En iGaming son canales centrales, con su propia lógica, su propio seguimiento y su propia optimización. Por eso podemos ofrecer estos servicios con experiencia real detrás, no como algo que añadimos al catálogo sin haberlo gestionado antes en serio.' },
      { type: 'h2', text: 'Qué significa esto para un cliente fuera del iGaming' },
      { type: 'p', text: 'No se trata de aplicar tácticas de apuestas a un negocio local, nada de eso. Se trata de traer la misma exigencia: medir de verdad, no dar por hecho que algo funciona porque lo parece, y tratar cada euro de presupuesto como algo que tiene que justificar su resultado.' },
    ],
    contentEn: [
      { type: 'p', text: 'Before founding ImpulsoMedia, we spent years running media buying for iGaming operators: sports betting, online casino, affiliate networks. It is an industry that demands a level of performance discipline few others match, because every euro spent on acquisition gets measured against the real value of each customer, not a vague sense that "it seems to be working".' },
      { type: 'h2', text: 'Everything is measured against real acquisition cost' },
      { type: 'p', text: "There's no luxury of brand-awareness campaigns without clear metrics in iGaming. Every channel, every creative, every audience gets evaluated against how much it costs to acquire a customer and how much that customer generates over time. That same discipline is what we apply to any client, whether a local restaurant or a brand managing a larger budget: before scaling a campaign, you need to genuinely know what each result is costing." },
      { type: 'h2', text: 'Regulated-sector experience changes how you manage risk' },
      { type: 'p', text: "Working in a regulated sector forces you to understand advertising restrictions, compliance and account risk management in a way most agencies never need to learn. That experience applies directly to any client managing large budgets on ad platforms, where a poorly managed account can be lost overnight." },
      { type: 'h2', text: "Affiliate and in-app aren't an add-on, they're a full channel" },
      { type: 'p', text: "For many agencies, affiliate and in-app marketing are an occasional extra. In iGaming they're core channels with their own logic, their own tracking and their own optimisation. That background is why we can offer these services with real experience behind them, not as something bolted onto the service list without ever having run them at scale." },
      { type: 'h2', text: 'What this means for a client outside iGaming' },
      { type: 'p', text: "It's not about applying betting-industry tactics to a local business. It's about bringing the same level of rigour: actually measuring, not assuming something works because it seems to, and treating every euro of ad budget as something that has to prove its worth." },
    ],
  },
]

export function getPostBySlug(slug: string, lang: 'es' | 'en'): BlogPost | undefined {
  return blogPosts.find((p) => (lang === 'es' ? p.slugEs : p.slugEn) === slug)
}
