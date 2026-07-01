// ══════════════════════════════════════════════════════════════
// src/types/lead.ts — Lead COD
// ══════════════════════════════════════════════════════════════

export type LeadStatus = 'new' | 'sent' | 'confirmed' | 'cancelled' | 'duplicate'

export interface Lead {
  id: string
  productId: string
  productName: string
  productSlug: string

  // Contact
  name: string
  phone: string
  email?: string

  // Geo
  country: string
  city?: string
  state?: string
  ip?: string

  // Tracking
  status: LeadStatus
  terraLeadsId?: string
  terraLeadsStatus?: string

  // Analytics
  source?: string
  medium?: string
  campaign?: string
  landingPage?: string
  userAgent?: string
  sessionId?: string

  createdAt: string
  updatedAt: string
}

export interface CODFormData {
  name: string
  phone: string
  email?: string
  country: string
  productId: string
  productSlug: string
}

// ══════════════════════════════════════════════════════════════
// src/types/geo.ts — Geolocalización
// ══════════════════════════════════════════════════════════════

export interface GeoData {
  country: string           // ISO code: AR, MX, CO, etc.
  countryName: string
  city?: string
  region?: string
  latitude?: number
  longitude?: number
  timezone?: string
  currency?: string
  language?: string
}

export const SUPPORTED_COUNTRIES: Record<string, {
  name: string
  flag: string
  currency: string
  locale: string
  phone: string
}> = {
  AR: { name: 'Argentina',   flag: '🇦🇷', currency: 'ARS', locale: 'es-AR', phone: '+54'  },
  MX: { name: 'México',      flag: '🇲🇽', currency: 'MXN', locale: 'es-MX', phone: '+52'  },
  CO: { name: 'Colombia',    flag: '🇨🇴', currency: 'COP', locale: 'es-CO', phone: '+57'  },
  PE: { name: 'Perú',        flag: '🇵🇪', currency: 'PEN', locale: 'es-PE', phone: '+51'  },
  CL: { name: 'Chile',       flag: '🇨🇱', currency: 'CLP', locale: 'es-CL', phone: '+56'  },
  EC: { name: 'Ecuador',     flag: '🇪🇨', currency: 'USD', locale: 'es-EC', phone: '+593' },
  BO: { name: 'Bolivia',     flag: '🇧🇴', currency: 'BOB', locale: 'es-BO', phone: '+591' },
  PY: { name: 'Paraguay',    flag: '🇵🇾', currency: 'PYG', locale: 'es-PY', phone: '+595' },
  UY: { name: 'Uruguay',     flag: '🇺🇾', currency: 'UYU', locale: 'es-UY', phone: '+598' },
  VE: { name: 'Venezuela',   flag: '🇻🇪', currency: 'USD', locale: 'es-VE', phone: '+58'  },
  RU: { name: 'Rusia',       flag: '🇷🇺', currency: 'RUB', locale: 'ru-RU', phone: '+7'   },
  UA: { name: 'Ucrania',     flag: '🇺🇦', currency: 'UAH', locale: 'uk-UA', phone: '+380' },
  PL: { name: 'Polonia',     flag: '🇵🇱', currency: 'PLN', locale: 'pl-PL', phone: '+48'  },
  RO: { name: 'Rumanía',     flag: '🇷🇴', currency: 'RON', locale: 'ro-RO', phone: '+40'  },
  TR: { name: 'Turquía',     flag: '🇹🇷', currency: 'TRY', locale: 'tr-TR', phone: '+90'  },
}

// ══════════════════════════════════════════════════════════════
// src/types/agent.ts — Agente IA
// ══════════════════════════════════════════════════════════════

export type MessageRole = 'user' | 'assistant' | 'system'

export interface Message {
  id: string
  role: MessageRole
  content: string
  timestamp: string
  resourceCards?: ResourceCard[]
}

export interface ResourceCard {
  type: 'pdf' | 'guide' | 'checklist' | 'plan' | 'comparison'
  title: string
  description: string
  icon: string
  downloadUrl?: string
  ctaText?: string
  ctaUrl?: string
  productSlug?: string
}

export interface AgentSession {
  id: string
  productId?: string
  productSlug?: string
  messages: Message[]
  country: string
  createdAt: string
}
