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
  metaTitleEs?: string
  metaTitleEn?: string
  metaDescEs?: string
  metaDescEn?: string
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
    metaTitleEs: 'Guía de SEO local en Sotogrande y Gibraltar',
    metaTitleEn: 'Local SEO guide: Sotogrande & Gibraltar',
    metaDescEs: 'Qué funciona de verdad para aparecer en Google cuando buscan un negocio en Sotogrande, San Roque o Gibraltar. Lo que aplicamos con clientes reales.',
    metaDescEn: 'What actually works to show up on Google when someone searches for a business in Sotogrande, San Roque or Gibraltar. What we apply with real clients.',
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
    metaTitleEs: 'Caso Racket Breaks: reservas de pádel',
    metaTitleEn: 'Racket Breaks case study: padel booking',
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
    metaTitleEs: 'Lo que el iGaming nos enseñó del marketing',
    metaTitleEn: 'What iGaming taught us about marketing',
    metaDescEs: 'Años gestionando media buying para operadores de apuestas y casino dejan una forma concreta de entender el marketing de resultados. Esto es lo que aplicamos.',
    metaDescEn: 'Years of media buying for betting and casino operators leave a particular way of thinking about performance marketing. Here is what we apply now.',
    slugEs: 'experiencia-igaming-marketing-resultados',
    slugEn: 'igaming-experience-performance-marketing',
    titleEs: 'Lo que el iGaming nos enseñó sobre el marketing de resultados',
    titleEn: 'What iGaming taught us about marketing',
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
  {
    id: 'cuanto-cuesta-web-2026',
    category: 'local-seo',
    categoryLabelEs: 'Guía',
    categoryLabelEn: 'Guide',
    metaTitleEs: 'Cuánto cuesta una página web en 2026',
    metaTitleEn: 'How much does a website cost in 2026',
    metaDescEs: 'Lo que cobran freelancers, agencias locales y grandes agencias por una web en la zona, qué incluye cada rango y qué mueve el precio.',
    metaDescEn: 'What freelancers, local agencies and larger agencies charge for a website in the area, what each range includes and what moves the price.',
    slugEs: 'cuanto-cuesta-una-pagina-web-2026',
    slugEn: 'how-much-does-a-website-cost-2026',
    titleEs: 'Cuánto cuesta una página web en 2026: precios reales en Cádiz, Málaga y Gibraltar',
    titleEn: 'How much does a website cost in 2026: real prices in Cádiz, Málaga and Gibraltar',
    excerptEs: 'Lo que cobran de verdad freelancers, agencias locales y agencias grandes por una web en la zona, qué incluye cada rango y qué hace que el precio suba o baje. Sin vender nada: para que sepas si el presupuesto que tienes delante es razonable.',
    excerptEn: 'What freelancers, local agencies and larger agencies really charge for a website in the area, what each range includes and what pushes the price up or down. Not a sales pitch: so you know whether the quote in front of you is reasonable.',
    date: '2026-10-27',
    readMinutes: 7,
    coverImage: '/images/blog-web-cost-cover.svg',
    contentEs: [
      { type: 'p', text: 'Cada semana alguien de Algeciras, Estepona, San Roque o Gibraltar nos manda un presupuesto de otra agencia preguntando si es normal. Casi siempre la respuesta es "depende", pero eso no ayuda. Así que aquí van los rangos reales que se mueven en la zona en 2026, con lo que suele incluir cada uno y las cosas que hacen que un presupuesto suba o baje. No son nuestras tarifas (eso lo explicamos en la [página de precios](/precios)); es lo que vemos en el mercado.' },
      { type: 'h2', text: 'Los cuatro rangos que existen de verdad' },
      { type: 'p', text: 'Simplificando mucho, una web en la provincia de Cádiz, la Costa del Sol o Gibraltar cae en uno de estos cuatro cajones. Los precios son sin IVA y orientativos.' },
      { type: 'stats', stats: [
        { value: '300–800 €', label: 'Plantilla de WordPress o Wix hecha por un freelancer. 3-5 páginas, diseño de tema, fotos de stock. Rápida de entregar, lenta de cargar, difícil de posicionar.' },
        { value: '900–2.500 €', label: 'Web corporativa a medida de una agencia local. 5-10 páginas, diseño propio, móvil, SEO on page, a veces bilingüe. Donde está la mayoría de pymes de la zona.' },
        { value: '2.500–8.000 €', label: 'Web con funcionalidad: reservas, tienda, área privada, varios idiomas, integraciones con CRM. Agencias locales serias o agencias de Málaga y Sevilla.' },
        { value: '8.000 € +', label: 'Plataformas, portales inmobiliarios, webs multi-mercado para operadores o empresas de Gibraltar, con arquitectura, compliance y equipo dedicado.' },
      ]},
      { type: 'h2', text: 'Qué hace subir el precio (y qué no)' },
      { type: 'p', text: 'Lo que más encarece una web no es el diseño bonito, es la funcionalidad y los idiomas. Estas son las variables que de verdad mueven un presupuesto:' },
      { type: 'ul', items: [
        'Número de páginas: cada página con contenido propio es trabajo de redacción, diseño y SEO. De 5 a 15 páginas puede duplicar el precio.',
        'Idiomas: una versión en inglés escrita de verdad (no traducida con un plugin) añade entre un 30 % y un 50 %. En Sotogrande, Estepona o Gibraltar suele ser imprescindible.',
        'Funcionalidad: reservas online, tienda, pagos, área de clientes o calculadoras. Cada una es un módulo con su desarrollo y sus pruebas.',
        'Automatizaciones: formularios que entran en el CRM, avisos por WhatsApp, publicación automática. Ahorran horas cada mes pero hay que montarlas.',
        'Partir de una web existente: migrar contenido y posicionamiento tiene su trabajo, y arreglar una plantilla antigua a veces cuesta más que rehacerla.',
        'Plazo: una web en dos semanas y una en dos meses no cuestan lo mismo.',
      ]},
      { type: 'p', text: 'Lo que no debería encarecerla: el hosting (hoy es gratuito o casi para una web corporativa), el dominio (10-15 € al año) y el "mantenimiento obligatorio". Si un presupuesto incluye una cuota mensual sin la que la web deja de funcionar, pregunta por qué.' },
      { type: 'h2', text: 'Las preguntas que hay que hacer antes de firmar' },
      { type: 'ul', items: [
        '¿La web es mía? Dominio, código y hosting a tu nombre. Si la respuesta es vaga, la web no es tuya.',
        '¿Qué pasa si quiero cambiar de agencia? Con una web a medida bien hecha, te la llevas. Con algunas plantillas y constructores, no.',
        '¿Cuánto tarda en cargar en el móvil? Pide ver una web suya en tu teléfono. Si tarda más de tres segundos, el SEO va a sufrir.',
        '¿Qué incluye el SEO? "SEO incluido" puede significar desde títulos y sitemap hasta nada. Pide que lo concreten.',
        '¿Quién escribe los textos? Si los tienes que escribir tú, el plazo depende de ti. Si los escriben ellos, pregunta en qué idiomas y quién los revisa.',
        '¿El precio es cerrado? Un presupuesto serio dice qué incluye y qué no. Lo que no está escrito se cobra aparte.',
      ]},
      { type: 'h2', text: 'Cómo lo hacemos nosotros' },
      { type: 'p', text: 'No publicamos tarifas fijas porque dos negocios nunca necesitan lo mismo, pero sí explicamos qué determina el precio y damos ejemplos orientativos en nuestra [página de precios](/precios). Tenemos páginas específicas sobre diseño web en [Algeciras](/diseno-web-algeciras), [La Línea](/diseno-web-la-linea), [San Roque y Sotogrande](/diseno-web-san-roque) y [Estepona](/diseno-web-estepona), con cómo trabajamos en cada zona. Y si ya tienes un presupuesto de otra agencia y quieres una segunda opinión, mándanoslo por WhatsApp: te decimos si es razonable, sin compromiso.' },
    ],
    contentEn: [
      { type: 'p', text: 'Every week someone from Algeciras, Estepona, San Roque or Gibraltar sends us another agency’s quote and asks whether it is normal. The honest answer is usually "it depends", which does not help. So here are the real ranges in the area in 2026, what each usually includes and what pushes a quote up or down. These are not our rates (we explain those on the [pricing page](/en/pricing)); this is what we see in the market.' },
      { type: 'h2', text: 'The four price bands that actually exist' },
      { type: 'p', text: 'Simplifying a lot, a website in Cádiz province, the Costa del Sol or Gibraltar falls into one of these four boxes. Prices exclude VAT and are indicative.' },
      { type: 'stats', stats: [
        { value: '€300–800', label: 'WordPress or Wix template by a freelancer. 3-5 pages, theme design, stock photos. Fast to deliver, slow to load, hard to rank.' },
        { value: '€900–2,500', label: 'Custom corporate site by a local agency. 5-10 pages, own design, mobile, on-page SEO, sometimes bilingual. Where most local SMEs sit.' },
        { value: '€2,500–8,000', label: 'Site with functionality: bookings, shop, client area, several languages, CRM integrations. Serious local agencies or Málaga and Seville agencies.' },
        { value: '€8,000 +', label: 'Platforms, property portals, multi-market sites for operators or Gibraltar-based firms, with architecture, compliance and a dedicated team.' },
      ]},
      { type: 'h2', text: 'What pushes the price up (and what should not)' },
      { type: 'p', text: 'What makes a site expensive is not a pretty design, it is functionality and languages. These are the variables that really move a quote:' },
      { type: 'ul', items: [
        'Number of pages: each page with its own content is copywriting, design and SEO work. Going from 5 to 15 pages can double the price.',
        'Languages: a properly written English version (not a plugin translation) adds 30% to 50%. In Sotogrande, Estepona or Gibraltar it is usually essential.',
        'Functionality: online bookings, shop, payments, client area or calculators. Each is a module with its own development and testing.',
        'Automations: forms that feed the CRM, WhatsApp notifications, automatic publishing. They save hours every month but have to be built.',
        'Starting from an existing site: migrating content and rankings is real work, and fixing an old template sometimes costs more than rebuilding.',
        'Timeline: a site in two weeks and a site in two months do not cost the same.',
      ]},
      { type: 'p', text: 'What should not make it expensive: hosting (free or nearly free for a corporate site today), the domain (€10-15 a year) and "compulsory maintenance". If a quote includes a monthly fee without which the site stops working, ask why.' },
      { type: 'h2', text: 'Questions to ask before you sign' },
      { type: 'ul', items: [
        'Do I own the site? Domain, code and hosting in your name. If the answer is vague, the site is not yours.',
        'What happens if I change agency? With a well-built custom site, you take it with you. With some templates and builders, you cannot.',
        'How fast does it load on a phone? Ask to see one of their sites on your phone. Over three seconds and SEO will suffer.',
        'What does "SEO included" mean? It can mean anything from titles and a sitemap to nothing. Ask them to be specific.',
        'Who writes the copy? If you do, the timeline depends on you. If they do, ask in which languages and who reviews it.',
        'Is the price fixed? A serious quote says what is included and what is not. Anything not written down is charged extra.',
      ]},
      { type: 'h2', text: 'How we do it' },
      { type: 'p', text: 'We do not publish fixed rates because no two businesses need the same thing, but we do explain what drives the price and give indicative examples on our [pricing page](/en/pricing). We have dedicated pages on web design in [Sotogrande](/en/web-design-sotogrande) and [Gibraltar](/en/web-design-gibraltar), explaining how we work in each area. And if you already have a quote from another agency and want a second opinion, send it to us on WhatsApp: we will tell you whether it is reasonable, no strings attached.' },
    ],
  },
  {
    id: 'ai-agents-business',
    category: 'industry',
    categoryLabelEs: 'IA y automatización',
    categoryLabelEn: 'AI & automation',
    metaTitleEs: 'Agentes de IA para empresas: guía práctica',
    metaTitleEn: 'AI agents for business: a practical guide',
    metaDescEs: 'Qué es un agente de IA, en qué se diferencia de un chatbot, qué tareas puede hacer en una pyme y cómo empezar sin cambiar de herramientas.',
    metaDescEn: 'What an AI agent is, how it differs from a chatbot, which tasks it can take on in a small business and how to start without changing tools.',
    slugEs: 'agentes-ia-para-empresas',
    slugEn: 'ai-agents-for-business',
    titleEs: 'Agentes de IA para empresas: qué son, qué pueden hacer y cómo empezar',
    titleEn: 'AI agents for business: what they are, what they can do and how to start',
    excerptEs: 'Todo el mundo habla de agentes de IA, pero pocas empresas saben qué pueden hacer por ellas mañana. Qué son, en qué se diferencian de un chatbot, qué tareas encajan y cómo empezar con un proceso pequeño que se note.',
    excerptEn: 'Everyone is talking about AI agents, but few companies know what one could do for them tomorrow. What they are, how they differ from a chatbot, which tasks fit and how to start with one small process that makes a difference.',
    date: '2026-11-11',
    readMinutes: 7,
    coverImage: '/images/blog-ai-agents-cover.svg',
    contentEs: [
      { type: 'p', text: 'En los últimos meses "agente de IA" se ha convertido en la palabra de moda. Lo malo de las modas es que se mezcla todo: chatbots, automatizaciones de toda la vida y promesas de sustituir departamentos enteros. Esta guía va al grano: qué es un agente de IA, qué puede hacer hoy en una empresa pequeña o mediana, dónde no conviene usarlo y cómo empezar sin un proyecto enorme.' },
      { type: 'h2', text: 'Qué es un agente de IA (y qué no es)' },
      { type: 'p', text: 'Un agente de IA es un sistema que recibe un objetivo y trabaja para cumplirlo: consulta la información que necesita, decide qué paso dar después y lo ejecuta en tus herramientas (el correo, el CRM, la web, una hoja de cálculo). Cuando se encuentra algo fuera de lo normal, para y se lo pasa a una persona.' },
      { type: 'p', text: 'Un chatbot, en cambio, responde preguntas dentro de una conversación. Y una automatización clásica sigue siempre el mismo camino fijo: si pasa A, haz B. El agente está en medio: tiene reglas y límites, pero puede leer, interpretar y adaptarse a casos que no son idénticos, que es justo lo que hace una persona con las tareas repetitivas pero no mecánicas.' },
      { type: 'h2', text: 'Tareas en las que un agente encaja bien' },
      { type: 'p', text: 'La pista es sencilla: tareas repetitivas, con un criterio claro, que hoy consumen horas cada semana y que hace siempre la misma persona de la misma manera. Algunos ejemplos habituales:' },
      { type: 'ul', items: [
        'Atención y captación de clientes: leer los mensajes que llegan por la web, el correo o WhatsApp, entender qué piden, responder lo rutinario en el idioma del cliente y avisar al equipo cuando hay una oportunidad real.',
        'Gestión del correo: clasificar, extraer datos (pedidos, facturas, reservas), preparar respuestas y archivar, dejando para una persona solo lo que necesita criterio.',
        'Contenido: preparar borradores de publicaciones, fichas de producto o newsletters a partir de información que ya existe, en el tono de la marca y con revisión antes de publicar.',
        'Informes: recoger datos de varias herramientas (ventas, anuncios, web, reservas) y entregar cada semana un resumen en lenguaje normal con lo que ha cambiado.',
        'Investigación: buscar y ordenar información sobre posibles clientes, proveedores o la competencia, y dejarla lista para decidir.',
      ]},
      { type: 'h2', text: 'Dónde no conviene (todavía)' },
      { type: 'p', text: 'Un agente no debería tomar solo decisiones con consecuencias importantes: aprobar un pago, firmar un presupuesto, responder una reclamación delicada o dar un consejo legal o médico. Ahí su papel es preparar el trabajo para que una persona decida rápido. Tampoco merece la pena para tareas que se hacen una vez al año o que cambian cada vez: el coste de montarlo no compensa.' },
      { type: 'h2', text: 'Cómo empezar sin un proyecto enorme' },
      { type: 'ul', items: [
        'Elige un solo proceso: el que más horas se come y más claro está. Mejor uno pequeño que funcione que cinco a medias.',
        'Apunta cómo se hace hoy: qué entra, qué sale, qué decisiones se toman por el camino y cuánto tiempo lleva. Esa es la base para medir si el agente ahorra algo.',
        'Decide dónde revisa una persona: al principio, conviene revisar casi todo. A medida que el sistema acierta, las revisiones bajan.',
        'Conéctalo a lo que ya usáis: un buen agente trabaja sobre tus herramientas actuales, no te obliga a cambiar de programas.',
        'Pruébalo en paralelo: durante unas semanas el agente trabaja a la vez que el proceso manual, con datos reales, hasta que el resultado es igual o mejor. Entonces se activa.',
      ]},
      { type: 'h2', text: 'Las preguntas que hay que hacer antes de contratar' },
      { type: 'ul', items: [
        '¿Dónde quedan mis datos? Deben quedarse en tus cuentas y no usarse para entrenar modelos públicos.',
        '¿Qué pasa cuando se equivoca? Tiene que haber revisión humana donde importa y un registro de lo que ha hecho.',
        '¿Quién lo mantiene? Las herramientas y los modelos cambian; alguien tiene que vigilarlo y ajustarlo.',
        '¿Cómo se mide? Horas ahorradas, tiempo de respuesta, leads atendidos o errores evitados. Si no se puede medir, no se sabe si funciona.',
      ]},
      { type: 'h2', text: 'Cómo lo hacemos nosotros' },
      { type: 'p', text: 'En ImpulsoMedia diseñamos y mantenemos automatizaciones y agentes de IA para empresas: empezamos con una sesión para entender el proceso, proponemos por escrito qué se automatiza y qué queda en manos de tu equipo, lo construimos sobre tus herramientas y lo vigilamos después. Tienes más detalle en nuestra página de [automatización con IA](/servicios/automatizacion-ia). Si tienes una tarea que te gustaría no volver a hacer a mano, [cuéntanosla](/contacto) y te decimos si se puede automatizar y qué ahorraría.' },
    ],
    contentEn: [
      { type: 'p', text: 'Over the last few months "AI agent" has become the buzzword. The trouble with buzzwords is that everything gets lumped together: chatbots, old-school automations and promises to replace whole departments. This guide cuts through it: what an AI agent is, what it can do today in a small or mid-sized company, where it is not a good idea and how to start without a huge project.' },
      { type: 'h2', text: 'What an AI agent is (and what it is not)' },
      { type: 'p', text: 'An AI agent is a system that gets a goal and works towards it: it looks up the information it needs, decides the next step and carries it out in your tools (email, CRM, website, a spreadsheet). When it hits something out of the ordinary, it stops and hands over to a person.' },
      { type: 'p', text: 'A chatbot, by contrast, answers questions inside a conversation. And a classic automation always follows the same fixed path: if A happens, do B. An agent sits in between: it has rules and limits, but it can read, interpret and adapt to cases that are not identical, which is exactly what a person does with tasks that are repetitive but not mechanical.' },
      { type: 'h2', text: 'Tasks where an agent fits well' },
      { type: 'p', text: 'The rule of thumb is simple: repetitive tasks with clear criteria that eat hours every week and that the same person always does the same way. Some common examples:' },
      { type: 'ul', items: [
        'Customer enquiries and lead handling: reading messages from the website, email or WhatsApp, understanding what people want, answering the routine in the customer\'s language and alerting the team when there is a real opportunity.',
        'Email handling: sorting, extracting data (orders, invoices, bookings), drafting replies and filing, leaving only what needs judgement for a person.',
        'Content: preparing drafts of posts, product sheets or newsletters from information that already exists, in the brand\'s tone and reviewed before publishing.',
        'Reporting: pulling data from several tools (sales, ads, website, bookings) and delivering a weekly plain-language summary of what changed.',
        'Research: finding and organising information about prospects, suppliers or competitors, ready for a decision.',
      ]},
      { type: 'h2', text: 'Where it is not a good idea (yet)' },
      { type: 'p', text: 'An agent should not make decisions with serious consequences on its own: approving a payment, signing off a quote, answering a sensitive complaint or giving legal or medical advice. There its role is to prepare the work so a person can decide quickly. Nor is it worth it for tasks done once a year or that change every time: the cost of building it does not pay back.' },
      { type: 'h2', text: 'How to start without a huge project' },
      { type: 'ul', items: [
        'Pick one process: the one that eats the most hours and is the clearest. One small process that works beats five half-done.',
        'Write down how it is done today: what comes in, what goes out, which decisions are made along the way and how long it takes. That is your baseline to measure whether the agent saves anything.',
        'Decide where a person reviews: at first, review almost everything. As the system gets things right, reviews go down.',
        'Connect it to what you already use: a good agent works on your current tools; it does not force you to switch software.',
        'Run it in parallel: for a few weeks the agent works alongside the manual process, on real data, until the output is as good or better. Then it goes live.',
      ]},
      { type: 'h2', text: 'Questions to ask before you hire anyone' },
      { type: 'ul', items: [
        'Where does my data stay? It should stay in your accounts and not be used to train public models.',
        'What happens when it gets it wrong? There must be human review where it matters and a log of what it did.',
        'Who maintains it? Tools and models change; someone has to monitor and adjust it.',
        'How is it measured? Hours saved, response time, leads handled or errors avoided. If it cannot be measured, you do not know whether it works.',
      ]},
      { type: 'h2', text: 'How we do it' },
      { type: 'p', text: 'At ImpulsoMedia we design and maintain automations and AI agents for businesses: we start with a session to understand the process, put in writing what gets automated and what stays with your team, build it on your tools and monitor it afterwards. There is more detail on our [AI automation](/en/services/ai-automation) page. If there is a task you would rather never do by hand again, [tell us about it](/en/contact) and we will tell you whether it can be automated and what it would save.' },
    ],
  },
]

export function getPostBySlug(slug: string, lang: 'es' | 'en'): BlogPost | undefined {
  return blogPosts.find((p) => (lang === 'es' ? p.slugEs : p.slugEn) === slug)
}
