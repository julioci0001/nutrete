'use client'
// ══════════════════════════════════════════════════════════════
// src/components/product/ProductHero.tsx
// ══════════════════════════════════════════════════════════════

import { useState } from 'react'
import Link from 'next/link'
import { formatPrice } from '@/lib/geo/detect'

interface ProductHeroProps {
  product:     any
  countryData: any
  country:     string
  countryName: string
}

export function ProductHero({ product, countryData, country, countryName }: ProductHeroProps) {
  const [imgLoaded, setImgLoaded] = useState(false)

  const stars = Array.from({ length: 5 })
  const rating = 4.9
  const reviewCount = product.testimonials?.length ?? 0

  return (
    <section className="bg-hero-gradient pt-20 pb-10 md:pt-28 md:pb-16">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left: image */}
          <div className="relative order-1 md:order-none">
            <div className="relative rounded-3xl overflow-hidden bg-white shadow-premium aspect-square max-w-md mx-auto">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.image_alt || product.name}
                  onLoad={() => setImgLoaded(true)}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl bg-brand-50">
                  🌿
                </div>
              )}

              {/* Float badge: discount */}
              {product.discount && (
                <div className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full">
                  -{product.discount}%
                </div>
              )}
            </div>

            {/* Floating trust chip */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-card border border-gray-100 px-5 py-3 flex items-center gap-3 whitespace-nowrap">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <p className="text-xs font-bold text-gray-900">Disponible en {countryName}</p>
                <p className="text-xs text-gray-500">Envío a domicilio</p>
              </div>
            </div>
          </div>

          {/* Right: content */}
          <div className="space-y-5">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-gray-400">
              <Link href="/" className="hover:text-gray-600">Inicio</Link>
              <span>/</span>
              <Link href="/productos" className="hover:text-gray-600">Productos</Link>
              <span>/</span>
              <span className="text-gray-600">{product.name}</span>
            </nav>

            {/* Category */}
            <div className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-brand-200">
              🌿 {product.category}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Tagline */}
            {product.tagline && (
              <p className="text-xl text-gray-600 leading-relaxed">{product.tagline}</p>
            )}

            {/* Stars */}
            {reviewCount > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {stars.map((_, i) => (
                    <span key={i} className={`text-sm ${i < Math.floor(rating) ? 'star-filled' : 'star-empty'}`}>★</span>
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-900">{rating}</span>
                <span className="text-sm text-gray-400">({reviewCount} opiniones)</span>
              </div>
            )}

            {/* Price */}
            {countryData?.price && (
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(countryData.price, countryData.currency)}
                </span>
                {product.discount && (
                  <span className="text-lg text-gray-400 line-through">
                    {formatPrice(countryData.price * (1 + product.discount / 100), countryData.currency)}
                  </span>
                )}
              </div>
            )}

            {/* CTA */}
            <div className="space-y-3">
              <a href="#pedido" className="btn-primary btn-orange w-full text-lg py-4 text-center">
                🛒 {product.cta_text || 'Quiero mi producto'}
              </a>
              <p className="text-center text-sm text-gray-500">
                💳 Pagas cuando lo recibís · 📦 Envío a {countryName}
              </p>
            </div>

            {/* Quick benefits */}
            {product.benefits?.slice(0, 3).map((b: any, i: number) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">{b.title}: </span>
                  {b.description}
                </p>
              </div>
            ))}

            {/* Scarcity */}
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
