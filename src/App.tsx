import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, IndianRupee, Sparkles, Home, Scale, BookOpen, User, Search, Bell, X, ShieldCheck, ChevronDown } from 'lucide-react'
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
import { getFinBindings } from '@/modules/finance/format'

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

function Sidebar(props: { mode: ModeKey; setMode: (m: ModeKey) => void }) {
  const cream = '#FFF6DC'
  return (
    <aside className="hidden lg:flex flex-col fixed top-0 bottom-0 left-0 w-60 shrink-0 z-40" style={{ background: 'var(--sidebar-bg)' }}>
      <div className="px-5 pt-6 pb-4 flex items-center gap-3">
        <svg width="34" height="34" viewBox="0 0 32 32" fill="none" aria-hidden>
          <path d="M16 2 29 7v9c0 7.5-5.2 12.9-13 15C8.2 28.9 3 23.5 3 16V7l13-5z" fill="#FFC93C" />
          <text x="16" y="22.5" textAnchor="middle" fontSize="13" fontWeight="700" fill="#14203A" fontFamily="JetBrains Mono, monospace">₹</text>
        </svg>
        <div className="leading-tight">
          <div className="font-display font-bold text-base tracking-tight" style={{ color: 'var(--text-primary)' }}>FinKavach</div>
          <div className="text-[9px] font-semibold tracking-widest leading-none" style={{ color: 'var(--text-secondary)' }}>BACHAAO BHI</div>
          <div className="text-[9px] font-semibold tracking-widest leading-none" style={{ color: 'var(--text-secondary)' }}>BADHAAO BHI</div>
        </div>
      </div>
      <nav className="flex-1 px-3 pt-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((n) => {
          const active = props.mode === n.key
          const Icon = n.Icon
          return (
            <button
              key={n.key}
              onClick={() => props.setMode(n.key)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-sm font-semibold transition-all"
              style={active ? { background: '#FFF6DC', color: '#14203A' } : { color: 'var(--text-secondary)' }}
            >
              <Icon className="h-4 w-4" strokeWidth={active ? 2.4 : 1.8} fill={active ? 'currentColor' : 'none'} />
              {n.label}
            </button>
          )
        })}
      </nav>
      <div className="px-5 pt-3 pb-5">
        <div className="h-px mb-3" style={{ background: 'var(--border)' }} />
        <p className="font-hand text-xl leading-tight" style={{ color: 'var(--text-secondary)' }}>A Smarter You, A Brighter Tomorrow</p>
      </div>
      <div className="px-4 pb-5">
        <div className="rounded-[8px] h-24 relative overflow-hidden" style={{ background: '#1B2947', border: '1px solid rgba(255,253,248,0.12)' }}>
          <img src="/img/sidebar-books.svg" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
          <div className="absolute bottom-1 left-2 right-2 flex justify-between text-[9px] font-bold" style={{ color: 'rgba(255,246,220,0.92)' }}>
            <span>Save</span><span>Plan</span><span>Grow</span>
          </div>
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
  const [unread, setUnread] = useState(() => {
    try { return Number(localStorage.getItem('fk_unread') ?? 0) > 0 } catch { return false }
  })
  const b = getFinBindings(pref)

  useEffect(() => {
    const done = setTimeout(() => setSplash(false), 3400)
    return () => { clearTimeout(done) }
  }, [])

  function askAI(preset?: string) { setChatPreset(preset ?? null); setMode('chat') }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : hour < 21 ? 'Good evening' : 'Good night'

  return (
    <div className="min-h-dvh flex" style={{ background: 'var(--bg)', color: 'var(--text-primary)' }}>
      {splash && <Splash onDone={() => setSplash(false)} />}
      <Sidebar mode={mode} setMode={setMode} />
      <div className="flex-1 flex flex-col min-w-0 lg:pl-60">
        {/* Top bar */}
        <header className="sticky top-0 z-40 backdrop-blur-xl border-b" style={{ background: 'color-mix(in srgb, var(--surface) 88%, transparent)', borderBottom: '1px solid var(--border)' }}>
          <div className="px-5 py-3">
            <div className="flex items-center gap-3">
              <div className="w-full max-w-md">
                <div className="flex items-center gap-2 h-11 rounded-full border px-3" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                  <Search className="h-4 w-4 shrink-0" style={{ color: 'var(--text-secondary)' }} />
                  <input placeholder="Search for deductions, regimes, or anything…" className="bg-transparent outline-none text-sm w-full h-full" style={{ color: 'var(--text-primary)' }} />
                </div>
              </div>
              <button aria-label="Notifications" className="relative h-11 w-11 shrink-0 rounded-full flex items-center justify-center" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                <Bell className="h-4 w-4" />
                {unread && <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full" style={{ background: '#E5484D' }} />}
              </button>
              <button onClick={() => setSheetOpen(true)} aria-label="Open profile" className="h-11 w-11 shrink-0 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{ background: '#14203A', border: '1px solid #E8B01F' }}>
                {b.userName.trim().split(/\s+/).map((s) => s[0]).join('').slice(0, 2).toUpperCase()}
              </button>
              <button aria-label="Profile menu" className="h-11 w-11 shrink-0 rounded-full flex items-center justify-center" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Greeting block */}
        <div className="px-5 pt-5 pb-1 relative">
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {b.greeting}, <span className="marker-stripe">{b.userName}</span>!
              </h1>
              <p className="text-xs font-semibold flex items-center gap-1.5 mt-1.5" style={{ color: 'var(--text-secondary)' }}>
                <ShieldCheck className="h-3.5 w-3.5" style={{ color: 'var(--success)' }} />
                You&apos;re {b.protectionStatus === 'Protected' ? 'protected' : b.protectionStatus.toLowerCase()} today
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{b.today}</p>
              <p className="font-hand text-lg leading-tight mt-0.5" style={{ color: 'var(--text-secondary)' }}>Progress over perfection</p>
              <svg viewBox="0 0 24 24" className="h-5 w-5 ml-auto mt-1" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-label="smiley doodle" role="img" style={{ color: 'var(--text-secondary)' }}>
                <path d="M12 3.5c4.7 0 8.5 3.5 8.5 8s-3.8 8-8.5 8-8.5-3.5-8.5-8 3.8-8 8.5-8z" />
                <path d="M8.8 10.2v.8M15.2 10.2v.8" />
                <path d="M8.6 14.4c.9 1.3 2 1.9 3.4 1.9s2.5-.6 3.4-1.9" />
              </svg>
            </div>
          </div>
          <p className="absolute top-0 right-0 font-hand text-xl hidden sm:block" style={{ color: 'var(--text-secondary)' }}>Small steps, Big freedom</p>
        </div>

        <main className="flex-1 px-5 py-5 pb-28 lg:pb-8">
          <div className="max-w-[1200px] mx-auto">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
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
                <X className="h-4 w-4" style={{ color: 'var(--text-secondary)' }} />
              </button>
            </div>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Name</p>
                <div className="mt-1 flex gap-2">
                  <input id="fk-name" defaultValue={pref.name} className="flex-1 px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: 'var(--border)', background: 'var(--surface-muted)', color: 'var(--text-primary)' }} />
                  <button onClick={() => { const el = document.getElementById('fk-name') as HTMLInputElement; const t = new ToolPrefsClass(); t.fromLocalStorage(); t.save({ ...t.fromLocalStorage(), name: el.value?.trim() || 'Anya' }); setSheetOpen(false) }} className="btn-marigold text-sm px-4">Save</button>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Appearance — Theme</p>
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
