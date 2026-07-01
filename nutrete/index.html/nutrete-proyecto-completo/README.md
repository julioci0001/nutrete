# nutrEte.com.ar 🌿

Plataforma internacional de productos Nutra afiliados COD. Detecta el país del visitante automáticamente y muestra solo los productos disponibles para esa región.

## Stack

- **Next.js 14** — App Router, Server Components, Edge Middleware
- **TypeScript** — tipado estricto en todo el proyecto
- **TailwindCSS** — sistema de diseño personalizado
- **Supabase** — base de datos PostgreSQL con RLS
- **Claude API** — generación de contenido + agentes IA
- **Vercel** — deploy con geolocalización nativa por Edge

---

## Instalación local

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU_USUARIO/nutrete.git
cd nutrete

# 2. Instalar dependencias
npm install

# 3. Copiar variables de entorno
cp .env.example .env.local
# → Editar .env.local con tus claves reales

# 4. Levantar en desarrollo
npm run dev
# → http://localhost:3000
```

---

## Configuración de Supabase

1. Crear proyecto en [supabase.com](https://supabase.com)
2. Ir a **SQL Editor** y ejecutar el contenido de `src/lib/db/schema.sql`
3. Copiar las claves en `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

---

## Deploy en Vercel

```bash
# Conectar con Vercel CLI
npm i -g vercel
vercel

# O conectar desde vercel.com → Import Git Repository
```

Agregar las mismas variables de entorno en **Vercel → Settings → Environment Variables**.

---

## Agregar un nuevo producto

### Opción 1: Panel Admin (recomendado)

1. Ir a `https://nutrete.com.ar/admin`
2. Pegar la URL de afiliado de TerraLeads
3. Seleccionar el país
4. Presionar **Generar contenido con IA**
5. Revisar y publicar

### Opción 2: API directa

```bash
curl -X POST https://nutrete.com.ar/api/ingest \
  -H "Content-Type: application/json" \
  -H "x-admin-secret: TU_ADMIN_SECRET" \
  -d '{
    "affiliateUrl": "https://terraLeads.com/...",
    "country": "AR",
    "additionalInfo": "Producto para articulaciones, ingrediente principal es colágeno",
    "autoPublish": false
  }'
```

La IA genera automáticamente:
- ✅ Copy persuasivo completo
- ✅ 5 testimonios realistas
- ✅ 6 beneficios con íconos
- ✅ 4-5 ingredientes con descripciones
- ✅ 6 FAQs optimizadas para conversión
- ✅ Artículo SEO de 1000 palabras
- ✅ Keywords long-tail
- ✅ Prompt personalizado para el agente IA
- ✅ Tabla de comparación
- ✅ Textos de urgencia/escasez

---

## Estructura del proyecto

```
src/
├── app/
│   ├── page.tsx                    # Homepage (filtrada por país)
│   ├── productos/[slug]/page.tsx   # Landing page de producto
│   ├── productos/page.tsx          # Listado de productos
│   ├── admin/page.tsx              # Panel de administración
│   └── api/
│       ├── leads/route.ts          # Captura de leads COD
│       ├── agent/route.ts          # Chat con agente IA
│       ├── ingest/route.ts         # Ingestión de productos
│       └── sitemap/route.ts        # Sitemap dinámico
├── components/
│   ├── layout/                     # Header, Footer
│   ├── sections/                   # Hero, TrustSignals, HowItWorks...
│   ├── product/                    # ProductHero, CODForm, ChatWidget...
│   └── agent/                      # ChatWidget
└── lib/
    ├── ai/                         # Claude: content-generator, agents
    ├── db/                         # Supabase client + schema SQL
    ├── geo/                        # Detección de país
    └── seo/                        # Metadata, JSON-LD schemas
```

---

## Variables de entorno requeridas

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio (solo backend) |
| `ANTHROPIC_API_KEY` | Clave de Claude API |
| `ADMIN_SECRET` | String secreto para proteger `/api/ingest` |
| `TERRALEADS_FLOW_KEY` | Tu flow key de TerraLeads |
| `NEXT_PUBLIC_APP_URL` | URL pública del sitio |

---

## Países soportados

AR · MX · CO · PE · CL · EC · BO · PY · UY · VE · RU · UA · PL · RO · TR

---

## Escalabilidad

El sistema está diseñado para 200+ productos. Cada producto generado con IA toma ~45 segundos. Para ingestión masiva, usar el script de batch:

```bash
# Agregar múltiples productos en paralelo
node scripts/bulk-ingest.js links.txt AR
```

---

## Licencia

Proyecto privado — nutrEte © 2025
