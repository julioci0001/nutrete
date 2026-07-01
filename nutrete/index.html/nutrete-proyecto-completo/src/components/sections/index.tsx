// ══════════════════════════════════════════════════════════════
// src/components/sections/CountryBanner.tsx
// ══════════════════════════════════════════════════════════════

'use client'
import { useState } from 'react'

interface CountryBannerProps {
  country:     string
  countryName: string
  flag:        string
}

export function CountryBanner({ country, countryName, flag }: CountryBannerProps) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  return (
    <div className="bg-brand-50 border-y border-brand-100">
      <div className="container-custom">
        <div className="flex items-center justify-between py-3 gap-4">
          <div className="flex items-center gap-3 text-sm text-brand-800">
            <span className="text-xl">{flag}</span>
            <p>
              <span className="font-semibold">Mostrando productos para {countryName}.</span>
              {' '}¿No es tu país?{' '}
              <button
                onClick={() => {
                  document.cookie = `nutrete_country_manual=;max-age=0;path=/`
                  window.location.reload()
                }}
                className="underline hover:no-underline font-medium"
              >
                Cambiar
              </button>
            </p>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-brand-500 hover:text-brand-700 flex-shrink-0"
            aria-label="Cerrar"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// src/components/sections/TrustSignals.tsx
// ══════════════════════════════════════════════════════════════

export function TrustSignals() {
  const signals = [
    {
      icon: '🌿',
      title: '100% Natural',
      desc: 'Ingredientes de origen natural, sin químicos artificiales',
    },
    {
      icon: '📦',
      title: 'Envío a domicilio',
      desc: 'Llega directo a tu casa en días hábiles',
    },
    {
      icon: '💳',
      title: 'Pagas al recibir',
      desc: 'Sin riesgo. Ves el producto antes de pagar',
    },
    {
      icon: '🔒',
      title: 'Datos seguros',
      desc: 'Tu información está protegida al 100%',
    },
  ]

  return (
    <section className="py-10 bg-white border-b border-gray-100">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {signals.map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-2">
              <span className="text-3xl">{s.icon}</span>
              <p className="font-semibold text-gray-900 text-sm">{s.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════
// src/components/sections/HowItWorks.tsx
// ══════════════════════════════════════════════════════════════

export function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon:   '🔍',
      title:  'Encontrá tu producto',
      desc:   'Buscá entre nuestros productos el que resuelve tu problema. Podés hablar con nuestro asesor IA para que te oriente.',
    },
    {
      number: '02',
      icon:   '📝',
      title:  'Completá tu pedido',
      desc:   'Solo necesitás tu nombre y teléfono. Sin tarjeta de crédito, sin registrarte. Es así de simple.',
    },
    {
      number: '03',
      icon:   '📱',
      title:  'Te contactamos',
      desc:   'Nuestro equipo te llama o escribe para confirmar tu dirección y los detalles del envío.',
    },
    {
      number: '04',
      icon:   '📦',
      title:  'Recibís y pagás',
      desc:   'El producto llega a tu puerta. Revisás, quedás conforme, y recién ahí pagás. Sin riesgo.',
    },
  ]

  return (
    <section id="como-funciona" className="section-spacing bg-white">
      <div className="container-custom">
        <div className="text-center mb-14">
          <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-3">Simple y seguro</p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
            ¿Cómo funciona?
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            En 4 pasos simples, el producto llega a tu puerta.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative text-center group">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gray-100 z-0" />
              )}

              <div className="relative z-10">
                <div className="w-20 h-20 bg-brand-50 group-hover:bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors">
                  <span className="text-3xl">{step.icon}</span>
                </div>
                <div className="text-4xl font-display font-bold text-brand-100 mb-1">{step.number}</div>
                <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════
// src/components/sections/CategoryGrid.tsx
// ══════════════════════════════════════════════════════════════

import Link from 'next/link'

export function CategoryGrid() {
  const categories = [
    { icon: '🦴', label: 'Articulaciones', href: '/categorias/articulaciones', color: 'bg-orange-50 hover:bg-orange-100 text-orange-700' },
    { icon: '💉', label: 'Diabetes',        href: '/categorias/diabetes',        color: 'bg-blue-50   hover:bg-blue-100   text-blue-700'   },
    { icon: '❤️', label: 'Presión',         href: '/categorias/presion',          color: 'bg-red-50    hover:bg-red-100    text-red-700'    },
    { icon: '⚖️', label: 'Peso',            href: '/categorias/peso',             color: 'bg-green-50  hover:bg-green-100  text-green-700'  },
    { icon: '⚡', label: 'Potencia',        href: '/categorias/potencia',         color: 'bg-purple-50 hover:bg-purple-100 text-purple-700' },
    { icon: '🧠', label: 'Memoria',         href: '/categorias/memoria',          color: 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700' },
    { icon: '👁️', label: 'Visión',          href: '/categorias/vision',           color: 'bg-cyan-50   hover:bg-cyan-100   text-cyan-700'   },
    { icon: '🌙', label: 'Sueño',           href: '/categorias/sueno',            color: 'bg-slate-50  hover:bg-slate-100  text-slate-700'  },
  ]

  return (
    <section className="section-spacing bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-3">
            Busca por tu problema
          </h2>
          <p className="text-gray-500">Cada categoría tiene productos específicos para tu necesidad.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map(cat => (
            <Link
              key={cat.href}
              href={cat.href}
              className={`flex flex-col items-center gap-3 p-5 rounded-2xl transition-colors cursor-pointer ${cat.color}`}
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="font-semibold text-sm text-center">{cat.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════
// src/components/sections/Testimonials.tsx
// ══════════════════════════════════════════════════════════════

export function Testimonials({ country }: { country: string }) {
  const testimonials = [
    {
      name: 'María Elena R.',
      age:  58,
      country: 'AR',
      rating: 5,
      text:   'Llevaba años con dolor de rodillas. Después de 3 semanas noté una diferencia enorme. Ahora puedo caminar sin problema.',
      product: 'Producto para Articulaciones',
    },
    {
      name: 'Carlos M.',
      age:  62,
      country: 'MX',
      rating: 5,
      text:   'Mi médico quedó impresionado con mis análisis. No esperaba resultados tan rápidos siendo 100% natural.',
      product: 'Producto para Presión',
    },
    {
      name: 'Ana Sofía T.',
      age:  45,
      country: 'CO',
      rating: 5,
      text:   'Lo mejor fue la atención. Me explicaron todo antes de pagar y el envío llegó en 3 días. Muy confiable.',
      product: 'Producto para Peso',
    },
  ]

  return (
    <section className="section-spacing bg-brand-950">
      <div className="container-custom">
        <div className="text-center mb-12">
          <p className="text-brand-400 font-semibold text-sm uppercase tracking-widest mb-3">Testimonios reales</p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Lo que dicen nuestros clientes
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <span key={j} className="star-filled text-sm">★</span>
                ))}
              </div>
              <p className="text-gray-200 text-sm leading-relaxed mb-5">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-700 flex items-center justify-center text-white font-bold text-sm">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}, {t.age}</p>
                  <p className="text-brand-400 text-xs">{t.product}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
