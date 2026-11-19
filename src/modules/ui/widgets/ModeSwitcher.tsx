import { motion } from 'framer-motion'
import { Home, Shield, IndianRupee, Scale, Sparkles, BookOpen, User } from 'lucide-react'

export type ModeKey = 'home' | 'shield' | 'taxes' | 'compare' | 'chat' | 'learn' | 'profile'

export const MODE_KEYS: ModeKey[] = ['home', 'shield', 'taxes', 'compare', 'chat', 'learn', 'profile']

const MODE_META: Record<ModeKey, { label: string; Icon: typeof Home; grad: string }> = {
  home: { label: 'Home', Icon: Home, grad: 'linear-gradient(135deg, #4338CA, #6366F1)' },
  shield: { label: 'Shield', Icon: Shield, grad: 'linear-gradient(135deg, #4338CA, #6366F1)' },
  taxes: { label: 'My Taxes', Icon: IndianRupee, grad: 'linear-gradient(135deg, #059669, #34D399)' },
  compare: { label: 'Compare', Icon: Scale, grad: 'linear-gradient(135deg, #4338CA, #6366F1)' },
  chat: { label: 'Ask AI', Icon: Sparkles, grad: 'linear-gradient(135deg, #6366F1, #A5B4FC)' },
  learn: { label: 'Learn', Icon: BookOpen, grad: 'linear-gradient(135deg, #4338CA, #6366F1)' },
  profile: { label: 'Profile', Icon: User, grad: 'linear-gradient(135deg, #4338CA, #6366F1)' },
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
                style={{ background: MODE_META[k].grad }}
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative z-10 flex items-center justify-center gap-2 py-2 text-sm font-semibold" style={{ color: active ? '#fff' : 'var(--text-2)' }}>
              <Icon className="h-4 w-4" />
              {MODE_META[k].label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
