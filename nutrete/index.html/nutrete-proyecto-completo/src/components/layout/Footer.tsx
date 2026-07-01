// ══════════════════════════════════════════════════════════════
// src/components/layout/Footer.tsx
// ══════════════════════════════════════════════════════════════

import Link from 'next/link'

export function Footer() {
  const year = new Date().getFullYear()

  const categories = [
    { label: 'Articulaciones', href: '/categorias/articulaciones' },
    { label: 'Presión arterial', href: '/categorias/presion' },
    { label: 'Control de peso', href: '/categorias/peso' },
    { label: 'Potencia masculina', href: '/categorias/potencia' },
    { label: 'Memoria y enfoque', href: '/categorias/memoria' },
    { label: 'Diabetes', href: '/categorias/diabetes' },
  ]

  const info = [
    { label: 'Sobre nutrEte', href: '/nosotros' },
    { label: 'Cómo funciona', href: '/como-funciona' },
    { label: 'Preguntas frecuentes', href: '/faq' },
    { label: 'Contacto', href: '/contacto' },
    { label: 'Política de privacidad', href: '/privacidad' },
    { label: 'Términos y condiciones', href: '/terminos' },
  ]

  return (
    <footer className="bg-gray-950 text-gray-400">
      {/* Main footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">N</span>
              </div>
              <span className="font-display font-bold text-xl text-white">
                nutr<span className="text-brand-400">E</span>te
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-500">
              Productos naturales de salud seleccionados para Latinoamérica. Tu bienestar, nuestra misión.
            </p>
            <div className="flex gap-3 mt-5">
              {['🇦🇷','🇲🇽','🇨🇴','🇵🇪','🇨🇱'].map((flag, i) => (
                <span key={i} className="text-lg">{flag}</span>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Categorías</h4>
            <ul className="space-y-2.5">
              {categories.map(c => (
                <li key={c.href}>
                  <Link href={c.href} className="text-sm hover:text-brand-400 transition-colors">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Información</h4>
            <ul className="space-y-2.5">
              {info.map(i => (
                <li key={i.href}>
                  <Link href={i.href} className="text-sm hover:text-brand-400 transition-colors">
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Por qué nutrEte</h4>
            <ul className="space-y-3">
              {[
                { icon: '🔒', text: 'Datos 100% seguros' },
                { icon: '📦', text: 'Envío a domicilio' },
                { icon: '💳', text: 'Pagas al recibir' },
                { icon: '🌿', text: 'Solo productos naturales' },
                { icon: '⭐', text: '+50.000 pedidos entregados' },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <p>© {year} nutrEte. Todos los derechos reservados.</p>
          <p className="text-center">
            Los productos son suplementos naturales. No reemplazan tratamientos médicos. Consulta a tu médico.
          </p>
        </div>
      </div>
    </footer>
  )
}
