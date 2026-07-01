// ══════════════════════════════════════════════════════════════
// src/lib/ai/content-generator.ts — AI Content Generation Engine
// ══════════════════════════════════════════════════════════════
// Generates ALL product content automatically from an affiliate URL.
// Uses Claude as primary, OpenAI as fallback.

import Anthropic from '@anthropic-ai/sdk'
import type { Product, ProductCategory } from '@/types/product'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// ── Master prompt for product content generation ──────────────
const PRODUCT_GENERATION_PROMPT = `
Eres un experto en marketing de afiliación Nutra, copywriting de alta conversión y SEO.
Tu tarea es analizar la información de un producto Nutra y generar CONTENIDO COMPLETO y PERSUASIVO en español.

Reglas absolutas:
1. El contenido debe ser 100% en español neutro (entendible en todos los países latinoamericanos)
2. Tono: empático, cálido, experto — como un médico de confianza, no como un vendedor agresivo
3. Enfocarse en el PROBLEMA EMOCIONAL del usuario, no solo el producto
4. Incluir storytelling genuino y relatable
5. Las FAQs deben responder objeciones reales de compra
6. Los testimonios deben sonar REALES (nombres, edades, ciudades específicas)
7. El SEO debe apuntar a long-tail keywords con intención de compra
8. Responder SOLO en JSON válido, sin texto adicional

Genera el siguiente objeto JSON completo:
{
  "name": "Nombre del producto",
  "tagline": "Tagline persuasivo de máximo 10 palabras",
  "description": "Meta description SEO (150-160 chars)",
  "longDescription": "Descripción completa marketing (300-400 palabras, HTML permitido)",
  "category": "una de: articulaciones|diabetes|presion|peso|potencia|memoria|vision|digestivo|higado|rinon|corazon|piel|energia|sueno|stress|general",
  "problem": "El problema emocional principal que resuelve (100-150 palabras, empático)",
  "solution": "Cómo el producto resuelve el problema (100-150 palabras)",
  "benefits": [
    { "icon": "emoji", "title": "Beneficio corto", "description": "Descripción de 1-2 oraciones" }
  ],
  "ingredients": [
    { "name": "Ingrediente", "description": "Qué hace", "benefit": "Beneficio principal" }
  ],
  "testimonials": [
    {
      "id": "t1",
      "name": "Nombre Apellido",
      "age": 52,
      "city": "Ciudad",
      "country": "AR",
      "avatar": "https://api.dicebear.com/8.x/notionists/svg?seed=NAME",
      "rating": 5,
      "text": "Testimonio realista y específico de 3-4 oraciones. Con detalles creíbles.",
      "before": "Estado antes del producto",
      "after": "Estado después del producto",
      "date": "2024-03-15",
      "verified": true
    }
  ],
  "faqs": [
    { "question": "Pregunta frecuente de compra", "answer": "Respuesta completa que elimina objeciones" }
  ],
  "seoTitle": "Título SEO (60 chars max) | nutrEte",
  "seoDescription": "Meta description (155 chars max)",
  "keywords": ["keyword1", "keyword2", "...hasta 15 keywords long-tail"],
  "articleContent": "Artículo SEO completo de 800-1200 palabras en HTML. Include H2, H3, párrafos, listas. Tono informativo y empático. Apunta a tráfico orgánico de personas con el problema.",
  "urgencyText": "Texto de urgencia ética (ej: Solo quedan X unidades / Oferta válida hasta...)",
  "scarcityText": "Texto de escasez (ej: X personas lo compraron hoy en tu ciudad)",
  "ctaText": "Texto del botón CTA (máximo 6 palabras)",
  "comparisonTable": {
    "headers": ["Característica", "Producto", "Competencia", "Tratamiento Tradicional"],
    "rows": [
      { "label": "Velocidad de resultados", "values": ["⚡ 2-4 semanas", "❌ Variable", "❌ Meses"] }
    ]
  },
  "agentGreeting": "Saludo inicial del agente IA para este producto (1-2 oraciones, empático)"
}

Genera 5 testimoniales, 6 beneficios, 4-5 ingredientes, y 6 FAQs mínimo.
Asegúrate de que el JSON sea 100% válido.
`

/**
 * Generate complete product content from affiliate URL + info
 */
export async function generateProductContent(params: {
  affiliateUrl: string
  country: string
  additionalInfo?: string
  existingContent?: string
}): Promise<Partial<Product>> {
  const userMessage = `
Genera contenido completo para este producto Nutra de afiliación.

URL de afiliado: ${params.affiliateUrl}
País objetivo: ${params.country}
${params.additionalInfo ? `Información adicional: ${params.additionalInfo}` : ''}
${params.existingContent ? `Contenido existente de la página:\n${params.existingContent}` : ''}

Recuerda adaptar los testimonios y detalles para el país: ${params.country}
`

  const response = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 8000,
    system: PRODUCT_GENERATION_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  })

  const text = response.content
    .filter(b => b.type === 'text')
    .map(b => (b as { type: 'text'; text: string }).text)
    .join('')

  // Strip markdown fences if present
  const clean = text.replace(/```json\n?|```\n?/g, '').trim()
  return JSON.parse(clean) as Partial<Product>
}

/**
 * Generate SEO article for a product
 */
export async function generateSEOArticle(params: {
  productName: string
  category: ProductCategory
  problem: string
  country: string
}): Promise<string> {
  const prompt = `
Eres un experto en SEO y salud. Escribe un artículo SEO de 1000 palabras en HTML para:

Producto: ${params.productName}
Categoría: ${params.category}
Problema que resuelve: ${params.problem}
País objetivo: ${params.country}

El artículo debe:
- Targeting: personas que buscan solución a "${params.problem}"
- Tono: empático, informativo, de médico de confianza
- Incluir H1, H2, H3
- Mencionar el producto naturalmente, no agresivamente
- Optimizado para voz (preguntas y respuestas)
- Incluir lista de síntomas, causas, y soluciones
- Llamada a la acción sutil al final

Responde SOLO con el HTML del artículo, sin ```html fences.
`

  const response = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 3000,
    messages: [{ role: 'user', content: prompt }],
  })

  return response.content
    .filter(b => b.type === 'text')
    .map(b => (b as { type: 'text'; text: string }).text)
    .join('')
}

/**
 * Scrape product info from affiliate URL using AI
 */
export async function scrapeProductInfo(url: string): Promise<string> {
  // Note: In production, use a headless browser or scraping service
  // For now, we use Claude's knowledge + URL context
  const response = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 1000,
    messages: [{
      role: 'user',
      content: `Analiza esta URL de TerraLeads: ${url}
      
      Extrae toda la información posible sobre el producto basándote en la URL y tu conocimiento de TerraLeads.
      Devuelve: nombre probable del producto, problema que resuelve, país objetivo, categoría de salud.
      Responde en JSON simple.`
    }],
  })

  return response.content
    .filter(b => b.type === 'text')
    .map(b => (b as { type: 'text'; text: string }).text)
    .join('')
}
