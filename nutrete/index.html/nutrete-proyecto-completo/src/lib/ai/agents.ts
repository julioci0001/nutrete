// ══════════════════════════════════════════════════════════════
// src/lib/ai/agents.ts — Conversational AI Agent System
// ══════════════════════════════════════════════════════════════
// Each product gets a specialized AI advisor agent.
// Agents help users, build trust, and recommend products ethically.

import Anthropic from '@anthropic-ai/sdk'
import type { Message, ResourceCard } from '@/types'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// ── Base system prompt for all agents ────────────────────────
const BASE_AGENT_SYSTEM = `
Eres un asesor de salud integral de nutrEte, con conocimientos en nutrición, medicina natural y bienestar.

Tu personalidad:
- Empático, cálido, como un médico de confianza
- Escuchas genuinamente el problema del usuario
- Das consejos útiles y prácticos ANTES de mencionar productos
- Nunca eres agresivo en ventas — eres un consejero
- Hablas en español neutro (entendible en toda Latinoamérica)

Tu proceso:
1. Escucha y valida el problema del usuario con empatía
2. Ofrece orientación útil y gratuita (ejercicios, hábitos, tips)
3. Cuando sea relevante, menciona que existe una solución adicional
4. Recomendas el producto de forma natural, como lo haría un doctor de confianza

Herramientas a tu disposición:
- Puedes ofrecer guías en PDF (usa [RECURSO:tipo:titulo:descripcion])
- Puedes crear planes personalizados
- Puedes generar checklists
- Puedes hacer comparativas

Formato de recursos especiales:
[RECURSO:pdf:Guía de Ejercicios para Articulaciones:Ejercicios específicos para reducir el dolor en 7 días]
[RECURSO:checklist:Checklist Diaria de Bienestar:10 hábitos que transformarán tu salud]
[RECURSO:plan:Plan de 30 Días:Protocolo completo para resultados visibles]

Cuando menciones el producto, sé sutil:
"Muchos de mis pacientes han encontrado que [nombre] les ha ayudado significativamente con esto..."
"Si quieres acelerar los resultados, existe un suplemento natural que ha funcionado muy bien..."

NUNCA:
- Presiones para comprar
- Hagas promesas médicas absolutas
- Seas repetitivo en mencionar el producto
- Uses lenguaje de venta agresivo
`

/**
 * Build system prompt for a specific product's agent
 */
function buildAgentSystemPrompt(params: {
  productName: string
  productSlug: string
  problem: string
  benefits: string
  country: string
  customPrompt?: string
}): string {
  return `${BASE_AGENT_SYSTEM}

CONTEXTO DE TU ESPECIALIDAD:
Eres especialista en ayudar a personas con: ${params.problem}
País del usuario: ${params.country}

PRODUCTO QUE PUEDES RECOMENDAR (de forma natural y ética):
Nombre: ${params.productName}
Link: /productos/${params.productSlug}
Beneficios clave: ${params.benefits}

${params.customPrompt || ''}

Cuando el momento sea apropiado (después de dar valor genuino), puedes decir algo como:
"Si te interesa acelerar este proceso, hay un suplemento natural llamado ${params.productName} que muchos han encontrado muy útil. ¿Quieres que te cuente más sobre él?"
`
}

/**
 * Parse resource cards from agent response
 */
function parseResourceCards(text: string): { text: string; cards: ResourceCard[] } {
  const cards: ResourceCard[] = []
  const resourceRegex = /\[RECURSO:(\w+):([^:]+):([^\]]+)\]/g

  let match
  while ((match = resourceRegex.exec(text)) !== null) {
    const [, type, title, description] = match
    cards.push({
      type: type as ResourceCard['type'],
      title,
      description,
      icon: getResourceIcon(type),
      ctaText: 'Descargar gratis',
      ctaUrl: `/recursos/${type}/${encodeURIComponent(title.toLowerCase().replace(/\s+/g, '-'))}`,
    })
  }

  // Remove resource tags from text
  const cleanText = text.replace(resourceRegex, '').trim()
  return { text: cleanText, cards }
}

function getResourceIcon(type: string): string {
  const icons: Record<string, string> = {
    pdf:       '📄',
    checklist: '✅',
    plan:      '📋',
    guide:     '📚',
    comparison:'📊',
  }
  return icons[type] ?? '📎'
}

/**
 * Send message to product agent and get response
 */
export async function chatWithAgent(params: {
  messages: { role: 'user' | 'assistant'; content: string }[]
  productName: string
  productSlug: string
  problem: string
  benefits: string
  country: string
  customPrompt?: string
}): Promise<{ content: string; cards: ResourceCard[] }> {
  const systemPrompt = buildAgentSystemPrompt({
    productName: params.productName,
    productSlug: params.productSlug,
    problem:     params.problem,
    benefits:    params.benefits,
    country:     params.country,
    customPrompt: params.customPrompt,
  })

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 600,
    system: systemPrompt,
    messages: params.messages.slice(-10), // Last 10 messages for context
  })

  const rawText = response.content
    .filter(b => b.type === 'text')
    .map(b => (b as { type: 'text'; text: string }).text)
    .join('')

  const { text, cards } = parseResourceCards(rawText)
  return { content: text, cards }
}

/**
 * Get initial greeting for a product agent
 */
export function getAgentGreeting(productName: string, problem: string, country: string): string {
  const countryGreetings: Record<string, string> = {
    AR: '¡Hola!',
    MX: '¡Hola!',
    CO: '¡Hola!',
    PE: '¡Hola!',
    CL: '¡Hola!',
  }

  const greeting = countryGreetings[country] ?? '¡Hola!'

  return `${greeting} Soy tu asesor de salud en nutrEte 👋

Estoy aquí para ayudarte con ${problem.toLowerCase()}. Puedo orientarte, responderte preguntas y darte consejos prácticos — todo de forma gratuita.

¿Cómo puedo ayudarte hoy?`
}
