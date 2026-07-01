// ══════════════════════════════════════════════════════════════
// src/app/api/ingest/route.ts — Product Ingest API
// ══════════════════════════════════════════════════════════════
// POST a new affiliate link → AI generates ALL content →
// Product is saved and goes live automatically.
// Protected by ADMIN_SECRET header.

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/db/client'
import { generateProductContent } from '@/lib/ai/content-generator'
import { nanoid } from 'nanoid'

const ingestSchema = z.object({
  affiliateUrl:   z.string().url(),
  country:        z.string().min(2).max(3),
  additionalInfo: z.string().optional(),
  // Optionally override auto-generated fields
  productName:    z.string().optional(),
  imageUrl:       z.string().url().optional(),
  autoPublish:    z.boolean().default(false),
})

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export async function POST(request: NextRequest) {
  // Auth check
  const secret = request.headers.get('x-admin-secret')
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const data = ingestSchema.parse(body)

    // ── Step 1: Create content job record ────────────────────
    const { data: job } = await supabaseAdmin
      .from('content_jobs')
      .insert({
        job_type: 'full',
        status:   'running',
      })
      .select()
      .single()

    // ── Step 2: Generate content with AI ─────────────────────
    let generatedContent
    try {
      generatedContent = await generateProductContent({
        affiliateUrl:    data.affiliateUrl,
        country:         data.country,
        additionalInfo:  data.additionalInfo,
      })
    } catch (aiError) {
      await supabaseAdmin
        .from('content_jobs')
        .update({ status: 'error', error: String(aiError) })
        .eq('id', job?.id)

      return NextResponse.json({ error: 'AI generation failed', details: String(aiError) }, { status: 500 })
    }

    // ── Step 3: Build product record ─────────────────────────
    const productName = data.productName || generatedContent.name || 'Producto Nuevo'
    const slug = slugify(productName) + '-' + nanoid(4)

    const productRecord = {
      slug,
      name:               productName,
      tagline:            generatedContent.tagline,
      description:        generatedContent.description,
      long_description:   generatedContent.longDescription,
      category:           generatedContent.category ?? 'general',
      status:             data.autoPublish ? 'active' : 'draft',
      image_url:          data.imageUrl || `https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800`,
      image_alt:          productName,
      problem:            generatedContent.problem,
      solution:           generatedContent.solution,
      benefits:           JSON.stringify(generatedContent.benefits ?? []),
      ingredients:        JSON.stringify(generatedContent.ingredients ?? []),
      testimonials:       JSON.stringify(generatedContent.testimonials ?? []),
      faqs:               JSON.stringify(generatedContent.faqs ?? []),
      article_content:    generatedContent.articleContent,
      comparison_table:   JSON.stringify(generatedContent.comparisonTable),
      seo_title:          generatedContent.seoTitle,
      seo_description:    generatedContent.seoDescription,
      keywords:           generatedContent.keywords ?? [],
      urgency_text:       generatedContent.urgencyText,
      scarcity_text:      generatedContent.scarcityText,
      cta_text:           generatedContent.ctaText ?? 'Quiero mi producto',
      agent_greeting:     generatedContent.agentGreeting,
    }

    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .insert(productRecord)
      .select()
      .single()

    if (productError) throw productError

    // ── Step 4: Add country availability ─────────────────────
    await supabaseAdmin.from('product_countries').insert({
      product_id:    product.id,
      country_code:  data.country.toUpperCase(),
      affiliate_url: data.affiliateUrl,
      available:     true,
    })

    // ── Step 5: Update job as done ────────────────────────────
    await supabaseAdmin
      .from('content_jobs')
      .update({
        product_id:   product.id,
        status:       'done',
        completed_at: new Date().toISOString(),
        result:       { productId: product.id, slug },
      })
      .eq('id', job?.id)

    return NextResponse.json({
      success:   true,
      productId: product.id,
      slug,
      status:    data.autoPublish ? 'active' : 'draft',
      adminUrl:  `/admin/products/${product.id}`,
      publicUrl: `/productos/${slug}`,
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Datos inválidos', details: error.errors }, { status: 400 })
    }
    console.error('[ingest API]', error)
    return NextResponse.json({ error: 'Error interno', details: String(error) }, { status: 500 })
  }
}

// GET — Check ingest job status
export async function GET(request: NextRequest) {
  const secret = request.headers.get('x-admin-secret')
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const jobId = new URL(request.url).searchParams.get('jobId')
  if (!jobId) {
    // List recent jobs
    const { data } = await supabaseAdmin
      .from('content_jobs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)
    return NextResponse.json({ jobs: data })
  }

  const { data } = await supabaseAdmin
    .from('content_jobs')
    .select('*')
    .eq('id', jobId)
    .single()

  return NextResponse.json(data)
}
