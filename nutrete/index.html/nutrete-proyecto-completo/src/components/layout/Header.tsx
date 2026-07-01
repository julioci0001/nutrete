'use client'
// ══════════════════════════════════════════════════════════════
// src/components/layout/Header.tsx
// ══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { SUPPORTED_COUNTRIES } from '@/types'

interface HeaderProps {
  country:     string
  countryName: string
  transparent?: boolean
}

export function Header({ country, countryName, transparent = false }: HeaderProps) {
  const [scrolled, setScrolled]         = useState(false)
  const [menuOpen, setMenuOpen]         = useState(false)
  const [countryOpen, setCountryOpen]   = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const flag = SUPPORTED_COUNTRIES[country]?.flag ?? '🌎'

  const navLinks = [
    { href: '/productos',   label: 'Productos' },
    { href: '/categorias',  label: 'Categorías' },
    { href: '/nosotros',    label: 'Nosotros' },
  ]

  const bgClass = transparent && !scrolled
    ? 'bg-transparent'
    : 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${bgClass}`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-18">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-brand-700 transition-colors">
              <span className="text-white text-sm font-bold">N</span>
            </div>
            <span className="font-display font-bold text-xl text-gray-900">
              nutr<span className="text-brand-600">E</span>te
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-brand-700 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Country selector */}
            <div className="relative">
              <button
                onClick={() => setCountryOpen(p => !p)}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-2 py-1 rounded-lg hover:bg-gray-100"
              >
                <span>{flag}</span>
                <span className="hidden sm:inline">{country}</span>
                <svg className={`w-3 h-3 transition-transform ${countryOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {countryOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-premium border border-gray-100 py-2 z-50">
                  <p className="text-xs text-gray-400 px-4 py-1 font-medium uppercase tracking-wider">Cambiar país</p>
                  {Object.entries(SUPPORTED_COUNTRIES).map(([code, info]) => (
                    <button
                      key={code}
                      onClick={() => {
                        document.cookie = `nutrete_country_manual=${code};max-age=${60*60*24*30};path=/`
                        window.location.reload()
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${code === country ? 'text-brand-700 font-semibold' : 'text-gray-700'}`}
                    >
                      <span className="text-base">{info.flag}</span>
                      <span>{info.name}</span>
                      {code === country && <span className="ml-auto text-brand-500 text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CTA button */}
            <Link href="/productos" className="hidden sm:flex btn-primary py-2 px-4 text-sm">
              Ver productos
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(p => !p)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              aria-label="Menú"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1 animate-fade-in">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl font-medium"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/productos" className="block btn-primary text-center mt-3">
            Ver productos
          </Link>
        </div>
      )}

      {/* Backdrop for country selector */}
      {countryOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setCountryOpen(false)} />
      )}
    </header>
  )
}
