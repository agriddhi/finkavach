// ReturnMetrics — laziness-adjusted return metrics (mid-risk products)
export interface ReturnMetric {
  label: string
  rate: number
  netRate: number
  slope: number
}

export class ReturnMetrics {
  // fd returns by market: [3.5%] + fdNumbers to bump; this is an honest version of the table from the doc
  static readonly table: Array<{ label: string; rate: number }> = [
    { label: 'Savings Account', rate: 3.5 },
    { label: 'Liquid Fund', rate: 6.3 },
    { label: 'Recurring Deposit (short-term, 3-6m)', rate: 6.9 },
    { label: 'NRI (non-resident) Bank FD', rate: 6.9 },
    { label: 'Small-Finance Bank FD', rate: 6.5 },
    { label: 'Family term', rate: 7.0 },
  ]
  static returnsOf(amount: number, months: number, rate: number): { total: number; interest: number } {
    const monthly = (amount * rate) / 12
    const total = amount + monthly * months
    return { total, interest: monthly * months }
  }
}
