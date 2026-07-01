'use client'
import { useState } from 'react'
export default function AdminPage() {
  const [form, setForm] = useState({ affiliateUrl: '', country: 'AR', additionalInfo: '', imageUrl: '', autoPublish: false })
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')
  const [result, setResult] = useState<any>(null)
  const handleIngest = async () => {
    setStatus('loading')
    const secret = window.prompt('Ingresa el Admin Secret:') || ''
    try {
      const res = await fetch('/api/ingest', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret }, body: JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data); setStatus('success')
    } catch (err) { setResult({ error: String(err) }); setStatus('error') }
  }
  const COUNTRIES = ['AR','MX','CO','PE','CL','EC','BO','PY','UY','VE']
  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold text-green-400">nutrEte — Admin</h1>
          <p className="text-gray-400 text-sm mt-1">Panel de administracion</p>
        </div>
        <div className="bg-gray-900 rounded-2xl p-6 space-y-5">
          <h2 className="text-xl font-bold mb-2">Agregar Nuevo Producto con IA</h2>
          <p className="text-gray-400 text-sm">Pega el link de TerraLeads y la IA genera todo el contenido automaticamente en ~45 segundos.</p>
          <div>
            <label className="block text-sm text-gray-400 mb-2">URL de Afiliado TerraLeads *</label>
            <input type="url" value={form.affiliateUrl} onChange={e => setForm(p => ({...p, affiliateUrl: e.target.value}))}
              placeholder="https://terraLeads.com/..." className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-green-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Pais objetivo *</label>
            <select value={form.country} onChange={e => setForm(p => ({...p, country: e.target.value}))} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white outline-none">
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Informacion adicional (opcional)</label>
            <textarea value={form.additionalInfo} onChange={e => setForm(p => ({...p, additionalInfo: e.target.value}))}
              placeholder="Nombre del producto, problema que resuelve, ingredientes clave..." rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-green-500 outline-none resize-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">URL de imagen (opcional)</label>
            <input type="url" value={form.imageUrl} onChange={e => setForm(p => ({...p, imageUrl: e.target.value}))}
              placeholder="https://..." className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-green-500 outline-none" />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.autoPublish} onChange={e => setForm(p => ({...p, autoPublish: e.target.checked}))} className="w-4 h-4 accent-green-500" />
            <span className="text-sm text-gray-300">Publicar automaticamente al finalizar</span>
          </label>
          <button onClick={handleIngest} disabled={!form.affiliateUrl || status === 'loading'}
            className="w-full btn-primary disabled:opacity-50 py-4">
            {status === 'loading' ? '⏳ La IA esta generando el contenido... (30-60 seg)' : '🚀 Generar contenido con IA'}
          </button>
        </div>
        {result && (
          <div className={`mt-6 p-5 rounded-2xl ${status === 'success' ? 'bg-green-950 border border-green-800' : 'bg-red-950 border border-red-800'}`}>
            {status === 'success' ? (
              <div>
                <p className="text-green-400 font-semibold text-lg mb-3">✅ Producto creado exitosamente</p>
                <p className="text-gray-300 text-sm mb-2">Slug: <span className="text-white font-mono">{result.slug}</span></p>
                <p className="text-gray-300 text-sm mb-4">Estado: <span className={result.status === 'active' ? 'text-green-400' : 'text-yellow-400'}>{result.status}</span></p>
                <a href={result.publicUrl} target="_blank" className="btn-primary py-2 px-4 text-sm">Ver producto →</a>
              </div>
            ) : <p className="text-red-400">❌ Error: {result.error}</p>}
          </div>
        )}
      </div>
    </div>
  )
}