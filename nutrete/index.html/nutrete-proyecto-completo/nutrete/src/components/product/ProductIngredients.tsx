export function ProductIngredients({ ingredients }: { ingredients: any[] }) {
  return (
    <section className="section-spacing bg-gray-50">
      <div className="container-custom max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-3">Formula natural</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900">Ingredientes activos</h2>
        </div>
        <div className="space-y-4">
          {ingredients.map((ing:any,i:number) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 flex gap-5 items-start shadow-sm">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">🌿</div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-gray-900">{ing.name}</h3>
                  {ing.dosage && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{ing.dosage}</span>}
                </div>
                <p className="text-sm text-gray-600">{ing.description}</p>
                {ing.benefit && <p className="text-xs text-green-600 font-medium mt-1">✓ {ing.benefit}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}