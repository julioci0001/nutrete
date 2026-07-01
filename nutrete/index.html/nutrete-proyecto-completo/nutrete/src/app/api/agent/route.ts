import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { chatWithAgent } from '@/lib/ai/agents'
const schema = z.object({
  messages: z.array(z.object({ role: z.enum(['user','assistant']), content: z.string() })).max(20),
  productName: z.string(), productSlug: z.string(), problem: z.string(),
  benefits: z.string(), country: z.string(),
})
export async function POST(request: NextRequest) {
  try {
    const data = schema.parse(await request.json())
    const result = await chatWithAgent(data)
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ content: 'Disculpa, tuve un problema. Intenta de nuevo.', cards: [] })
  }
}