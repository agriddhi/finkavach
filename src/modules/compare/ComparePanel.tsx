import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Card } from '@/modules/ui/widgets/Table'
import { ToolPrefsClass } from '@/modules/data/UserPreferences'
import { TaxEngine } from '@/modules/surgeon/TaxEngine'
import { TAX_SLABS_OLD, TAX_SLABS_NEW, NEW_STANDARD_DEDUCTION, FY_2025_26 } from '@/modules/surgeon/TaxData'
import { formatINR } from '@/modules/finance/format'

const SCENARIOS = ['What if I invest 1.5L in 80C?', 'What if HRA doubles?', 'What if salary grows 20%?']

function slabTax(t: number, slabs: Array<{ upto: number; rate: number }>): number {
  let prev = 0
  let tax = 0
  for (const s of slabs) {
    if (t > prev) {
      const band = Math.min(t, s.upto) - prev
      tax += band * s.rate
    }
    prev = s.upto
    if (t <= prev) break
  }
  if (t > prev) tax += (t - prev) * 0.3
  return tax
}

function slabSlices(t: number, slabs: Array<{ upto: number; rate: number }>): Array<{ upto: number; tax: number }> {
  const out: Array<{ upto: number; tax: number }> = []
  let prev = 0
  for (const s of slabs) {
    if (t > prev) {
      const band = Math.min(t, s.upto) - prev
      if (band > 0) out.push({ upto: s.upto, tax: band * s.rate })
    }
    prev = s.upto
    if (t <= prev) break
  }
  if (t > prev) out.push({ upto: prev + (t - prev) * 10, tax: (t - prev) * 0.3 })
  return out
}

export function ComparePanel() {
  const prefs = useMemo(() => new ToolPrefsClass().fromLocalStorage(), [])
  const [salary, setSalary] = useState(prefs.salary * 100000)
  const [hra, setHra] = useState(200000)
  const [c80, setC80] = useState(150000)
  const [nps, setNps] = useState(50000)
  const [loan, setLoan] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)

  const { old, new: nu, savings } = useMemo(() => TaxEngine.compare(salary), [salary])
  const recommended: 'old' | 'new' = old.tax <= nu.tax ? 'old' : 'new'
  const equal = old.tax === nu.tax

  const oldSlices = useMemo(() => slabSlices(old.taxableIncome, TAX_SLABS_OLD), [old.taxableIncome])
  const newSlices = useMemo(() => slabSlices(nu.taxableIncome, TAX_SLABS_NEW), [nu.taxableIncome])
  const oldMax = Math.max(...oldSlices.map((s) => s.tax), 0)
  const newMax = Math.max(...newSlices.map((s) => s.tax), 0)
  const chartMax = Math.max(oldMax, newMax, 1)

  const rows = [
    { k: 'Gross salary', o: salary, n: salary },
    { k: 'Standard deduction', o: -NEW_STANDARD_DEDUCTION, n: -NEW_STANDARD_DEDUCTION },
    { k: 'Taxable income', o: old.taxableIncome, n: nu.taxableIncome },
    { k: 'Tax payable', o: old.tax, n: nu.tax },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-extrabold text-2xl tracking-tight" style={{ color: 'var(--text-primary)' }}>Compare Regimes</h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{`Old vs New · ${FY_2025_26}`}</p>
      </div>

      {/* Inputs card */}
      <Card>
        <h3 className="font-display font-bold text-lg mb-3" style={{ color: 'var(--text-primary)' }}>Your inputs</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Salary (annual)', value: salary, set: setSalary, min: 300000, max: 10000000, step: 100000 },
            { label: 'HRA', value: hra, set: setHra, min: 0, max: 500000, step: 10000 },
            { label: '80C', value: c80, set: setC80, min: 0, max: 150000, step: 5000 },
            { label: 'NPS (80CCD)', value: nps, set: setNps, min: 0, max: 50000, step: 5000 },
            { label: 'Home loan interest', value: loan, set: setLoan, min: 0, max: 200000, step: 5000 },
          ].map((f) => (
            <div key={f.label}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{f.label}</label>
                <span className="font-mono text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{formatINR(f.value)}</span>
              </div>
              <input type="range" min={f.min} max={f.max} step={f.step} value={f.value} onChange={(e) => f.set(Number(e.target.value))} className="w-full accent-amber-500" />
            </div>
          ))}
        </div>
      </Card>

      {/* Side-by-side — single ledger block, recommended row marked with a rule */}
      <div className="rounded-[10px] overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: '0 1px 2px rgba(20,32,58,0.05)' }}>
        <div className="flex items-baseline justify-between gap-3 px-5 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
          <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--text-secondary)' }}>Tax payable</h3>
          <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{FY_2025_26}</span>
        </div>
        {([
          { key: 'old', label: 'Old Regime', tax: old.tax },
          { key: 'new', label: 'New Regime', tax: nu.tax },
        ] as Array<{ key: 'old' | 'new'; label: string; tax: number }>).map((r, i) => {
          const isRec = recommended === r.key && !equal
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
            {equal ? 'Both regimes cost the same for you' : <>You save <span className="font-mono">{formatINR(savings)}</span> by switching</>}
          </p>
        </div>
      </div>

      {/* Slab chart */}
      <Card>
        <h3 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Tax by slab</h3>
        <div className="flex items-end gap-2 h-40 mt-2">
          {Array.from({ length: Math.max(oldSlices.length, newSlices.length) }).map((_, i) => {
            const ov = oldSlices[i]?.tax ?? 0
            const nv = newSlices[i]?.tax ?? 0
            const oh = oldMax > 0 ? (ov / chartMax) * 100 : 0
            const nh = newMax > 0 ? (nv / chartMax) * 100 : 0
            return (
              <div key={i} className="flex-1 flex items-end justify-center gap-0.5 h-full">
                <div className="w-1/3 rounded-t" style={{ height: `${oh}%`, background: '#14203A', minHeight: oh > 0 ? 2 : 0 }} title={`Slab ${i} Old: ${formatINR(ov)}`} />
                <div className="w-1/3 rounded-t" style={{ height: `${nh}%`, background: '#FFC93C', minHeight: nh > 0 ? 2 : 0 }} title={`Slab ${i} New: ${formatINR(nv)}`} />
              </div>
            )
          })}
        </div>
        <div className="flex items-center gap-4 mt-2 text-[10px]" style={{ color: 'var(--text-secondary)' }}>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm" style={{ background: '#14203A' }} /> Old</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm" style={{ background: '#FFC93C' }} /> New</span>
        </div>
      </Card>

      {/* Scenario strip */}
      <div>
        <h3 className="font-display font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>What changes if…</h3>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {SCENARIOS.map((s) => (
            <button key={s} className="shrink-0 rounded-[6px] px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-[var(--surface-muted)]" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>{s}</button>
          ))}
        </div>
      </div>

      {/* Full breakdown */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Full breakdown</h3>
          <button onClick={() => setModalOpen(true)} className="text-xs font-bold underline underline-offset-2" style={{ color: 'var(--text-primary)' }}>Open modal</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th className="text-left py-2 font-semibold" style={{ color: 'var(--text-secondary)' }}>Component</th>
                <th className="text-right py-2 font-semibold" style={{ color: 'var(--text-secondary)' }}>Old</th>
                <th className="text-right py-2 font-semibold" style={{ color: 'var(--text-secondary)' }}>New</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.k} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="py-2" style={{ color: 'var(--text-primary)' }}>{r.k}</td>
                  <td className="py-2 text-right font-mono" style={{ color: 'var(--text-secondary)' }}>{formatINR(r.o)}</td>
                  <td className="py-2 text-right font-mono font-bold" style={{ color: 'var(--text-primary)' }}>{formatINR(r.n)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Breakdown modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.5)' }} onClick={() => setModalOpen(false)}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-[10px] p-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: '0 24px 48px -24px rgba(20,32,58,0.4)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Full breakdown</h3>
              <button onClick={() => setModalOpen(false)} aria-label="Close" className="h-8 w-8 rounded-full flex items-center justify-center" style={{ background: 'var(--surface-muted)' }}>
                <X className="h-4 w-4" style={{ color: 'var(--text-secondary)' }} />
              </button>
            </div>
            <div className="space-y-2">
              {rows.map((r) => (
                <div key={r.k} className="flex items-center justify-between px-4 py-3" style={{ background: 'var(--surface-muted)', borderRadius: '6px' }}>
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{r.k}</span>
                  <div className="flex gap-4">
                    <span className="font-mono text-sm" style={{ color: 'var(--text-secondary)' }}>Old: {formatINR(r.o)}</span>
                    <span className="font-mono text-sm font-bold" style={{ color: 'var(--text-primary)' }}>New: {formatINR(r.n)}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
