import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Clock, CheckCircle2 } from 'lucide-react'
import { Card } from '@/modules/ui/widgets/Table'

const TOPICS = [
  { title: 'Old vs New regime', duration: '5 min', progress: 60 },
  { title: 'Section 80C', duration: '4 min', progress: 30 },
  { title: 'HRA exemption', duration: '6 min', progress: 0 },
  { title: 'Spotting SMS scams', duration: '3 min', progress: 100 },
  { title: 'ITR basics', duration: '8 min', progress: 0 },
]

const GLOSSARY = ['Taxable income', 'Standard deduction', 'HRA', '80C', 'NPS', 'Rebate 87A', 'TDS', 'Advance tax']

export function LearnPanel() {
  const [q, setQ] = useState('')
  const filtered = GLOSSARY.filter((g) => g.toLowerCase().includes(q.toLowerCase()))
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-extrabold text-2xl tracking-tight" style={{ color: 'var(--text-primary)' }}>Learn</h2>
        <p className="text-sm" style={{ color: 'var(--text-2)' }}>Tax basics, in plain language</p>
      </div>

      {/* Featured lesson */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="h-32 sm:h-24 sm:w-40 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #4338CA, #6366F1)' }}>
            <span className="text-3xl">📘</span>
          </div>
          <div className="flex-1">
            <span className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold" style={{ background: 'rgba(251,191,36,0.15)', color: '#FBBF24' }}>FEATURED</span>
            <h3 className="font-display font-bold text-lg mt-1" style={{ color: 'var(--text-primary)' }}>Old vs New regime, explained</h3>
            <p className="text-xs mt-1" style={{ color: 'var(--text-2)' }}>Which one saves you more? A 5-minute read.</p>
            <button className="mt-2 text-xs font-bold" style={{ color: 'var(--indigo, #4338CA)' }}>Start lesson →</button>
          </div>
        </div>
      </Card>

      {/* Topic grid */}
      <div>
        <h3 className="font-display font-bold text-lg mb-3" style={{ color: 'var(--text-primary)' }}>Topics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TOPICS.map((t) => (
            <div key={t.title} className="rounded-2xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{t.title}</p>
                {t.progress === 100 && <CheckCircle2 className="h-4 w-4" style={{ color: '#10B981' }} />}
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: 'var(--surface-muted)', color: 'var(--text-2)' }}>
                  <Clock className="inline h-3 w-3 mr-0.5" />{t.duration}
                </span>
                {t.progress > 0 && t.progress < 100 && <span className="text-[10px] font-semibold" style={{ color: '#FBBF24' }}>{t.progress}%</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Glossary search */}
      <Card>
        <h3 className="font-display font-bold text-lg mb-3" style={{ color: 'var(--text-primary)' }}>Tax terms glossary</h3>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search terms…" className="w-full px-3 py-2 rounded-lg border text-sm outline-none mb-3" style={{ borderColor: 'var(--border)', background: 'var(--surface-muted)', color: 'var(--text-primary)' }} />
        <div className="flex flex-wrap gap-2">
          {filtered.map((g) => (
            <span key={g} className="rounded-full px-3 py-1 text-xs font-semibold" style={{ background: 'var(--surface-muted)', color: 'var(--text-2)' }}>{g}</span>
          ))}
        </div>
      </Card>
    </div>
  )
}
