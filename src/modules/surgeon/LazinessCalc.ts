// LazinessCalc — laziness-calculator components (Glamor / interactive UI)
export function lazinessScore(score: number): number { return Math.round(score * 100) / 100 }
export function lazinessLabel(laziness: number): string {
  return laziness > 0.6 ? 'High' : laziness > 0.3 ? 'Moderate' : 'Low'
}
export function lazinessTotal(totals: { laziness: number; money: number }): number {
  return totals.laziness + (totals.money ?? 0)
}
