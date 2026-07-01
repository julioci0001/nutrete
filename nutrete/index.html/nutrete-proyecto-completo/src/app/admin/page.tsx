// ══════════════════════════════════════════════════════════════
// src/app/admin/page.tsx — Admin Dashboard
// ══════════════════════════════════════════════════════════════
// Basic admin panel to manage products, leads, and content jobs.

'use client'

import { useState } from 'react'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'products' | 'leads' | 'ingest' | 'analytics'>('products')

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Sidebar */}
      <div className="flex">
        <aside className="w-64 min-h-screen bg-gray-900 border-r border-gray-800 p-6 fixed">
          <div className="mb-8">
            <h1 className="text-xl font-display font-bold text-brand-400">nutrEte</h1>
            <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'products',  icon: '📦', label: 'Productos' },
              { id: 'ingest',    icon: '➕', label: 'Agregar Producto' },
              { id: 'leads',     icon: '👥', label: 'Leads COD' },
              { id: 'analytics', icon: '📊', label: 'Analytics' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${
                  activeTab === item.id
                    ? 'bg-brand-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8">
          {activeTab === 'ingest' && <IngestPanel />}
          {activeTab === 'products' && <ProductsPanel />}
          {activeTab === 'leads' && <LeadsPanel />}
          {activeTab === 'analytics' && <AnalyticsPanel />}
        </main>
      </div>
    </div>
  )
}

// ── Ingest Panel ──────────────────────────────────────────────
function IngestPanel() {
  const [formData, setFormData] = useState({
    affiliateUrl:   '',
    country:        'AR',
    additionalInfo: '',
    imageUrl:       '',
    autoPublish:    false,
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [result, setResult] = useState<any>(null)

  const handleIngest = async () => {
    setStatus('loading')
    try {
      const res = await fetch('/api/ingest', {
        method: 'POST',
        headers: {
          'Content-Type':   'application/json',
          'x-admin-secret': prompt('Ingresa el Admin Secret:') || '',
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data)
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setResult({ error: String(err) })
    }
  }

  const COUNTRIES = ['AR','MX','CO','PE','CL','EC','BO','PY','UY','VE']

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-display font-bold mb-2">Agregar Nuevo Producto</h2>
      <p className="text-gray-400 text-sm mb-8">
        Pega el link de afiliado y la IA genera todo el contenido automáticamente.
      </p>

      <div className="bg-gray-900 rounded-2xl p-6 space-y-5">
        <div>
          <label className="block text-sm text-gray-400 mb-2">URL de Afiliado TerraLeads *</label>
          <input
            type="url"
            value={formData.affiliateUrl}
            onChange={e => setFormData(p => ({ ...p, affiliateUrl: e.target.value }))}
            placeholder="https://terraLeads.com/..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-brand-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">País objetivo *</label>
          <select
            value={formData.country}
            onChange={e => setFormData(p => ({ ...p, country: e.target.value }))}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-500"
          >
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Información adicional (opcional)</label>
          <textarea
            value={formData.additionalInfo}
            onChange={e => setFormData(p => ({ ...p, additionalInfo: e.target.value }))}
            placeholder="Nombre del producto, problema que resuelve, ingredientes clave..."
            rows={3}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-brand-500 outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">URL de imagen (opcional)</label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={e => setFormData(p => ({ ...p, imageUrl: e.target.value }))}
            placeholder="https://..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-brand-500 outline-none"
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.autoPublish}
            onChange={e => setFormData(p => ({ ...p, autoPublish: e.target.checked }))}
            className="w-4 h-4 accent-brand-500"
          />
          <span className="text-sm text-gray-300">Publicar automáticamente al finalizar</span>
        </label>

        <button
          onClick={handleIngest}
          disabled={!formData.affiliateUrl || status === 'loading'}
          className="w-full btn-primary disabled:opacity-50 py-4"
        >
          {status === 'loading' ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              La IA está generando el contenido... (30-60 seg)
            </span>
          ) : '🚀 Generar contenido con IA'}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className={`mt-6 p-5 rounded-2xl ${status === 'success' ? 'bg-green-950 border border-green-800' : 'bg-red-950 border border-red-800'}`}>
          {status === 'success' ? (
            <div>
              <p className="text-green-400 font-semibold text-lg mb-3">✅ Producto creado exitosamente</p>
              <div className="space-y-2 text-sm text-gray-300">
                <p>• ID: <span className="text-white font-mono">{result.productId}</span></p>
                <p>• Slug: <span className="text-white font-mono">{result.slug}</span></p>
                <p>• Estado: <span className={result.status === 'active' ? 'text-green-400' : 'text-yellow-400'}>{result.status}</span></p>
                <div className="flex gap-3 mt-4">
                  <a href={result.publicUrl} target="_blank" className="btn-primary py-2 px-4 text-sm">Ver producto →</a>
                  <a href={result.adminUrl} className="bg-gray-700 text-white py-2 px-4 rounded-full text-sm hover:bg-gray-600 transition-colors">Editar</a>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-red-400">❌ Error: {result.error}</p>
          )}
        </div>
      )}
    </div>
  )
}

function ProductsPanel() {
  return (
    <div>
      <h2 className="text-2xl font-display font-bold mb-6">Gestión de Productos</h2>
      <p className="text-gray-400">Conecta Supabase para ver y gestionar productos.</p>
    </div>
  )
}

function LeadsPanel() {
  return (
    <div>
      <h2 className="text-2xl font-display font-bold mb-6">Leads COD</h2>
      <p className="text-gray-400">Conecta Supabase para ver leads capturados.</p>
    </div>
  )
}

function AnalyticsPanel() {
  return (
    <div>
      <h2 className="text-2xl font-display font-bold mb-6">Analytics</h2>
      <p className="text-gray-400">Integra Google Analytics o Supabase para ver métricas.</p>
    </div>
  )
}
