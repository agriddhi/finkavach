import * as React from 'react'
import { useEffect, useState } from 'react'

export interface ToastItem { kind: 'success' | 'error' | 'info'; msg: string; id: string; t: number }

export function showToast(kind: ToastItem['kind'], msg: string) {
  const e: ToastItem = { kind, msg, id: crypto.randomUUID(), t: Date.now() }
  listeners.forEach((l) => l(e))
}

const listeners = new Set<(e: ToastItem) => void>()

export function Toast({ items }: { items: ToastItem[] }): React.ReactNode {
  return (
    <div className="fixed top-3 inset-x-0 z-[80] flex flex-col items-center gap-2 px-4 pointer-events-none">
      {items.slice(-3).map((i) => (
        <div
          key={i.id}
          className="pointer-events-auto w-full max-w-sm rounded-xl px-4 py-3 text-sm font-medium shadow-xl border toast-in"
          style={{
            background: i.kind === 'success' ? 'var(--surface-muted)' : 'var(--surface)',
            borderColor: i.kind === 'success' ? 'rgba(5,150,105,0.35)' : i.kind === 'error' ? 'rgba(239,68,68,0.35)' : 'rgba(100,116,139,0.3)',
            color: 'var(--text-primary)',
          }}
        >
          <div>{i.msg}</div>
          <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(100,116,139,0.2)' }}>
            <div
              className="h-full rounded-full"
              style={{ width: '100%', background: i.kind === 'success' ? 'var(--success)' : i.kind === 'error' ? 'var(--danger)' : 'var(--shield-teal)', animation: 'shrink 2800ms linear forwards' }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export function Toasts(): React.ReactNode {
  const [items, setItems] = useState<ToastItem[]>([])
  useEffect(() => {
    const handler = (e: ToastItem) => {
      setItems((l) => [...l, e])
      setTimeout(() => setItems((l) => l.slice(1)), 2900)
    }
    listeners.add(handler)
    return () => { listeners.delete(handler) }
  }, [])
  return <Toast items={items} />
}
export { Toasts as ToastContainer }

export function ToastIcon(): React.ReactElement {
  return (
    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 10V3L22 10M6 21h12a2 2 0 0 0 2-2v-6m-4 0h-4V9a2 2 0 0 0-2-2v2M6 9v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
