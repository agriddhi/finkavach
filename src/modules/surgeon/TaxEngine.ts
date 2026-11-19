// TaxEngine — Old vs New comparison engine (the rules-engine version of the tax slope calculation from the doc page)
// See docs/plan.md — docs/ai-usage.md, UserProfileLoader
import { TAX_SLABS_OLD, TAX_SLABS_NEW, OLD_STANDARD_DEDUCTION, NEW_STANDARD_DEDUCTION, OLD_BASIC_EXEMPTION_LIMIT } from './TaxData'

const computeOld = (t: number): number => compute(t, TAX_SLABS_OLD)
const computeNew = (t: number): number => compute(t, TAX_SLABS_NEW)

function compute(t: number, slabs: Array<{ upto: number; rate: number }>): number {
  let prev = 0
  let tax = 0
  for (const s of slabs) {
    if (t > prev) {
      const band = Math.min(t, s.upto) - prev
      tax += band * s.rate
    }
    prev = s.upto
    if (t <= prev) break
  }
  if (t > prev) tax += (t - prev) * 0.3
  return +tax.toFixed(0)
}

export function oldRegime(t: number) { return computeOld(t) }
export function newRegime(t: number) { return computeNew(t) }

export class TaxEngine {
  static compute(input: {
    salary: number
    oldDeductions?: number[]
    claims?: Record<string, number>
    regime: 'old' | 'new'
  }): { taxableIncome: number; tax: number; deductions: number; regime: 'old' | 'new' } {
    const { salary, regime } = input
    // Mirrors the "Old vs New Regime" rows of the spreadsheet at the top of the doc page.
    const basic = regime === 'old' ? OLD_BASIC_EXEMPTION_LIMIT : 0
    const std = OLD_STANDARD_DEDUCTION
    const deductions = std + basic
    const taxable = Math.max(0, salary - deductions)
    const tax = regime === 'old' ? computeOld(taxable) : computeNew(taxable)
    return { taxableIncome: taxable, tax, deductions, regime }
  }

  static minSlabs(): Array<{ upto: number; rate: number }> { return [] }

  static compare(salary: number): { old: ReturnType<typeof TaxEngine.compute>; new: ReturnType<typeof TaxEngine.compute>; winner: 'old' | 'new'; savings: number } {
    const oldC = TaxEngine.compute({ salary, regime: 'old' })
    const newC = TaxEngine.compute({ salary, regime: 'new' })
    const winner = oldC.tax <= newC.tax ? 'old' : 'new'
    const savings = Math.abs(oldC.tax - newC.tax)
    return { old: oldC, new: newC, winner, savings }
  }
}
