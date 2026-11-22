// SurgeonPanel — the Tax/Surgeon Mode screen (Design Spec §4): bento grid on desktop, single column on mobile.
import { useMemo, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Bot, Sparkles, IndianRupee, ArrowDown, ArrowUp, Home, ShieldCheck } from 'lucide-react'
import { Card } from '@/modules/ui/widgets/Table'
import { HeroStat } from '@/modules/ui/widgets/HeroStat'
import { StreamingChat } from '@/modules/chat/StreamChatModule'
import { ToolPrefsClass } from '@/modules/data/UserPreferences'
import { TaxEngine } from '@/modules/surgeon/TaxEngine'
import { TAX_SLABS_OLD, TAX_SLABS_NEW, OLD_STANDARD_DEDUCTION, NEW_STANDARD_DEDUCTION, OLD_BASIC_EXEMPTION_LIMIT } from '@/modules/surgeon/TaxData'
import { formatINR } from '@/modules/finance/format'

const SUGGESTIONS = [
  'Is New Regime better for me?',
  'What if I invest in 80C?',
  'Show my HRA impact',
]

function slabTaxes(salary: number, regime: 'old' | 'new'): Array<{ label: string; tax: number }> {
  const slabs = regime === 'old' ? TAX_SLABS_OLD : TAX_SLABS_NEW
  const std = regime === 'old' ? OLD_STANDARD_DEDUCTION : NEW_STANDARD_DEDUCTION
  const basic = regime === 'old' ? OLD_BASIC_EXEMPTION_LIMIT : 0
  const taxable = Math.max(0, salary - (std + basic))
  const out: Array<{ label: string; tax: number }> = []
  let prev = 0
  let remaining = taxable
  for (const s of slabs) {
    if (remaining <= 0) break
    const width = s.upto - prev
    const band = Math.min(remaining, width)
    if (band > 0) {
      const fromL = (prev / 100000).toFixed(1)
      const toL = (s.upto / 100000).toFixed(1)
      out.push({ label: `${fromL}–${toL}L`, tax: band * s.rate })
    }
    remaining -= band
    prev = s.upto
  }
  if (remaining > 0) out.push({ label: `>${(prev / 100000).toFixed(1)}L`, tax: remaining * 0.3 })
  return out
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const w = 80, h = 32
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w
    const y = h - ((v - min) / (max - min || 1)) * (h - 4) - 2
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const WAYS = [
  { icon: TrendingUp, title: 'Invest in 80C', amount: 150000, saving: 45000 },
  { icon: Home, title: 'HRA exemption', amount: 200000, saving: 60000 },
  { icon: ShieldCheck, title: 'NPS 80CCD(1B)', amount: 50000, saving: 15000 },
]

export function SurgeonPanel(props: { onAskAI: (preset?: string) => void }) {
  const prefs = useMemo(() => new ToolPrefsClass().fromLocalStorage(), [])
  const annual = Math.max(0, prefs.salary) * 100000
  const { winner, savings, old, new: newRegime } = useMemo(() => TaxEngine.compare(annual), [annual])
  const [hours, setHours] = useState(8)

  const oldTax = old.tax
  const newTax = newRegime.tax
  const diff = Math.max(0, Math.abs(oldTax - newTax))
  const recommended = oldTax <= newTax ? 'old' : 'new'

  const oldBands = useMemo(() => slabTaxes(annual, 'old'), [annual])
  const newBands = useMemo(() => slabTaxes(annual, 'new'), [annual])
  const maxBand = Math.max(...oldBands.map((b) => b.tax), ...newBands.map((b) => b.tax), 1)

  const automatedHours = Math.max(0.25, hours * 0.2)
  const savedHours = Math.max(0, hours - automatedHours)

  const inr = (n: number) => formatINR(n)

  const oldSpark = [oldTax * 0.9, oldTax * 0.95, oldTax, oldTax * 0.98, oldTax]
  const newSpark = [newTax * 1.05, newTax * 1.02, newTax, newTax * 0.99, newTax]

  return (
    <div className="space-y-4 stagger pb-8">
      {/* Desktop bento grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Hero tile (cols 1-8) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="lg:col-span-8 relative rounded-3xl p-6 overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, rgba(30,27,75,1) 0%, rgba(49,46,129,1) 100%)',
            border: '1px solid rgba(251,191,36,0.35)',
            boxShadow: '0 24px 48px -24px rgba(30,27,75,0.65)',
          }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 18% -10%, rgba(251,191,36,0.20), transparent 55%)' }} />
          <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-xs font-semibold" style={{ color: 'rgba(241,242,250,0.6)' }}>You save</p>
              <HeroStat value={Math.max(0, savings)} />
              <p className="text-[11px] font-medium mt-1" style={{ color: 'rgba(241,242,250,0.6)' }}>Estimated yearly tax savings</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative h-24 w-24 shrink-0">
                <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(251,191,36,0.15)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#FBBF24" strokeWidth="8" strokeDasharray={`${Math.min(1, savings / Math.max(1, oldTax)) * 2 * Math.PI * 42} ${2 * Math.PI * 42}`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color: '#FBBF24' }}>
                  {Math.round((savings / Math.max(1, oldTax)) * 100)}%
                </div>
              </div>
              <p className="text-sm text-slate-300">
                by choosing the {recommended} regime — {inr(oldTax)} vs {inr(newTax)} tax payable. Salary base {inr(annual)}/yr.
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 relative">
            <TrendingUp className="h-4 w-4 shrink-0" style={{ color: '#FBBF24' }} />
            <span className="text-xs font-medium" style={{ color: '#FDE68A' }}>Potential savings recognized</span>
          </div>
        </motion.div>

        {/* AI panel sidebar (cols 9-12) — desktop only */}
        <div className="hidden lg:block lg:col-span-4 lg:row-span-3 space-y-3">
          <div className="rounded-3xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--surface-muted)' }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="h-8 w-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4338CA, #6366F1)' }}>
                <Sparkles className="h-4 w-4" style={{ color: '#fff' }} />
              </span>
              <h3 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Ask AI</h3>
            </div>
            <button onClick={() => props.onAskAI('Should I switch my tax regime?')} className="w-full text-left rounded-xl px-4 py-3 text-sm font-medium border mb-3" style={{ background: 'var(--surface-muted)', borderColor: 'rgba(99,102,241,0.35)', color: 'var(--chat-indigo-hi)' }}>
              Should I switch?
            </button>
            <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
              {recommended === 'new' ? 'New' : 'Old'} regime saves you {inr(diff)} — {inr(oldTax)} vs {inr(newTax)} tax payable.
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {SUGGESTIONS.map((q) => (
                <button key={q} onClick={() => props.onAskAI(q)} className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border" style={{ background: 'var(--surface-muted)', borderColor: 'rgba(99,102,241,0.35)', color: 'var(--chat-indigo-hi)' }}>
                  {q}
                </button>
              ))}
            </div>
            <StreamingChat preset={null} />
          </div>
        </div>

        {/* Regime tiles (cols 1-8) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
          {/* Old Regime tile */}
          <div className="rounded-3xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--surface-muted)', borderRadius: '2rem 1rem 2rem 1rem' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--surface-muted)' }}>
                  <IndianRupee className="h-4 w-4" style={{ color: 'var(--text-secondary)' }} />
                </span>
                <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Old Regime</span>
              </div>
              <Sparkline values={oldSpark} color="#9AA0C3" />
            </div>
            <p className="font-mono text-2xl font-bold" style={{ color: 'var(--text-secondary)' }}>{inr(oldTax)}</p>
            <p className="text-[11px] mt-1" style={{ color: 'var(--text-secondary)' }}>incl. standard deduction {formatINR(NEW_STANDARD_DEDUCTION)}</p>
          </div>

          {/* New Regime tile */}
          <div className="rounded-3xl p-5 relative" style={{ background: 'linear-gradient(180deg, rgba(30,27,75,1) 0%, rgba(49,46,129,1) 100%)', border: '1px solid rgba(251,191,36,0.35)', borderRadius: '1rem 2rem 1rem 2rem' }}>
            <span className="absolute -top-2 -right-2 px-3 py-1 rounded-full text-[10px] font-bold" style={{ background: 'rgba(251,191,36,0.15)', color: '#FBBF24', border: '1px solid rgba(251,191,36,0.45)' }}>RECOMMENDED</span>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(251,191,36,0.15)' }}>
                  <IndianRupee className="h-4 w-4" style={{ color: '#FBBF24' }} />
                </span>
                <span className="text-sm font-semibold" style={{ color: '#FDE68A' }}>New Regime</span>
              </div>
              <Sparkline values={newSpark} color="#FBBF24" />
            </div>
            <p className="font-mono text-2xl font-bold" style={{ color: '#FBBF24' }}>{inr(newTax)}</p>
            <p className="text-[11px] mt-1" style={{ color: 'rgba(241,242,250,0.6)' }}>incl. standard deduction {formatINR(NEW_STANDARD_DEDUCTION)}</p>
          </div>

          {/* Saffron pill overlapping seam */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden sm:flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-bold" style={{ background: 'linear-gradient(135deg, #FBBF24, #FDE68A)', color: '#0F172A', boxShadow: '0 8px 20px -8px rgba(245,158,11,0.55)', zIndex: 10 }}>
            −{inr(diff)}
          </div>
        </div>

        {/* Bottom row (cols 1-12): slab chart + ways to save */}
        <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Slab chart */}
          <Card>
            <h3 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Tax by slab</h3>
            <div className="flex items-end gap-2 h-40 mt-2">
              {Array.from({ length: Math.max(oldBands.length, newBands.length) }).map((_, i) => {
                const o = oldBands[i]
                const n = newBands[i]
                const oH = o ? (o.tax / maxBand) * 100 : 0
                const nH = n ? (n.tax / maxBand) * 100 : 0
                return (
                  <div key={i} className="flex-1 flex items-end gap-0.5">
                    <div className="flex-1 rounded-t" style={{ height: `${oH}%`, background: '#FBBF24', minHeight: o && o.tax > 0 ? 2 : 0 }} title={o ? `${o.label}: ${inr(o.tax)}` : ''} />
                    <div className="flex-1 rounded-t" style={{ height: `${nH}%`, background: '#4338CA', minHeight: n && n.tax > 0 ? 2 : 0 }} title={n ? `${n.label}: ${inr(n.tax)}` : ''} />
                  </div>
                )
              })}
            </div>
            <div className="flex items-center gap-4 mt-2 text-[10px]" style={{ color: 'var(--text-secondary)' }}>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm" style={{ background: '#FBBF24' }} /> Old</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm" style={{ background: '#4338CA' }} /> New</span>
            </div>
          </Card>

          {/* Ways to save more */}
          <Card>
            <h3 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Ways to save more</h3>
            <div className="space-y-2 mt-2">
              {WAYS.map((w) => {
                const WI = w.icon
                return (
                <div key={w.title} className="flex items-center gap-3 rounded-xl p-2" style={{ background: 'var(--surface-muted)' }}>
                  <span className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--surface)' }}><WI className="h-4 w-4" style={{ color: '#FBBF24' }} /></span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{w.title}</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>up to {formatINR(w.amount)}</p>
                  </div>
                  <span className="text-xs font-bold" style={{ color: '#FBBF24' }}>−{inr(w.saving)}</span>
                </div>
                )
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Laziness calculator */}
      <Card>
        <h3 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Laziness Calculator</h3>
        <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Hours spent on tax filing</label>
        <input type="range" min={0} max={20} step={0.5} value={hours} onChange={(e) => setHours(Number(e.target.value))} className="w-full accent-amber-500" />
        <div className="rounded-xl p-3 text-center" style={{ background: 'var(--surface-muted)' }}>
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>You spent {hours} hours on tax filing.</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Automated: {automatedHours} hours. You just saved <span className="font-bold" style={{ color: '#059669' }}>{savedHours} hours</span> — enough for two Bollywood movies.
          </p>
        </div>
      </Card>

      {/* Sticky mobile CTA */}
      <div className="lg:hidden fixed bottom-20 inset-x-0 z-40 px-4">
        <button onClick={() => props.onAskAI('Should I switch my tax regime?')} className="w-full rounded-2xl py-3 text-sm font-bold flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, #4338CA, #6366F1)', color: '#fff', boxShadow: '0 12px 28px rgba(15,23,42,0.45)' }}>
          <Sparkles className="h-4 w-4" />
          Switch to New Regime
        </button>
      </div>
    </div>
  )
}
