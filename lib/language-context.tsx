"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'es' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (es: string, en: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

function detectUserLanguage(): Language {
  if (typeof window === 'undefined') return 'es'
  
  // Check localStorage for saved preference first
  const saved = localStorage.getItem('impulsomedia-language')
  if (saved === 'es' || saved === 'en') return saved
  
  // Detect from browser settings
  const browserLang = navigator.language || (navigator as any).userLanguage || ''
  const langCode = browserLang.toLowerCase().split('-')[0]
  
  // If browser language starts with 'es', use Spanish, otherwise English
  return langCode === 'es' ? 'es' : 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('es')
  const [isHydrated, setIsHydrated] = useState(false)

  // Detect language on mount (client-side only)
  useEffect(() => {
    const detectedLang = detectUserLanguage()
    setLanguage(detectedLang)
    setIsHydrated(true)
  }, [])

  // Save preference when language changes
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('impulsomedia-language', lang)
    }
  }

  const t = (es: string, en: string) => language === 'es' ? es : en

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
