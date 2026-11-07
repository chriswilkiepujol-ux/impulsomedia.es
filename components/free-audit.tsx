"use client"

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { LanguageProvider } from '@/lib/language-context'
import { HeaderV2 as Header } from '@/components/v2/header'
import { FooterV2 as Footer } from '@/components/v2/sections'
import { PageHero, SectionHead } from '@/components/v2/page'
import { Reveal } from '@/components/v2/shared'
import { FaqAccordion } from '@/components/faq-accordion'
import { WhatsAppButton } from '@/components/whatsapp-button'
import type { Result, Card } from '@/lib/free-audit'

type Lang = 'es' | 'en'
type Status = 'idle' | 'submitting' | 'running' | 'done' | 'failed'
const WA = 'https://wa.me/34680863229'
const track = (name: string, p: Record<string, any> = {}) => { try { (window as any).gtag?.('event', name, p) } catch {} }

const ROLE = { es: [['owner', 'Propietario/a o fundador/a'], ['director', 'Director/a o gerente'], ['marketing', 'Marketing'], ['other', 'Otro']], en: [['owner', 'Owner or founder'], ['director', 'Director or manager'], ['marketing', 'Marketing'], ['other', 'Other']] }
const STEPS = { es: ['Cargando la portada', 'Leyendo la web como un visitante nuevo', 'Revisando las páginas principales', 'Midiendo la velocidad en móvil', 'Buscando etiquetas de medición y anuncios', 'Preparando el informe'], en: ['Loading the homepage', 'Reading the site as a new visitor', 'Checking the main pages', 'Measuring mobile speed', 'Looking for tracking and ad tags', 'Preparing the report'] }
const ERR: Record<string, [string, string]> = {
  url_invalid: ['Esa dirección no parece una web pública. Prueba con algo como “minegocio.com”.', 'That does not look like a public website. Try something like “mybusiness.com”.'],
  url_empty: ['Escribe la dirección de tu web.', 'Enter your website address.'],
  email: ['Revisa el email.', 'Check the email address.'], name: ['Dinos tu nombre.', 'Tell us your name.'], consent: ['Necesitamos tu permiso para enviarte el resultado.', 'We need your permission to send you the result.'],
  rate: ['Has pedido varias revisiones seguidas. Espera un rato y vuelve a intentarlo.', 'You have requested several reviews in a row. Wait a while and try again.'],
  busy: ['Hoy hemos llegado al límite de revisiones. Vuelve mañana o escríbenos por WhatsApp.', 'We have hit today’s limit. Come back tomorrow or message us on WhatsApp.'],
  captcha: ['No hemos podido confirmar que eres una persona. Recarga la página e inténtalo de nuevo.', 'We could not confirm you are a person. Reload the page and try again.'],
  unreachable: ['No hemos podido cargar la web: no responde o el dominio no existe. Comprueba la dirección.', 'We could not load the site: it does not respond or the domain does not exist. Check the address.'],
  blocked: ['La web bloquea las visitas automáticas, así que no podemos leerla desde aquí. Si quieres, la revisamos a mano.', 'The site blocks automated visits, so we cannot read it from here. If you like, we will review it by hand.'],
  timeout: ['La web tardó demasiado en responder. Eso ya dice algo: escríbenos y la miramos a mano.', 'The site took too long to respond. That already says something: message us and we will look by hand.'],
}

function Ring({ v, size = 132 }: { v: number | null; size?: number }) {
  const r = (size - 14) / 2, c = 2 * Math.PI * r, p = v == null ? 0 : v / 100
  const col = v == null ? '#7a7f87' : v >= 75 ? '#1f9d55' : v >= 50 ? '#c9a04a' : '#dc2626'
  return <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${v ?? '—'} / 100`}>
    <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e6e2da" strokeWidth="10" />
    <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={col} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${c * p} ${c}`} transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ transition: 'stroke-dasharray 1s ease' }} />
    <text x="50%" y="50%" textAnchor="middle" dy=".12em" fontFamily="var(--display)" fontWeight="800" fontSize={size * 0.3} fill="#111418">{v ?? '—'}</text>
    <text x="50%" y={size * 0.72} textAnchor="middle" fontFamily="var(--mono)" fontSize="11" fill="#7a7f87">/ 100</text>
  </svg>
}
const Pill = ({ v }: { v: number | null }) => <span className="fa-pill" style={{ background: v == null ? '#eee' : v >= 75 ? '#e6f4ec' : v >= 50 ? '#f7efd9' : '#fde8e8', color: v == null ? '#7a7f87' : v >= 75 ? '#1f9d55' : v >= 50 ? '#8a6a1e' : '#b91c1c' }}>{v ?? '—'}</span>

function CardView({ c, t, extra = [] }: { c: Card; t: (a: string, b: string) => string; extra?: { ok: boolean | null; text: string }[] }) {
  return <Reveal className="fa-card" as="article">
    <div className="fa-ch"><h3>{c.title}</h3><Pill v={c.score} /></div>
    <p className="fa-sum">{c.summary}</p>
    <ul className="fa-f">{[...c.findings, ...extra].map((f, i) => <li key={i} className={f.ok === true ? 'ok' : f.ok === false ? 'no' : 'nt'}>{f.text}</li>)}</ul>
    <div className="fa-act"><b>{t('Qué hacer', 'What to do')}</b>{c.action}</div>
  </Reveal>
}

export function FreeAudit({ lang }: { lang: Lang }) {
  const t = (es: string, en: string) => (lang === 'es' ? es : en)
  const [status, setStatus] = useState<Status>('idle'); const [id, setId] = useState<string | null>(null)
  const [f, setF] = useState({ url: '', name: '', email: '', role: 'owner', consent: false, company_website: '', ads: '' })
  const [err, setErr] = useState<string | null>(null); const [res, setRes] = useState<Result | null>(null); const [host, setHost] = useState('')
  const [step, setStep] = useState(0); const [ans, setAns] = useState<any>({ maintainer: '', cost: '', agency_name: '', ads: '', frustration: '' }); const [ansSent, setAnsSent] = useState(false)
  const [copied, setCopied] = useState(false); const [savedAns, setSavedAns] = useState<any>({}); const [gated, setGated] = useState(false); const [hint, setHint] = useState(''); const key = useRef('')
  const utm = useRef<Record<string, string>>({})
  const otherLang = lang === 'es' ? '/en/free-website-audit' : '/auditoria-web-gratis'

  useEffect(() => {
    const q = new URLSearchParams(location.search)
    for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'ref']) { const v = q.get(k); if (v) utm.current[k] = v }
    try { const s = sessionStorage.getItem('fa-utm'); if (s && !Object.keys(utm.current).length) utm.current = JSON.parse(s); else if (Object.keys(utm.current).length) sessionStorage.setItem('fa-utm', JSON.stringify(utm.current)) } catch {}
    key.current = q.get('k') || ''
    const rid = q.get('id'); if (rid) { setId(rid); setStatus('running'); track('free_audit_view', { lang }) } else track('free_audit_land', { lang })
  }, [lang])

  // Poll while the audit runs; the steps animate on a timer so the wait feels shorter than it is.
  useEffect(() => {
    if (status !== 'running' || !id) return
    let alive = true; let n = 0
    const tick = async () => {
      try {
        const r = await fetch(`/api/free-audit?id=${id}${key.current ? `&k=${key.current}` : ''}`, { cache: 'no-store' }); const j = await r.json()
        if (!alive) return
        if (j.host) setHost(j.host); if (j.answers) setSavedAns(j.answers)
        if (j.status === 'done' && j.result) { setRes(j.result); setGated(!!j.gated); setHint(j.email_hint || ''); setStatus('done'); track('free_audit_done', { score: j.result.overall, lang }); return }
        if (j.status === 'failed' || j.error === 'not_found') { setErr(j.error || 'timeout'); setStatus('failed'); track('free_audit_failed', { reason: j.error }); return }
      } catch {}
      n++; setStep(Math.min(STEPS[lang].length - 1, Math.floor(n / 2)))
      if (alive) setTimeout(tick, 2500)
    }
    tick(); return () => { alive = false }
  }, [status, id, lang])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(null)
    if (!f.consent) { setErr('consent'); return }
    setStatus('submitting'); track('free_audit_submit', { role: f.role, lang })
    try {
      const r = await fetch('/api/free-audit', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...f, lang, utm: utm.current, answers: f.ads ? { ads: f.ads } : {} }) })
      const j = await r.json()
      if (!r.ok || !j.id) { setErr(j.error || 'db'); setStatus('idle'); return }
      setId(j.id); setStep(0); setStatus('running')
      history.replaceState(null, '', `?id=${j.id}`)
    } catch { setErr('db'); setStatus('idle') }
  }
  const sendAns = async () => {
    if (!id) return
    const a: any = {}; for (const k of Object.keys(ans)) if (ans[k]) a[k] = ans[k]
    if (!Object.keys(a).length) return
    setAnsSent(true); track('free_audit_answers', { keys: Object.keys(a).join(',') })
    try { await fetch('/api/free-audit', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action: 'answers', id, answers: a }) }) } catch {}
  }
  const waText = encodeURIComponent(t(`Hola Chris, he hecho la revisión gratis de ${host || 'mi web'}${res?.overall != null ? ` (${res.overall}/100)` : ''} y me gustaría comentarla.`, `Hi Chris, I ran the free review of ${host || 'my site'}${res?.overall != null ? ` (${res.overall}/100)` : ''} and would like to go through it.`))
  // The "are you running ads?" answer arrives after the audit started, so the comparison is drawn here.
  const adsAns = savedAns.ads || ans.ads
  const adsCheck: { ok: boolean | null; text: string }[] = !res || !adsAns || adsAns === 'unsure' ? [] : [
    ...(adsAns === 'google' || adsAns === 'both' ? [{ ok: res.tags.google_ads_conversion, text: res.tags.google_ads_conversion ? t('Dices que anuncias en Google y la medición de conversiones está en su sitio.', 'You say you advertise on Google and conversion tracking is in place.') : res.tags.google_ads ? t('Dices que anuncias en Google: hay etiqueta, pero no vemos conversiones. Estás pagando sin saber qué anuncio trae clientes.', 'You say you advertise on Google: the tag is there, but no conversions. You are paying without knowing which ad brings customers.') : t('Dices que anuncias en Google, pero la web no tiene la etiqueta de Google Ads: las campañas no pueden medir nada.', 'You say you advertise on Google, but the site has no Google Ads tag: the campaigns cannot measure anything.') }] : []),
    ...(adsAns === 'meta' || adsAns === 'both' ? [{ ok: res.tags.meta_events, text: res.tags.meta_events ? t('Dices que anuncias en Meta y los eventos de contacto están configurados.', 'You say you advertise on Meta and the contact events are set up.') : res.tags.meta ? t('Dices que anuncias en Meta: hay píxel, pero sin eventos de contacto el algoritmo no aprende quién te escribe.', 'You say you advertise on Meta: the pixel is there, but without contact events the algorithm cannot learn who contacts you.') : t('Dices que anuncias en Meta, pero la web no tiene el píxel: Facebook e Instagram no saben qué pasa después del clic.', 'You say you advertise on Meta, but the site has no pixel: Facebook and Instagram cannot see what happens after the click.') }] : []),
    ...(adsAns === 'no' && (res.tags.google_ads || res.tags.meta) ? [{ ok: null, text: t('Dices que no anuncias, pero la web tiene etiquetas de anuncios: o anunciaste antes o alguien las dejó. No pasa nada, pero conviene saberlo.', 'You say you do not advertise, but the site has ad tags: either you did before or someone left them. Harmless, but worth knowing.') }] : []),
  ]
  const offerClick = (which: string) => track('free_audit_offer_click', { which, lang })

  const chips = (key: string, opts: [string, string][]) => <div className="fa-chips">{opts.map(([v, l]) => <button key={v} type="button" className={ans[key] === v ? 'on' : ''} onClick={() => setAns({ ...ans, [key]: ans[key] === v ? '' : v })}>{l}</button>)}</div>

  const formCard = (
    <form className="fa-form" onSubmit={submit} noValidate>
      <div className="fa-ft">{t('Revisión gratis en 1 minuto', 'Free review in 1 minute')}</div>
      <label><span>{t('Tu web', 'Your website')}</span><input inputMode="url" autoComplete="url" placeholder="minegocio.com" value={f.url} onChange={e => setF({ ...f, url: e.target.value })} onFocus={() => track('free_audit_start', { lang })} required /></label>
      <div className="fa-2">
        <label><span>{t('Tu nombre', 'Your name')}</span><input autoComplete="given-name" placeholder={t('María', 'Maria')} value={f.name} onChange={e => setF({ ...f, name: e.target.value })} required /></label>
        <label><span>{t('Email de trabajo', 'Work email')}</span><input type="email" autoComplete="email" placeholder="maria@minegocio.com" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} required /></label>
      </div>
      <label><span>{t('Tu puesto', 'Your role')}</span><select value={f.role} onChange={e => setF({ ...f, role: e.target.value })}>{ROLE[lang].map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
      <label className="fa-hp" aria-hidden="true"><span>Company website</span><input tabIndex={-1} autoComplete="off" value={f.company_website} onChange={e => setF({ ...f, company_website: e.target.value })} /></label>
      <label className="fa-chk"><input type="checkbox" checked={f.consent} onChange={e => setF({ ...f, consent: e.target.checked })} /><span>{t('Acepto que ImpulsoMedia guarde estos datos para enviarme el resultado y contactarme sobre él. ', 'I agree that ImpulsoMedia stores these details to send me the result and contact me about it. ')}<a href={lang === 'es' ? '/privacidad' : '/en/privacy'} target="_blank" rel="noreferrer">{t('Política de privacidad', 'Privacy policy')}</a></span></label>
      {err && <div className="fa-err">{ERR[err]?.[lang === 'es' ? 0 : 1] || t('Algo ha fallado. Inténtalo de nuevo o escríbenos por WhatsApp.', 'Something went wrong. Try again or message us on WhatsApp.')}</div>}
      <button className="btn gold" type="submit" disabled={status === 'submitting'}>{status === 'submitting' ? t('Enviando…', 'Sending…') : t('Analizar mi web', 'Review my website')} <span className="arr" style={{ background: '#fff' }}>→</span></button>
      <div className="fa-note">{t('Gratis · sin instalar nada · resultado en pantalla y por email', 'Free · nothing to install · result on screen and by email')}</div>
    </form>
  )

  const runningCard = (
    <div className="fa-form fa-run">
      <div className="fa-ft">{t(`Analizando ${host || 'tu web'}…`, `Reviewing ${host || 'your site'}…`)}</div>
      <ol className="fa-steps">{STEPS[lang].map((s, i) => <li key={s} className={i < step ? 'done' : i === step ? 'now' : ''}>{s}</li>)}</ol>
      {!ansSent ? <div className="fa-q">
        <b>{t('Mientras tanto, para afinar el resultado (opcional):', 'Meanwhile, to sharpen the result (optional):')}</b>
        <p>{t('¿Quién se ocupa de la web hoy?', 'Who looks after the site today?')}</p>
        {chips('maintainer', lang === 'es' ? [['me', 'Yo'], ['team', 'Alguien del equipo'], ['freelancer', 'Un freelance'], ['agency', 'Una agencia'], ['nobody', 'Nadie']] : [['me', 'Me'], ['team', 'Someone on the team'], ['freelancer', 'A freelancer'], ['agency', 'An agency'], ['nobody', 'Nobody']])}
        {(ans.maintainer === 'agency' || ans.maintainer === 'freelancer') && <>
          <p>{t('¿Cuánto te cuesta la web al año, todo incluido (hosting, mantenimiento, agencia)?', 'Roughly what does the site cost you a year, all in (hosting, maintenance, agency)?')}</p>
          {chips('cost', lang === 'es' ? [['lt500', 'Menos de 500 €'], ['500-2k', '500–2.000 €'], ['2-5k', '2.000–5.000 €'], ['gt5k', 'Más de 5.000 €'], ['unsure', 'No lo sé']] : [['lt500', 'Under €500'], ['500-2k', '€500–2,000'], ['2-5k', '€2,000–5,000'], ['gt5k', 'Over €5,000'], ['unsure', 'Not sure']])}
          <input className="fa-in" placeholder={t('¿Quién? (opcional)', 'Who? (optional)')} value={ans.agency_name} onChange={e => setAns({ ...ans, agency_name: e.target.value })} />
        </>}
        <p>{t('¿Estás haciendo anuncios ahora mismo?', 'Are you running ads right now?')}</p>
        {chips('ads', lang === 'es' ? [['google', 'Google'], ['meta', 'Facebook / Instagram'], ['both', 'Los dos'], ['no', 'No'], ['unsure', 'No lo sé']] : [['google', 'Google'], ['meta', 'Facebook / Instagram'], ['both', 'Both'], ['no', 'No'], ['unsure', 'Not sure']])}
        <p>{t('¿Qué es lo que más te frustra de tu web?', 'What frustrates you most about your site?')}</p>
        <input className="fa-in" placeholder={t('Por ejemplo: no me llama nadie desde la web', 'For example: nobody calls from the website')} value={ans.frustration} onChange={e => setAns({ ...ans, frustration: e.target.value })} maxLength={300} />
        <button type="button" className="btn ghost" onClick={sendAns}>{t('Guardar respuestas', 'Save answers')}</button>
      </div> : <div className="fa-q"><b>{t('Gracias. Lo tendremos en cuenta en el resultado y si hablamos.', 'Thanks. We will take it into account in the result and if we talk.')}</b></div>}
    </div>
  )

  const failedCard = (
    <div className="fa-form">
      <div className="fa-ft">{t('No hemos podido completar la revisión', 'We could not complete the review')}</div>
      <p className="fa-sum">{ERR[err || '']?.[lang === 'es' ? 0 : 1] || t('Ha fallado algo por nuestra parte. Escríbenos y la hacemos a mano.', 'Something failed on our side. Message us and we will do it by hand.')}</p>
      <a className="btn wa" href={`${WA}?text=${waText}`} target="_blank" rel="noreferrer" onClick={() => offerClick('manual')}>{t('Pedir revisión manual por WhatsApp', 'Ask for a manual review on WhatsApp')}</a>
      <button type="button" className="btn ghost" style={{ marginTop: 10 }} onClick={() => { setStatus('idle'); setErr(null); history.replaceState(null, '', location.pathname) }}>{t('Probar con otra dirección', 'Try another address')}</button>
    </div>
  )

  const faq = lang === 'es' ? [
    { q: '¿Qué revisa exactamente?', a: 'La portada y hasta seis páginas internas de tu web: cómo la entiende un visitante nuevo, si hay formas claras de contactar, la velocidad en móvil, el SEO técnico básico (títulos, descripciones, encabezados, móvil, datos estructurados), las etiquetas de medición y anuncios que tiene instaladas y si el código muestra signos de web anticuada.' },
    { q: '¿Qué no revisa?', a: 'No mide tu tráfico, tus posiciones en Google ni tus campañas: para eso hace falta acceso a tus cuentas. Tampoco sustituye a una auditoría hecha por una persona, que mira el diseño, los textos, la competencia y la estrategia. Esta es la versión corta, para saber por dónde empezar.' },
    { q: '¿Cuánto tarda?', a: 'Normalmente entre 30 y 60 segundos. Si tu web es muy lenta puede tardar algo más, y eso ya es un dato.' },
    { q: '¿Qué hacéis con mis datos?', a: 'Te enviamos el resultado por email y guardamos tu petición para poder contactarte sobre ella. No vendemos ni compartimos tus datos. Si no quieres que te escribamos, responde “baja” al correo.' },
    { q: '¿Por qué es gratis?', a: 'Porque es la mejor forma de que nos conozcas. Si la revisión te sirve y quieres ir más allá, ofrecemos auditorías completas de web y de cuentas de anuncios. Si no, te quedas con una lista de mejoras que puedes hacer con quien quieras.' },
  ] : [
    { q: 'What exactly does it check?', a: 'Your homepage and up to six internal pages: how a new visitor understands it, whether there are clear ways to get in touch, mobile speed, basic technical SEO (titles, descriptions, headings, mobile set-up, structured data), the tracking and ad tags installed, and whether the code shows signs of an outdated site.' },
    { q: 'What does it not check?', a: 'It does not measure your traffic, your Google rankings or your campaigns: that needs access to your accounts. Nor does it replace an audit done by a person, who looks at design, copy, competitors and strategy. This is the short version, to know where to start.' },
    { q: 'How long does it take?', a: 'Usually 30 to 60 seconds. If your site is very slow it can take longer, and that is already a finding.' },
    { q: 'What do you do with my details?', a: 'We email you the result and keep your request so we can contact you about it. We never sell or share your data. If you would rather we did not write, reply “unsubscribe” to the email.' },
    { q: 'Why is it free?', a: 'Because it is the best way for you to get to know us. If the review is useful and you want to go further, we offer full website audits and ad-account audits. If not, you keep a list of improvements you can make with whoever you like.' },
  ]

  const offers = (
    <section className="section" id="auditorias">
      <div className="wrap">
        <SectionHead eyebrow={t('Si quieres ir más allá', 'If you want to go further')} title={t('Esta es la versión corta. La completa la hace una persona.', 'This is the short version. The full one is done by a person.')} lead={t('Dos auditorías separadas, cada una con un informe por escrito y una llamada para explicarlo. Sin permanencia ni letra pequeña.', 'Two separate audits, each with a written report and a call to walk you through it. No tie-in, no small print.')} />
        <div className="tiles c3" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <Reveal className="tile hov" as="article">
            <h3>{t('Auditoría web completa', 'Full website audit')}</h3>
            <p>{t('Diseño y textos página a página, velocidad real, SEO técnico y de contenido, comparación con tus competidores de la zona y una lista priorizada de cambios con su impacto esperado.', 'Design and copy page by page, real speed, technical and content SEO, a comparison with your local competitors and a prioritised list of changes with their expected impact.')}</p>
            <a className="btn" href={`${WA}?text=${encodeURIComponent(t(`Hola Chris, me interesa la auditoría web completa de ${host || 'mi web'}.`, `Hi Chris, I'm interested in the full website audit of ${host || 'my site'}.`))}`} target="_blank" rel="noreferrer" onClick={() => offerClick('web')}>{t('Pedir por WhatsApp', 'Ask on WhatsApp')} <span className="arr">→</span></a>
          </Reveal>
          <Reveal className="tile hov" as="article">
            <h3>{t('Auditoría de cuentas de anuncios', 'Ad-account audit')}</h3>
            <p>{t('Google Ads y Meta: estructura, palabras clave negativas, medición de conversiones, páginas de destino y dónde se va el presupuesto. Te decimos qué ahorrarías y qué dejarías de perder.', 'Google Ads and Meta: structure, negative keywords, conversion tracking, landing pages and where the budget leaks. We tell you what you would save and what you would stop losing.')}</p>
            <a className="btn" href={`${WA}?text=${encodeURIComponent(t('Hola Chris, me interesa la auditoría de mis cuentas de anuncios.', "Hi Chris, I'm interested in the ad-account audit."))}`} target="_blank" rel="noreferrer" onClick={() => offerClick('ads')}>{t('Pedir por WhatsApp', 'Ask on WhatsApp')} <span className="arr">→</span></a>
          </Reveal>
        </div>
      </div>
    </section>
  )

  return (
    <LanguageProvider initialLanguage={lang}>
      <div className="min-h-screen bg-[#ffffff]">
        <Header />
        <main>
          {status !== 'done' ? (
            <PageHero
              eyebrow={t('Auditoría web gratis · Sotogrande · Campo de Gibraltar', 'Free website review · Sotogrande · Campo de Gibraltar')}
              title={lang === 'es' ? <>¿Tu web te trae clientes<br />o los <em>espanta</em>?</> : <>Does your website win customers<br />or <em>lose</em> them?</>}
              sub={t('Pon tu dirección y en un minuto te decimos cómo la ve un cliente nuevo, si Google la entiende, si carga rápido en el móvil y si estás midiendo algo. Sin instalar nada y sin tecnicismos.', 'Enter your address and in a minute we tell you how a new customer sees it, whether Google understands it, whether it loads fast on a phone and whether you are measuring anything. Nothing to install, no jargon.')}
              note={t('Revisión corta y automática. Las auditorías completas de web y de cuentas de anuncios se piden aparte.', 'Short, automated review. Full website and ad-account audits are requested separately.')}
              aside={status === 'running' || status === 'submitting' ? (status === 'running' ? runningCard : formCard) : status === 'failed' ? failedCard : formCard}
              asideFirstOnMobile
            />
          ) : res && (
            <header className="phero fa-res">
              <div className="gridlines" aria-hidden="true" />
              <div className="wrap">
                <div className="txt">
                  <div className="eyebrow rise">{t('Resultado de la revisión', 'Review result')} · {host}</div>
                  <div className="fa-score rise d1"><Ring v={res.overall} /><div>
                    <h1 style={{ fontSize: 'clamp(28px,3.4vw,44px)', marginTop: 0 }}>{res.overall == null ? t('Sin puntuación global', 'No overall score') : res.overall >= 75 ? t('Buena base. Hay detalles que marcan la diferencia.', 'Good base. Some details make the difference.') : res.overall >= 50 ? t('Funciona, pero pierde clientes por el camino.', 'It works, but loses customers along the way.') : t('Tu web te está costando clientes.', 'Your website is costing you customers.')}</h1>
                    <p className="sub">{res.cards.filter(c => c.score != null && c.score < 60).slice(0, 2).map(c => c.summary).join(' ') || t('Las seis áreas están en buen estado. Abajo tienes el detalle y qué pulir.', 'All six areas are in good shape. The detail and what to polish is below.')}</p>
                  </div></div>
                  <div className="actions rise d2">
                    <a className="btn wa" href={`${WA}?text=${waText}`} target="_blank" rel="noreferrer" onClick={() => offerClick('talk')}>{t('Comentarlo con Chris', 'Go through it with Chris')} <span className="arr">→</span></a>
                    <a className="btn ghost" href="#auditorias" onClick={() => offerClick('scroll')}>{t('Ver auditorías completas', 'See full audits')}</a>
                  </div>
                  <div className="fa-facts rise d3">
                    {res.facts.platform && <span><small>{t('Plataforma', 'Platform')}</small>{res.facts.platform}</span>}
                    {res.facts.first_year && <span><small>{t('Online desde', 'Online since')}</small>{res.facts.first_year}</span>}
                    <span><small>{t('Páginas revisadas', 'Pages checked')}</small>{res.facts.pages_checked}</span>
                    {res.psi?.lcp_ms != null ? <span><small>{t('Carga móvil', 'Mobile load')}</small>{(res.psi.lcp_ms / 1000).toFixed(1)} s</span> : res.facts.load_ms != null && <span><small>{t('Respuesta', 'Response')}</small>{(res.facts.load_ms / 1000).toFixed(1)} s</span>}
                    <span><small>HTTPS</small>{res.facts.https ? '✓' : '✗'}</span>
                  </div>
                </div>
                <div className="aside rise d4">
                  {res.psi?.screenshot ? <div className="fa-shot"><img src={res.psi.screenshot} alt={t(`Captura de ${host} en móvil`, `Screenshot of ${host} on mobile`)} /></div>
                    : <div className="fa-mini">{res.cards.map(c => <div key={c.key}><span>{c.title}</span><Pill v={c.score} /></div>)}</div>}
                </div>
              </div>
            </header>
          )}

          {status === 'done' && res && <>
            <section className="section" style={{ paddingTop: 40 }}>
              <div className="wrap">
                {gated ? <Reveal className="fa-gate">
                  <h3>{t('El informe completo está en tu email', 'The full report is in your email')}</h3>
                  <p>{t(`Te lo hemos enviado a ${hint || 'tu dirección'}. Abre el enlace del correo para ver qué falla en cada apartado, por qué y qué hacer. Así nos aseguramos de que el informe llega a quien lo ha pedido.`, `We sent it to ${hint || 'your address'}. Open the link in the email to see what fails in each area, why, and what to do. This is how we make sure the report reaches the person who asked for it.`)}</p>
                  <p className="note">{t('¿No lo ves? Mira en spam o promociones. Si sigue sin llegar, escríbenos por WhatsApp.', 'Can’t see it? Check spam or promotions. If it still has not arrived, message us on WhatsApp.')}</p>
                  <div className="fa-grid fa-blur" aria-hidden="true">{res.cards.map(c => <div key={c.key} className="fa-card"><div className="fa-ch"><h3>{c.title}</h3><Pill v={c.score} /></div><p className="fa-sum">{c.summary}</p></div>)}</div>
                </Reveal> : <div className="fa-grid">{res.cards.map(c => <CardView key={c.key} c={c} t={t} extra={c.key === 'tracking' ? adsCheck : []} />)}</div>}
                {res.ai?.quick_wins?.length ? <Reveal className="fa-wins"><h3>{t('Tres cambios rápidos', 'Three quick changes')}</h3><ol>{res.ai.quick_wins.map((w, i) => <li key={i}>{w}</li>)}</ol></Reveal> : null}
                {(savedAns.ads || savedAns.maintainer) && <p className="note">{t('Hemos tenido en cuenta tus respuestas al preparar el apartado de medición.', 'Your answers were taken into account in the tracking section.')}</p>}
                {!gated && <div className="fa-limits">
                  <b>{t('Lo que esta revisión no ve', 'What this review does not see')}</b>
                  <p>{t('Tráfico, posiciones en Google, resultados de campañas, diseño visual y textos página a página. Para eso está la auditoría completa.', 'Traffic, Google rankings, campaign results, visual design and copy page by page. That is what the full audit is for.')}{res.limits.length ? ' ' + res.limits.join(' ') : ''}</p>
                  <div className="fa-share"><span>{t('Enlace a este resultado:', 'Link to this result:')}</span><code>{typeof location !== 'undefined' ? location.href : ''}</code><button type="button" className="btn ghost" onClick={() => { navigator.clipboard?.writeText(location.href); setCopied(true); track('free_audit_share') }}>{copied ? t('Copiado', 'Copied') : t('Copiar', 'Copy')}</button></div>
                </div>}
              </div>
            </section>
            {offers}
          </>}

          {status !== 'done' && <>
            <section className="section" style={{ background: 'var(--paper2)' }}>
              <div className="wrap">
                <SectionHead eyebrow={t('Qué revisamos', 'What we check')} title={t('Seis cosas que decide un cliente en diez segundos', 'Six things a customer decides in ten seconds')} lead={t('No es una lista de errores técnicos. Es lo que hace que alguien te llame o cierre la pestaña.', 'Not a list of technical errors. It is what makes someone call you or close the tab.')} />
                <div className="tiles c3">
                  {(lang === 'es' ? [['Primera impresión', '¿Se entiende en segundos qué haces, dónde y para quién? Lo leemos como lo leería alguien que no te conoce.'], ['Llamadas a la acción', 'Teléfono tocable, WhatsApp, formulario. Si contactar cuesta, el cliente se va al siguiente.'], ['Velocidad', 'Cuánto tarda en aparecer el contenido en un móvil normal. Cada segundo de más se nota en las llamadas.'], ['SEO técnico', 'Títulos, descripciones, encabezados, móvil y datos estructurados en tus páginas principales, no solo en la portada.'], ['Medición y anuncios', 'Qué etiquetas tienes instaladas, si miden conversiones y si lo que dices que haces coincide con lo que vemos.'], ['¿Está anticuada?', 'Año del pie de página, antigüedad del dominio, tecnología y código: las señales de web abandonada que un cliente nota.']] : [['First impression', 'Is it clear in seconds what you do, where and for whom? We read it like someone who has never heard of you.'], ['Calls to action', 'Tappable phone, WhatsApp, form. If contacting you is hard, the customer moves on.'], ['Speed', 'How long the content takes to appear on an ordinary phone. Every extra second shows up in your calls.'], ['Technical SEO', 'Titles, descriptions, headings, mobile set-up and structured data on your main pages, not just the homepage.'], ['Tracking and ads', 'Which tags are installed, whether they measure conversions and whether what you say matches what we see.'], ['Is it outdated?', 'Footer year, domain age, technology and code: the abandoned-site signals a customer notices.']]).map(([h, p]) => <Reveal key={h} className="tile" as="article"><h3>{h}</h3><p>{p}</p></Reveal>)}
                </div>
              </div>
            </section>
            <section className="section">
              <div className="wrap">
                <SectionHead eyebrow={t('Cómo funciona', 'How it works')} title={t('Un minuto. Sin instalar nada.', 'One minute. Nothing to install.')} />
                <div className="steps" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  {(lang === 'es' ? [['Pon tu web', 'Dirección, nombre y email. Nada más.'], ['Espera un minuto', 'Leemos tu portada y tus páginas principales, medimos la velocidad y buscamos etiquetas.'], ['Lee el resultado', 'Seis apartados con puntuación, lo que está bien, lo que falla y qué hacer. También te llega por email.']] : [['Enter your site', 'Address, name and email. Nothing else.'], ['Wait a minute', 'We read your homepage and main pages, measure speed and look for tags.'], ['Read the result', 'Six areas with a score, what works, what fails and what to do. It also arrives by email.']]).map(([h, p], i) => <Reveal key={h} className="step" as="article"><div className="n">0{i + 1}</div><h3>{h}</h3><p>{p}</p></Reveal>)}
                </div>
              </div>
            </section>
            {offers}
          </>}

          <section className="section" style={{ background: 'var(--paper2)' }}>
            <div className="wrap">
              <SectionHead eyebrow="FAQ" title={t('Preguntas habituales', 'Common questions')} />
              <div style={{ marginTop: 28 }}><FaqAccordion items={faq} /></div>
              <p className="note" style={{ marginTop: 20 }}><a href={otherLang}>{t('This page in English →', 'Esta página en español →')}</a></p>
            </div>
          </section>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </LanguageProvider>
  )
}
