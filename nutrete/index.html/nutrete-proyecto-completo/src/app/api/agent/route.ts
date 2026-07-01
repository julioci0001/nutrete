// ══════════════════════════════════════════════════════════════
// src/app/api/agent/route.ts — AI Agent Chat API
// ══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { chatWithAgent } from '@/lib/ai/agents'

const agentSchema = z.object({
  messages: z.array(z.object({
    role:    z.enum(['user', 'assistant']),
    content: z.string(),
  })).max(20),
  productName:  z.string(),
  productSlug:  z.string(),
  problem:      z.string(),
  benefits:     z.string(),
  country:      z.string(),
  sessionId:    z.string().optional(),
  customPrompt: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = agentSchema.parse(body)

    const result = await chatWithAgent({
      messages:     data.messages,
      productName:  data.productName,
      productSlug:  data.productSlug,
      problem:      data.problem,
      benefits:     data.benefits,
      country:      data.country,
      customPrompt: data.customPrompt,
    })

    return NextResponse.json(result)

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
    }
    console.error('[agent API]', error)
    return NextResponse.json({
      content: 'Disculpa, tuve un inconveniente. ¿Puedes repetir tu pregunta?',
      cards: [],
    })
  }
}
