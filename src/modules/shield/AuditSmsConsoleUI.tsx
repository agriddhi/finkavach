// AuditSmsConsoleUI — Shield Mode screen (Design Spec §3): hero, quick actions, composer, verdict, recent scans.
import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, ShieldX, ShieldAlert, ScanSearch, KeyRound, Link2, Clock, Lock, ClipboardPaste, ChevronDown, Zap, PhoneCall } from 'lucide-react'
import { Card, CardHeader, Icons } from '@/modules/ui/widgets/Table'
import { showToast, StatusBar } from '@/modules/ui/widgets/ToolMessaging'
import { AuditSmsConsole, type HistoryItem } from '@/modules/shield/AuditSmsConsole'
import { Confetti } from '@/modules/ui/widgets/Confetti'

const STATE_META: Record<string, { color: string; icon: typeof ShieldCheck; chip: string }> = {
  SAFE: { color: '#2E9E6B', icon: ShieldCheck, chip: 'border px-3 py-1 rounded-full text-xs font-semibold' },
  SCAM: { color: '#EF4444', icon: ShieldX, chip: 'border px-3 py-1 rounded-full text-xs font-semibold' },
  NOT_SURE: { color: '#D97706', icon: ShieldAlert, chip: 'border px-3 py-1 rounded-full text-xs font-semibold' },
}

function reasonIcon(reason: string): typeof ShieldAlert {
  const r = reason.toLowerCase()
  if (r.includes('otp') || r.includes('pin') || r.includes('cvv') || r.includes('collect') || r.includes('forward')) return KeyRound
  if (r.includes('url') || r.includes('link') || r.includes('http')) return Link2
  if (r.includes('brand') || r.includes('sender') || r.includes('impersonat')) return ShieldAlert
  return ShieldX
}

function evidenceFor(rule: string): { icon: typeof ShieldAlert; label: string } {
  const r = rule.toLowerCase()
  if (r.includes('otp')) return { icon: ShieldAlert, label: 'Asked for OTP' }
  if (r.includes('url') || r.includes('fake') || r.includes('phishing') || r.includes('domain') || r.includes('collect')) return { icon: Link2, label: 'Suspicious link' }
  if (r.includes('brand')) return { icon: Zap, label: 'Impersonation' }
  if (r.includes('call')) return { icon: PhoneCall, label: 'Fraud call' }
  return { icon: Clock, label: 'Unknown sender' }
}

export function AuditSmsConsoleUI(props: { onAskAI: (preset?: string) => void }) {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<HistoryItem[]>(() => AuditSmsConsole.history())
  const [scan, setScan] = useState<HistoryItem[] | null>(null)
  const [scanning, setScanning] = useState(false)
  const [scanStatus, setScanStatus] = useState('')
  const [prevSafe, setPrevSafe] = useState<HistoryItem | null>(null)
  const [expanded, setExpanded] = useState<number | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { setHistory(AuditSmsConsole.history()) }, [])

  const scanned = history.length
  const threats = history.filter((h) => h.verdict.label === 'SCAM').length

  function runDetector() {
    if (!input.trim()) { showToast('error', 'Paste an SMS first'); return }
    setScanning(true)
    setScan(null)
    setScanStatus('Checking sender…')
    setTimeout(() => {
      setScanStatus('Analyzing links…')
      setTimeout(() => {
        setScanStatus('Reading language patterns…')
        setTimeout(() => {
          const prev = AuditSmsConsole.history()
          const results = AuditSmsConsole.run(input)
          const prevSafeItem = prev.filter((h) => h.verdict.label === 'SAFE').pop() ?? null
          setScan(results)
          setPrevSafe(prevSafeItem)
          setInput('')
          setHistory(AuditSmsConsole.history())
          setScanning(false)
          setScanStatus('')
          showToast('success', 'Analyzed.')
        }, 450)
      }, 450)
    }, 450)
  }

  function markSafe(item: HistoryItem) {
    const h = AuditSmsConsole.history()
    const idx = h.findIndex((x) => x.sms === item.sms && x.sender === item.sender && x.at === item.at)
    AuditSmsConsole.markSafe(idx >= 0 ? idx : Math.max(0, h.length - 1))
    setScan(null)
    setHistory(AuditSmsConsole.history())
    showToast('success', 'Marked safe.')
  }

  function report1930() { showToast('info', 'Reported to NPCI 1930 (demo)') }

  function pasteFromClipboard() {
    navigator.clipboard?.readText?.().then((t) => { if (t) setInput(t) }).catch(() => showToast('info', 'Clipboard unavailable'))
  }

  const current = scan && scan.length > 0 ? scan[scan.length - 1] : null

  return (
    <div className="space-y-4 stagger">
      {/* Hero — flat status block */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[10px] p-6 text-center"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          boxShadow: '0 1px 2px rgba(20,32,58,0.05)',
        }}
      >
        <div className="flex flex-col items-center">
          <span className="h-16 w-16 rounded-full flex items-center justify-center mb-3" style={{ background: 'var(--success-soft)', border: '1px solid rgba(46,158,107,0.3)' }}>
            <ShieldCheck className="h-8 w-8" style={{ color: 'var(--success)' }} />
          </span>
          <h2 className="font-display font-extrabold text-2xl" style={{ color: 'var(--text-primary)' }}>You&apos;re protected</h2>
          <p className="text-sm font-medium mt-1" style={{ color: 'var(--text-secondary)' }}>
            {scanned} message{scanned === 1 ? '' : 's'} scanned this week · {threats} threat{threats === 1 ? '' : 's'}
          </p>
          <p className="flex items-center gap-1 text-[11px] mt-1" style={{ color: 'var(--text-secondary)' }}>
            <Lock className="h-3 w-3" /> Your data stays on your device.
          </p>
        </div>
      </motion.div>

      {/* Quick actions */}
      <div className="flex gap-2">
        {[
          { label: 'Scan SMS', icon: ScanSearch, onClick: () => textareaRef.current?.focus() },
          { label: 'Check link', icon: Link2, onClick: () => props.onAskAI('Check this link for me') },
          { label: 'Report scam', icon: ShieldAlert, onClick: report1930 },
        ].map((q) => {
          const Icon = q.icon
          return (
            <button key={q.label} onClick={q.onClick} className="flex-1 flex items-center justify-center gap-1.5 rounded-[6px] py-2.5 text-xs font-semibold transition-colors hover:bg-[var(--surface-muted)]" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
              <Icon className="h-4 w-4" style={{ color: 'var(--text-secondary)' }} />
              {q.label}
            </button>
          )
        })}
      </div>

      {/* Composer: Scan a message */}
      <div className="rounded-[10px] p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: '0 1px 2px rgba(20,32,58,0.04)' }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Scan a message</h2>
          <span title="Connect an SMS gateway to scan your inbox automatically" className="h-7 w-7 rounded-full flex items-center justify-center" style={{ background: 'var(--surface-muted)', color: 'var(--text-secondary)' }}>
            <span className="text-xs font-bold">i</span>
          </span>
        </div>
        <div className="relative rounded-[6px] overflow-hidden" style={{ background: 'var(--surface-muted)', border: '1px solid var(--border)' }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 text-sm outline-none resize-none bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
            placeholder="Paste suspicious SMS..."
            style={{ boxShadow: '0 0 0 0 transparent' }}
          onFocus={(e) => { e.currentTarget.parentElement!.style.boxShadow = '0 0 0 2px var(--kavach-gold)' }}
            onBlur={(e) => { e.currentTarget.parentElement!.style.boxShadow = 'none' }}
          />
          <button onClick={pasteFromClipboard} className="absolute bottom-2 right-2 rounded-lg px-2 py-1 text-[10px] font-semibold" style={{ background: 'var(--surface)', border: '1px solid var(--surface-muted)', color: 'var(--text-secondary)' }}>
            <ClipboardPaste className="inline h-3 w-3 mr-1" />
            Paste from clipboard
          </button>
          {scanning && (
            <div className="absolute inset-0 overflow-hidden rounded-[10px]">
              <div className="absolute inset-0 animate-pulse" style={{ background: 'rgba(13,148,136,0.08)' }} />
              <div className="absolute left-0 right-0 h-[2px] animate-scan" style={{ background: '#14203A' }} />
            </div>
          )}
        </div>
        <button
          onClick={runDetector}
          disabled={scanning || !input.trim()}
          className="w-full mt-3 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold disabled:opacity-40"
          style={{ background: '#FFC93C', color: '#14203A', boxShadow: input.trim() ? '0 8px 20px -8px rgba(255,201,60,0.55)' : 'none' }}
        >
          <ScanSearch className="h-4 w-4" />
          Scan
        </button>
      </div>

      {/* Scanning state: skeleton + status lines */}
      {scanning && (
        <div className="space-y-3">
          <div className="rounded-[10px] p-4 animate-pulse" style={{ background: 'var(--surface)', border: '1px solid var(--surface-muted)' }}>
            <div className="h-3 w-2/3 rounded" style={{ background: 'var(--surface-muted)' }} />
            <div className="h-3 w-1/2 rounded mt-2" style={{ background: 'var(--surface-muted)' }} />
            <div className="h-3 w-3/4 rounded mt-2" style={{ background: 'var(--surface-muted)' }} />
          </div>
          <div className="rounded-[10px] p-4" style={{ background: 'var(--surface)', border: '1px solid var(--surface-muted)' }}>
            {['Checking sender…', 'Analyzing links…', 'Reading language patterns…'].map((s) => (
              <p key={s} className="text-xs py-0.5 flex items-center gap-2" style={{ color: scanStatus === s ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: scanStatus === s ? '#FFC93C' : 'var(--surface-muted)' }} />
                {s}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Verdict panel + recent scans: two columns on desktop */}
      <div className="grid lg:grid-cols-2 gap-4 items-start">
        {/* Verdict panel */}
        <div className="space-y-3">
          {current && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              {prevSafe && current.verdict.label !== 'SAFE' && <SafeCard item={prevSafe} />}
              <VerdictCard item={current} onMarkSafe={() => markSafe(current)} onReport={report1930} onAskAI={() => props.onAskAI('Why was this SMS flagged?')} />
            </motion.div>
          )}
          {current && (
            <RiskGauge verdict={current.verdict.label} />
          )}
        </div>

        {/* Recent scans: timeline list */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Recent scans</h3>
            <Icons variant="Detection Status" />
          </div>
          {history.length === 0 ? (
            <p className="text-xs text-center py-4" style={{ color: 'var(--text-secondary)' }}>No scans yet.</p>
          ) : (
            <div className="space-y-2">
              {history.map((v, i) => (
                <TimelineRow key={`${v.sms}-${i}`} item={v} expanded={expanded === i} onToggle={() => setExpanded(expanded === i ? null : i)} />
              ))}
            </div>
          )}
        </div>
      </div>

      <StatusBar title="Shield Mode — SMS Bodyguard" detail="Paste any SMS/alert text below." />
      <p className="text-xs text-center" style={{ color: 'var(--text-secondary)' }}>Every verdict is deterministic & explainable — verify links with official apps.</p>
    </div>
  )
}

function SafeCard({ item }: { item: HistoryItem }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[10px] p-4 flex items-start gap-3"
      style={{ background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.35)' }}>
      <span className="h-9 w-9 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(46,158,107,0.12)', color: '#2E9E6B' }}>
        <ShieldCheck className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="font-display font-bold text-sm" style={{ color: '#2E9E6B' }}>Safe</p>
        <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{item.sms.length > 90 ? `${item.sms.slice(0, 90)}…` : item.sms}</p>
        <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>from: {item.sender}</p>
        <p className="text-[11px] font-medium mt-1" style={{ color: '#2E9E6B' }}>All good — read normally. You are protected.</p>
      </div>
    </motion.div>
  )
}

function RiskGauge({ verdict }: { verdict: string }) {
  const scam = verdict === 'SCAM'
  const notSure = verdict === 'NOT_SURE'
  const color = scam ? '#EF4444' : notSure ? '#D97706' : '#2E9E6B'
  const frac = scam ? 1 : notSure ? 0.6 : 0.15
  const len = Math.PI * 45
  const dash = frac * len
  return (
    <div className="rounded-[10px] p-4 flex flex-col items-center" style={{ background: 'var(--surface)', border: '1px solid var(--surface-muted)' }}>
      <svg viewBox="0 0 120 70" className="w-full max-w-[220px]" aria-hidden>
        <path d="M 15 60 A 45 45 0 0 1 105 60" fill="none" stroke="var(--surface-muted)" strokeWidth="10" strokeLinecap="round" />
        <path d="M 15 60 A 45 45 0 0 1 105 60" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${dash} ${len}`} />
      </svg>
      <p className="text-[10px] font-semibold tracking-wide mt-1" style={{ color: 'var(--text-secondary)' }}>RISK GAUGE</p>
      <p className="text-xs font-medium" style={{ color: color }}>{verdict}</p>
    </div>
  )
}

function TimelineRow({ item, expanded, onToggle }: { item: HistoryItem; expanded: boolean; onToggle: () => void }) {
  const meta = STATE_META[item.verdict.label] ?? STATE_META.SAFE
  const Icon = meta.icon
  const safe = item.verdict.label === 'SAFE'
  const time = item.at ? new Date(item.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
  const summary = item.verdict.label === 'SAFE' ? 'All good — read normally' : item.verdict.reasons[0]?.slice(0, 60) ?? ''
  return (
    <div className="rounded-[10px]" style={{ background: 'var(--surface)', border: '1px solid var(--surface-muted)' }}>
      <button onClick={onToggle} className="w-full flex items-center gap-3 p-3 text-left">
        <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: meta.color }} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{item.sender}</p>
          <p className="text-[11px] truncate" style={{ color: 'var(--text-secondary)' }}>{summary}</p>
        </div>
        <span className="text-[10px] shrink-0" style={{ color: 'var(--text-secondary)' }}>{time}</span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 transition-transform" style={{ color: 'var(--text-secondary)', transform: expanded ? 'rotate(180deg)' : 'none' }} />
      </button>
      {expanded && (
        <div className="px-3 pb-3 pt-0">
          <p className="text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Why we flagged this:</p>
          <div className="space-y-1">
            {item.verdict.reasons.slice(0, 3).map((r, i) => {
              const EI = reasonIcon(r)
              const fe = evidenceFor(r)
              const FI = fe.icon
              return (
                <div key={i} className="flex gap-2 text-xs">
                  <EI className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: meta.color }} />
                  <span className="inline-flex items-center gap-1.5"><FI className="h-3.5 w-3.5 shrink-0" style={{ color: meta.color }} /> {fe.label}</span>
                </div>
              )
            })}
          </div>
          <p className="mt-2 text-xs italic" style={{ color: 'var(--text-secondary)' }}>{item.sms.length > 140 ? `${item.sms.slice(0, 140)}…` : item.sms}</p>
        </div>
      )}
    </div>
  )
}

function VerdictCard({ item, onMarkSafe, onReport, onAskAI }: { item: HistoryItem; onMarkSafe: () => void; onReport: () => void; onAskAI: () => void }) {
  const meta = STATE_META[item.verdict.label] ?? STATE_META.SAFE
  const Icon = meta.icon
  const scam = item.verdict.label === 'SCAM'
  const safe = item.verdict.label === 'SAFE'
  const time = item.at ? new Date(item.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
  const smsText = item.sms.length > 140 ? `${item.sms.slice(0, 140)}…` : item.sms
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative rounded-[10px] p-4"
      style={{
        background: 'var(--surface)',
        border: `1px solid ${safe ? 'rgba(16,185,129,0.25)' : 'var(--surface-muted)'}`,
        borderLeft: `4px solid ${meta.color}`,
        borderLeftWidth: 4,
      }}
    >
      {safe && <Confetti />}
      {scam && <div className="absolute inset-0 rounded-[10px] animate-red-pulse pointer-events-none" style={{ boxShadow: 'inset 0 0 40px rgba(239,68,68,0.08)' }} />}
      <div className="relative">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="h-9 w-9 rounded-full flex items-center justify-center shrink-0" style={{ background: safe ? 'rgba(46,158,107,0.12)' : 'rgba(239,68,68,0.12)', color: safe ? '#2E9E6B' : '#DC2626' }}>
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <div className="font-display font-bold" style={{ color: safe ? '#2E9E6B' : '#DC2626' }}>{item.verdict.label === 'SCAM' ? 'SCAM DETECTED' : item.verdict.label}</div>
              <div className="text-[10px] flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                <Clock className="h-3 w-3 shrink-0" />
                {time}
              </div>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${meta.chip}`}>{item.verdict.label}</span>
        </div>
        <p className="mt-3 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{item.sms.length > 140 ? `${item.sms.slice(0, 140)}…` : item.sms}</p>
        <p className="text-[11px] mt-0.5 italic" style={{ color: 'var(--text-secondary)' }}>from: {item.sender}</p>
        <div className="mt-2">
          <p className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>Why we flagged this:</p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {item.verdict.evidence.slice(0, 3).map((e, i) => {
              const fe = evidenceFor(e.rule)
              const FI = fe.icon
              return (
                <span key={i} className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium" style={{ background: scam ? 'rgba(239,68,68,0.10)' : 'rgba(46,158,107,0.10)', border: `1px solid ${scam ? 'rgba(239,68,68,0.35)' : 'rgba(46,158,107,0.35)'}`, color: scam ? '#DC2626' : '#2E9E6B' }}>
                  <FI className="h-3.5 w-3.5 shrink-0" /> {fe.label}
                </span>
              )
            })}
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <button onClick={onMarkSafe} className="btn-outline text-xs">Mark Safe</button>
          <button onClick={onReport} className="text-xs font-bold rounded-lg px-3 py-1.5" style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)', color: '#fff' }}>Report to 1930</button>
        </div>
        {scam && <p className="mt-2 text-[11px] font-medium" style={{ color: '#DC2626' }}>Do NOT click links. Call 1930, do not reveal OTP.</p>}
        {safe && <p className="mt-2 text-[11px] font-medium" style={{ color: '#2E9E6B' }}>All good — read normally. You are protected.</p>}
      </div>
    </motion.div>
  )
}
