import { Suspense } from 'react'
import { getGeoData } from '@/lib/geo/detect'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FeaturedProducts, ProductGridSkeleton } from '@/components/sections/FeaturedProducts'
import type { Metadata } from 'next'
export const dynamic = 'force-dynamic'
export async function generateMetadata(): Promise<Metadata> {
  const geo = await getGeoData()
  return { title: `Todos los productos para ${geo.countryName} | nutrEte`, description: `Productos naturales disponibles en ${geo.countryName}. Pago al recibir.` }
}
const CATS = [
  { id:'all',label:'Todos',icon:'🌿' },{ id:'articulaciones',label:'Articulaciones',icon:'🦴' },
  { id:'diabetes',label:'Diabetes',icon:'💉' },{ id:'presion',label:'Presion',icon:'❤️' },
  { id:'peso',label:'Peso',icon:'⚖️' },{ id:'potencia',label:'Potencia',icon:'⚡' },
  { id:'memoria',label:'Memoria',icon:'🧠' },{ id:'sueno',label:'Sueno',icon:'🌙' },
]
export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const [geo, params] = await Promise.all([getGeoData(), searchParams])
  const active = params.category ?? 'all'
  return (
    <>
      <Header country={geo.country} countryName={geo.countryName} />
      <main className="pt-20 min-h-screen">
        <div className="bg-hero-gradient py-14 border-b border-gray-100">
          <div className="container-custom text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-3">Todos los productos</h1>
            <p className="text-gray-500 text-lg">Disponibles en {geo.countryName}. Naturales, con envio a domicilio.</p>
          </div>
        </div>
        <div className="sticky top-16 z-20 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
          <div className="container-custom overflow-x-auto">
            <div className="flex items-center gap-2 py-3 min-w-max">
              {CATS.map(cat => (
                <a key={cat.id} href={cat.id === 'all' ? '/productos' : `/productos?category=${cat.id}`}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${active === cat.id ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  <span>{cat.icon}</span> {cat.label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <section className="section-spacing">
          <div className="container-custom">
            <Suspense fallback={<ProductGridSkeleton />}>
              <FeaturedProducts country={geo.country} />
            </Suspense>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}