import { motion } from 'framer-motion'
import { Home, Shield, IndianRupee, Scale, Sparkles, BookOpen, User } from 'lucide-react'

export type ModeKey = 'home' | 'shield' | 'taxes' | 'compare' | 'chat' | 'learn' | 'profile'

export const MODE_KEYS: ModeKey[] = ['home', 'shield', 'taxes', 'compare', 'chat', 'learn', 'profile']

const MODE_META: Record<ModeKey, { label: string; Icon: typeof Home }> = {
  home: { label: 'Home', Icon: Home },
  shield: { label: 'Shield', Icon: Shield },
  taxes: { label: 'My Taxes', Icon: IndianRupee },
  compare: { label: 'Compare', Icon: Scale },
  chat: { label: 'Ask AI', Icon: Sparkles },
  learn: { label: 'Learn', Icon: BookOpen },
  profile: { label: 'Profile', Icon: User },
}

export function ModeSwitcher(props: { mode: ModeKey; setMode: (m: ModeKey) => void }) {
  return (
    <div className="relative flex rounded-full p-[3px] overflow-x-auto" style={{ background: 'var(--surface-muted)' }}>
      {MODE_KEYS.map((k) => {
        const active = props.mode === k
        const Icon = MODE_META[k].Icon
        return (
          <button
            key={k}
            type="button"
            onClick={() => props.setMode(k)}
            className="relative flex-1 min-w-[80px] rounded-full"
            aria-pressed={active}
          >
            {active && (
              <motion.span
                layoutId="finkavach-mode-pill"
                className="absolute inset-0 rounded-full"
                style={{ background: '#14203A' }}
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative z-10 flex items-center justify-center gap-2 py-2 text-sm font-semibold" style={{ color: active ? '#FFFDF8' : 'var(--text-2)' }}>
              <Icon className="h-4 w-4" />
              {MODE_META[k].label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
