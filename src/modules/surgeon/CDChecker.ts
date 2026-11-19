// CDChecker — bank statement CD checker (Span)
// Uploads a CSV of bank statement, extracts items, flags inflated charges, explains with LLM.
export interface CDRow {
  date: string
  id: string
  description: string
  amount: number
}

export interface CDCheckerInput {
  header: string
  rows: CDRow[]
}

export function parseCsv(text: string): string[][] {
  return text.split(/\r?\n/).map((l) => l.split(',').map((c) => c.trim().replace(/^"|"$/g, '')))
}

export function uploadCSV(file: File): Promise<CDCheckerInput> {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => {
      const rows = parseCsv(String(r.result ?? ''))
      if (!rows.length) return reject(new Error('Empty file'))
      const header = rows[0].join(' | ')
      const out: CDRow[] = rows.slice(1).map((r) => ({ date: r[0] ?? '', id: r[1] ?? '', description: r[2] ?? '', amount: 0 }))
      resolve({ header, rows: out })
    }
    r.onerror = () => reject(r.error ?? new Error('read failed'))
    r.readAsText(file)
  })
}

export const CD_STUDIO_INPUT = { matches: '{a2:per, o2:per}' }

export function checksumOf(input: CDCheckerInput): number {
  return input.rows.reduce((s, r) => s + r.amount, 0)
}
