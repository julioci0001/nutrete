'use client'
// ══════════════════════════════════════════════════════════════
// src/components/sections/Hero.tsx
// ══════════════════════════════════════════════════════════════

import { useEffect, useRef } from 'react'
import Link from 'next/link'

interface HeroProps {
  country:     string
  countryName: string
}

export function Hero({ country, countryName }: HeroProps) {
  const headlineRef = useRef<HTMLHeadingElement>(null)

  // Subtle reveal on load
  useEffect(() => {
    const el = headlineRef.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(16px)'
    requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.7s ease, transform 0.7s ease'
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    })
  }, [])

  return (
    <section className="bg-hero-gradient pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse-slow" />
            <span className="text-brand-700 text-sm font-medium">
              Productos disponibles en {countryName}
            </span>
          </div>

          {/* Headline */}
          <h1
            ref={headlineRef}
            className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-gray-900 leading-tight mb-6"
          >
            Tu cuerpo merece{' '}
            <span className="text-gradient-green">soluciones naturales</span>
            {' '}que realmente funcionen
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Productos naturales seleccionados para {countryName}. Enviados a tu domicilio.
            Pagas cuando los recibes, sin riesgo.
          </p>

          {/* CTA group */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/productos" className="btn-primary text-base px-8 py-4 w-full sm:w-auto">
              Ver productos para mí →
            </Link>
            <Link
              href="#como-funciona"
              className="text-gray-600 hover:text-gray-900 font-medium text-sm flex items-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Cómo funciona
            </Link>
          </div>

          {/* Social proof strip */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 pt-8 border-t border-gray-100">
            {[
              { value: '+50.000', label: 'pedidos entregados' },
              { value: '4.9★',   label: 'calificación promedio' },
              { value: '12',     label: 'países disponibles' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-display font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-brand-100 rounded-full blur-3xl opacity-30 pointer-events-none" aria-hidden />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-earth-100 rounded-full blur-3xl opacity-25 pointer-events-none" aria-hidden />
    </section>
  )
}
