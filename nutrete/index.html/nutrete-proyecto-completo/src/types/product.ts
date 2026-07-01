// ══════════════════════════════════════════════════════════════
// src/types/product.ts — Tipos de Producto
// ══════════════════════════════════════════════════════════════

export type ProductStatus = 'active' | 'inactive' | 'draft'
export type ProductCategory =
  | 'articulaciones'
  | 'diabetes'
  | 'presion'
  | 'peso'
  | 'potencia'
  | 'memoria'
  | 'vision'
  | 'digestivo'
  | 'higado'
  | 'rinon'
  | 'corazon'
  | 'piel'
  | 'energia'
  | 'sueno'
  | 'stress'
  | 'general'

export interface ProductCountry {
  code: string        // AR, MX, CO, PE, CL, etc.
  name: string
  currency: string
  price: number
  affiliateUrl: string
  available: boolean
}

export interface ProductBenefit {
  icon: string
  title: string
  description: string
}

export interface ProductTestimonial {
  id: string
  name: string
  age: number
  city: string
  country: string
  avatar: string
  rating: number
  text: string
  before?: string
  after?: string
  date: string
  verified: boolean
}

export interface ProductFAQ {
  question: string
  answer: string
}

export interface ProductIngredient {
  name: string
  description: string
  dosage?: string
  benefit?: string
}

export interface Product {
  id: string
  slug: string
  name: string
  tagline: string
  description: string           // Short (meta)
  longDescription: string       // Full marketing copy
  category: ProductCategory
  status: ProductStatus

  // Media
  imageUrl: string
  imageAlt: string
  images: string[]
  videoUrl?: string

  // Content
  problem: string               // Emotional problem this solves
  solution: string              // How it solves it
  benefits: ProductBenefit[]
  ingredients: ProductIngredient[]
  testimonials: ProductTestimonial[]
  faqs: ProductFAQ[]

  // SEO
  seoTitle: string
  seoDescription: string
  keywords: string[]
  articleContent?: string       // Long-form SEO article

  // Countries / Availability
  countries: ProductCountry[]

  // Marketing
  urgencyText?: string
  scarcityText?: string
  priceStrikethrough?: number
  discount?: number
  ctaText: string
  ctaColor?: string

  // Comparison
  comparisonTable?: {
    headers: string[]
    rows: { label: string; values: string[] }[]
  }

  // AI Agent
  agentSystemPrompt?: string    // Custom prompt for this product's agent
  agentGreeting?: string

  // Tracking
  terraLeadsFlowId?: string
  createdAt: string
  updatedAt: string
}

// ── Filters ───────────────────────────────────────────────────
export interface ProductFilter {
  country?: string
  category?: ProductCategory
  status?: ProductStatus
  search?: string
  page?: number
  limit?: number
}

// ── Ingest ────────────────────────────────────────────────────
export interface ProductIngestPayload {
  affiliateUrl: string
  country: string
  additionalInfo?: string
}
