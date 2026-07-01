'use client'
import { useState } from 'react'
export function ProductFAQ({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState<number|null>(0)
  return (
    <section className="section-spacing bg-white">
      <div className="container-custom max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-3">Resolvemos tus dudas</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900">Preguntas frecuentes</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq,i) => (
            <div key={i} className="border border-gray-200 rounded-2xl overflow-hidden">
              <button onClick={() => setOpen(open===i?null:i)} className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors">
                <span className="font-semibold text-gray-900 pr-4 text-sm md:text-base">{faq.question}</span>
                <svg className={`w-5 h-5 text-green-600 flex-shrink-0 transition-transform duration-200 ${open===i?'rotate-180':''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              {open===i&&<div className="px-6 pb-5"><p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}