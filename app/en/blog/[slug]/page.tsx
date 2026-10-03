import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { blogPosts, getPostBySlug } from '@/lib/blog-data'
import { BlogPostContent } from '../../../blog/[slug]/blog-post-content'

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slugEn }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug, 'en')
  if (!post) return {}

  const enUrl = `https://impulsomedia.es/en/blog/${post.slugEn}`
  const esUrl = `https://impulsomedia.es/blog/${post.slugEs}`

  return {
    title: post.titleEn,
    description: post.excerptEn,
    alternates: {
      canonical: `/en/blog/${post.slugEn}`,
      languages: {
        'es-ES': esUrl,
        'en-GB': enUrl,
        'x-default': esUrl,
      },
    },
    openGraph: {
      title: `${post.titleEn} | ImpulsoMedia`,
      description: post.excerptEn,
      url: enUrl,
      type: 'article',
      publishedTime: post.date,
      locale: 'en_GB',
    },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug, 'en')
  if (!post) notFound()

  const enUrl = `https://impulsomedia.es/en/blog/${post.slugEn}`

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.titleEn,
    description: post.excerptEn,
    datePublished: post.date,
    author: { '@type': 'Organization', name: 'ImpulsoMedia' },
    publisher: { '@type': 'Organization', name: 'ImpulsoMedia', logo: { '@type': 'ImageObject', url: 'https://impulsomedia.es/images/impulsomedia-logo.svg' } },
    mainEntityOfPage: enUrl,
    inLanguage: 'en-GB',
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://impulsomedia.es/en" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://impulsomedia.es/en/blog" },
      { "@type": "ListItem", "position": 3, "name": post.titleEn, "item": enUrl }
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <BlogPostContent post={post} lang="en" />
    </>
  )
}
