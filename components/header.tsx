"use client"

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/lib/language-context'
import { cn } from '@/lib/utils'

export function Header() {
  const { language, t } = useLanguage()
  const pathname = usePathname() || '/'
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isEn = pathname === '/en' || pathname.startsWith('/en/')
  const prefix = isEn ? '/en' : ''
  const homeHref = isEn ? '/en' : '/'

  // Alternate-language URL for the current page, used by the EN/ES toggle
  const altHref = isEn
    ? (pathname.replace(/^\/en/, '') || '/')
    : (pathname === '/' ? '/en' : `/en${pathname}`)

  const navLinks = [
    { href: `${prefix}/servicios`, label: t('Servicios', 'Services') },
    { href: `${prefix}/proyectos`, label: t('Proyectos', 'Work') },
    { href: `${prefix}/nosotros`, label: t('Nosotros', 'About') },
    { href: `${homeHref}#reviews`, label: t('Opiniones', 'Reviews') },
    { href: `${prefix}/contacto`, label: t('Contacto', 'Contact') },
  ]

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-[200] transition-all duration-300',
        'flex items-center justify-between',
        'px-[clamp(1.5rem,5vw,4rem)] h-[68px]',
        'bg-[rgba(8,8,8,0.9)] backdrop-blur-[24px]',
        'border-b border-[rgba(255,255,255,0.06)]'
      )}
    >
      {/* Logo with Icon */}
      <Link
        href={homeHref}
        className="flex items-center gap-2 font-display font-extrabold text-[1.1rem] tracking-[0.12em] uppercase text-[#f2ede6] no-underline"
      >
        <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="14" stroke="#d4a853" strokeWidth="2" fill="none"/>
          <path d="M6 16 L10 16 L12 10 L16 22 L20 8 L22 16 L26 16" stroke="#d4a853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
        Impulso<em className="text-[#d4a853] not-italic">Media</em>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-6">
        <nav className="flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[0.75rem] font-medium tracking-[0.08em] uppercase text-[rgba(242,237,230,0.42)] no-underline transition-colors duration-200 hover:text-[#f2ede6]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Language Toggle - navigates to the alternate-language URL for this page */}
        <div className="flex items-center border border-[rgba(255,255,255,0.13)] rounded-[3px] overflow-hidden">
          <Link
            href={isEn ? pathname : altHref}
            className={cn(
              'px-[0.65rem] py-[0.35rem] font-display font-bold text-[0.68rem] tracking-[0.1em] no-underline transition-all duration-200',
              isEn
                ? 'bg-[#d4a853] text-[#0a0808]'
                : 'bg-transparent text-[rgba(242,237,230,0.42)]'
            )}
          >
            EN
          </Link>
          <Link
            href={isEn ? altHref : pathname}
            className={cn(
              'px-[0.65rem] py-[0.35rem] font-display font-bold text-[0.68rem] tracking-[0.1em] no-underline transition-all duration-200',
              !isEn
                ? 'bg-[#d4a853] text-[#0a0808]'
                : 'bg-transparent text-[rgba(242,237,230,0.42)]'
            )}
          >
            ES
          </Link>
        </div>

        {/* WhatsApp CTA */}
        <a
          href="https://wa.me/34680863229"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-[0.45rem] bg-[#25d366] text-white px-4 py-[0.45rem] rounded-[3px] font-semibold text-[0.72rem] no-underline transition-all duration-200 hover:opacity-90 hover:-translate-y-[1px]"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          WhatsApp
        </a>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden p-2 text-[#f2ede6]"
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
      >
        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu */}
      <div
        className={cn(
          'md:hidden fixed inset-x-0 top-[68px] bg-[rgba(8,8,8,0.98)] backdrop-blur-lg border-b border-[rgba(255,255,255,0.06)] transition-all duration-300 overflow-hidden',
          isMenuOpen ? 'max-h-[calc(100vh-68px)] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <nav className="flex flex-col p-6 gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="text-lg font-display font-semibold text-[#f2ede6] py-4 border-b border-[rgba(255,255,255,0.06)] no-underline"
            >
              {link.label}
            </a>
          ))}
          
          <div className="flex items-center justify-between pt-6 gap-4">
            {/* Language Toggle Mobile */}
            <div className="flex items-center border border-[rgba(255,255,255,0.13)] rounded-[3px] overflow-hidden">
              <Link
                href={isEn ? pathname : altHref}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  'px-4 py-2 font-display font-bold text-[0.75rem] tracking-[0.1em] no-underline transition-all duration-200',
                  isEn
                    ? 'bg-[#d4a853] text-[#0a0808]'
                    : 'bg-transparent text-[rgba(242,237,230,0.42)]'
                )}
              >
                EN
              </Link>
              <Link
                href={isEn ? altHref : pathname}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  'px-4 py-2 font-display font-bold text-[0.75rem] tracking-[0.1em] no-underline transition-all duration-200',
                  !isEn
                    ? 'bg-[#d4a853] text-[#0a0808]'
                    : 'bg-transparent text-[rgba(242,237,230,0.42)]'
                )}
              >
                ES
              </Link>
            </div>

            {/* WhatsApp CTA Mobile */}
            <a
              href="https://wa.me/34680863229"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 bg-[#25d366] text-white px-5 py-3 rounded-[3px] font-semibold text-[0.8rem] no-underline"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
          </div>
        </nav>
      </div>
    </header>
  )
}
