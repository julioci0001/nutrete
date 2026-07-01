// ══════════════════════════════════════════════════════════════
// src/components/product/ProductBenefits.tsx
// ══════════════════════════════════════════════════════════════

export function ProductBenefits({ benefits, productName }: { benefits: any[]; productName: string }) {
  return (
    <section className="section-spacing bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-3">Lo que hace</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900">
            Beneficios de <span className="text-gradient-green">{productName}</span>
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {benefits.map((benefit: any, i: number) => (
            <div key={i} className="bg-gray-50 hover:bg-brand-50 border border-gray-100 hover:border-brand-200 rounded-2xl p-6 transition-colors group">
              <div className="text-3xl mb-3">{benefit.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2 group-hover:text-brand-700 transition-colors">
                {benefit.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════
// src/components/product/ProductIngredients.tsx
// ══════════════════════════════════════════════════════════════

export function ProductIngredients({ ingredients }: { ingredients: any[] }) {
  return (
    <section className="section-spacing bg-gray-50">
      <div className="container-custom max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-3">Fórmula natural</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900">
            Ingredientes activos
          </h2>
          <p className="text-gray-500 mt-3">Cada ingrediente fue elegido por su eficacia comprobada.</p>
        </div>
        <div className="space-y-4">
          {ingredients.map((ing: any, i: number) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 flex gap-5 items-start shadow-sm">
              <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                🌿
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-gray-900">{ing.name}</h3>
                  {ing.dosage && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{ing.dosage}</span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{ing.description}</p>
                {ing.benefit && (
                  <p className="text-xs text-brand-600 font-medium mt-1">✓ {ing.benefit}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════
// src/components/product/ProductComparison.tsx
// ══════════════════════════════════════════════════════════════

export function ProductComparison({ table, productName }: { table: any; productName: string }) {
  if (!table?.headers || !table?.rows) return null

  return (
    <section className="section-spacing bg-gray-50">
      <div className="container-custom max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-3">
            ¿Por qué elegir {productName}?
          </h2>
          <p className="text-gray-500">Compara con otras alternativas</p>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
          <table className="w-full bg-white">
            <thead>
              <tr className="bg-gray-900 text-white">
                {table.headers.map((h: string, i: number) => (
                  <th key={i} className={`px-5 py-4 text-sm font-semibold text-left ${i === 1 ? 'bg-brand-700' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row: any, i: number) => (
                <tr key={i} className={`border-t border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-5 py-3.5 text-sm font-medium text-gray-700">{row.label}</td>
                  {row.values.map((val: string, j: number) => (
                    <td key={j} className={`px-5 py-3.5 text-sm ${j === 0 ? 'text-brand-700 font-medium bg-brand-50' : 'text-gray-500'}`}>
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════
// src/components/product/StickyBuy.tsx
// ══════════════════════════════════════════════════════════════

'use client'
import { useState, useEffect } from 'react'
import { formatPrice } from '@/lib/geo/detect'

interface StickyBuyProps {
  productName: string
  ctaText:     string
  price?:      number
  currency?:   string
}

export function StickyBuy({ productName, ctaText, price, currency }: StickyBuyProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white border-t border-gray-200 shadow-premium px-4 py-3 transition-transform duration-300 ${visible ? 'translate-y-0' : 'translate-y-full'}`}>
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm truncate">{productName}</p>
          {price && currency && (
            <p className="text-brand-600 font-bold text-sm">{formatPrice(price, currency)}</p>
          )}
        </div>
        <a
          href="#pedido"
          className="btn-primary btn-orange py-3 px-5 text-sm flex-shrink-0"
        >
          {ctaText || 'Pedir ahora'}
        </a>
      </div>
    </div>
  )
}
