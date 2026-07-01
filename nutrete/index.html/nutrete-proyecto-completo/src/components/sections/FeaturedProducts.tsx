// ══════════════════════════════════════════════════════════════
// src/components/sections/FeaturedProducts.tsx  (Server Component)
// ══════════════════════════════════════════════════════════════

import Link from 'next/link'
import { getProductsByCountry } from '@/lib/db/client'

interface FeaturedProductsProps {
  country: string
}

export async function FeaturedProducts({ country }: FeaturedProductsProps) {
  const products = await getProductsByCountry(country)

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-5xl mb-4">🌿</p>
        <p className="text-gray-500 text-lg">
          Pronto habrá productos disponibles para tu país.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product: any) => (
        <ProductCard key={product.product_id} product={product} />
      ))}
    </div>
  )
}

// ── Product Card ──────────────────────────────────────────────
function ProductCard({ product }: { product: any }) {
  const categoryEmoji: Record<string, string> = {
    articulaciones: '🦴', diabetes: '💉', presion: '❤️', peso: '⚖️',
    potencia: '⚡', memoria: '🧠', vision: '👁️', sueno: '🌙',
    digestivo: '🫀', energia: '🔥', piel: '✨', general: '🌿',
  }

  return (
    <Link href={`/productos/${product.slug}`} className="group block">
      <div className="card h-full hover:shadow-card-hover transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-[4/3] rounded-t-2xl overflow-hidden bg-gray-50">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              {categoryEmoji[product.category] ?? '🌿'}
            </div>
          )}
          {/* Category badge */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-gray-700">
            {categoryEmoji[product.category]} {product.category}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-display font-bold text-gray-900 text-lg leading-snug mb-1.5 group-hover:text-brand-700 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-500 text-sm line-clamp-2 mb-4">
            {product.tagline}
          </p>

          {/* Price + CTA */}
          <div className="flex items-center justify-between">
            {product.price && (
              <div>
                <span className="font-bold text-gray-900 text-lg">
                  {product.currency} {Number(product.price).toLocaleString()}
                </span>
              </div>
            )}
            <span className="btn-primary py-2 px-4 text-sm ml-auto">
              Ver producto →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

// ── Skeleton loader ───────────────────────────────────────────
export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="card animate-pulse">
          <div className="skeleton aspect-[4/3] rounded-t-2xl" />
          <div className="p-5 space-y-3">
            <div className="skeleton h-5 w-3/4 rounded" />
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-2/3 rounded" />
            <div className="flex justify-end mt-2">
              <div className="skeleton h-9 w-28 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
