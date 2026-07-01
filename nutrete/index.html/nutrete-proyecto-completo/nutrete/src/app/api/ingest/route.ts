import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/db/client'
import { generateProductContent } from '@/lib/ai/content-generator'
function slugify(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-').trim()
}
const schema = z.object({
  affiliateUrl: z.string().url(), country: z.string().min(2).max(3),
  additionalInfo: z.string().optional(), imageUrl: z.string().url().optional(), autoPublish: z.boolean().default(false),
})
export async function POST(request: NextRequest) {
  if (request.headers.get('x-admin-secret') !== process.env.ADMIN_SECRET)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const data = schema.parse(await request.json())
    const generated = await generateProductContent({ affiliateUrl: data.affiliateUrl, country: data.country, additionalInfo: data.additionalInfo })
    const productName = (generated.name as string) || 'Producto Nuevo'
    const slug = slugify(productName) + '-' + Math.random().toString(36).slice(2,6)
    const { data: product, error } = await supabaseAdmin.from('products').insert({
      slug, name: productName, tagline: generated.tagline, description: generated.description,
      long_description: generated.longDescription, category: generated.category ?? 'general',
      status: data.autoPublish ? 'active' : 'draft',
      image_url: data.imageUrl || 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800',
      problem: generated.problem, solution: generated.solution,
      benefits: JSON.stringify(generated.benefits ?? []), ingredients: JSON.stringify(generated.ingredients ?? []),
      testimonials: JSON.stringify(generated.testimonials ?? []), faqs: JSON.stringify(generated.faqs ?? []),
      article_content: generated.articleContent, comparison_table: JSON.stringify(generated.comparisonTable),
      seo_title: generated.seoTitle, seo_description: generated.seoDescription, keywords: generated.keywords ?? [],
      urgency_text: generated.urgencyText, scarcity_text: generated.scarcityText,
      cta_text: generated.ctaText ?? 'Quiero mi producto', agent_greeting: generated.agentGreeting,
    }).select().single()
    if (error) throw error
    await supabaseAdmin.from('product_countries').insert({ product_id: product.id, country_code: data.country.toUpperCase(), affiliate_url: data.affiliateUrl, available: true })
    return NextResponse.json({ success: true, productId: product.id, slug, status: data.autoPublish ? 'active' : 'draft', publicUrl: `/productos/${slug}` }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Error interno', details: String(error) }, { status: 500 })
  }
}