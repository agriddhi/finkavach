import { Home, Shield, Scale, Sparkles, User } from 'lucide-react'
import type { ModeKey } from './ModeSwitcher'

const TABS: Array<{ key: ModeKey; label: string; Icon: typeof Home }> = [
  { key: 'home', label: 'Home', Icon: Home },
  { key: 'shield', label: 'Shield', Icon: Shield },
  { key: 'compare', label: 'Compare', Icon: Scale },
  { key: 'chat', label: 'Ask AI', Icon: Sparkles },
  { key: 'profile', label: 'Profile', Icon: User },
]

export function BottomNav(props: { mode: ModeKey; setMode: (m: ModeKey) => void; onProfile: () => void }) {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t" style={{ background: 'color-mix(in srgb, var(--surface) 90%, transparent)', borderTop: '1px solid var(--border)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="grid grid-cols-5 h-[64px]">
        {TABS.map((t) => {
          const active = props.mode === t.key
          const Icon = t.Icon
          return (
            <button key={t.key} type="button" onClick={() => props.setMode(t.key)} className="relative flex flex-col items-center justify-center gap-0.5" style={{ color: active ? 'var(--indigo, #4338CA)' : 'var(--text-2)' }} aria-label={t.label}>
              {active && <span className="absolute top-0 h-0.5 w-8 rounded-full" style={{ background: 'linear-gradient(135deg, #4338CA, #A5B4FC)' }} />}
              <span className="h-8 w-14 rounded-full flex items-center justify-center" style={active ? { background: 'linear-gradient(135deg, rgba(67,56,202,0.2), rgba(165,180,252,0.15))' } : undefined}>
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-[10px] font-semibold">{t.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
