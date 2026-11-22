// StreamingChat — LLM-backed chat with fallback (Design Spec §5): welcome bubble, suggestions, bubbles, thinking state, input bar.
import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Send, Sparkles } from 'lucide-react'
import { callLLM } from '@/modules/tools/ToolAI'
import { showToast } from '@/modules/ui/widgets/ToolMessaging'
import { ToolPrefsClass } from '@/modules/data/UserPreferences'
import { TaxEngine } from '@/modules/surgeon/TaxEngine'
import { formatINR } from '@/modules/finance/format'

interface ChatCard {
  headline: string
  note?: string
  rows: Array<{ k: string; v: string }>
  cta: string
  ctaAction?: string
}

interface Msg { role: 'user' | 'assistant'; text: string; at: number; card?: ChatCard }

const SUGGESTIONS = [
  'Should I switch regimes?',
  'Is 80C worth it?',
  'HRA impact',
  'Check this SMS',
]

function ChatBubble(props: { msg: Msg; onAsk?: (q: string) => void }) {
  const mine = props.msg.role === 'user'
  const time = new Date(props.msg.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  if (mine) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-[85%] rounded-[10px] px-4 py-2.5 text-sm whitespace-pre-wrap shadow-sm self-end" style={{ background: 'linear-gradient(135deg, #14203A, #1E2A4A)', color: '#FFFDF8', borderBottomRightRadius: '0.25rem' }}>
        <div>{props.msg.text}</div>
        <div className="mt-1 text-[10px]" style={{ color: 'rgba(255,255,255,0.75)' }}>{time}</div>
      </motion.div>
    )
  }
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="self-start max-w-[90%] flex items-start gap-2">
      <span className="h-7 w-7 rounded-full shrink-0 flex items-center justify-center" style={{ background: 'var(--surface-muted)', border: '1px solid var(--border)' }}>
        <Sparkles className="h-3.5 w-3.5" style={{ color: 'var(--text-primary)' }} />
      </span>
      <div className="max-w-[85%] rounded-[10px] px-4 py-2.5 text-sm whitespace-pre-wrap shadow-sm" style={{ background: 'var(--surface)', border: '1px solid var(--surface-muted)', borderBottomLeftRadius: '0.25rem', color: 'var(--text-primary)' }}>
        <div>{props.msg.text}</div>
        {props.msg.card && (
          <div className="mt-2 rounded-xl p-3" style={{ background: 'rgba(255,201,60,0.08)', border: '1px solid rgba(255,201,60,0.35)' }}>
            <p className="font-mono font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{props.msg.card.headline}</p>
            {props.msg.card.note && <p className="text-[11px] mt-1" style={{ color: 'var(--text-secondary)' }}>{props.msg.card.note}</p>}
            <div className="mt-2 space-y-1">
              {props.msg.card.rows.map((r) => (
                <div key={r.k} className="flex justify-between gap-2">
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{r.k}</span>
                  <span className="font-mono text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{r.v}</span>
                </div>
              ))}
            </div>
            {props.msg.card.ctaAction && (
              <button onClick={() => props.onAsk?.(props.msg.card!.ctaAction!)} className="mt-2 rounded-full px-3 py-1 text-[11px] font-bold" style={{ background: 'rgba(255,201,60,0.18)', border: '1px solid rgba(255,201,60,0.55)', color: '#92400E' }}>
                {props.msg.card.cta}
              </button>
            )}
          </div>
        )}
        <div className="mt-1 text-[10px]" style={{ color: 'var(--text-secondary)' }}>{time}</div>
      </div>
    </motion.div>
  )
}

function ThinkingBubble() {
  return (
    <div className="self-start max-w-[85%] flex items-start gap-2">
      <span className="h-7 w-7 rounded-full shrink-0 flex items-center justify-center" style={{ background: 'var(--surface-muted)', border: '1px solid var(--border)' }}>
        <Sparkles className="h-3.5 w-3.5" style={{ color: 'var(--text-primary)' }} />
      </span>
      <div className="self-start max-w-[85%] rounded-[10px] rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-2" style={{ background: 'var(--surface)', border: '1px solid var(--surface-muted)' }}>
        <span className="flex gap-1">
          <span className="h-1.5 w-1.5 rounded-full animate-blink" style={{ background: 'var(--text-secondary)' }} />
          <span className="h-1.5 w-1.5 rounded-full animate-blink" style={{ background: 'var(--text-secondary)', animationDelay: '0.2s' }} />
          <span className="h-1.5 w-1.5 rounded-full animate-blink" style={{ background: 'var(--text-secondary)', animationDelay: '0.4s' }} />
        </span>
        <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>FinKavach is analyzing…</span>
      </div>
    </div>
  )
}

export function StreamingChat(props: { preset?: string | null; onPresetSent?: () => void }) {
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const prefs = useMemo(() => new ToolPrefsClass().fromLocalStorage(), [])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, thinking])

  async function send(q?: string) {
    const text = (q ?? input).trim()
    if (!text || thinking) return
    const msg: Msg = { role: 'user', text, at: Date.now() }
    const aiMsg: Msg = { role: 'assistant', text: '', at: Date.now(), card: undefined }
    if (!q) { setInput(''); setMessages((m) => [...m, msg]) }
    else { setMessages((m) => [...m, msg]) }
    setThinking(true)
    try {
      const annual = prefs.salary * 100000
      const r = await callLLM(
        `You are FinKavach, a friendly Indian personal finance assistant. The user's gross annual income is about ${formatINR(annual)}. Answer the user's question honestly, in plain language, and use the comparison logic the user can verify in the app. Question: ${text}`,
        prefs.llmModel,
        prefs.llmApiKey,
      )
      const answer = r ?? 'The AI could not be reached just now — try again in a moment, or ask about tax basics instead.'
      const isRegimeQ = /regime|tax|compare|slab|save|which/i.test(text)
      const { savings, old, new: nu } = TaxEngine.compare(annual)
      const recommended = old.tax <= nu.tax ? 'Old' : 'New'
      const card: ChatCard | undefined = isRegimeQ ? {
        headline: `${recommended} Regime saves ${formatINR(savings)}`,
        note: `Old regime tax ${formatINR(old.tax)} vs New ${formatINR(nu.tax)} tax payable.`,
        rows: [
          { k: 'Old Regime', v: `${formatINR(old.tax)} tax` },
          { k: 'New Regime', v: `${formatINR(nu.tax)} tax` },
          { k: 'You Save', v: formatINR(savings) },
        ],
        cta: 'Show breakdown',
        ctaAction: 'Show me the full tax breakdown for my income',
      } : undefined
      setMessages((m) => [...m, { ...aiMsg, text: answer, card }])
    } finally {
      setThinking(false)
    }
  }

  // External preset (e.g. "Should I switch?" from Surgeon mode) → auto-send
  useEffect(() => {
    const q = (props.preset ?? '').trim()
    if (!q) return
    void send(q)
    props.onPresetSent?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.preset])

  async function onMic() {
    showToast('info', 'Voice input coming soon — type your question instead')
  }

  return (
    <div className="flex flex-col rounded-[10px] overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--surface-muted)', boxShadow: '0 1px 2px rgb(0 0 0 / 0.05)' }}>
      {/* Messages */}
      <div className="h-72 overflow-y-auto px-4 py-3 flex flex-col gap-2">
        {messages.length === 0 && !thinking && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="self-start max-w-[90%] rounded-[10px] rounded-bl-sm px-4 py-3 shadow-sm" style={{ background: 'var(--surface)', border: '1px solid var(--surface-muted)' }}>
            <div className="flex items-center gap-2">
              <span className="h-7 w-7 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--surface-muted)', border: '1px solid var(--border)' }}>
                <Sparkles className="h-4 w-4" style={{ color: 'var(--text-primary)' }} />
              </span>
              <span className="font-display font-bold text-sm" style={{ color: 'var(--text-primary)' }}>FinKavach AI</span>
            </div>
            <p className="mt-2 text-sm" style={{ color: 'var(--text-primary)' }}>Hi! Ask me anything about your taxes, savings, or that suspicious SMS.</p>
            <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>Money math is verified in-app — the AI only explains.</p>
          </motion.div>
        )}
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <ChatBubble key={i} msg={m} onAsk={(q) => void send(q)} />
          ))}
          {thinking && <ThinkingBubble />}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 0 && !thinking && (
        <div className="px-4 pb-2">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {SUGGESTIONS.map((s) => (
              <button key={s} type="button" onClick={() => send(s)} className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors hover:bg-[var(--surface-muted)]" style={{ background: 'var(--surface-muted)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t" style={{ borderColor: 'var(--surface-muted)' }}>
        <div className="flex items-end gap-2 rounded-full bg-white border shadow-sm px-3 py-2" style={{ background: 'var(--surface)', borderColor: 'var(--surface-muted)' }}>
          <button type="button" onClick={onMic} aria-label="Voice input" className="h-9 w-9 shrink-0 rounded-full flex items-center justify-center" style={{ background: 'var(--surface-muted)' }}>
            <Mic className="h-4 w-4" style={{ color: 'var(--text-secondary)' }} />
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            placeholder="Ask about taxes, savings, scams..."
            rows={1}
            className="flex-1 bg-transparent outline-none resize-none text-sm max-h-28 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
          />
          <button onClick={() => send()} disabled={!input.trim() || thinking} aria-label="Send" className="h-9 w-9 shrink-0 rounded-full flex items-center justify-center disabled:opacity-40" style={{ background: '#FFC93C' }}>
            <Send className="h-4 w-4" style={{ color: '#14203A' }} />
          </button>
        </div>
        <p className="mt-1.5 text-[10px] text-center" style={{ color: 'var(--text-secondary)' }}>FinKavach AI can make mistakes — verify money decisions with a CA.</p>
      </div>
    </div>
  )
}
