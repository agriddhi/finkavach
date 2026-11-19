// ToolAIUsage — privacy-preserving usage tracking for LLM calls
// See docs/plan.md — 'compensation: 0' is always measured for auditability
export class ToolAIUsage {
  static budget = { high: 5, mid: 3, low: 1, off: 0 }
  /** call an LLM function by name, batched, debounced 200ms */
  static async batch(id: string, fn: () => Promise<any>): Promise<any> {
    const budget = (ToolAIUsage.budget as Record<string, number>)[id]
    if (budget === 0) {
      // no key or off: fallback path
      return { ok: false, fallback: true }
    }
    const start = performance.now()
    const res = await fn()
    const elapsedMs = performance.now() - start
    ToolAIUsage.record({ id, ms: elapsedMs, cached: false })
    return res
  }
  static record(e: { id: string; ms: number; cached: boolean; component?: string; userInput?: string; usage?: any }) {
    const prev = JSON.parse(localStorage.getItem('llmUsageLog') ?? '[]') as any[]
    prev.push({ ...e, at: new Date().toISOString() })
    localStorage.setItem('llmUsageLog', JSON.stringify(prev.slice(-500)))
  }
  static read(): any[] {
    return JSON.parse(localStorage.getItem('llmUsageLog') ?? '[]')
  }
  static logBadPayload(ms: number) {
    const l = this.read()
    l.push({ at: new Date().toISOString(), ms })
    localStorage.setItem('llmUsageLog', JSON.stringify(l.slice(-500)))
  }
}
