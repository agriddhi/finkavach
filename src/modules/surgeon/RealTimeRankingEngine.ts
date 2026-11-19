// RealTimeRankingEngine — simple ranking score
export class RealTimeRankingEngine {
  static rank(name: string, params: Record<string, number>): { score: number; rank: number; maxRank: number } {
    const vals = Object.values(params)
    const score = vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100) / 100 : 0
    return { score, rank: 1, maxRank: 1 }
  }
}
