// ══════════════════════════════════════════════════════════════
// src/app/productos/[slug]/page.tsx — Product Landing Page
// ══════════════════════════════════════════════════════════════

import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getProductBySlug, getAllActiveProducts } from '@/lib/db/client'
import { getGeoData } from '@/lib/geo/detect'
import { generateProductMetadata } from '@/lib/seo/metadata'
import { generateProductSchema, generateFAQSchema, generateBreadcrumbSchema } from '@/lib/seo/metadata'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ProductHero } from '@/components/product/ProductHero'
import { ProductBenefits } from '@/components/product/ProductBenefits'
import { ProductIngredients } from '@/components/product/ProductIngredients'
import { ProductTestimonials } from '@/components/product/ProductTestimonials'
import { ProductFAQ } from '@/components/product/ProductFAQ'
import { ProductComparison } from '@/components/product/ProductComparison'
import { CODForm } from '@/components/product/CODForm'
import { ChatWidget } from '@/components/agent/ChatWidget'
import { StickyBuy } from '@/components/product/StickyBuy'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const [product, geo] = await Promise.all([
    getProductBySlug(slug).catch(() => null),
    getGeoData(),
  ])
  if (!product) return { title: 'Producto no encontrado | nutrEte' }
  return generateProductMetadata(product as any, geo.country)
}

export async function generateStaticParams() {
  const products = await getAllActiveProducts().catch(() => [])
  return products.map((p: any) => ({ slug: p.slug }))
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params
  const [product, geo] = await Promise.all([
    getProductBySlug(slug).catch(() => null),
    getGeoData(),
  ])

  if (!product) notFound()

  // Find country-specific data
  const countryData = (product as any).product_countries?.find(
    (c: any) => c.country_code === geo.country
  ) || (product as any).product_countries?.[0]

  if (!countryData) notFound() // Product not available in this country

  const p = product as any

  // JSON-LD
  const productSchema = generateProductSchema(p, geo.country)
  const faqSchema = p.faqs?.length > 0 ? generateFAQSchema(p.faqs) : null
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Inicio', url: '/' },
    { name: 'Productos', url: '/productos' },
    { name: p.name, url: `/productos/${slug}` },
  ])

  return (
    <>
      <Header country={geo.country} countryName={geo.countryName} transparent />

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <main>
        {/* Urgency bar */}
        {p.urgency_text && (
          <div className="urgency-bar">⏰ {p.urgency_text}</div>
        )}

        {/* 1. Hero + Primary CTA */}
        <ProductHero
          product={p}
          countryData={countryData}
          country={geo.country}
          countryName={geo.countryName}
        />

        {/* 2. Social Proof Numbers */}
        <SocialProofBar />

        {/* 3. Problem/Solution */}
        <ProblemSolutionSection problem={p.problem} solution={p.solution} name={p.name} />

        {/* 4. Benefits */}
        {p.benefits?.length > 0 && (
          <ProductBenefits benefits={p.benefits} productName={p.name} />
        )}

        {/* 5. COD Form #1 (mid-page) */}
        <section id="pedido" className="section-spacing bg-brand-950">
          <div className="container-custom max-w-2xl mx-auto">
            <div className="text-center text-white mb-8">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
                Quiero {p.name}
              </h2>
              <p className="text-brand-200">
                Completa tus datos y recíbelo en tu domicilio. Pagas al recibir.
              </p>
            </div>
            <CODForm
              productId={p.id}
              productName={p.name}
              productSlug={slug}
              affiliateUrl={countryData.affiliate_url}
              country={geo.country}
              ctaText={p.cta_text}
            />
          </div>
        </section>

        {/* 6. Ingredients */}
        {p.ingredients?.length > 0 && (
          <ProductIngredients ingredients={p.ingredients} />
        )}

        {/* 7. Testimonials */}
        {p.testimonials?.length > 0 && (
          <ProductTestimonials
            testimonials={p.testimonials}
            country={geo.country}
            productName={p.name}
          />
        )}

        {/* 8. Comparison Table */}
        {p.comparison_table && (
          <ProductComparison
            table={p.comparison_table}
            productName={p.name}
          />
        )}

        {/* 9. FAQs */}
        {p.faqs?.length > 0 && (
          <ProductFAQ faqs={p.faqs} />
        )}

        {/* 10. SEO Article */}
        {p.article_content && (
          <ArticleSection content={p.article_content} productName={p.name} />
        )}

        {/* 11. Final COD Form */}
        <section className="section-spacing bg-gray-50">
          <div className="container-custom max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-3">
                ¿Listo para empezar?
              </h2>
              <p className="text-gray-600">Paga cuando lo recibas. Sin riesgo.</p>
            </div>
            <CODForm
              productId={p.id}
              productName={p.name}
              productSlug={slug}
              affiliateUrl={countryData.affiliate_url}
              country={geo.country}
              ctaText={p.cta_text}
            />
          </div>
        </section>
      </main>

      <Footer />

      {/* Sticky buy button on mobile */}
      <StickyBuy
        productName={p.name}
        ctaText={p.cta_text}
        price={countryData.price}
        currency={countryData.currency}
      />

      {/* AI Chat Agent */}
      <Suspense fallback={null}>
        <ChatWidget
          productId={p.id}
          productName={p.name}
          productSlug={slug}
          problem={p.problem ?? ''}
          benefits={p.benefits?.map((b: any) => b.title).join(', ') ?? ''}
          country={geo.country}
          agentGreeting={p.agent_greeting}
        />
      </Suspense>
    </>
  )
}

// ── Internal Sections ─────────────────────────────────────────
function SocialProofBar() {
  return (
    <div className="bg-white border-y border-gray-100">
      <div className="container-custom">
        <div className="flex flex-wrap items-center justify-center gap-8 py-5">
          {[
            { icon: '⭐', value: '4.9/5', label: 'Calificación' },
            { icon: '📦', value: '+50.000', label: 'Pedidos entregados' },
            { icon: '🌿', label: '100% Natural' },
            { icon: '💳', label: 'Pagas al recibir' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-xl">{item.icon}</span>
              <div>
                {item.value && <span className="font-bold text-gray-900">{item.value} </span>}
                <span>{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ProblemSolutionSection({ problem, solution, name }: {
  problem: string
  solution: string
  name: string
}) {
  return (
    <section className="section-spacing bg-white">
      <div className="container-custom max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="bg-red-50 rounded-3xl p-8 border border-red-100">
            <div className="text-3xl mb-4">😔</div>
            <h3 className="text-xl font-display font-bold text-gray-900 mb-4">
              ¿Te identificas con esto?
            </h3>
            <p className="text-gray-700 leading-relaxed">{problem}</p>
          </div>
          <div className="bg-green-50 rounded-3xl p-8 border border-green-100">
            <div className="text-3xl mb-4">✅</div>
            <h3 className="text-xl font-display font-bold text-gray-900 mb-4">
              Existe una solución natural
            </h3>
            <p className="text-gray-700 leading-relaxed">{solution}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function ArticleSection({ content, productName }: { content: string; productName: string }) {
  return (
    <section className="section-spacing bg-white">
      <div className="container-custom max-w-3xl mx-auto">
        <article
          className="prose prose-lg prose-green max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </section>
  )
}
