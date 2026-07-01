'use client'
// ══════════════════════════════════════════════════════════════
// src/components/agent/ChatWidget.tsx — AI Agent Chat
// ══════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from 'react'
import { nanoid } from 'nanoid'
import type { Message, ResourceCard } from '@/types'

interface ChatWidgetProps {
  productId:     string
  productName:   string
  productSlug:   string
  problem:       string
  benefits:      string
  country:       string
  agentGreeting?: string
}

export function ChatWidget({
  productId,
  productName,
  productSlug,
  problem,
  benefits,
  country,
  agentGreeting,
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasNewMessage, setHasNewMessage] = useState(false)
  const [sessionId] = useState(() => nanoid())
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Initial greeting
  useEffect(() => {
    const greeting = agentGreeting || `¡Hola! Soy tu asesor de salud en nutrEte 👋

Estoy aquí para ayudarte con ${problem.toLowerCase()}. Puedo orientarte y darte consejos gratuitos.

¿Cómo puedo ayudarte hoy?`

    setMessages([{
      id: nanoid(),
      role: 'assistant',
      content: greeting,
      timestamp: new Date().toISOString(),
    }])
  }, [])

  // Auto-open after delay (with pulse notification)
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasNewMessage(true)
    }, 12000) // 12 seconds
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setHasNewMessage(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMessage: Message = {
      id: nanoid(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
          })),
          productName,
          productSlug,
          problem,
          benefits,
          country,
          sessionId,
        }),
      })

      const data = await response.json()

      const agentMessage: Message = {
        id: nanoid(),
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toISOString(),
        resourceCards: data.cards,
      }

      setMessages(prev => [...prev, agentMessage])
    } catch {
      setMessages(prev => [...prev, {
        id: nanoid(),
        role: 'assistant',
        content: 'Disculpa, tuve un problema. ¿Puedes repetir tu pregunta?',
        timestamp: new Date().toISOString(),
      }])
    } finally {
      setIsLoading(false)
    }
  }, [messages, isLoading, productName, productSlug, problem, benefits, country, sessionId])

  const suggestedQuestions = [
    `¿Cómo funciona ${productName}?`,
    '¿Es seguro para mi condición?',
    '¿En cuánto tiempo veo resultados?',
  ]

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 z-50 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-3xl shadow-premium border border-gray-200 flex flex-col overflow-hidden animate-fade-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-700 to-brand-600 p-4 flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg">🌿</div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">Asesor de Salud nutrEte</p>
              <p className="text-brand-200 text-xs">En línea · Responde al instante</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white transition-colors p-1"
              aria-label="Cerrar chat"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[380px] bg-gray-50">
            {messages.map(msg => (
              <div key={msg.id}>
                <div className={msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                  <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-agent'}>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                  </div>
                </div>

                {/* Resource cards */}
                {msg.resourceCards?.map((card, i) => (
                  <ResourceCardItem key={i} card={card} />
                ))}
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="chat-bubble-agent flex gap-1 items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested questions (initial state) */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="text-xs bg-brand-50 text-brand-700 border border-brand-200 rounded-full px-3 py-1.5 hover:bg-brand-100 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-gray-100 bg-white flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
              placeholder="Escribe tu pregunta..."
              className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-brand-300"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 bg-brand-600 hover:bg-brand-700 text-white rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="fixed bottom-6 right-4 z-50 w-14 h-14 bg-brand-600 hover:bg-brand-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        aria-label="Chat con asesor"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}

        {/* Notification pulse */}
        {hasNewMessage && !isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="absolute w-full h-full bg-red-400 rounded-full animate-ping" />
            <span className="text-[8px] font-bold">1</span>
          </span>
        )}
      </button>
    </>
  )
}

// ── Resource Card ─────────────────────────────────────────────
function ResourceCardItem({ card }: { card: ResourceCard }) {
  return (
    <div className="mx-4 bg-white rounded-2xl border border-brand-200 p-3 flex items-start gap-3">
      <span className="text-2xl flex-shrink-0">{card.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">{card.title}</p>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{card.description}</p>
        {card.ctaUrl && (
          <a
            href={card.ctaUrl}
            className="inline-block mt-2 text-xs font-semibold text-brand-600 hover:text-brand-700"
          >
            {card.ctaText || 'Descargar'} →
          </a>
        )}
      </div>
    </div>
  )
}
