import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, IndianRupee, Sparkles, Home, Scale, BookOpen, User, Search, Bell, X } from 'lucide-react'
import { GlassHeader } from '@/modules/ui/widgets/GlassHeader'
import { BottomNav } from '@/modules/ui/widgets/BottomNav'
import { Splash } from '@/modules/ui/widgets/Splash'
import { ThemePicker, useTheme } from '@/modules/ui/themes'
import { Toasts } from '@/modules/ui/widgets/Toast'
import { ModeSwitcher, type ModeKey } from '@/modules/ui/widgets/ModeSwitcher'
import { AuditSmsConsoleUI } from '@/modules/shield/AuditSmsConsoleUI'
import { HomePanel } from '@/modules/home/HomePanel'
import { MyTaxesPanel } from '@/modules/taxes/MyTaxesPanel'
import { ComparePanel } from '@/modules/compare/ComparePanel'
import { StreamingChat } from '@/modules/chat/StreamChatModule'
import { LearnPanel } from '@/modules/learn/LearnPanel'
import { ProfilePanel } from '@/modules/profile/ProfilePanel'
import { ToolPrefsClass } from '@/modules/data/UserPreferences'

export type { ModeKey } from '@/modules/ui/widgets/ModeSwitcher'

const NAV_ITEMS: Array<{ key: ModeKey; label: string; Icon: typeof Home }> = [
  { key: 'home', label: 'Home', Icon: Home },
  { key: 'shield', label: 'Shield', Icon: Shield },
  { key: 'taxes', label: 'My Taxes', Icon: IndianRupee },
  { key: 'compare', label: 'Compare', Icon: Scale },
  { key: 'chat', label: 'Ask AI', Icon: Sparkles },
  { key: 'learn', label: 'Learn', Icon: BookOpen },
  { key: 'profile', label: 'Profile', Icon: User },
]

const BOTTOM_TABS: Array<{ key: ModeKey; label: string; Icon: typeof Home }> = [
  { key: 'home', label: 'Home', Icon: Home },
  { key: 'shield', label: 'Shield', Icon: Shield },
  { key: 'compare', label: 'Compare', Icon: Scale },
  { key: 'chat', label: 'Ask AI', Icon: Sparkles },
  { key: 'profile', label: 'Profile', Icon: User },
]

function LeftRail(props: { mode: ModeKey; setMode: (m: ModeKey) => void }) {
  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 sticky top-0 h-screen overflow-hidden" style={{ background: 'linear-gradient(180deg, #14173A 0%, #0E1022 100%)', borderRight: '1px solid var(--border)' }}>
      <div className="px-5 pt-6 pb-4 flex items-center gap-3">
        <svg width="34" height="34" viewBox="0 0 32 32" fill="none" aria-hidden>
          <defs>
            <linearGradient id="fk-shield-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4338CA" />
              <stop offset="100%" stopColor="#818CF8" />
            </linearGradient>
          </defs>
          <path d="M16 2 29 7v9c0 7.5-5.2 12.9-13 15C8.2 28.9 3 23.5 3 16V7l13-5z" fill="url(#fk-shield-grad)" stroke="#FBBF24" strokeWidth="1.5" />
          <text x="16" y="22.5" textAnchor="middle" fontSize="13" fontWeight="700" fill="#FBBF24" fontFamily="JetBrains Mono, monospace">₹</text>
        </svg>
        <div className="leading-tight">
          <div className="font-display font-bold text-base tracking-tight" style={{ color: 'var(--text-primary)' }}>FinKavach</div>
          <div className="text-[9px] font-semibold tracking-widest" style={{ color: 'var(--text-2)' }}>BACHAAO BHI • BADHAAO BHI</div>
        </div>
      </div>
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((n) => {
          const active = props.mode === n.key
          const Icon = n.Icon
          return (
            <button key={n.key} onClick={() => props.setMode(n.key)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all" style={active ? { background: 'linear-gradient(135deg, #4338CA, #6366F1)', color: '#fff', boxShadow: '0 8px 20px -8px rgba(67,56,202,0.55)' } : { color: 'var(--text-2)' }}>
              <Icon className="h-4 w-4" />
              {n.label}
            </button>
          )
        })}
      </nav>
      <div className="px-4 pb-5 pt-2">
        <div className="rounded-2xl p-3 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(30,27,75,0.6), rgba(14,16,34,0.9))', border: '1px solid var(--border)' }}>
          <svg viewBox="0 0 200 60" className="w-full" aria-hidden>
            <defs>
              <linearGradient id="hill-sun" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#F59E3B" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            <circle cx="160" cy="18" r="12" fill="url(#hill-sun)" />
            <path d="M0 60 L40 38 L80 50 L120 30 L160 42 L200 60 Z" fill="#4338CA" opacity="0.35" />
            <path d="M0 60 L50 44 L100 56 L150 40 L200 60 Z" fill="#1E1B4B" opacity="0.6" />
          </svg>
          <p className="text-[11px] font-semibold mt-1" style={{ color: 'var(--text-2)' }}>A Smarter You, A Brighter Tomorrow</p>
        </div>
      </div>
    </aside>
  )
}

export default function App() {
  const [mode, setMode] = useState<ModeKey>('home')
  const [theme, changeTheme] = useTheme()
  const [pref] = useState(() => new ToolPrefsClass().fromLocalStorage())
  const [splash, setSplash] = useState(true)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [chatPreset, setChatPreset] = useState<string | null>(null)

  useEffect(() => {
    const done = setTimeout(() => setSplash(false), 3400)
    return () => { clearTimeout(done) }
  }, [])

  function askAI(preset?: string) { setChatPreset(preset ?? null); setMode('chat') }

  return (
    <div className="min-h-dvh flex" style={{ background: 'var(--bg)', color: 'var(--text-primary)' }}>
      {splash && <Splash onDone={() => setSplash(false)} />}
      <LeftRail mode={mode} setMode={setMode} />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-40 backdrop-blur-xl border-b" style={{ background: 'color-mix(in srgb, var(--surface) 82%, transparent)', borderBottom: '1px solid var(--border)' }}>
          <div className="px-8 py-4 flex items-center justify-between gap-4">
            <div>
              <h1 className="font-display font-bold text-2xl tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Good morning, <span style={{ color: 'var(--lavender, #A5B4FC)' }}>Anya</span>!
              </h1>
              <p className="text-xs font-semibold flex items-center gap-1.5 mt-0.5" style={{ color: 'var(--text-2)' }}>
                <span className="h-3.5 w-3.5 rounded-full flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }}>✓</span>
                You're protected today
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button aria-label="Search" className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-2)' }}>
                <Search className="h-4 w-4" />
              </button>
              <button aria-label="Notifications" className="relative h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-2)' }}>
                <Bell className="h-4 w-4" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full" style={{ background: '#EF4444' }} />
              </button>
              <button onClick={() => setSheetOpen(true)} aria-label="Open profile" className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-white text-xs" style={{ background: 'linear-gradient(135deg, #4338CA, #6366F1)', boxShadow: '0 0 0 2px var(--kavach-gold)' }}>
                {pref.name.trim().split(/\s+/).map((s) => s[0]).join('').slice(0, 2).toUpperCase() || 'A'}
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 px-8 py-6 pb-24 lg:pb-6">
          <div className="max-w-[1200px] mx-auto">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {mode === 'home' && <HomePanel onAskAI={askAI} setMode={setMode} />}
              {mode === 'shield' && <AuditSmsConsoleUI onAskAI={askAI} />}
              {mode === 'taxes' && <MyTaxesPanel />}
              {mode === 'compare' && <ComparePanel />}
              {mode === 'chat' && <StreamingChat preset={chatPreset} onPresetSent={() => setChatPreset(null)} />}
              {mode === 'learn' && <LearnPanel />}
              {mode === 'profile' && <ProfilePanel theme={theme} changeTheme={changeTheme} pref={pref} />}
            </motion.div>
          </div>
        </main>
      </div>

      {/* Mobile bottom tab bar */}
      <BottomNav mode={mode} setMode={setMode} onProfile={() => setSheetOpen(true)} />

      {/* Profile / Theme bottom sheet */}
      {sheetOpen && (
        <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSheetOpen(false)}>
          <div className="absolute inset-0" style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(2px)' }} />
          <motion.div className="absolute bottom-0 left-0 right-0 rounded-t-3xl p-5" style={{ background: 'var(--surface)' }} initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 320, damping: 34 }} onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full bg-slate-300 mx-auto mb-4" />
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Profile & Preferences</h3>
              <button onClick={() => setSheetOpen(false)} aria-label="Close" className="h-8 w-8 rounded-full flex items-center justify-center" style={{ background: 'var(--surface-muted)' }}>
                <X className="h-4 w-4" style={{ color: 'var(--text-2)' }} />
              </button>
            </div>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <p className="text-xs font-semibold" style={{ color: 'var(--text-2)' }}>Name</p>
                <div className="mt-1 flex gap-2">
                  <input id="fk-name" defaultValue={pref.name} className="flex-1 px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: 'var(--border)', background: 'var(--surface-muted)', color: 'var(--text-primary)' }} />
                  <button onClick={() => { const el = document.getElementById('fk-name') as HTMLInputElement; const t = new ToolPrefsClass(); t.fromLocalStorage(); t.save({ ...t.fromLocalStorage(), name: el.value || 'A' }); setSheetOpen(false) }} className="btn-gold text-sm px-4">Save</button>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold" style={{ color: 'var(--text-2)' }}>Appearance — Theme</p>
                <div className="mt-2"><ThemePicker value={theme.id} onChange={changeTheme} /></div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <Toasts />
    </div>
  )
}
