import { headers, cookies } from "next/headers"
import type { GeoData } from "@/types"
import { SUPPORTED_COUNTRIES } from "@/types"
export async function getGeoData(): Promise<GeoData> {
  const headersList = await headers()
  const cookieStore = await cookies()
  const manualCountry = cookieStore.get("nutrete_country_manual")?.value
  const rawCountry = (manualCountry || headersList.get("x-geo-country") || cookieStore.get("nutrete_country")?.value || "AR").toUpperCase()
  const countryInfo = SUPPORTED_COUNTRIES[rawCountry]
  return { country: rawCountry, countryName: countryInfo?.name ?? rawCountry, currency: countryInfo?.currency ?? "USD", language: countryInfo?.locale ?? "es" }
}
export function formatPrice(price: number, currency: string): string {
  try {
    return new Intl.NumberFormat("es", { style: "currency", currency, minimumFractionDigits: 0 }).format(price)
  } catch { return `${currency} ${price}` }
}