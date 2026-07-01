import Anthropic from "@anthropic-ai/sdk"
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const SYSTEM_PROMPT = `Eres experto en marketing Nutra y copywriting de alta conversion.
Genera contenido COMPLETO y PERSUASIVO en español neutro latinoamericano.
Responde SOLO en JSON valido sin texto adicional ni markdown.
Genera este objeto:
{
  "name": "nombre del producto",
  "tagline": "tagline 10 palabras max",
  "description": "meta description 155 chars",
  "longDescription": "descripcion marketing 300 palabras",
  "category": "articulaciones|diabetes|presion|peso|potencia|memoria|vision|digestivo|energia|sueno|general",
  "problem": "problema emocional 100 palabras",
  "solution": "como lo resuelve 100 palabras",
  "benefits": [{"icon":"emoji","title":"titulo","description":"descripcion 2 oraciones"}],
  "ingredients": [{"name":"ingrediente","description":"que hace","benefit":"beneficio"}],
  "testimonials": [{"id":"t1","name":"Nombre Apellido","age":52,"city":"Ciudad","country":"AR","avatar":"https://api.dicebear.com/8.x/notionists/svg?seed=nombre","rating":5,"text":"testimonio realista 3 oraciones","before":"estado antes","after":"estado despues","date":"2024-03-15","verified":true}],
  "faqs": [{"question":"pregunta frecuente","answer":"respuesta completa"}],
  "seoTitle": "titulo SEO 60 chars | nutrEte",
  "seoDescription": "meta description 155 chars",
  "keywords": ["keyword1","keyword2"],
  "articleContent": "articulo SEO 800 palabras en HTML con H2 H3",
  "urgencyText": "texto urgencia etica",
  "scarcityText": "X personas lo compraron hoy",
  "ctaText": "Quiero mi producto",
  "comparisonTable": {"headers":["Caracteristica","Producto","Competencia"],"rows":[{"label":"Velocidad","values":["2-4 semanas","Variable"]}]},
  "agentGreeting": "saludo inicial del agente IA"
}
Genera 5 testimonios, 6 beneficios, 5 ingredientes, 6 FAQs minimo.`

export async function generateProductContent(params: { affiliateUrl: string; country: string; additionalInfo?: string }): Promise<Record<string, unknown>> {
  const response = await anthropic.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 8000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: `Genera contenido para producto Nutra.
URL afiliado: ${params.affiliateUrl}
Pais objetivo: ${params.country}
${params.additionalInfo ? "Info adicional: " + params.additionalInfo : ""}` }],
  })
  const text = response.content.filter((b): b is Anthropic.TextBlock => b.type === "text").map(b => b.text).join("")
  const clean = text.replace(/\`\`\`json
?|\`\`\`
?/g, "").trim()
  return JSON.parse(clean)
}