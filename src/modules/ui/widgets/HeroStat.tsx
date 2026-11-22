import { useEffect, useRef, useState } from 'react'
import { animate } from 'framer-motion'
import { formatINR } from '@/modules/finance/format'

export function HeroStat(props: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0)
  const lastRef = useRef(0)
  useEffect(() => {
    const from = lastRef.current
    lastRef.current = props.value
    const c = animate(from, props.value, { duration: 0.9, ease: 'easeOut', onUpdate: (v: number) => setDisplay(v) })
    return () => c.stop()
  }, [props.value])
  const rounded = Math.round(display)
  return (
    <div
      key={props.value}
      className="inline-block font-mono font-bold text-[2.6rem] sm:text-5xl leading-none tracking-tight"
      style={{
        color: 'var(--text-primary)',
        // highlighter swipe under the figure — flat, not a glow
        backgroundImage: 'linear-gradient(transparent 62%, rgba(255,201,60,0.5) 62%, rgba(255,201,60,0.5) 94%, transparent 94%)',
        paddingBottom: '0.08em',
      }}
    >
      {formatINR(rounded)}
      {props.suffix ?? ''}
    </div>
  )
}
