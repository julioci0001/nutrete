import { Suspense } from 'react'
import { getGeoData } from '@/lib/geo/detect'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { CountryBanner } from '@/components/sections/CountryBanner'
import { TrustSignals } from '@/components/sections/TrustSignals'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { FeaturedProducts, ProductGridSkeleton } from '@/components/sections/FeaturedProducts'
import { SUPPORTED_COUNTRIES } from '@/types'
import type { Metadata } from 'next'
export const dynamic = 'force-dynamic'
export async function generateMetadata(): Promise<Metadata> {
  const geo = await getGeoData()
  return { title: `nutrEte ${geo.countryName} — Productos Naturales`, description: `Los mejores productos naturales en ${geo.countryName}. Envio a domicilio, pagas al recibir.` }
}
export default async function HomePage() {
  const geo = await getGeoData()
  const flag = SUPPORTED_COUNTRIES[geo.country]?.flag ?? '🌎'
  return (
    <>
      <Header country={geo.country} countryName={geo.countryName} />
      <div className="urgency-bar">🔥 Envio gratis en tu primer pedido · Solo hoy</div>
      <main>
        <Hero country={geo.country} countryName={geo.countryName} />
        <CountryBanner country={geo.country} countryName={geo.countryName} flag={flag} />
        <TrustSignals />
        <section className="section-spacing bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-3">Disponibles en {geo.countryName}</p>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">Productos <span className="text-gradient-green">para ti</span></h2>
              <p className="text-gray-600 text-lg max-w-xl mx-auto">Seleccionados especialmente para {geo.countryName}. Naturales, efectivos y con entrega rapida.</p>
            </div>
            <Suspense fallback={<ProductGridSkeleton />}>
              <FeaturedProducts country={geo.country} />
            </Suspense>
          </div>
        </section>
        <HowItWorks />
        <section className="section-spacing bg-green-950 text-white">
          <div className="container-custom text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Comienza tu viaje hacia el <span className="text-gradient-green">bienestar natural</span></h2>
              <p className="text-gray-300 text-lg mb-8">Miles de personas en {geo.countryName} ya encontraron su solucion natural.</p>
              <a href="/productos" className="btn-primary text-lg px-10 py-4">Ver todos los productos →</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}