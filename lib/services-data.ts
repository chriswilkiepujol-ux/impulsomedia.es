import { Globe, Smartphone, TrendingUp, Wrench, Package, MessageCircle, Target, Share2, BarChart3, Handshake, Store, Instagram, Megaphone, Briefcase, LucideIcon } from 'lucide-react'

export interface ServiceItem {
  num: string
  icon: LucideIcon
  titleEs: string
  titleEn: string
  descEs: string
  descEn: string
  tagsEs: string[]
  tagsEn: string[]
}

export const services: ServiceItem[] = [
  {
    num: '01',
    icon: Globe,
    titleEs: 'Diseño Web',
    titleEn: 'Web Design',
    descEs: 'Sitios web únicos construidos desde cero. Sin plantillas, sin WordPress. Código limpio y diseño que convierte visitantes en clientes.',
    descEn: 'Unique websites built from scratch. No templates, no WordPress. Clean code and design that converts visitors into clients.',
    tagsEs: ['Diseño UI/UX', 'Desarrollo', 'Responsive', 'SEO técnico'],
    tagsEn: ['UI/UX Design', 'Development', 'Responsive', 'Technical SEO'],
  },
  {
    num: '02',
    icon: TrendingUp,
    titleEs: 'SEO',
    titleEn: 'SEO',
    descEs: 'Posicionamiento local y nacional. Contenido, técnica y estrategia para aparecer donde tus clientes buscan.',
    descEn: 'Local and national search positioning. Content, technical SEO and strategy to show up where your clients search.',
    tagsEs: ['SEO Local', 'Técnico', 'Contenido', 'Google Business'],
    tagsEn: ['Local SEO', 'Technical', 'Content', 'Google Business'],
  },
  {
    num: '03',
    icon: Target,
    titleEs: 'PPC',
    titleEn: 'PPC',
    descEs: 'Campañas de Google Ads gestionadas para convertir, con seguimiento claro de coste por lead y retorno.',
    descEn: 'Google Ads campaigns managed to convert, with clear tracking on cost per lead and return.',
    tagsEs: ['Google Ads', 'Búsqueda', 'Display', 'Remarketing'],
    tagsEn: ['Google Ads', 'Search', 'Display', 'Remarketing'],
  },
  {
    num: '04',
    icon: Share2,
    titleEs: 'Paid Social',
    titleEn: 'Paid Social',
    descEs: 'Campañas pagadas en Meta, TikTok y Snapchat diseñadas para generar demanda y captar clientes.',
    descEn: 'Paid campaigns on Meta, TikTok and Snapchat designed to build demand and capture new clients.',
    tagsEs: ['Meta Ads', 'TikTok', 'Snapchat', 'Creatividades'],
    tagsEn: ['Meta Ads', 'TikTok', 'Snapchat', 'Creative'],
  },
  {
    num: '05',
    icon: BarChart3,
    titleEs: 'Programática',
    titleEn: 'Programmatic',
    descEs: 'Compra de medios a escala para marcas y operadores con presupuestos mayores y objetivos de alcance.',
    descEn: 'Media buying at scale for brands and operators with larger budgets and reach objectives.',
    tagsEs: ['Media Buying', 'DSP', 'Display', 'Video'],
    tagsEn: ['Media Buying', 'DSP', 'Display', 'Video'],
  },
  {
    num: '06',
    icon: Handshake,
    titleEs: 'Afiliación',
    titleEn: 'Affiliate Marketing',
    descEs: 'Gestión y optimización de programas de afiliados, con foco en calidad de tráfico y rendimiento real.',
    descEn: 'Management and optimization of affiliate programs, focused on traffic quality and real performance.',
    tagsEs: ['Gestión de Red', 'Tracking', 'Optimización', 'Reporting'],
    tagsEn: ['Network Management', 'Tracking', 'Optimization', 'Reporting'],
  },
  {
    num: '07',
    icon: Smartphone,
    titleEs: 'In-App Marketing',
    titleEn: 'In-App Marketing',
    descEs: 'Estrategias de adquisición y retención dentro de apps, pensadas para maximizar el valor de cada usuario.',
    descEn: 'Acquisition and retention strategies inside apps, built to maximize the value of every user.',
    tagsEs: ['Adquisición', 'Retención', 'Push', 'Segmentación'],
    tagsEn: ['Acquisition', 'Retention', 'Push', 'Segmentation'],
  },
  {
    num: '08',
    icon: Store,
    titleEs: 'ASO',
    titleEn: 'ASO',
    descEs: 'Optimización en App Store y Google Play para mejorar visibilidad, descargas y conversión.',
    descEn: 'App Store and Google Play optimization to improve visibility, downloads and conversion.',
    tagsEs: ['App Store', 'Google Play', 'Keywords', 'Conversión'],
    tagsEn: ['App Store', 'Google Play', 'Keywords', 'Conversion'],
  },
  {
    num: '09',
    icon: Instagram,
    titleEs: 'Redes Sociales',
    titleEn: 'Social Media',
    descEs: 'Estrategias de contenido y gestión de redes que construyen comunidad y generan engagement real.',
    descEn: 'Content strategies and social management that build community and generate real engagement.',
    tagsEs: ['Estrategia', 'Contenido', 'Community', 'Análisis'],
    tagsEn: ['Strategy', 'Content', 'Community', 'Analytics'],
  },
  {
    num: '10',
    icon: Megaphone,
    titleEs: 'Marketing de Influencers',
    titleEn: 'Influencer Marketing',
    descEs: 'Colaboraciones con creadores de contenido para ampliar alcance y credibilidad de marca.',
    descEn: 'Collaborations with content creators to extend reach and brand credibility.',
    tagsEs: ['Sourcing', 'Gestión', 'Campañas', 'Reporting'],
    tagsEn: ['Sourcing', 'Management', 'Campaigns', 'Reporting'],
  },
  {
    num: '11',
    icon: Wrench,
    titleEs: 'Mantenimiento Web',
    titleEn: 'Web Maintenance',
    descEs: 'Actualizaciones, seguridad, backups y soporte técnico continuo para que tu sitio siempre funcione al máximo.',
    descEn: 'Updates, security, backups and ongoing technical support to keep your site running at peak performance.',
    tagsEs: ['Actualizaciones', 'Seguridad', 'Backups', 'Soporte'],
    tagsEn: ['Updates', 'Security', 'Backups', 'Support'],
  },
  {
    num: '12',
    icon: Briefcase,
    titleEs: 'Consultoría',
    titleEn: 'Consultancy',
    descEs: 'Estrategia y asesoría a medida por proyecto, tarifa diaria o retainer, según lo que tu equipo necesite.',
    descEn: 'Tailored strategy and advisory work, billed by project, day rate or retainer, based on what your team needs.',
    tagsEs: ['Estrategia', 'Auditoría', 'A medida', 'Bajo SOW'],
    tagsEn: ['Strategy', 'Audit', 'Tailored', 'Under SOW'],
  },
]


export default services
