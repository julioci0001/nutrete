'use client'
// ══════════════════════════════════════════════════════════════
// src/components/product/CODForm.tsx — Cash on Delivery Form
// ══════════════════════════════════════════════════════════════
// The conversion engine. Captures name + phone, sends to our
// API which forwards to TerraLeads.

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { SUPPORTED_COUNTRIES } from '@/types'

// ── Validation schema ─────────────────────────────────────────
const codSchema = z.object({
  name:    z.string().min(2, 'Ingresa tu nombre completo').max(80),
  phone:   z.string().min(6, 'Ingresa un teléfono válido').max(20).regex(/^\+?[\d\s\-\(\)]+$/, 'Teléfono inválido'),
  email:   z.string().email('Email inválido').optional().or(z.literal('')),
  country: z.string().min(2).max(3),
})
type CODFormValues = z.infer<typeof codSchema>

interface CODFormProps {
  productId:    string
  productName:  string
  productSlug:  string
  affiliateUrl: string
  country:      string
  ctaText?:     string
  compact?:     boolean
}

export function CODForm({
  productId,
  productName,
  productSlug,
  affiliateUrl,
  country,
  ctaText = 'Quiero mi producto',
  compact = false,
}: CODFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CODFormValues>({
    resolver: zodResolver(codSchema),
    defaultValues: { country },
  })

  const onSubmit = async (data: CODFormValues) => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          productId,
          productName,
          productSlug,
          affiliateUrl,
          landingPage: window.location.pathname,
          sessionId: document.cookie.match(/nutrete_session=([^;]+)/)?.[1],
        }),
      })

      if (!response.ok) throw new Error('Error al enviar')

      // Track analytics event
      if (typeof window !== 'undefined') {
        // Google Analytics
        if ((window as any).gtag) {
          (window as any).gtag('event', 'cod_form_submit', {
            event_category: 'conversion',
            event_label: productName,
            product_id: productId,
          })
        }
        // Meta Pixel
        if ((window as any).fbq) {
          (window as any).fbq('track', 'Lead', { content_name: productName })
        }
      }

      setIsSuccess(true)
      reset()

      // Redirect to affiliate URL after short delay
      setTimeout(() => {
        window.open(affiliateUrl, '_blank')
      }, 1500)

    } catch (error) {
      toast.error('Ocurrió un error. Por favor intenta nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center shadow-premium border border-green-200">
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="text-2xl font-display font-bold text-gray-900 mb-3">
          ¡Pedido recibido!
        </h3>
        <p className="text-gray-600 mb-2">
          Nos pondremos en contacto contigo pronto para confirmar tu pedido.
        </p>
        <p className="text-sm text-gray-500">
          Redirigiendo para completar tu pedido...
        </p>
        <div className="mt-4">
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-brand-500 rounded-full animate-[width_1.5s_ease-out_forwards]" style={{ width: '100%' }} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl shadow-premium border border-gray-100 overflow-hidden">
      {/* Header */}
      {!compact && (
        <div className="bg-gradient-to-r from-brand-700 to-brand-600 p-6 text-white text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-brand-200 text-sm">💳 Pagas cuando lo recibes</span>
          </div>
          <h3 className="text-xl font-display font-bold">
            Completa tu pedido de {productName}
          </h3>
        </div>
      )}

      {/* Form */}
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Nombre completo *
          </label>
          <input
            {...register('name')}
            type="text"
            placeholder="Tu nombre y apellido"
            className="cod-form-field"
            autoComplete="name"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Teléfono / WhatsApp *
          </label>
          <div className="flex gap-2">
            {/* Country code */}
            <select
              {...register('country')}
              className="cod-form-field w-24 flex-shrink-0"
            >
              {Object.entries(SUPPORTED_COUNTRIES).map(([code, info]) => (
                <option key={code} value={code}>
                  {info.flag} {info.phone}
                </option>
              ))}
            </select>
            <input
              {...register('phone')}
              type="tel"
              placeholder="Número de teléfono"
              className="cod-form-field flex-1"
              autoComplete="tel"
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Email (optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Email <span className="text-gray-400 font-normal">(opcional)</span>
          </label>
          <input
            {...register('email')}
            type="email"
            placeholder="tu@email.com"
            className="cod-form-field"
            autoComplete="email"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary btn-orange w-full text-lg py-4 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Procesando...
            </span>
          ) : (
            <>🛒 {ctaText}</>
          )}
        </button>

        {/* Trust signals */}
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          {[
            { icon: '🔒', text: 'Datos protegidos' },
            { icon: '📦', text: 'Envío a domicilio' },
            { icon: '💳', text: 'Pagas al recibir' },
          ].map((item, i) => (
            <span key={i} className="trust-badge">
              {item.icon} {item.text}
            </span>
          ))}
        </div>
      </form>
    </div>
  )
}
