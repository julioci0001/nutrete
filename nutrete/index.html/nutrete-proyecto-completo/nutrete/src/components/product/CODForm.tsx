'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { SUPPORTED_COUNTRIES } from '@/types'
const schema = z.object({
  name: z.string().min(2,'Ingresa tu nombre completo').max(80),
  phone: z.string().min(6,'Ingresa un telefono valido').max(20),
  email: z.string().email('Email invalido').optional().or(z.literal('')),
  country: z.string().min(2).max(3),
})
type FormValues = z.infer<typeof schema>
interface Props { productId: string; productName: string; productSlug: string; affiliateUrl: string; country: string; ctaText?: string }
export function CODForm({ productId, productName, productSlug, affiliateUrl, country, ctaText = 'Quiero mi producto' }: Props) {
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { country } })
  const onSubmit = async (data: FormValues) => {
    setSubmitting(true)
    try {
      const res = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, productId, productName, productSlug, affiliateUrl, landingPage: window.location.pathname }) })
      if (!res.ok) throw new Error()
      if ((window as any).gtag) (window as any).gtag('event','cod_form_submit',{ event_category:'conversion', event_label: productName })
      if ((window as any).fbq) (window as any).fbq('track','Lead',{ content_name: productName })
      setSuccess(true); reset()
      setTimeout(() => window.open(affiliateUrl,'_blank'), 1500)
    } catch { toast.error('Ocurrio un error. Intenta nuevamente.') }
    finally { setSubmitting(false) }
  }
  if (success) return (
    <div className="bg-white rounded-3xl p-8 text-center shadow-premium border border-green-200">
      <div className="text-5xl mb-4">🎉</div>
      <h3 className="text-2xl font-display font-bold text-gray-900 mb-3">¡Pedido recibido!</h3>
      <p className="text-gray-600 mb-2">Nos pondremos en contacto para confirmar tu pedido.</p>
      <p className="text-sm text-gray-500">Redirigiendo para completar tu pedido...</p>
    </div>
  )
  return (
    <div className="bg-white rounded-3xl shadow-premium border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-green-700 to-green-600 p-6 text-white text-center">
        <p className="text-green-200 text-sm mb-1">💳 Pagas cuando lo recibes</p>
        <h3 className="text-xl font-display font-bold">Completa tu pedido de {productName}</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre completo *</label>
          <input {...register('name')} type="text" placeholder="Tu nombre y apellido" className="cod-form-field" autoComplete="name" />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefono / WhatsApp *</label>
          <div className="flex gap-2">
            <select {...register('country')} className="cod-form-field w-28 flex-shrink-0">
              {Object.entries(SUPPORTED_COUNTRIES).map(([code,info]) => <option key={code} value={code}>{info.flag} {info.phone}</option>)}
            </select>
            <input {...register('phone')} type="tel" placeholder="Numero de telefono" className="cod-form-field flex-1" autoComplete="tel" />
          </div>
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email <span className="text-gray-400 font-normal">(opcional)</span></label>
          <input {...register('email')} type="email" placeholder="tu@email.com" className="cod-form-field" />
        </div>
        <button type="submit" disabled={submitting} className="btn-primary btn-orange w-full text-lg py-4 disabled:opacity-60 disabled:cursor-not-allowed">
          {submitting ? '⏳ Procesando...' : `🛒 ${ctaText}`}
        </button>
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          {[['🔒','Datos protegidos'],['📦','Envio a domicilio'],['💳','Pagas al recibir']].map(([icon,text],i) => (
            <span key={i} className="trust-badge">{icon} {text}</span>
          ))}
        </div>
      </form>
    </div>
  )
}