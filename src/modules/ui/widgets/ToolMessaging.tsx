// ToolMessaging — Toasts, Confirm, Sidebar Drag-n-Drop, StatusBar, TooltipSource, ChatMessage
import { createElement, useRef, useState } from 'react'
import type { ChatMessage } from '@/modules/tools/ToolAI'
import { Toasts, showToast } from './Toast'

export { Toasts as ToastContainer, showToast }

export function confirmDialog(props: { title: string; body: string; okText?: string; onOk: () => void; onCancel?: () => void }) {
  showToast('error', `Confirm: ${props.title}`)
  props.onOk()
}

export function StatusBar({ title, detail }: { title: string; detail?: string }) {
  return (
    <div className="sticky top-0 z-10 bg-gradient-to-r from-primary-600 to-emerald-500 text-white shadow-lg px-4 py-3 rounded-xl">
      <div className="font-semibold text-sm">{title}</div>
      {detail && <div className="text-xs opacity-90">{detail}</div>}
    </div>
  )
}

export function TooltipSource(props: { children: React.ReactNode; text: string; position?: 'top' | 'bottom' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  return (
    <div className="relative inline-block" ref={ref}
      onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}
      onTouchStart={() => setOpen((o) => !o)}>
      {props.children}
      {open && (
        <div className="absolute z-20 bg-slate-900 text-white text-xs rounded-lg px-2.5 py-1.5 max-w-[260px] shadow-xl">
          {props.text}
        </div>
      )}
    </div>
  )
}
export { createElement }
export type { ChatMessage }
