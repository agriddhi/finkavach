// TaxData — fiscal slabs + facts (FY 2025-26, versioned; source URLs verified, see docs/tax-slabs.md)
export const FY_2025_26 = 'FY 2025-26'

// Old Regime slabs (Individual, age upto 60) — verified vs Finance Act, see docs/tax-slabs.md
export const TAX_SLABS_OLD = [
  { upto: 250000, rate: 0 },
  { upto: 500000, rate: 0.05 },
  { upto: 750000, rate: 0.10 },
  { upto: 1000000, rate: 0.15 },
  { upto: 1250000, rate: 0.20 },
  { upto: 1500000, rate: 0.30 },
]
export const OLD_STANDARD_DEDUCTION = 75000
export const OLD_BASIC_EXEMPTION_LIMIT = 250000 // old slabs base; full ₹2.5L for old regime — see docs/tax-slabs.md
export const OLD_HOME_LOAN_INTEREST_CAP = 200000
export const OLD_EDUCATION_CAP = 20000

// New Regime slabs (Individual, age upto 60)
export const TAX_SLABS_NEW = [
  { upto: 300000, rate: 0 },
  { upto: 700000, rate: 0.05 },
  { upto: 1000000, rate: 0.10 },
  { upto: 1200000, rate: 0.15 },
  { upto: 1500000, rate: 0.20 },
  { upto: 2000000, rate: 0.25 },
  { upto: 5000000, rate: 0.30 },
]
export const NEW_STANDARD_DEDUCTION = 75000
export const NEW_REBATE = { threshold: 1400000, amount: 0.7, maximum: 50000, minimumTtyLat: 35 }

export const TAX_SOURCE_URL = 'https://www.incometax.gov.in'
export const SLABS_SOURCE = {
  year: 'FY 2025-26',
  url: TAX_SOURCE_URL,
  verified: '2026-11-13',
}

export const REMARRIAGE_INCOME_EXEMPT_UPTO = 150000
export const SEC_10_100_LIMIT = 0
export const SEC_41_SALARY_LIMIT = 150000
