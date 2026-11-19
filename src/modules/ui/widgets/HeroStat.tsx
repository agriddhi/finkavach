import { useEffect, useState } from 'react'
import { animate } from 'framer-motion'

export function HeroStat(props: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    const c = animate(0, props.value, { duration: 0.9, ease: 'easeOut', onUpdate: (v: number) => setDisplay(v) })
    return () => c.stop()
  }, [props.value])
  const rounded = Math.round(display)
  return (
    <div key={props.value} className="text-display font-extrabold text-4xl leading-none font-mono tracking-tight animate-gold-pulse" style={{ color: 'var(--kavach-gold)' }}>
      {props.prefix}
      {rounded.toLocaleString('en-IN')}
      {props.suffix}
    </div>
  )
}
