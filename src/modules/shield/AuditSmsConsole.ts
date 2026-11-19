// AuditSmsConsole — SMS ingester + spam detector (pure logic layer, reused by the console UI)
import { Detector, type DetectionResult } from '@/modules/shield/Detector'
import { AttackSignatures } from '@/modules/shield/AttackSignatures'
import { DEFAULT_CONFIG, DetectorConfig } from '@/modules/shield/DetectorConfig'

export interface HistoryItem {
  sms: string
  sender: string
  verdict: DetectionResult['verdict']
  actions: string[]
  at: number
}

export class AuditSmsConsole {
  private static _detector: Detector | null = null

  static getDetector(): Detector {
    if (!AuditSmsConsole._detector) {
      AuditSmsConsole._detector = new Detector(DEFAULT_CONFIG, new AttackSignatures())
    }
    return AuditSmsConsole._detector
  }

  static detect(sms: string): DetectionResult {
    const res = AuditSmsConsole.getDetector().detect(sms)
    return { sender: res.sender, verdict: res.verdict, actions: res.actions }
  }

  static run(smsText: string): HistoryItem[] {
    const texts = smsText.split(/\r?\n/).map((s) => s.trim()).filter(Boolean)
    const out: HistoryItem[] = texts.map((t) => {
      const d = AuditSmsConsole.detect(t)
      return { sms: t, sender: d.sender, verdict: d.verdict, actions: d.actions, at: Date.now() }
    })
    const h = AuditSmsConsole.history()
    AuditSmsConsole.save([...h, ...out])
    return out
  }

  private static save(h: HistoryItem[]): void {
    localStorage.setItem('smsHistory', JSON.stringify(h))
  }

  static history(): HistoryItem[] {
    return JSON.parse(localStorage.getItem('smsHistory') ?? '[]')
  }

  static markSafe(idx: number): void {
    const h = AuditSmsConsole.history()
    if (h[idx]) {
      h[idx].verdict = { ...h[idx].verdict, label: 'SAFE', score: 0.15, reasons: [...h[idx].verdict.reasons, 'User-marked safe'] }
      AuditSmsConsole.save(h)
    }
  }
}

export { Detector, DetectorConfig, AttackSignatures }
