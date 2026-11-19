// themes.ts — Curated personalisation themes (Design Spec §6)
// 8 curated themes applied via CSS custom properties + data-theme attribute.
export interface Theme {
  id: string
  name: string
  vibe: string
  primary: string
  accent: string
  bg: string
  surface: string
  muted: string
  text: string
  secondary: string
}

export const THEMES: Theme[] = [
  { id: 'kavach-classic', name: 'Kavach Classic', vibe: 'Banking trust', primary: '#0F172A', accent: '#FBBF24', bg: '#FFFFFF', surface: '#FFFFFF', muted: '#F1F5F9', text: '#0F172A', secondary: '#64748B' },
  { id: 'midnight-shield', name: 'Midnight Shield', vibe: 'Dark mode premium', primary: '#0F172A', accent: '#2DD4BF', bg: '#020617', surface: '#0F172A', muted: '#1E293B', text: '#E2E8F0', secondary: '#94A3B8' },
  { id: 'surgeon-mint', name: 'Surgeon Mint', vibe: 'Fresh growth', primary: '#059669', accent: '#34D399', bg: '#ECFDF5', surface: '#FFFFFF', muted: '#D1FAE5', text: '#064E3B', secondary: '#047857' },
  { id: 'royal-india', name: 'Royal India', vibe: 'Festive premium', primary: '#4C1D95', accent: '#FF9933', bg: '#FFFBEB', surface: '#FFFFFF', muted: '#FEF3C7', text: '#3B0764', secondary: '#7C3AED' },
  { id: 'hacker-shield', name: 'Hacker Shield', vibe: 'Cybersecurity', primary: '#111827', accent: '#22C55E', bg: '#0A0A0A', surface: '#111827', muted: '#1F2937', text: '#E5E7EB', secondary: '#9CA3AF' },
  { id: 'sunrise-optimist', name: 'Sunrise Optimist', vibe: 'Morning energy', primary: '#F97316', accent: '#FCD34D', bg: '#FFF7ED', surface: '#FFFFFF', muted: '#FFEDD5', text: '#7C2D12', secondary: '#C2410C' },
  { id: 'monochrome-pro', name: 'Monochrome Pro', vibe: 'Minimal', primary: '#18181B', accent: '#52525B', bg: '#FAFAFA', surface: '#FFFFFF', muted: '#F4F4F5', text: '#18181B', secondary: '#71717A' },
  { id: 'deep-ocean', name: 'Deep Ocean', vibe: 'Calm, focused', primary: '#0C4A6E', accent: '#22D3EE', bg: '#082F49', surface: '#0C4A6E', muted: '#155E75', text: '#E0F2FE', secondary: '#7DD3FC' },
  { id: 'indigo-night', name: 'Indigo Night', vibe: 'Premium dark', primary: '#4338CA', accent: '#F59E3B', bg: '#0E1022', surface: '#171A33', muted: '#262B4D', text: '#E8E6F3', secondary: '#A5B4FC' },
  { id: 'indigo-dawn', name: 'Indigo Dawn', vibe: 'Soft light', primary: '#4338CA', accent: '#D97706', bg: '#F6F5FB', surface: '#FFFFFF', muted: '#E6E4F2', text: '#14122B', secondary: '#5E5B80' },
]

export const THEME_STORAGE_KEY = 'fin_theme'

export function getTheme(id?: string): Theme {
  const found = THEMES.find((t) => t.id === id) ?? THEMES.find((t) => t.id === 'indigo-night') ?? THEMES[0]
  return found
}

export function applyTheme(id: string): void {
  const t = getTheme(id)
  const root = document.documentElement
  root.setAttribute('data-theme', t.id)
  root.style.setProperty('--bg', t.bg)
  root.style.setProperty('--surface', t.surface)
  root.style.setProperty('--surface-muted', t.muted)
  root.style.setProperty('--text-primary', t.text)
  root.style.setProperty('--text-secondary', t.secondary)
  root.style.setProperty('--brand', t.primary)
  root.style.setProperty('--accent', t.accent)
  try { localStorage.setItem(THEME_STORAGE_KEY, t.id) } catch { /* noop */ }
}

export function applySystemTheme(): void {
  if (typeof window === 'undefined') return
  const dark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true
  const id = dark ? 'indigo-night' : 'indigo-dawn'
  const t = getTheme(id)
  const root = document.documentElement
  root.setAttribute('data-theme', t.id)
  root.style.setProperty('--bg', t.bg)
  root.style.setProperty('--surface', t.surface)
  root.style.setProperty('--surface-muted', t.muted)
  root.style.setProperty('--text-primary', t.text)
  root.style.setProperty('--text-secondary', t.secondary)
  root.style.setProperty('--brand', t.primary)
  root.style.setProperty('--accent', t.accent)
}

const THEME_KEY = 'fin_theme'

export function readStoredTheme(): string {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY) ?? localStorage.getItem('theme')
    return v ?? 'indigo-night'
  } catch { return 'indigo-night' }
}

export function storeTheme(id: string): void {
  try { localStorage.setItem(THEME_STORAGE_KEY, id) } catch { /* noop */ }
}

import { useEffect, useState } from 'react'

export function useTheme(): [Theme, (id: string) => void] {
  const [theme, setTheme] = useState<Theme>(() => getTheme(readStoredTheme()))
  useEffect(() => { applyTheme(theme.id) }, [theme])
  const change = (id: string) => setTheme(getTheme(id))
  return [theme, change]
}

export function ThemePicker({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const isAuto = value === 'auto'
  const selectedId = isAuto ? 'indigo-night' : value

  const previewThemes = [
    { id: 'indigo-night', name: 'Indigo Night', vibe: 'Premium dark', bg: '#0E1022', card: '#171A33', accent: '#F59E3B', dark: true },
    { id: 'indigo-dawn', name: 'Indigo Dawn', vibe: 'Soft light', bg: '#F6F5FB', card: '#FFFFFF', accent: '#D97706', dark: false },
  ]

  const SEGMENTS = [
    { id: 'auto', label: 'Auto (follow system)' },
    { id: 'indigo-night', label: 'Indigo Night' },
    { id: 'indigo-dawn', label: 'Indigo Dawn' },
  ]

  const [reducedMotion, setReducedMotion] = useState(false)
  const [hindi, setHindi] = useState(false)

  return (
    <div className="space-y-4">
      <p className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>Choose Your Theme</p>

      {/* Two large side-by-side preview cards */}
      <div className="grid grid-cols-2 gap-3">
        {previewThemes.map((t) => {
          const selected = selectedId === t.id
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              className="rounded-2xl p-3 text-left transition-transform active:scale-95"
              style={{ background: 'var(--surface)', border: `2px solid ${selected ? 'var(--kavach-gold)' : 'var(--surface-muted)'}` }}
            >
              <div className="h-20 rounded-xl overflow-hidden relative mb-2" style={{ background: t.bg, border: '1px solid rgba(0,0,0,0.06)' }}>
                <div className="absolute top-2 left-2 h-8 w-10 rounded-md" style={{ background: t.card, border: '1px solid rgba(0,0,0,0.08)' }} />
                <div className="absolute top-4 right-2 h-5 w-5 rounded-full" style={{ background: t.accent }} />
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>{t.name}</div>
                  <div className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{t.vibe}</div>
                </div>
                {selected && (
                  <span className="h-5 w-5 rounded-full shrink-0 flex items-center justify-center" style={{ background: 'var(--kavach-gold)' }}>
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#fff' }} />
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Segmented control: Auto (follow system) + manual themes */}
      <div>
        <p className="text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Theme source</p>
        <div className="grid grid-cols-3 rounded-full p-[3px]" style={{ background: 'var(--surface-muted)' }}>
          {SEGMENTS.map((s) => {
            const active = value === s.id
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => { if (s.id === 'auto') applySystemTheme(); else onChange(s.id) }}
                className="relative rounded-full py-2 text-xs font-semibold"
                style={{ background: active ? 'linear-gradient(135deg, #4338CA, #6366F1)' : 'transparent', color: active ? '#fff' : 'var(--text-secondary)' }}
              >
                {s.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setReducedMotion((v) => !v)}
          className="w-full flex items-center justify-between rounded-xl px-4 py-3"
          style={{ background: 'var(--surface)', border: '1px solid var(--surface-muted)' }}
        >
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Reduced Motion</span>
          <span className="h-6 w-11 rounded-full p-0.5 transition-colors" style={{ background: reducedMotion ? 'linear-gradient(135deg, #4338CA, #6366F1)' : 'var(--surface-muted)' }}>
            <span className="block h-5 w-5 rounded-full transition-transform" style={{ background: '#fff', transform: reducedMotion ? 'translateX(20px)' : 'translateX(0)', boxShadow: '0 1px 3px rgb(0 0 0 / 0.2)' }} />
          </span>
        </button>
        <button
          type="button"
          onClick={() => setHindi((v) => !v)}
          className="w-full flex items-center justify-between rounded-xl px-4 py-3"
          style={{ background: 'var(--surface)', border: '1px solid var(--surface-muted)' }}
        >
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Hindi Language</span>
          <span className="h-6 w-11 rounded-full p-0.5 transition-colors" style={{ background: hindi ? 'linear-gradient(135deg, #4338CA, #6366F1)' : 'var(--surface-muted)' }}>
            <span className="block h-5 w-5 rounded-full transition-transform" style={{ background: '#fff', transform: hindi ? 'translateX(20px)' : 'translateX(0)', boxShadow: '0 1px 3px rgb(0 0 0 / 0.2)' }} />
          </span>
        </button>
      </div>
    </div>
  )
}
