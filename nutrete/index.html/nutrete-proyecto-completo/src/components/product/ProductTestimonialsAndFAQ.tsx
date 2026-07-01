'use client'
// ══════════════════════════════════════════════════════════════
// src/components/product/ProductTestimonials.tsx
// ══════════════════════════════════════════════════════════════

import { useState } from 'react'

interface ProductTestimonialsProps {
  testimonials: any[]
  country:      string
  productName:  string
}

export function ProductTestimonials({ testimonials, country, productName }: ProductTestimonialsProps) {
  const [showAll, setShowAll] = useState(false)

  // Prefer testimonials from same country
  const sorted = [...testimonials].sort((a, b) => {
    if (a.country === country && b.country !== country) return -1
    if (b.country === country && a.country !== country) return 1
    return 0
  })

  const visible = showAll ? sorted : sorted.slice(0, 3)

  return (
    <section className="section-spacing bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-3">Historias reales</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-3">
            Clientes que transformaron su salud
          </h2>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <span className="text-yellow-400">★★★★★</span>
            <span className="font-semibold text-gray-900">4.9/5</span>
            <span>·</span>
            <span>{testimonials.length} opiniones verificadas</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {visible.map((t: any, i: number) => (
            <TestimonialCard key={t.id || i} t={t} />
          ))}
        </div>

        {testimonials.length > 3 && !showAll && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAll(true)}
              className="text-brand-600 hover:text-brand-800 font-medium text-sm underline"
            >
              Ver las {testimonials.length - 3} opiniones restantes
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

function TestimonialCard({ t }: { t: any }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
      {/* Stars */}
      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={`text-sm ${i < (t.rating ?? 5) ? 'star-filled' : 'star-empty'}`}>★</span>
        ))}
      </div>

      {/* Before/After chips */}
      {t.before && t.after && (
        <div className="flex gap-2 mb-4 text-xs">
          <span className="bg-red-50 text-red-600 border border-red-100 rounded-full px-2 py-1">Antes: {t.before}</span>
          <span className="bg-green-50 text-green-700 border border-green-100 rounded-full px-2 py-1">Ahora: {t.after}</span>
        </div>
      )}

      {/* Text */}
      <p className="text-gray-700 text-sm leading-relaxed flex-1">"{t.text}"</p>

      {/* Author */}
      <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100">
        <img
          src={t.avatar || `https://api.dicebear.com/8.x/notionists/svg?seed=${encodeURIComponent(t.name)}`}
          alt={t.name}
          className="w-10 h-10 rounded-full bg-gray-100"
        />
        <div>
          <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
          <p className="text-gray-400 text-xs">
            {t.age} años · {t.city}, {t.country}
            {t.verified && <span className="ml-1 text-green-500">✓ Verificado</span>}
          </p>
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// src/components/product/ProductFAQ.tsx
// ══════════════════════════════════════════════════════════════

'use client'
import { useState } from 'react'

interface ProductFAQProps {
  faqs: { question: string; answer: string }[]
}

export function ProductFAQ({ faqs }: ProductFAQProps) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="section-spacing bg-white">
      <div className="container-custom max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-3">Resolvemos tus dudas</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900">
            Preguntas frecuentes
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-200 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-4 text-sm md:text-base">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-brand-600 flex-shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
              </button>

              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
