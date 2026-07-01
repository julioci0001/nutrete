// ══════════════════════════════════════════════════════════════
// src/lib/seo/metadata.ts — SEO & Schema Utilities
// ══════════════════════════════════════════════════════════════

import type { Metadata } from 'next'
import type { Product } from '@/types/product'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://nutrete.com.ar'

// ── Site-wide defaults ────────────────────────────────────────
export const defaultMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'nutrEte — Productos Naturales para tu Bienestar',
    template: '%s | nutrEte',
  },
  description: 'Descubre productos naturales de salud seleccionados para tu país. Soluciones reales para articulaciones, presión, peso, energía y más.',
  keywords: ['productos naturales', 'suplementos salud', 'bienestar natural', 'nutra'],
  authors: [{ name: 'nutrEte' }],
  creator: 'nutrEte',
  publisher: 'nutrEte',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: BASE_URL,
    siteName: 'nutrEte',
    title: 'nutrEte — Productos Naturales para tu Bienestar',
    description: 'Descubre productos naturales de salud seleccionados para tu país.',
    images: [{
      url: `${BASE_URL}/og-default.jpg`,
      width: 1200,
      height: 630,
      alt: 'nutrEte — Bienestar Natural',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'nutrEte — Productos Naturales',
    description: 'Productos naturales de salud para tu bienestar.',
    images: [`${BASE_URL}/og-default.jpg`],
  },
}

// ── Product page metadata ─────────────────────────────────────
export function generateProductMetadata(product: Product, country?: string): Metadata {
  const url = `${BASE_URL}/productos/${product.slug}`

  return {
    title: product.seoTitle || `${product.name} — ${product.tagline}`,
    description: product.seoDescription || product.description,
    keywords: product.keywords,
    openGraph: {
      type: 'website',
      url,
      title: product.seoTitle || product.name,
      description: product.seoDescription || product.description,
      images: [{
        url: product.imageUrl,
        width: 1200,
        height: 630,
        alt: product.imageAlt || product.name,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.seoTitle || product.name,
      description: product.seoDescription || product.description,
      images: [product.imageUrl],
    },
    alternates: {
      canonical: url,
    },
  }
}

// ── JSON-LD Schemas ───────────────────────────────────────────
export function generateProductSchema(product: Product, country?: string) {
  const countryData = product.countries?.find(c => c.code === country) || product.countries?.[0]

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.imageUrl,
    brand: {
      '@type': 'Brand',
      name: 'nutrEte',
    },
    offers: countryData ? {
      '@type': 'Offer',
      price: countryData.price,
      priceCurrency: countryData.currency,
      availability: 'https://schema.org/InStock',
      url: `${BASE_URL}/productos/${product.slug}`,
    } : undefined,
    aggregateRating: product.testimonials?.length > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: product.testimonials.length,
      bestRating: '5',
    } : undefined,
    review: product.testimonials?.slice(0, 3).map(t => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: t.name },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: t.rating,
        bestRating: '5',
      },
      reviewBody: t.text,
      datePublished: t.date,
    })),
  }
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  }
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'nutrEte',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description: 'Plataforma de productos naturales de salud y bienestar para Latinoamérica.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: 'Spanish',
    },
  }
}
