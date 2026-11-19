// Detector — spam detector (Rule 1 detector via heuristic signatures)
// Deterministic verdicts: SAFE / SCAM / NOT_SURE with evidence (span + rule).
export interface Verdict {
  label: string // SAFE | SCAM | NOT_SURE
  score: number // 0 = safe, 1 = spam
  reasons: string[]
  evidence: Array<{ span: string; rule: string }>
}

export interface DetectionResult {
  sender: string
  verdict: Verdict
  actions: string[]
}

export class Detector {
  constructor(
    private config: { spamThreshold: number; collectThreshold: number; noticeSpam: number; safeThreshold: number },
    private signatures: { rules: Array<{ kind: string; required: string[]; exempt?: string[]; any?: boolean; severity: number; action: string }> },
  ) {}

  detect(sms: string, sender?: string): DetectionResult {
    const txt = sms.toLowerCase()
    const evidence: Array<{ span: string; rule: string }> = []
    const reasons: string[] = []
    let score = 0.05

    for (const rule of this.signatures.rules) {
      const hit = rule.any
        ? rule.required.filter((r) => txt.includes(r))[0]
        : rule.required.filter((r) => txt.includes(r))
      if (hit === undefined && !rule.any) continue
      if (rule.any ? !hit : (hit as string[]).length < rule.required.length) continue
      if (rule.exempt && rule.exempt.some((e) => txt.includes(e))) continue
      const span = pickSpan(sms, rule.any ? (hit as string) : (rule.required[0] ?? sms.slice(0, 15)))
      evidence.push({ span, rule: rule.kind })
      reasons.push(`${rule.kind}: "${rule.any ? (hit as string) : rule.required.join(' / ')}"`)
      score = Math.max(score, rule.severity + 0.05)
    }

    let label: Verdict['label']
    if (score >= this.config.spamThreshold) label = 'SCAM'
    else if (score >= this.config.noticeSpam) label = 'NOT_SURE'
    else label = 'SAFE'
    if (label === 'SAFE') score = Math.max(score, 0.1)

    const verdict: Verdict = { label, score: +score.toFixed(2), reasons, evidence }
    return {
      sender: sender ?? pickSender(sms),
      verdict,
      actions: verdict.label === 'SAFE' ? ['Read normally'] : verdict.label === 'NOT_SURE' ? ['Verify with official app', 'Check link ends with official domain'] : ['Do NOT click links', 'Call 1930, do not reveal OTP'],
    }
  }
}

function pickSender(body: string): string {
  const m = body.match(/^[\w\s]{2,30}?(?=@[A-Za-z]|^\s*[A-Z][A-Z0-9 ]{2,}$)/i)
  return m?.[0]?.trim() ?? 'unknown'
}

function pickSpan(body: string, query: string): string {
  const re = new RegExp(`(.{0,18})${escapeRe(query)}(.{0,12})`, 'i')
  const m = body.match(re)
  return m ? m[0] : query
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
