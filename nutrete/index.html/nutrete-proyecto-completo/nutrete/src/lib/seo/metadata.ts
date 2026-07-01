import type { Metadata } from "next"
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://nutrete.com.ar"
export const defaultMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: { default: "nutrEte — Productos Naturales para tu Bienestar", template: "%s | nutrEte" },
  description: "Productos naturales de salud para Latinoamerica. Articulaciones, presion, peso, energia y mas. Envio a domicilio, pagas al recibir.",
  robots: { index: true, follow: true },
  openGraph: { type: "website", locale: "es_AR", url: BASE_URL, siteName: "nutrEte",
    title: "nutrEte — Bienestar Natural", description: "Productos naturales seleccionados para tu pais.",
    images: [{ url: `${BASE_URL}/og-default.jpg`, width: 1200, height: 630, alt: "nutrEte" }] },
}
export function generateProductMetadata(product: any, country?: string): Metadata {
  return {
    title: product.seo_title || `${product.name} — ${product.tagline}`,
    description: product.seo_description || product.description,
    keywords: product.keywords,
    openGraph: { title: product.seo_title || product.name, description: product.seo_description || product.description,
      images: [{ url: product.image_url, width: 1200, height: 630, alt: product.name }] },
  }
}
export function generateProductSchema(product: any, country?: string) {
  const countryData = product.product_countries?.find((c: any) => c.country_code === country) || product.product_countries?.[0]
  return {
    "@context": "https://schema.org", "@type": "Product", name: product.name,
    description: product.description, image: product.image_url,
    brand: { "@type": "Brand", name: "nutrEte" },
    offers: countryData ? { "@type": "Offer", price: countryData.price, priceCurrency: countryData.currency, availability: "https://schema.org/InStock" } : undefined,
    aggregateRating: product.testimonials?.length > 0 ? { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: product.testimonials.length } : undefined,
  }
}
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return { "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faqs.map(f => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) }
}