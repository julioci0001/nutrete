# nutrEte.com.ar

Plataforma de productos Nutra afiliados COD para Latinoamerica.

## Stack
Next.js 14 · TypeScript · TailwindCSS · Supabase · Claude API · Vercel

## Pasos de configuracion

### 1. Supabase
- Crear proyecto en supabase.com
- Ir a SQL Editor y ejecutar src/lib/db/schema.sql
- Copiar URL, Anon Key y Service Role Key

### 2. Anthropic (Claude API)
- Ir a console.anthropic.com
- Crear API Key

### 3. Variables de entorno en Vercel
Cargar todas las variables del archivo .env.example

### 4. Agregar productos
Ir a /admin y pegar links de TerraLeads. La IA genera todo automaticamente.