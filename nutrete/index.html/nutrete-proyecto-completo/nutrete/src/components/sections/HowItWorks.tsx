export function HowItWorks() {
  const steps = [
    {number:'01',icon:'🔍',title:'Encontra tu producto',desc:'Busca entre nuestros productos el que resuelve tu problema. Nuestro asesor IA te puede orientar.'},
    {number:'02',icon:'📝',title:'Completa tu pedido',desc:'Solo necesitas tu nombre y telefono. Sin tarjeta de credito, sin registrarte.'},
    {number:'03',icon:'📱',title:'Te contactamos',desc:'Nuestro equipo te llama para confirmar tu direccion y los detalles del envio.'},
    {number:'04',icon:'📦',title:'Recibes y pagas',desc:'El producto llega a tu puerta. Revisas, quedas conforme, y recien ahi pagas.'},
  ]
  return (
    <section id="como-funciona" className="section-spacing bg-white">
      <div className="container-custom">
        <div className="text-center mb-14">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-3">Simple y seguro</p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">¿Como funciona?</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">En 4 pasos simples, el producto llega a tu puerta.</p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="text-center group">
              <div className="w-20 h-20 bg-green-50 group-hover:bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors">
                <span className="text-3xl">{step.icon}</span>
              </div>
              <div className="text-4xl font-display font-bold text-green-100 mb-1">{step.number}</div>
              <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}