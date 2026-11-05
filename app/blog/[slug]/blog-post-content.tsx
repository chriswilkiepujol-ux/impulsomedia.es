"use client"

import { LanguageProvider } from '@/lib/language-context'
import { HeaderV2 as Header } from '@/components/v2/header'
import { BlogPost } from '@/components/blog-post'
import { CtaBand } from '@/components/cta-band'
import { FooterV2 as Footer } from '@/components/v2/sections'
import { AreasStrip } from '@/components/areas-strip'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { BlogPost as BlogPostType } from '@/lib/blog-data'

export function BlogPostContent({ post, lang = 'es' }: { post: BlogPostType; lang?: 'es' | 'en' }) {
  return (
    <LanguageProvider initialLanguage={lang}>
      <div className="min-h-screen bg-[#ffffff]">
        <Header />
        <main>
          <BlogPost post={post} />
          <AreasStrip />
          <CtaBand />
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </LanguageProvider>
  )
}
