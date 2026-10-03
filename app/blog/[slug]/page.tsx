import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { blogPosts, getPostBySlug } from '@/lib/blog-data'
import { BlogPostContent } from './blog-post-content'

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slugEs }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug, 'es')
  if (!post) return {}

  const enUrl = `https://impulsomedia.es/en/blog/${post.slugEn}`
  const esUrl = `https://impulsomedia.es/blog/${post.slugEs}`

  return {
    title: post.titleEs,
    description: post.excerptEs,
    alternates: {
      canonical: `/blog/${post.slugEs}`,
      languages: {
        'es-ES': esUrl,
        'en-GB': enUrl,
        'x-default': esUrl,
      },
    },
    openGraph: {
      title: `${post.titleEs} | ImpulsoMedia`,
      description: post.excerptEs,
      url: esUrl,
      type: 'article',
      publishedTime: post.date,
      images: [{ url: `https://impulsomedia.es${post.coverImage.replace('.svg', '-og.png')}` }],
    },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug, 'es')
  if (!post) notFound()

  const esUrl = `https://impulsomedia.es/blog/${post.slugEs}`

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.titleEs,
    description: post.excerptEs,
    datePublished: post.date,
    author: { '@type': 'Organization', name: 'ImpulsoMedia' },
    publisher: { '@type': 'Organization', name: 'ImpulsoMedia', logo: { '@type': 'ImageObject', url: 'https://impulsomedia.es/images/impulsomedia-logo.svg' } },
    mainEntityOfPage: esUrl,
    inLanguage: 'es-ES',
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://impulsomedia.es" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://impulsomedia.es/blog" },
      { "@type": "ListItem", "position": 3, "name": post.titleEs, "item": esUrl }
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <BlogPostContent post={post} lang="es" />
    </>
  )
}
