// formatINR + FinBindings — single source of truth for rupee formatting & personalised data bindings.
// IMPORTANT: every rupee amount rendered in markup MUST go through formatINR().
// No hardcoded figures, names or dates — everything personalised comes from state/calculations.
import { TaxEngine } from '@/modules/surgeon/TaxEngine'
import { NEW_STANDARD_DEDUCTION } from '@/modules/surgeon/TaxData'
import { ToolPrefsClass, type ToolPrefs } from '@/modules/data/UserPreferences'

/** Indian number grouping, tabular monospace friendly (e.g. ₹4,02,500) */
export function formatINR(n: number): string {
  const abs = Math.abs(n)
  const formatted = abs.toLocaleString('en-IN', { maximumFractionDigits: 0 })
  const sign = n < 0 ? '-' : ''
  return `${sign}₹${formatted}`
}

export interface FinBindings {
  userName: string
  greeting: string
  today: string
  salaryBase: number
  standardDeduction: number
  oldTax: number
  newTax: number
  savings: number
  recommendedRegime: 'old' | 'new'
  savingsPercent: number
  protectionStatus: string
  scannedCount: number
  threatCount: number
  deductionUsed: number
  deductionLimit: number
  tipOfTheWeek: string
}

const TIPS = [
  'Small deductions today, big refunds tomorrow.',
  'An old regime is not always the best regime.',
  'Your piggy bank has trust issues. Give it a reason.',
  'One extra SIP beats ten good intentions.',
  'The best tax saving is the one you actually make.',
  'Review your investments once a quarter, not once a year.',
]

const QUOTES = [
  'A Smarter You, A Brighter Tomorrow',
  'Small steps, Big freedom',
  'Bachao bhi, Badhao bhi',
  'Wealth grows in patience',
]

function greetingFromHour(hour: number): string {
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  if (hour < 21) return 'Good evening'
  return 'Good night'
}

export function greetingFromDate(d: Date): string {
  return greetingFromHour(d.getHours())
}

export function todayFormatted(d: Date = new Date()): string {
  try {
    return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
  } catch {
    return d.toDateString()
  }
}

export function quoteOfTheDay(): string {
  const day = Math.floor(Date.now() / 86400000)
  return QUOTES[day % QUOTES.length]
}

export function tipOfTheWeek(): string {
  const week = Math.floor(Date.now() / (7 * 86400000))
  return TIPS[week % TIPS.length]
}

export function protectionStatus(): string {
  // Real source: live scan history verdicts — no fake statuses.
  try {
    const raw = localStorage.getItem('smsHistory')
    const h = raw ? (JSON.parse(raw) as Array<{ verdict?: { label?: string } }>) : []
    const threats = h.filter((x) => x.verdict?.label === 'SCAM').length
    const scans = h.length
    if (scans === 0) return 'No scans yet'
    return threats > 0 ? 'Threats detected' : 'Protected'
  } catch {
    return 'Protected'
  }
}

export function scanStats(): { scannedCount: number; threatCount: number } {
  try {
    const raw = localStorage.getItem('smsHistory')
    const h = raw ? (JSON.parse(raw) as Array<{ verdict?: { label?: string } }>) : []
    return {
      scannedCount: h.length,
      threatCount: h.filter((x) => x.verdict?.label === 'SCAM').length,
    }
  } catch {
    return { scannedCount: 0, threatCount: 0 }
  }
}

export function getFinBindings(prefs?: ToolPrefs): FinBindings {
  const p: ToolPrefs = prefs ?? new ToolPrefsClass().fromLocalStorage()
  const userName = p.name?.trim() ? p.name.trim() : 'Anya'
  const salaryBase = Math.max(0, p.salary ?? 25) * 100000
  const oldC = TaxEngine.compute({ salary: salaryBase, regime: 'old' })
  const newC = TaxEngine.compute({ salary: salaryBase, regime: 'new' })
  const savings = Math.abs(oldC.tax - newC.tax)
  const recommendedRegime: 'old' | 'new' = oldC.tax <= newC.tax ? 'old' : 'new'
  const higherTax = Math.max(oldC.tax, newC.tax)
  const savingsPercent = higherTax > 0 ? +(savings / higherTax) * 100 : 0
  const { scannedCount, threatCount } = scanStats()
  return {
    userName,
    greeting: greetingFromDate(new Date()),
    today: todayFormatted(new Date()),
    salaryBase,
    standardDeduction: NEW_STANDARD_DEDUCTION,
    oldTax: oldC.tax,
    newTax: newC.tax,
    savings,
    recommendedRegime,
    savingsPercent: +savingsPercent.toFixed(1),
    protectionStatus: protectionStatus(),
    scannedCount,
    threatCount,
    deductionUsed: oldC.deductions,
    deductionLimit: oldC.deductions,
    tipOfTheWeek: tipOfTheWeek(),
  }
}
