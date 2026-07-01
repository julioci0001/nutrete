// ══════════════════════════════════════════════════════════════
// src/lib/geo/detect.ts — Geo Detection Utilities
// ══════════════════════════════════════════════════════════════

import { headers, cookies } from 'next/headers'
import type { GeoData } from '@/types'
import { SUPPORTED_COUNTRIES } from '@/types'

/**
 * Get geo data from Next.js server context.
 * Works with the middleware-injected headers.
 */
export async function getGeoData(): Promise<GeoData> {
  const headersList = await headers()
  const cookieStore = await cookies()

  // Manual override via cookie (user selected their country)
  const manualCountry = cookieStore.get('nutrete_country_manual')?.value

  const rawCountry =
    manualCountry ||
    headersList.get('x-geo-country') ||
    cookieStore.get('nutrete_country')?.value ||
    'AR'

  const country = rawCountry.toUpperCase()
  const countryInfo = SUPPORTED_COUNTRIES[country]

  return {
    country,
    countryName: countryInfo?.name ?? country,
    city:        headersList.get('x-geo-city')    ?? undefined,
    region:      headersList.get('x-geo-region')  ?? undefined,
    latitude:    parseFloat(headersList.get('x-geo-lat') ?? ''),
    longitude:   parseFloat(headersList.get('x-geo-lon') ?? ''),
    currency:    countryInfo?.currency ?? 'USD',
    language:    countryInfo?.locale ?? 'es',
  }
}

/**
 * Get country code from API request (for API routes)
 */
export function getCountryFromRequest(request: Request): string {
  const headersList = request.headers
  return (
    headersList.get('x-geo-country') ||
    headersList.get('x-vercel-ip-country') ||
    'AR'
  ).toUpperCase()
}

/**
 * Format price for a country
 */
export function formatPrice(price: number, currency: string): string {
  try {
    return new Intl.NumberFormat('es', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price)
  } catch {
    return `${currency} ${price}`
  }
}

/**
 * Check if country is supported
 */
export function isSupportedCountry(code: string): boolean {
  return code.toUpperCase() in SUPPORTED_COUNTRIES
}
