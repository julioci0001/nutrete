export function ProductBenefits({ benefits, productName }: { benefits: any[]; productName: string }) {
  return (
    <section className="section-spacing bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-3">Lo que hace</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900">Beneficios de <span className="text-gradient-green">{productName}</span></h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {benefits.map((b:any,i:number) => (
            <div key={i} className="bg-gray-50 hover:bg-green-50 border border-gray-100 hover:border-green-200 rounded-2xl p-6 transition-colors group">
              <div className="text-3xl mb-3">{b.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">{b.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}