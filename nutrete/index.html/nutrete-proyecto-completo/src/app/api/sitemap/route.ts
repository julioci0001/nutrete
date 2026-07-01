// ══════════════════════════════════════════════════════════════
// src/app/api/sitemap/route.ts — Dynamic XML Sitemap
// ══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import { getAllActiveProducts } from '@/lib/db/client'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://nutrete.com.ar'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Re-generate every hour

export async function GET() {
  const products = await getAllActiveProducts().catch(() => [])

  const staticPages = [
    { url: '/',         priority: '1.0', changefreq: 'daily' },
    { url: '/productos',priority: '0.9', changefreq: 'daily' },
    { url: '/nosotros', priority: '0.5', changefreq: 'monthly' },
    { url: '/contacto', priority: '0.5', changefreq: 'monthly' },
  ]

  const productPages = products.map((p: any) => ({
    url:        `/productos/${p.slug}`,
    priority:   '0.8',
    changefreq: 'weekly',
    lastmod:    p.updated_at ? new Date(p.updated_at).toISOString().split('T')[0] : undefined,
  }))

  const allPages = [...staticPages, ...productPages]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>${page.lastmod ? `\n    <lastmod>${page.lastmod}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
