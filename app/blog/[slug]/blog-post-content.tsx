"use client"

import { LanguageProvider } from '@/lib/language-context'
import { Header } from '@/components/header'
import { BlogPost } from '@/components/blog-post'
import { CtaBand } from '@/components/cta-band'
import { Footer } from '@/components/footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { BlogPost as BlogPostType } from '@/lib/blog-data'

export function BlogPostContent({ post, lang = 'es' }: { post: BlogPostType; lang?: 'es' | 'en' }) {
  return (
    <LanguageProvider initialLanguage={lang}>
      <div className="min-h-screen bg-[#262C37]">
        <Header />
        <main className="pt-[68px]">
          <BlogPost post={post} />
          <CtaBand />
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </LanguageProvider>
  )
}
