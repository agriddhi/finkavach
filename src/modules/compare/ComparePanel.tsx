import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'
import { Card } from '@/modules/ui/widgets/Table'
import { ToolPrefsClass } from '@/modules/data/UserPreferences'
import { TaxEngine } from '@/modules/surgeon/TaxEngine'
import { OLD_STANDARD_DEDUCTION, NEW_STANDARD_DEDUCTION } from '@/modules/surgeon/TaxData'
import { Input } from '@/modules/ui/widgets/Table'

const SCENARIOS = ['What if I invest 1.5L in 80C?', 'What if HRA doubles?', 'What if salary grows 20%?']

export function ComparePanel() {
  const prefs = useMemo(() => new ToolPrefsClass().fromLocalStorage(), [])
  const [salary, setSalary] = useState(prefs.salary * 100000)
  const [hra, setHra] = useState(200000)
  const [c80, setC80] = useState(150000)
  const [nps, setNps] = useState(50000)
  const [loan, setLoan] = useState(0)

  const { old, new: nu, savings } = useMemo(() => TaxEngine.compare(salary), [salary])
  const best = Math.min(old.tax, nu.tax)
  const annual = salary

  const slabs = [
    { label: '0-2.5L', old: 0, new: 0 },
    { label: '2.5-5L', old: 12500, new: 0 },
    { label: '5-7.5L', old: 25000, new: 10000 },
    { label: '7.5-10L', old: 37500, new: 30000 },
    { label: '10-12.5L', old: 50000, new: 30000 },
    { label: '12.5-15L', old: 75000, new: 60000 },
    { label: '15L+', old: 202500, new: 127500 },
  ]
  const maxV = Math.max(...slabs.map((s) => Math.max(s.old, s.new)), 1)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-extrabold text-2xl tracking-tight" style={{ color: 'var(--text-primary)' }}>Compare Regimes</h2>
        <p className="text-sm" style={{ color: 'var(--text-2)' }}>Old vs New · FY 2025-26</p>
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
                <label className="text-xs font-semibold" style={{ color: 'var(--text-2)' }}>{f.label}</label>
                <span className="font-mono text-xs font-bold" style={{ color: 'var(--text-primary)' }}>₹{f.value.toLocaleString('en-IN')}</span>
              </div>
              <input type="range" min={f.min} max={f.max} step={f.step} value={f.value} onChange={(e) => f.set(Number(e.target.value))} className="w-full accent-amber-500" />
            </div>
          ))}
        </div>
      </Card>

      {/* Side-by-side */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-3xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '2rem 1rem 2rem 1rem' }}>
          <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-2)' }}>Old Regime</p>
          <p className="font-mono text-2xl font-bold" style={{ color: 'var(--text-2)' }}>₹{old.tax.toLocaleString('en-IN')}</p>
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-2)' }}>tax payable</p>
        </div>
        <div className="rounded-3xl p-5 relative" style={{ background: 'linear-gradient(180deg, rgba(30,27,75,1) 0%, rgba(49,46,129,1) 100%)', border: '1px solid rgba(251,191,36,0.35)', borderRadius: '1rem 2rem 1rem 2rem' }}>
          <span className="absolute -top-2 -right-2 px-3 py-1 rounded-full text-[10px] font-bold" style={{ background: 'rgba(251,191,36,0.15)', color: '#FBBF24', border: '1px solid rgba(251,191,36,0.45)' }}>RECOMMENDED</span>
          <p className="text-sm font-semibold mb-2" style={{ color: '#FDE68A' }}>New Regime</p>
          <p className="font-mono text-2xl font-bold" style={{ color: '#FBBF24' }}>₹{nu.tax.toLocaleString('en-IN')}</p>
          <p className="text-[11px] mt-1" style={{ color: 'rgba(241,242,250,0.6)' }}>tax payable</p>
        </div>
      </div>

      {/* Savings summary */}
      <div className="rounded-2xl p-4 text-center" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.35)' }}>
        <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>You save <span className="font-mono" style={{ color: '#FBBF24' }}>₹{savings.toLocaleString('en-IN')}</span> by switching</p>
      </div>

      {/* Slab chart */}
      <Card>
        <h3 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Tax by slab</h3>
        <div className="flex items-end gap-2 h-40 mt-2">
          {slabs.map((s) => (
            <div key={s.label} className="flex-1 flex items-end gap-0.5">
              <div className="flex-1 rounded-t" style={{ height: `${(s.old / maxV) * 100}%`, background: '#FBBF24', minHeight: s.old > 0 ? 2 : 0 }} title={`${s.label} Old: ₹${s.old.toLocaleString('en-IN')}`} />
              <div className="flex-1 rounded-t" style={{ height: `${(s.new / maxV) * 100}%`, background: '#4338CA', minHeight: s.new > 0 ? 2 : 0 }} title={`${s.label} New: ₹${s.new.toLocaleString('en-IN')}`} />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-2 text-[10px]" style={{ color: 'var(--text-2)' }}>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm" style={{ background: '#FBBF24' }} /> Old</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm" style={{ background: '#4338CA' }} /> New</span>
        </div>
      </Card>

      {/* Scenario strip */}
      <div>
        <h3 className="font-display font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>What changes if…</h3>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {SCENARIOS.map((s) => (
            <button key={s} className="shrink-0 rounded-xl px-4 py-2.5 text-xs font-semibold" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>{s}</button>
          ))}
        </div>
      </div>

      {/* Full breakdown */}
      <Card>
        <h3 className="font-display font-bold text-lg mb-3" style={{ color: 'var(--text-primary)' }}>Full breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th className="text-left py-2 font-semibold" style={{ color: 'var(--text-2)' }}>Component</th>
                <th className="text-right py-2 font-semibold" style={{ color: 'var(--text-2)' }}>Old</th>
                <th className="text-right py-2 font-semibold" style={{ color: 'var(--text-2)' }}>New</th>
              </tr>
            </thead>
            <tbody>
              {[
                { k: 'Gross salary', o: annual, n: annual },
                { k: 'Standard deduction', o: -OLD_STANDARD_DEDUCTION, n: -NEW_STANDARD_DEDUCTION },
                { k: 'Taxable income', o: old.taxableIncome, n: nu.taxableIncome },
                { k: 'Tax payable', o: old.tax, n: nu.tax },
              ].map((r) => (
                <tr key={r.k} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="py-2" style={{ color: 'var(--text-primary)' }}>{r.k}</td>
                  <td className="py-2 text-right font-mono" style={{ color: 'var(--text-2)' }}>₹{r.o.toLocaleString('en-IN')}</td>
                  <td className="py-2 text-right font-mono font-bold" style={{ color: '#FBBF24' }}>₹{r.n.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
