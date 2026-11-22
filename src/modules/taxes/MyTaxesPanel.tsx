import { useMemo } from 'react'
import { IndianRupee, TrendingDown, Plus } from 'lucide-react'
import { ToolPrefsClass } from '@/modules/data/UserPreferences'
import { TaxEngine } from '@/modules/surgeon/TaxEngine'
import { FY_2025_26 } from '@/modules/surgeon/TaxData'
import { formatINR, getFinBindings } from '@/modules/finance/format'

const DEDUCTIONS = [
  { name: '80C', used: 150000, limit: 150000 },
  { name: '80D', used: 25000, limit: 25000 },
  { name: 'NPS (80CCD)', used: 30000, limit: 50000 },
  { name: 'HRA', used: 120000, limit: 200000 },
]

const DEADLINES = [
  { date: 'Jul 31', label: 'ITR filing deadline' },
  { date: 'Sep 30', label: 'Audit report submission' },
  { date: 'Dec 31', label: 'Belated ITR filing' },
  { date: 'Mar 31', label: 'Advance tax (Q4)' },
]

export function MyTaxesPanel() {
  const prefs = useMemo(() => new ToolPrefsClass().fromLocalStorage(), [])
  const b = useMemo(() => getFinBindings(prefs), [prefs])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-extrabold text-2xl tracking-tight" style={{ color: 'var(--text-primary)' }}>My Taxes</h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{`${FY_2025_26} · Salaried`}</p>
      </div>

      {/* Stat strip — one flat ledger row, hairline dividers */}
      <div className="grid grid-cols-2 lg:grid-cols-4 rounded-[10px] overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: '0 1px 2px rgba(20,32,58,0.05)' }}>
        {[
          { label: 'Taxable income', value: formatINR(b.salaryBase - b.standardDeduction) },
          { label: 'Tax payable', value: formatINR(b.recommendedRegime === 'old' ? b.oldTax : b.newTax) },
          { label: 'Deductions used', value: formatINR(b.deductionUsed), sub: `of ${formatINR(b.deductionLimit)}` },
          { label: 'Standard deduction', value: formatINR(b.standardDeduction) },
        ].map((s) => (
          <div key={s.label} className="p-4 border-l-0 border-[color:var(--border)] max-lg:[&:nth-child(even)]:border-l lg:[&:not(:first-child)]:border-l max-lg:[&:nth-child(n+3)]:border-t">
            <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--text-secondary)' }}>{s.label}</p>
            <p className="font-mono text-lg font-bold mt-1 tabular-nums" style={{ color: 'var(--text-primary)' }}>{s.value}</p>
            {s.sub && <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{s.sub}</p>}
          </div>
        ))}
      </div>

      {/* Deduction trackers */}
      <div>
        <h3 className="font-display font-bold text-lg mb-3" style={{ color: 'var(--text-primary)' }}>Deductions</h3>
        <div className="rounded-[10px] overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: '0 1px 2px rgba(20,32,58,0.05)' }}>
          {DEDUCTIONS.map((d, i) => {
            const pct = Math.min(100, (d.used / d.limit) * 100)
            const headroom = d.limit - d.used
            return (
              <div key={d.name} className="px-5 py-4" style={{ borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{d.name}</p>
                  <button className="h-7 w-7 rounded-[6px] flex items-center justify-center transition-colors hover:bg-[var(--surface-muted)]" style={{ background: 'var(--surface-muted)' }}>
                    <Plus className="h-3.5 w-3.5" style={{ color: 'var(--text-secondary)' }} />
                  </button>
                </div>
                <div className="flex items-center justify-between text-[11px] mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  <span className="font-mono">Used {formatINR(d.used)}</span>
                  <span className="font-mono">Limit {formatINR(d.limit)}</span>
                </div>
                <div className="h-1.5 overflow-hidden" style={{ background: 'var(--surface-muted)' }}>
                  <div className="h-full" style={{ width: `${pct}%`, background: '#14203A' }} />
                </div>
                {headroom > 0 && (
                  <p className="text-[11px] mt-1.5 font-semibold font-mono" style={{ color: 'var(--text-secondary)' }}>{formatINR(headroom)} headroom left</p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Deadlines timeline */}
      <div>
        <h3 className="font-display font-bold text-lg mb-3" style={{ color: 'var(--text-primary)' }}>Tax deadlines</h3>
        <div className="rounded-[10px] overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: '0 1px 2px rgba(20,32,58,0.05)' }}>
          {DEADLINES.map((d, i) => (
            <div key={d.date} className="flex items-center gap-3 px-5 py-3.5" style={{ borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
              <span className="px-2 py-1 text-[11px] font-bold font-mono shrink-0" style={{ background: 'var(--surface-muted)', color: 'var(--text-primary)', borderRadius: '4px' }}>{d.date}</span>
              <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{d.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
