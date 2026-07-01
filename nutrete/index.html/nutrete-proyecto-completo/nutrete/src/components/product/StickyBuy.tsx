'use client'
import { useState, useEffect } from 'react'
import { formatPrice } from '@/lib/geo/detect'
interface Props { productName: string; ctaText: string; price?: number; currency?: string }
export function StickyBuy({ productName, ctaText, price, currency }: Props) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div className={`fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white border-t border-gray-200 shadow-premium px-4 py-3 transition-transform duration-300 ${visible?'translate-y-0':'translate-y-full'}`}>
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm truncate">{productName}</p>
          {price&&currency&&<p className="text-green-600 font-bold text-sm">{formatPrice(price,currency)}</p>}
        </div>
        <a href="#pedido" className="btn-primary btn-orange py-3 px-5 text-sm flex-shrink-0">{ctaText||'Pedir ahora'}</a>
      </div>
    </div>
  )
}