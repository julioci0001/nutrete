'use client'
import { useState } from 'react'
export function ProductTestimonials({ testimonials, country, productName }: { testimonials: any[]; country: string; productName: string }) {
  const [showAll, setShowAll] = useState(false)
  const sorted = [...testimonials].sort((a,b) => { if (a.country===country&&b.country!==country) return -1; if (b.country===country&&a.country!==country) return 1; return 0 })
  const visible = showAll ? sorted : sorted.slice(0,3)
  return (
    <section className="section-spacing bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-3">Historias reales</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-3">Clientes que transformaron su salud</h2>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <span className="text-yellow-400">★★★★★</span><span className="font-semibold text-gray-900">4.9/5</span>
            <span>·</span><span>{testimonials.length} opiniones verificadas</span>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {visible.map((t:any,i:number) => (
            <div key={t.id||i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
              <div className="flex gap-0.5 mb-3">{Array.from({length:5}).map((_,j) => <span key={j} className={`text-sm ${j<(t.rating??5)?'star-filled':'text-gray-300'}`}>★</span>)}</div>
              {t.before&&t.after&&(
                <div className="flex gap-2 mb-4 text-xs flex-wrap">
                  <span className="bg-red-50 text-red-600 border border-red-100 rounded-full px-2 py-1">Antes: {t.before}</span>
                  <span className="bg-green-50 text-green-700 border border-green-100 rounded-full px-2 py-1">Ahora: {t.after}</span>
                </div>
              )}
              <p className="text-gray-700 text-sm leading-relaxed flex-1">"{t.text}"</p>
              <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100">
                <img src={t.avatar||`https://api.dicebear.com/8.x/notionists/svg?seed=${encodeURIComponent(t.name)}`} alt={t.name} className="w-10 h-10 rounded-full bg-gray-100" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.age} anos · {t.city}, {t.country}{t.verified&&<span className="ml-1 text-green-500">✓</span>}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {testimonials.length>3&&!showAll&&(
          <div className="text-center mt-8">
            <button onClick={() => setShowAll(true)} className="text-green-600 hover:text-green-800 font-medium text-sm underline">Ver las {testimonials.length-3} opiniones restantes</button>
          </div>
        )}
      </div>
    </section>
  )
}