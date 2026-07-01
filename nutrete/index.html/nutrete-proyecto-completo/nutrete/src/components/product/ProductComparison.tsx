export function ProductComparison({ table, productName }: { table: any; productName: string }) {
  if (!table?.headers||!table?.rows) return null
  return (
    <section className="section-spacing bg-gray-50">
      <div className="container-custom max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-3">¿Por que elegir {productName}?</h2>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
          <table className="w-full bg-white">
            <thead>
              <tr className="bg-gray-900 text-white">
                {table.headers.map((h:string,i:number) => <th key={i} className={`px-5 py-4 text-sm font-semibold text-left ${i===1?'bg-green-700':''}`}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row:any,i:number) => (
                <tr key={i} className={`border-t border-gray-100 ${i%2===0?'bg-white':'bg-gray-50'}`}>
                  <td className="px-5 py-3.5 text-sm font-medium text-gray-700">{row.label}</td>
                  {row.values.map((val:string,j:number) => (
                    <td key={j} className={`px-5 py-3.5 text-sm ${j===0?'text-green-700 font-medium bg-green-50':'text-gray-500'}`}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}