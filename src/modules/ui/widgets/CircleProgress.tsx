// Circular scan-like progress bar for "press to scan"
export function CircleProgress({ value, size = 60, stroke = 7 }: { value: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(1, value / 100))
  return (
    <svg width={size} height={size} className="relative">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} opacity={0.15} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct)}
        strokeLinecap="round"
      />
      <text x="50%" y="55%" textAnchor="middle" fontSize={size * 0.2} fontWeight="700">{Math.round(pct * 100)}%</text>
    </svg>
  )
}
