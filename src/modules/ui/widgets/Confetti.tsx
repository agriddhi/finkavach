import { useMemo } from 'react'
import type { CSSProperties } from 'react'

interface Piece { id: number; dx: string; dy: string; delay: string; size: number; color: string }

export function Confetti() {
  const pieces = useMemo<Piece[]>(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        id: i,
        dx: `${((i - 3) * 26) + Math.random() * 10 - 5}px`,
        dy: `${-(46 + ((i * 37) % 40))}px`,
        delay: `${i * 70}ms`,
        size: 5 + (i % 3) * 2,
        color: ['#FBBF24', '#10B981', '#0D9488', '#6366F1', '#F59E0B', '#34D399', '#EF4444'][i % 7],
      })),
    [],
  )
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece absolute left-1/2 top-1/3 block rounded-[2px]"
          style={
            {
              width: p.size,
              height: p.size * 0.42,
              background: p.color,
              animationDelay: p.delay,
              '--dx': p.dx,
              '--dy': p.dy,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
