// ══════════════════════════════════════════════════════════════
// src/app/page.tsx — Homepage (Server Component)
// ══════════════════════════════════════════════════════════════

import { Suspense } from 'react'
import { getGeoData } from '@/lib/geo/detect'
import { getProductsByCountry } from '@/lib/db/client'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { CountryBanner } from '@/components/sections/CountryBanner'
import { FeaturedProducts } from '@/components/sections/FeaturedProducts'
import { TrustSignals } from '@/components/sections/TrustSignals'
import { CategoryGrid } from '@/components/sections/CategoryGrid'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { Testimonials } from '@/components/sections/Testimonials'
import { ProductGridSkeleton } from '@/components/product/ProductGrid'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const geo = await getGeoData()
  return {
    title: `nutrEte ${geo.countryName} — Productos Naturales para tu Bienestar`,
    description: `Los mejores productos naturales de salud disponibles en ${geo.countryName}. Soluciones naturales para articulaciones, presión, peso, energía y más. Envío rápido.`,
    openGraph: {
      title: `nutrEte — Bienestar Natural en ${geo.countryName}`,
      description: `Productos naturales seleccionados especialmente para ${geo.countryName}.`,
    },
  }
}

export default async function HomePage() {
  const geo = await getGeoData()

  return (
    <>
      <Header country={geo.country} countryName={geo.countryName} />

      {/* Urgency bar */}
      <div className="urgency-bar no-print">
        🔥 Envío gratis en tu primer pedido · Solo hoy
      </div>

      <main>
        {/* 1. Hero Section */}
        <Hero country={geo.country} countryName={geo.countryName} />

        {/* 2. Country Banner (if auto-detected) */}
        <CountryBanner
          country={geo.country}
          countryName={geo.countryName}
          flag={getFlagEmoji(geo.country)}
        />

        {/* 3. Trust Signals */}
        <TrustSignals />

        {/* 4. Featured Products — filtered by country */}
        <section className="section-spacing bg-gray-50/50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-3">
                Disponibles en {geo.countryName}
              </p>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
                Productos <span className="text-gradient-green">para ti</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-xl mx-auto">
                Seleccionados especialmente para {geo.countryName}. Naturales, efectivos y con entrega rápida.
              </p>
            </div>

            <Suspense fallback={<ProductGridSkeleton />}>
              <FeaturedProducts country={geo.country} />
            </Suspense>
          </div>
        </section>

        {/* 5. Categories */}
        <CategoryGrid />

        {/* 6. How It Works */}
        <HowItWorks />

        {/* 7. Testimonials */}
        <Testimonials country={geo.country} />

        {/* 8. Final CTA */}
        <FinalCTA countryName={geo.countryName} />
      </main>

      <Footer />
    </>
  )
}

// ── Internal Components ───────────────────────────────────────
function FinalCTA({ countryName }: { countryName: string }) {
  return (
    <section className="section-spacing bg-dark-hero text-white">
      <div className="container-custom text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-brand-400 font-semibold text-sm uppercase tracking-widest mb-4">
            Tu salud es tu mayor inversión
          </p>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Comienza tu viaje hacia el{' '}
            <span className="text-gradient-green">bienestar natural</span>
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Miles de personas en {countryName} ya encontraron su solución natural.
            Es tu turno de sentirte bien.
          </p>
          <a href="/productos" className="btn-primary text-lg px-10 py-4">
            Ver todos los productos →
          </a>
        </div>
      </div>
    </section>
  )
}

function getFlagEmoji(countryCode: string): string {
  const flags: Record<string, string> = {
    AR: '🇦🇷', MX: '🇲🇽', CO: '🇨🇴', PE: '🇵🇪', CL: '🇨🇱',
    EC: '🇪🇨', BO: '🇧🇴', PY: '🇵🇾', UY: '🇺🇾', VE: '🇻🇪',
  }
  return flags[countryCode] ?? '🌎'
}
