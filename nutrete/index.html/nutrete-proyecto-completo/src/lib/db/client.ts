// ══════════════════════════════════════════════════════════════
// src/lib/db/client.ts — Supabase Client
// ══════════════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// ── Public client (browser / server components) ───────────────
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
})

// ── Admin client (API routes — server only) ───────────────────
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

// ── Typed helpers ─────────────────────────────────────────────
export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_countries (*)
    `)
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (error) throw error
  return data
}

export async function getProductsByCountry(countryCode: string) {
  const { data, error } = await supabase
    .rpc('get_products_by_country', { p_country: countryCode.toUpperCase() })

  if (error) throw error
  return data ?? []
}

export async function getAllActiveProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*, product_countries(*)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function insertLead(lead: Record<string, unknown>) {
  const { data, error } = await supabaseAdmin
    .from('leads')
    .insert(lead)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function trackEvent(event: {
  event_type: string
  product_id?: string
  country?: string
  session_id?: string
  ip?: string
  metadata?: Record<string, unknown>
}) {
  await supabaseAdmin.from('analytics_events').insert(event)
}
