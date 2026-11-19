// Shield Mode — pure-logic console (no React) — See docs/plan.md — ToolDtool + ToolMessaging
import { AuditSmsConsole } from '@/modules/shield/AuditSmsConsole'

export interface ShieldVerdict {
  id: number
  sms: string
  sender: string
  verdict: { label: string; score: number; reasons: string[]; evidence: Array<{ span: string; rule: string }> }
  actions: string[]
}

export { AuditSmsConsole as ShieldConsole }
export { Detector } from '@/modules/shield/Detector'
export { DetectorConfig } from '@/modules/shield/DetectorConfig'
export { Ingestor } from '@/modules/shield/Ingestor'
export { AttackSignatures } from '@/modules/shield/AttackSignatures'
export type { SMSMetadata } from '@/modules/shield/Ingestor'
export type { DetectionResult } from '@/modules/shield/Detector'
