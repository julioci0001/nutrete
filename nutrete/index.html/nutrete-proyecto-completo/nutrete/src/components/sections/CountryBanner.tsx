'use client'
import { useState } from 'react'
interface Props { country: string; countryName: string; flag: string }
export function CountryBanner({ country, countryName, flag }: Props) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null
  return (
    <div className="bg-green-50 border-y border-green-100">
      <div className="container-custom">
        <div className="flex items-center justify-between py-3 gap-4">
          <div className="flex items-center gap-3 text-sm text-green-800">
            <span className="text-xl">{flag}</span>
            <p><span className="font-semibold">Mostrando productos para {countryName}.</span>{' '}¿No es tu pais?{' '}
              <button onClick={() => { document.cookie = 'nutrete_country_manual=;max-age=0;path=/'; window.location.reload() }} className="underline hover:no-underline font-medium">Cambiar</button>
            </p>
          </div>
          <button onClick={() => setDismissed(true)} className="text-green-500 hover:text-green-700">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      </div>
    </div>
  )
}