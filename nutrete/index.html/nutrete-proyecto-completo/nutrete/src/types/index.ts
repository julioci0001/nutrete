export type ProductStatus = 'active' | 'inactive' | 'draft'
export type ProductCategory = 'articulaciones'|'diabetes'|'presion'|'peso'|'potencia'|'memoria'|'vision'|'digestivo'|'higado'|'rinon'|'corazon'|'piel'|'energia'|'sueno'|'stress'|'general'
export interface ProductBenefit { icon: string; title: string; description: string }
export interface ProductTestimonial { id: string; name: string; age: number; city: string; country: string; avatar: string; rating: number; text: string; before?: string; after?: string; date: string; verified: boolean }
export interface ProductFAQ { question: string; answer: string }
export interface ProductIngredient { name: string; description: string; dosage?: string; benefit?: string }
export interface ProductCountry { code: string; name: string; currency: string; price: number; affiliateUrl: string; available: boolean }
export interface Product {
  id: string; slug: string; name: string; tagline: string; description: string; longDescription: string
  category: ProductCategory; status: ProductStatus; imageUrl: string; imageAlt: string; images: string[]
  problem: string; solution: string; benefits: ProductBenefit[]; ingredients: ProductIngredient[]
  testimonials: ProductTestimonial[]; faqs: ProductFAQ[]; seoTitle: string; seoDescription: string
  keywords: string[]; articleContent?: string; countries: ProductCountry[]; urgencyText?: string
  scarcityText?: string; ctaText: string; comparisonTable?: { headers: string[]; rows: { label: string; values: string[] }[] }
  agentSystemPrompt?: string; agentGreeting?: string; createdAt: string; updatedAt: string
}
export interface GeoData { country: string; countryName: string; city?: string; currency?: string; language?: string }
export const SUPPORTED_COUNTRIES: Record<string, { name: string; flag: string; currency: string; locale: string; phone: string }> = {
  AR: { name: "Argentina",  flag: "🇦🇷", currency: "ARS", locale: "es-AR", phone: "+54"  },
  MX: { name: "México",     flag: "🇲🇽", currency: "MXN", locale: "es-MX", phone: "+52"  },
  CO: { name: "Colombia",   flag: "🇨🇴", currency: "COP", locale: "es-CO", phone: "+57"  },
  PE: { name: "Perú",       flag: "🇵🇪", currency: "PEN", locale: "es-PE", phone: "+51"  },
  CL: { name: "Chile",      flag: "🇨🇱", currency: "CLP", locale: "es-CL", phone: "+56"  },
  EC: { name: "Ecuador",    flag: "🇪🇨", currency: "USD", locale: "es-EC", phone: "+593" },
  BO: { name: "Bolivia",    flag: "🇧🇴", currency: "BOB", locale: "es-BO", phone: "+591" },
  UY: { name: "Uruguay",    flag: "🇺🇾", currency: "UYU", locale: "es-UY", phone: "+598" },
}
export type MessageRole = "user" | "assistant" | "system"
export interface Message { id: string; role: MessageRole; content: string; timestamp: string; resourceCards?: ResourceCard[] }
export interface ResourceCard { type: "pdf"|"guide"|"checklist"|"plan"; title: string; description: string; icon: string; ctaText?: string; ctaUrl?: string }