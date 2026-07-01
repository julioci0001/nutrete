export function TrustSignals() {
  return (
    <section className="py-10 bg-white border-b border-gray-100">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[{icon:'🌿',title:'100% Natural',desc:'Ingredientes de origen natural, sin quimicos artificiales'},
            {icon:'📦',title:'Envio a domicilio',desc:'Llega directo a tu casa en dias habiles'},
            {icon:'💳',title:'Pagas al recibir',desc:'Sin riesgo. Ves el producto antes de pagar'},
            {icon:'🔒',title:'Datos seguros',desc:'Tu informacion esta protegida al 100%'}].map((s,i) => (
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