import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { IndianRupee, TrendingDown, Plus } from 'lucide-react'
import { Card } from '@/modules/ui/widgets/Table'
import { ToolPrefsClass } from '@/modules/data/UserPreferences'
import { TaxEngine } from '@/modules/surgeon/TaxEngine'

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
  const annual = Math.max(0, prefs.salary) * 100000
  const { old, new: nu } = useMemo(() => TaxEngine.compare(annual), [annual])
  const best = Math.min(old.tax, nu.tax)
  const refund = 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-extrabold text-2xl tracking-tight" style={{ color: 'var(--text-primary)' }}>My Taxes</h2>
        <p className="text-sm" style={{ color: 'var(--text-2)' }}>FY 2025-26 · Salaried</p>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Taxable income', value: `₹${old.taxableIncome.toLocaleString('en-IN')}`, tint: 'rgba(67,56,202,0.12)' },
          { label: 'Tax payable', value: `₹${best.toLocaleString('en-IN')}`, tint: 'rgba(251,191,36,0.12)' },
          { label: 'Deductions used', value: `₹${(old.deductions + 150000).toLocaleString('en-IN')}`, tint: 'rgba(165,180,252,0.12)' },
          { label: 'Refund estimate', value: `₹${refund.toLocaleString('en-IN')}`, tint: 'rgba(16,185,129,0.12)' },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl p-4" style={{ background: s.tint, border: '1px solid var(--border)' }}>
            <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: 'var(--text-2)' }}>{s.label}</p>
            <p className="font-mono text-lg font-bold mt-1" style={{ color: 'var(--text-primary)' }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Deduction trackers */}
      <div>
        <h3 className="font-display font-bold text-lg mb-3" style={{ color: 'var(--text-primary)' }}>Deductions</h3>
        <div className="space-y-3">
          {DEDUCTIONS.map((d) => {
            const pct = Math.min(100, (d.used / d.limit) * 100)
            const headroom = d.limit - d.used
            return (
              <div key={d.name} className="rounded-2xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{d.name}</p>
                  <button className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--surface-muted)' }}>
                    <Plus className="h-3.5 w-3.5" style={{ color: 'var(--text-2)' }} />
                  </button>
                </div>
                <div className="flex items-center justify-between text-[11px] mb-1.5" style={{ color: 'var(--text-2)' }}>
                  <span>Used ₹{d.used.toLocaleString('en-IN')}</span>
                  <span>Limit ₹{d.limit.toLocaleString('en-IN')}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface-muted)' }}>
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(135deg, #4338CA, #6366F1)' }} />
                </div>
                {headroom > 0 && (
                  <p className="text-[10px] mt-1.5 font-semibold" style={{ color: '#F59E3B' }}>₹{headroom.toLocaleString('en-IN')} headroom left</p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Deadlines timeline */}
      <div>
        <h3 className="font-display font-bold text-lg mb-3" style={{ color: 'var(--text-primary)' }}>Tax deadlines</h3>
        <div className="space-y-2">
          {DEADLINES.map((d) => (
            <div key={d.date} className="flex items-center gap-3 rounded-xl p-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <span className="rounded-lg px-2.5 py-1 text-xs font-bold font-mono" style={{ background: 'rgba(67,56,202,0.15)', color: '#A5B4FC' }}>{d.date}</span>
              <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{d.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
