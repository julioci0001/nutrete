'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
interface HeroProps { country: string; countryName: string }
export function Hero({ country, countryName }: HeroProps) {
  const ref = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    el.style.opacity = '0'; el.style.transform = 'translateY(16px)'
    requestAnimationFrame(() => { el.style.transition = 'opacity 0.7s ease, transform 0.7s ease'; el.style.opacity = '1'; el.style.transform = 'translateY(0)' })
  }, [])
  return (
    <section className="bg-hero-gradient pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden relative">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-green-700 text-sm font-medium">Productos disponibles en {countryName}</span>
          </div>
          <h1 ref={ref} className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-gray-900 leading-tight mb-6">
            Tu cuerpo merece <span className="text-gradient-green">soluciones naturales</span> que realmente funcionen
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Productos naturales para {countryName}. Enviados a tu domicilio. Pagas cuando los recibes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/productos" className="btn-primary text-base px-8 py-4 w-full sm:w-auto">Ver productos para mi →</Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 pt-8 border-t border-gray-100">
            {[{value:'+50.000',label:'pedidos entregados'},{value:'4.9★',label:'calificacion promedio'},{value:'12',label:'paises disponibles'}].map((s,i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-display font-bold text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}