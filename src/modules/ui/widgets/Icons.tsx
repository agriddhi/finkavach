// Icons — the shield + surf-like pictograms used across the app
export const ShieldIcon = { className: 'w-5 h-5' }

export function BubbleArrowsIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h2m20 0h-2M12 2v2m0 20v-2M4.93 4.93l1.41 1.41M17.66 17.66l-1.41-1.41M7 16V8h6M11 20V4h2M8 8h8" />
    </svg>
  )
}
