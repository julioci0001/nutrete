'use client'
import { useState } from 'react'
import Link from 'next/link'
import { formatPrice } from '@/lib/geo/detect'
interface Props { product: any; countryData: any; country: string; countryName: string }
export function ProductHero({ product, countryData, country, countryName }: Props) {
  const [imgLoaded, setImgLoaded] = useState(false)
  return (
    <section className="bg-hero-gradient pt-20 pb-10 md:pt-28 md:pb-16">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative order-1 md:order-none">
            <div className="relative rounded-3xl overflow-hidden bg-white shadow-premium aspect-square max-w-md mx-auto">
              {product.image_url
                ? <img src={product.image_url} alt={product.image_alt || product.name} onLoad={() => setImgLoaded(true)} className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`} />
                : <div className="w-full h-full flex items-center justify-center text-8xl bg-green-50">🌿</div>}
              {product.discount && <div className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full">-{product.discount}%</div>}
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-lg border border-gray-100 px-5 py-3 flex items-center gap-3 whitespace-nowrap">
              <span className="text-green-500 text-xl">✓</span>
              <div><p className="text-xs font-bold text-gray-900">Disponible en {countryName}</p><p className="text-xs text-gray-500">Envio a domicilio</p></div>
            </div>
          </div>
          <div className="space-y-5">
            <nav className="flex items-center gap-2 text-xs text-gray-400">
              <Link href="/" className="hover:text-gray-600">Inicio</Link><span>/</span>
              <Link href="/productos" className="hover:text-gray-600">Productos</Link><span>/</span>
              <span className="text-gray-600">{product.name}</span>
            </nav>
            <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-green-200">🌿 {product.category}</div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-900 leading-tight">{product.name}</h1>
            {product.tagline && <p className="text-xl text-gray-600 leading-relaxed">{product.tagline}</p>}
            {product.testimonials?.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">{Array.from({length:5}).map((_,i) => <span key={i} className="text-sm star-filled">★</span>)}</div>
                <span className="text-sm font-semibold text-gray-900">4.9</span>
                <span className="text-sm text-gray-400">({product.testimonials.length} opiniones)</span>
              </div>
            )}
            {countryData?.price && (
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">{formatPrice(countryData.price, countryData.currency)}</span>
              </div>
            )}
            <div className="space-y-3">
              <a href="#pedido" className="btn-primary btn-orange w-full text-lg py-4 text-center block">🛒 {product.cta_text || 'Quiero mi producto'}</a>
              <p className="text-center text-sm text-gray-500">💳 Pagas cuando lo recibes · 📦 Envio a {countryName}</p>
            </div>
            {product.benefits?.slice(0,3).map((b:any,i:number) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <p className="text-sm text-gray-700"><span className="font-medium">{b.title}: </span>{b.description}</p>
              </div>
            ))}
            {product.scarcity_text && (
              <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
                <span className="text-orange-500">🔥</span>
                <p className="text-orange-700 text-sm font-medium">{product.scarcity_text}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}