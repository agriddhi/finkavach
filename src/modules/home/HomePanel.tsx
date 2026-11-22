import { useEffect, useMemo, useState } from 'react'
import { PiggyBank, ChevronRight, Check, Lightbulb, ArrowRight, ShieldCheck } from 'lucide-react'
import { HeroStat } from '@/modules/ui/widgets/HeroStat'
import { ToolPrefsClass } from '@/modules/data/UserPreferences'
import { formatINR, getFinBindings, quoteOfTheDay } from '@/modules/finance/format'
import type { ModeKey } from '@/modules/ui/widgets/ModeSwitcher'

const FEATURES: Array<{ title: string; desc: string; mode?: ModeKey; ai?: boolean }> = [
  { title: 'Compare Regimes', desc: 'Old vs New, side by side.', mode: 'compare' },
  { title: 'Ask AI Questions', desc: 'Tax & savings, explained.', ai: true },
  { title: 'Deduction Finder', desc: '80C, 80D, NPS and HRA.', mode: 'taxes' },
  { title: 'Learn Tax Basics', desc: 'Guides & plain language.', mode: 'learn' },
]

const CARD_SHADOW = '0 1px 2px rgba(20,32,58,0.05)'

export function HomePanel(props: { onAskAI: (preset?: string) => void; setMode: (m: ModeKey) => void }) {
  const prefs = useMemo(() => new ToolPrefsClass().fromLocalStorage(), [])
  const b = useMemo(() => getFinBindings(prefs), [prefs])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 350)
    return () => clearTimeout(t)
  }, [])

  const hasData = b.salaryBase > 0

  if (!hasData) {
    return (
      <div className="rounded-[10px] p-8 text-center" style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: CARD_SHADOW }}>
        <img src="/img/empty-plant.svg" alt="" aria-hidden="true" className="mx-auto h-20 w-20 mb-3" onError={(e) => { e.currentTarget.style.display = 'none' }} />
        <h2 className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)' }}>Add your salary to see your savings</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Salary in, regime maths out — it all appears here.</p>
      </div>
    )
  }

  const recommendedRegime = b.recommendedRegime // 'old' | 'new'
  const equal = b.savings === 0
  const showRec = !equal

  return (
    <div className="grid lg:grid-cols-[1fr_300px] gap-5 items-start">
      <div className="space-y-5 min-w-0">
        {/* (1) Hero — editorial split: headline left, taped photo right (strip on mobile) */}
        <section className="relative rounded-[10px] overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: CARD_SHADOW }}>
          <div className="grid sm:grid-cols-[1.5fr_1fr]">
            <div className="p-6 sm:p-7 order-last sm:order-none">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 shrink-0" style={{ background: 'var(--text-secondary)' }} />
                <span className="font-mono text-[10px] font-semibold tracking-[0.2em]" style={{ color: 'var(--text-secondary)' }}>TAXES SHOULDN&apos;T HOLD YOU BACK</span>
              </div>
              <h2 className="font-display font-extrabold text-[28px] sm:text-[34px] leading-[1.08] tracking-[-0.02em] mt-4" style={{ color: 'var(--text-primary)' }}>
                Let your money <span className="marker-stripe">work harder for you.</span>
              </h2>
              <p className="text-sm mt-3 max-w-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Switching regimes can put real money back in your pocket. We run the numbers on your salary — you pick the cheaper one.
              </p>
              <button onClick={() => props.setMode('compare')} className="btn-marigold inline-flex items-center gap-2 mt-5 text-sm">
                Find Your Best Regime <ArrowRight className="h-4 w-4" />
              </button>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-5">
                {['Lower taxes', 'Bigger dreams', 'Brighter you'].map((c) => (
                  <span key={c} className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    <Check className="h-3.5 w-3.5" style={{ color: 'var(--success)' }} /> {c}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative h-28 sm:h-auto sm:min-h-[240px] order-first sm:order-none sm:border-l" style={{ borderColor: 'var(--border)', background: 'linear-gradient(120deg, #FFF6DC 0%, #FBE0E3 55%, #D9E8A6 100%)' }}>
              <img src="/img/hero-desk.svg" alt="Notebook, coffee and a small plant on a warm desk" className="absolute inset-0 h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
              {/* washi tape corners */}
              <span aria-hidden="true" className="absolute top-2.5 left-3 h-4.5 w-16 -rotate-6 hidden sm:block" style={{ height: '18px', width: '64px', background: 'rgba(255,201,60,0.45)', border: '1px solid rgba(20,32,58,0.06)' }} />
              <span aria-hidden="true" className="absolute bottom-2.5 right-3 rotate-3 hidden sm:block" style={{ height: '18px', width: '56px', background: 'rgba(217,232,166,0.65)', border: '1px solid rgba(20,32,58,0.06)' }} />
            </div>
          </div>
        </section>

        {/* (2) Savings — printed-statement ledger, flat */}
        <section className="rounded-[10px] p-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: CARD_SHADOW }}>
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex items-center gap-4 min-w-0">
              <span className="h-12 w-12 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--pink-soft)', border: '1px solid rgba(176,74,99,0.25)' }}>
                <PiggyBank className="h-6 w-6" style={{ color: '#B04A63' }} />
              </span>
              <div className="min-w-0">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--text-secondary)' }}>You save</p>
                {loading
                  ? <div className="h-10 w-40 rounded animate-pulse mt-1" style={{ background: 'var(--surface-muted)' }} />
                  : <div className="mt-1"><HeroStat value={b.savings} /></div>}
                <p className="text-[11px] mt-1.5" style={{ color: 'var(--text-secondary)' }}>Estimated yearly tax savings</p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              {b.savings > 0 && (
                <div className="relative h-20 w-20 shrink-0">
                  <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="var(--surface-muted)" strokeWidth="8" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#FFC93C" strokeWidth="8" strokeDasharray={`${Math.min(1, b.savingsPercent / 100) * 2 * Math.PI * 40} ${2 * Math.PI * 40}`} strokeLinecap="butt" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-mono font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{b.savingsPercent}%</span>
                    <span className="text-[8px] font-semibold" style={{ color: 'var(--text-secondary)' }}>of your tax</span>
                  </div>
                </div>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold" style={{ background: 'var(--success-soft)', color: 'var(--success)', border: '1px solid rgba(46,158,107,0.3)' }}>
                <ShieldCheck className="h-3.5 w-3.5" /> Protected today
              </span>
            </div>
          </div>
          <div className="mt-5 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{`By choosing the ${recommendedRegime} regime — ${formatINR(b.oldTax)} vs ${formatINR(b.newTax)} tax payable. Salary base ${formatINR(b.salaryBase)}/yr.`}</p>
          </div>
        </section>

        {/* (3) Regimes — one ledger card, recommended row marked with a marigold rule */}
        <section className="rounded-[10px] overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: CARD_SHADOW }}>
          <div className="flex items-baseline justify-between gap-3 px-5 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
            <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--text-secondary)' }}>Regime check</h3>
            <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>incl. standard deduction {formatINR(b.standardDeduction)}</span>
          </div>
          {([
            { key: 'old', label: 'Old Regime', tax: b.oldTax },
            { key: 'new', label: 'New Regime', tax: b.newTax },
          ] as Array<{ key: 'old' | 'new'; label: string; tax: number }>).map((r, i) => {
            const isRec = recommendedRegime === r.key && showRec
            return (
              <div
                key={r.key}
                className="flex items-center gap-4 px-5 py-4"
                style={{
                  background: isRec ? 'rgba(255,201,60,0.12)' : 'transparent',
                  borderLeft: `4px solid ${isRec ? '#FFC93C' : 'transparent'}`,
                  borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                }}
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold" style={{ color: isRec ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{r.label}</p>
                  {isRec && <p className="font-mono text-[9px] font-bold tracking-[0.18em] mt-1" style={{ color: '#92400E' }}>RECOMMENDED</p>}
                </div>
                <p className="ml-auto font-mono text-2xl sm:text-[28px] font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>{formatINR(r.tax)}</p>
              </div>
            )
          })}
          <div className="px-5 py-3.5" style={{ background: equal ? 'var(--surface-muted)' : '#FFC93C', borderTop: '1px solid var(--border)' }}>
            <p className="text-[13px] font-bold" style={{ color: equal ? 'var(--text-primary)' : '#14203A' }}>
              {equal ? 'Both regimes cost the same for you' : `You save ${formatINR(b.savings)} per year!`}
            </p>
          </div>
        </section>

        {/* (4) Features — numbered contents list, not four identical tiles */}
        <section className="rounded-[10px] overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: CARD_SHADOW }}>
          {FEATURES.map((f, i) => (
            <button
              key={f.title}
              onClick={() => (f.ai ? props.onAskAI() : f.mode && props.setMode(f.mode))}
              className="w-full flex items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-[var(--surface-muted)]"
              style={{ borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}
            >
              <span className="font-mono text-[11px] font-semibold w-6 shrink-0" style={{ color: 'var(--text-secondary)' }}>{String(i + 1).padStart(2, '0')}</span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{f.title}</span>
                <span className="block text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{f.desc}</span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" style={{ color: 'var(--text-secondary)' }} />
            </button>
          ))}
        </section>
      </div>

      {/* (Right rail) */}
      <aside className="space-y-5 lg:sticky lg:top-24">
        {/* Sticky note with tape */}
        <div className="relative rounded-[4px] p-5 pt-6" style={{ background: 'var(--note-green)', border: '1px solid rgba(120,140,60,0.35)', boxShadow: '0 6px 14px -10px rgba(80,100,40,0.6)', transform: 'rotate(1.6deg)' }}>
          <span aria-hidden="true" className="absolute -top-2.5 left-1/2 -translate-x-1/2 -rotate-2" style={{ height: '18px', width: '72px', background: 'rgba(255,253,248,0.8)', border: '1px solid rgba(20,32,58,0.08)' }} />
          <p className="font-hand text-[22px] leading-snug" style={{ color: '#3F4A21' }}>{quoteOfTheDay()}</p>
        </div>

        {/* Quick actions — plain hairline list */}
        <div className="rounded-[10px] px-5 py-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: CARD_SHADOW }}>
          <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] pb-1" style={{ color: 'var(--text-secondary)' }}>Quick actions</h3>
          <div className="mt-1">
            {[
              { label: 'Compare Tax Regimes', run: () => props.setMode('compare') },
              { label: 'Explore Deductions', run: () => props.setMode('taxes') },
              { label: 'Ask AI a Question', run: () => props.onAskAI() },
              { label: 'Read Guides', run: () => props.setMode('learn') },
            ].map((a, i) => (
              <button key={a.label} onClick={a.run} className="w-full flex items-center justify-between gap-2 py-3 text-left transition-colors hover:text-[var(--text-primary)]" style={{ borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
                <span className="text-[13px] font-medium" style={{ color: 'var(--text-secondary)' }}>{a.label}</span>
                <ChevronRight className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--text-secondary)' }} />
              </button>
            ))}
          </div>
        </div>

        {/* Tip of the week */}
        <div className="rounded-[10px] px-5 py-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: CARD_SHADOW }}>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-3.5 w-3.5" style={{ color: '#B45309' }} />
            <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--text-secondary)' }}>This week&apos;s tip</h3>
          </div>
          <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--text-primary)' }}>{b.tipOfTheWeek}</p>
          <p className="font-hand text-xl mt-1.5" style={{ color: 'var(--text-secondary)' }}>You got this!</p>
        </div>
      </aside>
    </div>
  )
}
