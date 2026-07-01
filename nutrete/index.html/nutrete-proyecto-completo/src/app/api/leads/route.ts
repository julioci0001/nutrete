// ══════════════════════════════════════════════════════════════
// src/app/api/leads/route.ts — COD Lead Capture API
// ══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { insertLead, trackEvent } from '@/lib/db/client'
import { getCountryFromRequest } from '@/lib/geo/detect'
import { nanoid } from 'nanoid'

const leadSchema = z.object({
  name:         z.string().min(2).max(80),
  phone:        z.string().min(6).max(20),
  email:        z.string().email().optional().or(z.literal('')),
  country:      z.string().min(2).max(3),
  productId:    z.string().uuid(),
  productName:  z.string(),
  productSlug:  z.string(),
  affiliateUrl: z.string().url(),
  landingPage:  z.string().optional(),
  sessionId:    z.string().optional(),
  source:       z.string().optional(),
  medium:       z.string().optional(),
  campaign:     z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = leadSchema.parse(body)

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') || ''

    // Save lead to database
    const lead = await insertLead({
      product_id:   data.productId,
      product_name: data.productName,
      product_slug: data.productSlug,
      name:         data.name,
      phone:        data.phone,
      email:        data.email || null,
      country:      data.country,
      ip,
      status:       'new',
      landing_page: data.landingPage,
      session_id:   data.sessionId,
      source:       data.source || 'direct',
      medium:       data.medium || 'organic',
      campaign:     data.campaign,
      user_agent:   request.headers.get('user-agent') || '',
    })

    // Forward to TerraLeads (async, don't block response)
    forwardToTerraLeads(data, lead.id).catch(console.error)

    // Track event
    await trackEvent({
      event_type: 'cod_lead_submit',
      product_id: data.productId,
      country:    data.country,
      session_id: data.sessionId,
      ip,
      metadata: { lead_id: lead.id },
    })

    return NextResponse.json({ success: true, leadId: lead.id })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Datos inválidos', details: error.errors }, { status: 400 })
    }
    console.error('[leads API]', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

async function forwardToTerraLeads(data: z.infer<typeof leadSchema>, leadId: string) {
  const terraLeadsUrl = process.env.TERRALEADS_API_URL
  const flowKey = process.env.TERRALEADS_FLOW_KEY

  if (!terraLeadsUrl || !flowKey) return

  try {
    await fetch(terraLeadsUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        flow_id: flowKey,
        name:    data.name,
        phone:   data.phone,
        email:   data.email,
        country: data.country,
        ref:     data.affiliateUrl,
        comment: `Lead ID: ${leadId}`,
      }),
    })
  } catch (error) {
    console.error('[TerraLeads forward]', error)
  }
}
