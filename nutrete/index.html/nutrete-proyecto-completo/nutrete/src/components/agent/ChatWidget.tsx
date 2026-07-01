'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
interface Props { productId: string; productName: string; productSlug: string; problem: string; benefits: string; country: string; agentGreeting?: string }
export function ChatWidget({ productId, productName, productSlug, problem, benefits, country, agentGreeting }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{id:string;role:string;content:string;cards?:any[]}[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasNew, setHasNew] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    const greeting = agentGreeting || `Hola! Soy tu asesor de salud en nutrEte 👋\n\nEstoy aqui para ayudarte con ${problem.toLowerCase()}. Te puedo orientar y dar consejos gratuitos.\n\n¿Como puedo ayudarte hoy?`
    setMessages([{ id:'1', role:'assistant', content: greeting }])
    const t = setTimeout(() => setHasNew(true), 12000)
    return () => clearTimeout(t)
  }, [])
  useEffect(() => { if (isOpen) { setHasNew(false); setTimeout(() => inputRef.current?.focus(), 100) } }, [isOpen])
  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages])
  const send = useCallback(async (text: string) => {
    if (!text.trim()||loading) return
    const userMsg = { id: Date.now().toString(), role:'user', content: text }
    setMessages(prev => [...prev, userMsg]); setInput(''); setLoading(true)
    try {
      const res = await fetch('/api/agent', { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ messages:[...messages,userMsg].map(m=>({role:m.role as 'user'|'assistant',content:m.content})), productName, productSlug, problem, benefits, country }) })
      const data = await res.json()
      setMessages(prev => [...prev, { id: Date.now().toString()+'a', role:'assistant', content: data.content, cards: data.cards }])
    } catch { setMessages(prev => [...prev, { id: Date.now().toString()+'e', role:'assistant', content:'Disculpa, tuve un problema. ¿Puedes repetir tu pregunta?' }]) }
    finally { setLoading(false) }
  }, [messages, loading, productName, productSlug, problem, benefits, country])
  const suggested = [`¿Como funciona ${productName}?`, '¿Es seguro para mi condicion?', '¿En cuanto tiempo veo resultados?']
  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-4 z-50 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-3xl shadow-premium border border-gray-200 flex flex-col overflow-hidden animate-fade-up">
          <div className="bg-gradient-to-r from-green-700 to-green-600 p-4 flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg">🌿</div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">Asesor de Salud nutrEte</p>
              <p className="text-green-200 text-xs">En linea · Responde al instante</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white p-1" aria-label="Cerrar">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[380px] bg-gray-50">
            {messages.map(msg => (
              <div key={msg.id}>
                <div className={msg.role==='user'?'flex justify-end':'flex justify-start'}>
                  <div className={msg.role==='user'?'chat-bubble-user':'chat-bubble-agent'}>
                    <p style={{whiteSpace:'pre-wrap'}}>{msg.content}</p>
                  </div>
                </div>
                {msg.cards?.map((card:any,i:number) => (
                  <div key={i} className="mt-2 bg-white rounded-2xl border border-green-200 p-3 flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">{card.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{card.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{card.description}</p>
                      {card.ctaUrl && <a href={card.ctaUrl} className="inline-block mt-2 text-xs font-semibold text-green-600 hover:text-green-700">{card.ctaText||'Descargar'} →</a>}
                    </div>
                  </div>
                ))}
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="chat-bubble-agent flex gap-1 items-center">
                  {[0,150,300].map(d => <span key={d} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:`${d}ms`}}></span>)}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
          {messages.length===1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {suggested.map((q,i) => <button key={i} onClick={() => send(q)} className="text-xs bg-green-50 text-green-700 border border-green-200 rounded-full px-3 py-1.5 hover:bg-green-100 transition-colors">{q}</button>)}
            </div>
          )}
          <div className="p-3 border-t border-gray-100 bg-white flex gap-2">
            <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==='Enter'&&send(input)} placeholder="Escribe tu pregunta..." className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-green-300" />
            <button onClick={() => send(input)} disabled={!input.trim()||loading} className="w-10 h-10 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center transition-colors disabled:opacity-50">
              <svg className="w-4 h-4 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
            </button>
          </div>
        </div>
      )}
      <button onClick={() => setIsOpen(p => !p)} className="fixed bottom-6 right-4 z-50 w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95" aria-label="Chat">
        {isOpen
          ? <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          : <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>}
        {hasNew&&!isOpen&&(
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="absolute w-full h-full bg-red-400 rounded-full animate-ping"></span>
            <span className="text-[8px] font-bold">1</span>
          </span>
        )}
      </button>
    </>
  )
}