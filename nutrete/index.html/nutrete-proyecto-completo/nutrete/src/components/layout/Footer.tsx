import Link from 'next/link'
export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">N</span>
              </div>
              <span className="font-display font-bold text-xl text-white">nutr<span className="text-green-400">E</span>te</span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-500">Productos naturales de salud para Latinoamerica. Tu bienestar, nuestra mision.</p>
            <div className="flex gap-3 mt-5">{['🇦🇷','🇲🇽','🇨🇴','🇵🇪','🇨🇱'].map((f,i) => <span key={i} className="text-lg">{f}</span>)}</div>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Categorias</h4>
            <ul className="space-y-2.5">
              {[['Articulaciones','/categorias/articulaciones'],['Presion','/categorias/presion'],['Control de peso','/categorias/peso'],['Potencia','/categorias/potencia'],['Memoria','/categorias/memoria'],['Diabetes','/categorias/diabetes']].map(([l,h]) => (
                <li key={h}><Link href={h} className="text-sm hover:text-green-400 transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Por que nutrEte</h4>
            <ul className="space-y-3">
              {[['🔒','Datos 100% seguros'],['📦','Envio a domicilio'],['💳','Pagas al recibir'],['🌿','Solo productos naturales'],['⭐','+50.000 pedidos entregados']].map(([icon,text],i) => (
                <li key={i} className="flex items-center gap-2 text-sm"><span>{icon}</span><span>{text}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="container-custom py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <p>© {year} nutrEte. Todos los derechos reservados.</p>
          <p className="text-center">Los productos son suplementos naturales. No reemplazan tratamientos medicos.</p>
        </div>
      </div>
    </footer>
  )
}