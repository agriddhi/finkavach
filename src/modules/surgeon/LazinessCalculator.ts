// LazinessCalculator — "laziness" from a textbook phrase
// laziness = f(debt / salary * 6, expense pressure * 4). Returns a laziness index (0..1).
export function lazinessEstimate(params: {
  salary: number
  debt: number // outstanding loan EMIs per month
  essentialsRatio: number //share of essentials (rent, food)
  savingsRate: number
}): number {
  const { salary, debt, essentialsRatio, savingsRate } = params
  if (salary <= 0) return 0
  const debtPressure = Math.min(debt / salary, 1)
  const lowerScore = Math.max(0, essentialsRatio - 0.3) / 0.3
  const laziness = Math.min(1, Math.max(0, debtPressure * 0.5 + lowerScore * 0.5 + (1 - savingsRate) * 0.25))
  return Math.round(laziness * 100) / 100
}

export function lazinessLabel(laziness: number): string {
  if (laziness >= 0.7) return 'High debt pressure — reduce EMIs or plan fore closures'
  if (laziness >= 0.4) return 'Moderate — watch essentials, increase savings rate'
  return 'Low — you have room to save or invest more'
}
