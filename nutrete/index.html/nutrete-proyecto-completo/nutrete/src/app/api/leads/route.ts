import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { insertLead, trackEvent } from '@/lib/db/client'
const schema = z.object({
  name: z.string().min(2).max(80),
  phone: z.string().min(6).max(20),
  email: z.string().email().optional().or(z.literal('')),
  country: z.string().min(2).max(3),
  productId: z.string(),
  productName: z.string(),
  productSlug: z.string(),
  affiliateUrl: z.string().url(),
  landingPage: z.string().optional(),
  sessionId: z.string().optional(),
})
export async function POST(request: NextRequest) {
  try {
    const data = schema.parse(await request.json())
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || ''
    const lead = await insertLead({
      product_id: data.productId, product_name: data.productName, product_slug: data.productSlug,
      name: data.name, phone: data.phone, email: data.email || null, country: data.country,
      ip, status: 'new', landing_page: data.landingPage, session_id: data.sessionId,
      user_agent: request.headers.get('user-agent') || '',
    })
    await trackEvent({ event_type: 'cod_lead_submit', country: data.country, metadata: { lead_id: lead.id } })
    forwardToTerraLeads(data, lead.id).catch(console.error)
    return NextResponse.json({ success: true, leadId: lead.id })
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Datos invalidos' }, { status: 400 })
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
async function forwardToTerraLeads(data: any, leadId: string) {
  const url = process.env.TERRALEADS_API_URL
  const key = process.env.TERRALEADS_FLOW_KEY
  if (!url || !key) return
  await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ flow_id: key, name: data.name, phone: data.phone, email: data.email, country: data.country, ref: data.affiliateUrl }) })
}