import { NextResponse } from 'next/server'
import { getAllActiveProducts } from '@/lib/db/client'
const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://nutrete.com.ar'
export const dynamic = 'force-dynamic'
export async function GET() {
  const products = await getAllActiveProducts().catch(() => [])
  const static_pages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/productos', priority: '0.9', changefreq: 'daily' },
  ]
  const product_pages = products.map((p: any) => ({ url: `/productos/${p.slug}`, priority: '0.8', changefreq: 'weekly' }))
  const all = [...static_pages, ...product_pages]
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${all.map(p => `<url><loc>${BASE}${p.url}</loc><changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority></url>`).join('')}</urlset>`
  return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } })
}