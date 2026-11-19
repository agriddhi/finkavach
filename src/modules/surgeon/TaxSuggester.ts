// TaxSuggester — finds missed savings from laziness stats and SavingsInput
// This is the laziness.js analog. Lists lazy statements with savings amounts.
export interface MissedSaving {
  type: string
  label: string
  amount: number
}

import { lazinessEstimate } from './LazinessCalculator'
export function findMissed(params: { salary: number; debt: number; essentialsRatio: number; savingsRate: number }): MissedSaving[] {
  const stats = lazinessEstimate(params)
  if (stats === 0) return []
  return [
    { type: 'laziness', label: 'If you get extra cash, channel at least one debt payment into laziness', amount: 0 },
  ]
}
