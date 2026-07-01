import Anthropic from "@anthropic-ai/sdk"
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const BASE_SYSTEM = `Eres asesor de salud natural de nutrEte. Personalidad empatica, calida, como medico de confianza.
Proceso: 1) Escucha y valida el problema 2) Da consejos utiles gratuitos 3) Menciona el producto de forma natural y sutil.
Recursos especiales (usa cuando corresponda):
[RECURSO:pdf:titulo:descripcion] [RECURSO:checklist:titulo:descripcion] [RECURSO:plan:titulo:descripcion]
NUNCA seas agresivo en ventas. Responde en espanol neutro. Maximo 150 palabras por respuesta.`

export async function chatWithAgent(params: { messages: { role: "user"|"assistant"; content: string }[]; productName: string; productSlug: string; problem: string; benefits: string; country: string }): Promise<{ content: string; cards: { type: string; title: string; description: string; icon: string; ctaUrl?: string; ctaText?: string }[] }> {
  const system = `${BASE_SYSTEM}

Eres especialista en: ${params.problem}
Producto que podes recomendar sutilmente: ${params.productName} (/productos/${params.productSlug})
Beneficios: ${params.benefits}
Pais del usuario: ${params.country}`
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 400,
    system,
    messages: params.messages.slice(-10),
  })
  const rawText = response.content.filter((b): b is Anthropic.TextBlock => b.type === "text").map(b => b.text).join("")
  const cards: { type: string; title: string; description: string; icon: string; ctaUrl?: string; ctaText?: string }[] = []
  const regex = /\[RECURSO:(\w+):([^:]+):([^\]]+)\]/g
  let match
  while ((match = regex.exec(rawText)) !== null) {
    const [, type, title, description] = match
    const icons: Record<string,string> = { pdf:"📄", checklist:"✅", plan:"📋", guide:"📚" }
    cards.push({ type, title, description, icon: icons[type]??"📎", ctaText:"Descargar gratis", ctaUrl:`/recursos/${type}/${encodeURIComponent(title.toLowerCase().replace(/\s+/g,"-"))}` })
  }
  return { content: rawText.replace(regex, "").trim(), cards }
}