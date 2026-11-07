"use client"

import { Mesh, GOLD, GOLD2, INK } from '@/components/v2/shared'
import { useState } from 'react'
import { useLanguage } from '@/lib/language-context'
import { Send, Loader2 } from 'lucide-react'

export function Contact({ primary = false }: { primary?: boolean } = {}) {
  const Heading = primary ? 'h1' : 'h2'
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setIsSuccess(false)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      company: formData.get('company') as string,
      service: formData.get('service') as string,
      message: formData.get('message') as string,
      website: formData.get('website') as string, // honeypot
    }

    const form = e.currentTarget
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      setError('')
      setIsSuccess(true)
      window.gtag?.('event', 'form_submit', { service: data.service })
      form.reset()
    } catch {
      setIsSuccess(false)
      setError(t(
        'Hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo.',
        'There was an error sending your message. Please try again.'
      ))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="contact" className="phero">
      <Mesh colors={[GOLD, GOLD2, INK, GOLD]} alpha={0.2} />
      <div className="gridlines" aria-hidden="true" />
      <div className="relative max-w-[1200px] mx-auto px-5 md:px-6 py-[clamp(28px,4.2vw,60px)]">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Column - Info */}
          <div>
            <span className="eyebrow mb-5">
              {t('Contacto', 'Contact')}
            </span>
            <Heading className="font-display font-extrabold text-[clamp(34px,4.4vw,62px)] leading-[1] tracking-[-0.025em] mb-6">
              {t('Hablemos de tu ', "Let's talk about your ")}
              <em className="text-[#c9a04a] not-italic">{t('proyecto', 'project')}</em>
            </Heading>
            <p className="text-[rgba(17,20,24,0.84)] text-base font-light leading-[1.6] mb-6 max-w-md">
              {t(
                'Cuéntanos sobre tu negocio y tus objetivos. Te responderemos en menos de 24 horas.',
                'Tell us about your business and goals. We\'ll respond within 24 hours.'
              )}
            </p>

            {/* WhatsApp CTA */}
            <div className="p-6 rounded-2xl border border-[rgba(17,20,24,0.1)] bg-[#ffffff] mb-8">
              <h3 className="font-display font-bold text-lg mb-2">
                {t('Prefiere WhatsApp?', 'Prefer WhatsApp?')}
              </h3>
              <p className="text-[0.9rem] text-[rgba(17,20,24,0.7)] mb-4">
                {t(
                  'Respuesta inmediata para consultas rápidas.',
                  'Immediate response for quick inquiries.'
                )}
              </p>
              <a
                href="https://wa.me/34680863229"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-[0.65rem] bg-[#25d366] text-white px-6 py-3 rounded-full font-sans font-semibold text-[0.92rem] no-underline transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_16px_40px_rgba(37,211,102,0.25)]"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                {t('Abrir WhatsApp', 'Open WhatsApp')}
              </a>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <div>
                <p className="text-[0.72rem] tracking-[0.1em] uppercase text-[rgba(17,20,24,0.7)] mb-1">Email</p>
                <a href="mailto:chris@impulsomedia.es" className="text-[#111418] hover:text-[#a67c2e] transition-colors">
                  chris@impulsomedia.es
                </a>
              </div>
              <div>
                <p className="text-[0.72rem] tracking-[0.1em] uppercase text-[rgba(17,20,24,0.7)] mb-1">
                  {t('Ubicación', 'Location')}
                </p>
                <p className="text-[#111418]">Sotogrande, Cádiz, España</p>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="p-[clamp(1.5rem,4vw,2.5rem)] rounded-[22px] border border-[rgba(17,20,24,0.1)] bg-[#ffffff] shadow-[0_30px_60px_rgba(17,20,24,0.1)]">
            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-x-4 gap-y-4">
              {/* Honeypot field - hidden from real visitors, bots that auto-fill every field will trip it */}
              <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }} aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-[0.72rem] tracking-[0.1em] uppercase text-[rgba(17,20,24,0.7)] mb-2">
                  {t('Nombre', 'Name')} *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-[#f6f4ef] border border-[rgba(17,20,24,0.1)] text-[#111418] placeholder:text-[rgba(17,20,24,0.58)] focus:outline-none focus:border-[#c9a04a] transition-colors"
                  placeholder={t('Tu nombre', 'Your name')}
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-[0.72rem] tracking-[0.1em] uppercase text-[rgba(17,20,24,0.7)] mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-[#f6f4ef] border border-[rgba(17,20,24,0.1)] text-[#111418] placeholder:text-[rgba(17,20,24,0.58)] focus:outline-none focus:border-[#c9a04a] transition-colors"
                  placeholder={t('tu@email.com', 'you@email.com')}
                />
              </div>

              {/* Company */}
              <div>
                <label htmlFor="company" className="block text-[0.72rem] tracking-[0.1em] uppercase text-[rgba(17,20,24,0.7)] mb-2">
                  {t('Empresa', 'Company')}
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  className="w-full px-4 py-3 rounded-2xl bg-[#f6f4ef] border border-[rgba(17,20,24,0.1)] text-[#111418] placeholder:text-[rgba(17,20,24,0.58)] focus:outline-none focus:border-[#c9a04a] transition-colors"
                  placeholder={t('Nombre de tu empresa', 'Your company name')}
                />
              </div>

              {/* Service */}
              <div>
                <label htmlFor="service" className="block text-[0.72rem] tracking-[0.1em] uppercase text-[rgba(17,20,24,0.7)] mb-2">
                  {t('Servicio de interés', 'Service of interest')}
                </label>
                <select
                  id="service"
                  name="service"
                  className="w-full px-4 py-3 rounded-2xl bg-[#f6f4ef] border border-[rgba(17,20,24,0.1)] text-[#111418] focus:outline-none focus:border-[#c9a04a] transition-colors"
                >
                  <option value="">{t('Selecciona un servicio', 'Select a service')}</option>
                  <option value="web">{t('Diseño Web', 'Web Design')}</option>
                  <option value="social">{t('Redes Sociales', 'Social Media')}</option>
                  <option value="branding">{t('Identidad Visual', 'Visual Identity')}</option>
                  <option value="growth">{t('Crecimiento Digital', 'Digital Growth')}</option>
                  <option value="all">{t('Paquete Completo', 'Complete Package')}</option>
                </select>
              </div>

              {/* Message */}
              <div className="sm:col-span-2">
                <label htmlFor="message" className="block text-[0.72rem] tracking-[0.1em] uppercase text-[rgba(17,20,24,0.7)] mb-2">
                  {t('Mensaje', 'Message')} *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl bg-[#f6f4ef] border border-[rgba(17,20,24,0.1)] text-[#111418] placeholder:text-[rgba(17,20,24,0.58)] focus:outline-none focus:border-[#c9a04a] transition-colors resize-none"
                  placeholder={t('Cuéntanos sobre tu proyecto...', 'Tell us about your project...')}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="sm:col-span-2 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Success Message */}
              {isSuccess && (
                <div className="sm:col-span-2 p-4 rounded-2xl bg-[#c9a04a]/10 border border-[#c9a04a]/20 text-[#a67c2e] text-sm">
                  {t(
                    'Mensaje enviado correctamente. Te responderemos pronto.',
                    'Message sent successfully. We\'ll respond soon.'
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="sm:col-span-2 w-full inline-flex items-center justify-center gap-[0.65rem] bg-[#111418] text-white px-8 py-4 rounded-full font-sans font-semibold text-[0.92rem] transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t('Enviando...', 'Sending...')}
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {t('Enviar mensaje', 'Send message')}
                  </>
                )}
              </button>
              <p className="sm:col-span-2 text-[12.5px] text-[rgba(17,20,24,0.62)] leading-snug">{t('Al enviar aceptas que usemos estos datos para responderte. ', 'By sending you agree that we use these details to reply to you. ')}<a className="underline" href={t('/privacidad', '/en/privacy')} target="_blank" rel="noreferrer">{t('Política de privacidad', 'Privacy policy')}</a></p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
