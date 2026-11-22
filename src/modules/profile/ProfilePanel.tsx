import { useState } from 'react'
import { User, ChevronRight, Shield, Bell, HelpCircle, IndianRupee } from 'lucide-react'
import { ThemePicker, type Theme } from '@/modules/ui/themes'
import { ToolPrefsClass } from '@/modules/data/UserPreferences'

const ROWS = [
  { icon: IndianRupee, label: 'Income details' },
  { icon: Bell, label: 'Notifications' },
  { icon: Shield, label: 'Privacy' },
  { icon: HelpCircle, label: 'Help' },
]

export function ProfilePanel(props: { theme: Theme; changeTheme: (id: string) => void; pref: any }) {
  const [reduced, setReduced] = useState(false)
  const [lang, setLang] = useState<'en' | 'hi'>('en')
  const name = props.pref?.name || 'Anya'
  const initials = name.trim().split(/\s+/).map((s: string) => s[0]).join('').slice(0, 2).toUpperCase() || 'A'

  return (
    <div className="space-y-6">
      {/* Avatar header */}
      <div className="flex flex-col items-center text-center gap-3">
        <span className="h-20 w-20 rounded-full flex items-center justify-center font-bold text-white text-2xl" style={{ background: 'linear-gradient(135deg, #14203A, #1E2A4A)', boxShadow: '0 0 0 3px var(--kavach-gold)' }}>
          {initials}
        </span>
        <div>
          <h2 className="font-display font-extrabold text-2xl tracking-tight" style={{ color: 'var(--text-primary)' }}>{name}</h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Salaried · India</p>
        </div>
      </div>

      {/* Grouped list rows */}
      <div className="rounded-[10px] overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        {ROWS.map((r, i) => {
          const Icon = r.icon
          return (
            <button key={r.label} className="w-full flex items-center gap-3 px-4 py-3.5 text-left" style={{ borderBottom: i < ROWS.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <Icon className="h-4 w-4" style={{ color: 'var(--text-secondary)' }} />
              <span className="flex-1 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{r.label}</span>
              <ChevronRight className="h-4 w-4" style={{ color: 'var(--text-secondary)' }} />
            </button>
          )
        })}
      </div>

      {/* Appearance */}
      <div className="rounded-[10px] p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--text-secondary)' }}>Appearance</p>
        <ThemePicker value={props.theme.id} onChange={props.changeTheme} />
      </div>

      {/* Language */}
      <div className="rounded-[10px] p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--text-secondary)' }}>Language</p>
        <div className="grid grid-cols-2 rounded-full p-[3px]" style={{ background: 'var(--surface-muted)' }}>
          {(['en', 'hi'] as const).map((l) => (
            <button key={l} onClick={() => setLang(l)} className="rounded-full py-2 text-xs font-semibold" style={{ background: lang === l ? 'linear-gradient(135deg, #14203A, #1E2A4A)' : 'transparent', color: lang === l ? '#FFFDF8' : 'var(--text-secondary)' }}>
              {l === 'en' ? 'English' : 'हिन्दी'}
            </button>
          ))}
        </div>
      </div>

      {/* Reduced motion toggle */}
      <div className="rounded-[10px] p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <button onClick={() => setReduced((v) => !v)} className="w-full flex items-center justify-between">
          <span className="text-sm font-semibold flex items-center" style={{ color: 'var(--text-primary)' }}>
            Reduced Motion
          </span>
          <span className="h-6 w-11 rounded-full p-0.5 transition-colors" style={{ background: reduced ? 'linear-gradient(135deg, #14203A, #1E2A4A)' : 'var(--surface-muted)' }}>
            <span className="block h-5 w-5 rounded-full transition-transform" style={{ background: '#FFFDF8', transform: reduced ? 'translateX(20px)' : 'translateX(0)', boxShadow: '0 1px 3px rgb(0 0 0 / 0.2)' }} />
          </span>
        </button>
      </div>
    </div>
  )
}
