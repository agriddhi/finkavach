import { motion } from 'framer-motion'
import { ModeSwitcher, type ModeKey } from './ModeSwitcher'

export function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      <defs>
        <linearGradient id="fk-shield-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4338CA" />
          <stop offset="100%" stopColor="#818CF8" />
        </linearGradient>
      </defs>
      <path d="M16 2 29 7v9c0 7.5-5.2 12.9-13 15C8.2 28.9 3 23.5 3 16V7l13-5z" fill="url(#fk-shield-grad)" stroke="#FBBF24" strokeWidth="1.5" />
      <text x="16" y="22.5" textAnchor="middle" fontSize="13" fontWeight="700" fill="#FBBF24" fontFamily="JetBrains Mono, monospace">
        ₹
      </text>
    </svg>
  )
}

export function GlassHeader(props: { name: string; onAvatarClick: () => void; mode: ModeKey; setMode: (m: ModeKey) => void }) {
  const name = props.name || 'A'
  const initials = name.trim().split(/\s+/).map((s) => s[0]).join('').slice(0, 2).toUpperCase() || 'A'
  let hash = 0
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) % 360
  const h = hash
  const modeAccent: Record<string, string> = {
    shield: 'rgba(67,56,202,0.30)',
    surgeon: 'rgba(5,150,105,0.30)',
    chat: 'rgba(99,102,241,0.30)',
  }
  const accent = modeAccent[props.mode] ?? 'rgba(226,232,240,0.7)'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : hour < 21 ? 'Good evening' : 'Good night'
  const greetingName = `${greeting}, ${props.name}`.trim()

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="sticky top-0 z-40 backdrop-blur-xl border-b"
      style={{ background: 'color-mix(in srgb, var(--surface) 82%, transparent)', borderBottom: `1px solid ${accent}` }}
    >
      <div className="px-4 pt-3 pb-3">
        <div className="h-12 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <LogoMark />
            <div className="leading-tight">
              <div className="font-display font-bold text-lg leading-tight tracking-tight" style={{ color: 'var(--text-primary)' }}>FinKavach</div>
              <div className="text-[10px] font-semibold tracking-widest" style={{ color: 'var(--text-secondary)' }}>
                BACHAAO BHI • BADHAAO BHI
              </div>
            </div>
          </div>
          <div className="text-center shrink-0">
            <div className="font-display font-bold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{greetingName}</div>
            <div className="text-[10px] font-semibold tracking-widest" style={{ color: 'var(--text-secondary)' }}>Protected today</div>
          </div>
          <button
            onClick={props.onAvatarClick}
            aria-label="Open profile and settings"
            className="h-9 w-9 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-md shrink-0"
            style={{ background: `linear-gradient(135deg, hsl(${h} 65% 42%), hsl(${(h + 40) % 360} 65% 55%))`, boxShadow: '0 0 0 2px var(--kavach-gold)' }}
          >
            {initials}
          </button>
        </div>
        <div className="mt-3 hidden md:block">
          <ModeSwitcher mode={props.mode} setMode={props.setMode} />
        </div>
      </div>
    </motion.header>
  )
}
