import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, ArrowRight, Sparkles, Shield, Scale, BookOpen, IndianRupee } from 'lucide-react'
import { HeroStat } from '@/modules/ui/widgets/HeroStat'
import { Card } from '@/modules/ui/widgets/Table'
import { ToolPrefsClass } from '@/modules/data/UserPreferences'
import { TaxEngine } from '@/modules/surgeon/TaxEngine'

const ACTIONS = [
  { icon: Scale, title: 'Compare Regimes', sub: 'Old vs New', mode: 'compare' as const },
  { icon: Sparkles, title: 'Ask AI Questions', sub: 'Tax & savings', mode: 'chat' as const },
  { icon: IndianRupee, title: 'Plan Your Savings', sub: '80C, NPS, HRA', mode: 'taxes' as const },
  { icon: BookOpen, title: 'Learn Tax Basics', sub: 'Guides & terms', mode: 'learn' as const },
]

export function HomePanel(props: { onAskAI: (preset?: string) => void; setMode: (m: any) => void }) {
  const prefs = useMemo(() => new ToolPrefsClass().fromLocalStorage(), [])
  const annual = Math.max(0, prefs.salary) * 100000
  const { savings, old, new: nu } = useMemo(() => TaxEngine.compare(annual), [annual])
  const diff = Math.max(0, Math.abs(old.tax - nu.tax))

  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative rounded-3xl overflow-hidden p-8" style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)', border: '1px solid rgba(165,180,252,0.2)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 80% 20%, rgba(251,191,36,0.25), transparent 60%)' }} />
        <svg className="absolute bottom-0 left-0 right-0 w-full h-24 opacity-30" viewBox="0 0 1200 100" preserveAspectRatio="none" aria-hidden>
          <path d="M0 100 L0 60 L200 40 L400 70 L600 30 L800 55 L1000 25 L1200 60 L1200 100 Z" fill="#4338CA" opacity="0.6" />
          <path d="M0 100 L0 70 L300 50 L600 75 L900 45 L1200 70 L1200 100 Z" fill="#1E1B4B" opacity="0.7" />
        </svg>
        <div className="relative z-10 max-w-2xl">
          <h2 className="font-display font-extrabold text-3xl tracking-tight" style={{ color: '#F1F2FA' }}>
            Let your money <span style={{ color: '#4338CA', textDecoration: 'underline', textDecorationColor: '#FBBF24', textUnderlineOffset: '6px' }}>work harder</span> for you
          </h2>
          <p className="mt-2 text-sm" style={{ color: 'rgba(241,242,250,0.7)' }}>Compare regimes, find deductions, and switch with confidence — all in one place.</p>
          <button onClick={() => props.setMode('compare')} className="mt-4 rounded-xl px-5 py-2.5 text-sm font-bold flex items-center gap-2" style={{ background: 'linear-gradient(135deg, #FBBF24, #FDE68A)', color: '#0F172A', boxShadow: '0 8px 20px -8px rgba(245,158,11,0.55)' }}>
            Find Your Best Regime <ArrowRight className="h-4 w-4" />
          </button>
          <div className="mt-4 flex gap-6 text-[10px] font-semibold tracking-widest" style={{ color: 'rgba(241,242,250,0.5)' }}>
            <span>LOWER TAXES</span><span>BIGGER DREAMS</span><span>BRIGHTER YOU</span>
          </div>
        </div>
      </motion.div>

      {/* Savings card */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="h-12 w-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(251,191,36,0.12)' }}>
              <span className="text-2xl">🐷</span>
            </span>
            <div>
              <p className="text-xs font-semibold" style={{ color: 'var(--text-2)' }}>You save</p>
              <HeroStat value={Math.max(0, savings)} prefix="₹" />
              <p className="text-[11px] font-medium" style={{ color: 'var(--text-2)' }}>Estimated yearly tax savings</p>
            </div>
          </div>
          <div className="sm:ml-auto flex items-center gap-4">
            <div className="relative h-20 w-20 shrink-0">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--surface-muted)" strokeWidth="8" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#FBBF24" strokeWidth="8" strokeDasharray={`${Math.min(1, savings / Math.max(1, annual)) * 2 * Math.PI * 40} ${2 * Math.PI * 40}`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color: '#FBBF24' }}>
                {Math.round((savings / Math.max(1, annual)) * 100)}% of salary
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block rounded-full px-3 py-1 text-[10px] font-bold" style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981', border: '1px solid rgba(16,185,129,0.35)' }}>Protected today</span>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-xs" style={{ color: 'var(--text-2)' }}>
            By choosing the new regime — <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>₹{old.tax.toLocaleString('en-IN')}</span> vs <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>₹{nu.tax.toLocaleString('en-IN')}</span> tax payable. Salary base <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>₹{annual.toLocaleString('en-IN')}</span>/yr.
          </p>
        </div>
      </Card>

      {/* Regime tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-3xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '2rem 1rem 2rem 1rem' }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold" style={{ color: 'var(--text-2)' }}>Old Regime</span>
            <TrendingUp className="h-4 w-4" style={{ color: 'var(--text-2)' }} />
          </div>
          <p className="font-mono text-2xl font-bold" style={{ color: 'var(--text-2)' }}>₹{old.tax.toLocaleString('en-IN')}</p>
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-2)' }}>incl. standard deduction ₹75,000</p>
        </div>
        <div className="rounded-3xl p-5 relative" style={{ background: 'linear-gradient(180deg, rgba(30,27,75,1) 0%, rgba(49,46,129,1) 100%)', border: '1px solid rgba(251,191,36,0.35)', borderRadius: '1rem 2rem 1rem 2rem' }}>
          <span className="absolute -top-2 -right-2 px-3 py-1 rounded-full text-[10px] font-bold" style={{ background: 'rgba(251,191,36,0.15)', color: '#FBBF24', border: '1px solid rgba(251,191,36,0.45)' }}>RECOMMENDED</span>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold" style={{ color: '#FDE68A' }}>New Regime</span>
            <TrendingUp className="h-4 w-4" style={{ color: '#FBBF24' }} />
          </div>
          <p className="font-mono text-2xl font-bold" style={{ color: '#FBBF24' }}>₹{nu.tax.toLocaleString('en-IN')}</p>
          <p className="text-[11px] mt-1" style={{ color: 'rgba(241,242,250,0.6)' }}>incl. standard deduction ₹75,000</p>
          <span className="absolute -bottom-3 -right-3 rounded-full px-3 py-1 text-xs font-bold" style={{ background: 'linear-gradient(135deg, #FBBF24, #FDE68A)', color: '#0F172A', boxShadow: '0 8px 20px -8px rgba(245,158,11,0.55)' }}>
            You save ₹{diff.toLocaleString('en-IN')} per year!
          </span>
        </div>
      </div>

      {/* Action tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {ACTIONS.map((a) => {
          const Icon = a.icon
          return (
            <button key={a.title} onClick={() => props.setMode(a.mode)} className="rounded-2xl p-4 text-left transition-transform active:scale-95" style={{ background: 'var(--surface)', border: '1px solid var(--border)', opacity: 0.9 }}>
              <Icon className="h-5 w-5 mb-2" style={{ color: 'var(--kavach-gold)' }} />
              <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{a.title}</p>
              <p className="text-[11px]" style={{ color: 'var(--text-2)' }}>{a.sub}</p>
              <span className="text-[11px] mt-1 inline-block" style={{ color: 'var(--text-2)' }}>→</span>
            </button>
          )
        })}
      </div>

      {/* Smart insights */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Smart Insights for You</h3>
          <button className="text-xs font-semibold" style={{ color: 'var(--indigo, #4338CA)' }}>See all →</button>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-3 rounded-xl p-3" style={{ background: 'var(--surface-muted)' }}>
            <span className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--surface)' }}>🏠</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>HRA optimization</p>
              <p className="text-[11px]" style={{ color: 'var(--text-2)' }}>up to ₹10,000 more</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl p-3" style={{ background: 'var(--surface-muted)' }}>
            <span className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--surface)' }}>🛡️</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>NPS contributions</p>
              <p className="text-[11px]" style={{ color: 'var(--text-2)' }}>to reduce taxable income</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Closing CTA */}
      <div className="rounded-3xl p-6" style={{ background: 'linear-gradient(135deg, #4338CA, #6366F1)', border: '1px solid rgba(165,180,252,0.2)' }}>
        <h3 className="font-display font-extrabold text-xl" style={{ color: '#fff' }}>Ready to switch?</h3>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.8)' }}>Move to the regime that saves you more — in one tap.</p>
        <button onClick={() => props.setMode('compare')} className="mt-3 rounded-full px-5 py-2.5 text-sm font-bold" style={{ background: '#fff', color: '#4338CA' }}>
          Switch to New Regime →
        </button>
      </div>
    </div>
  )
}
