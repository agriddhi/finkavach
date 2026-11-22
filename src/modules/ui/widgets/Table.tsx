import * as React from 'react'
import { Shield, User, Plus, Minus, ChartBar, Settings, Bell, Languages, Star } from 'lucide-react'

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-[10px] border p-4 ${className}`} style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: '0 1px 2px rgba(20,32,58,0.04)' }}>{children}</div>
}
export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="flex justify-between items-center mb-4">{children}</div>
}
export function Table({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <table className={`w-full text-sm table-fixed rounded-lg ${className}`}><tbody>{children}</tbody></table>
}
export function TableRow({ children, highlighted }: { children: React.ReactNode; highlighted?: boolean }) {
  return <tr className={highlighted ? 'bg-emerald-50' : ''}>{children}</tr>
}
export function TableCell({ children }: { children: React.ReactNode }) {
  return <td className="border-b border-slate-100 py-1.5 text-slate-700">{children}</td>
}
export function TableHeadCell({ children, align = 'start' }: { children: React.ReactNode; align?: 'start' | 'end' }) {
  return <th className={`border-b border-slate-200 font-medium text-slate-500 text-${align}`}>{children}</th>
}
export function TableRowPadder({ count }: { count: number }) {
  return <tr className="bg-slate-50"><td className="font-bold text-slate-900" colSpan={count}>Total</td></tr>
}
export const Button = ({ children, onClick, className = '', disabled }: { children: React.ReactNode; onClick?: () => void; className?: string; disabled?: boolean }) => (
  <button onClick={onClick} disabled={disabled} className={`btn-primary ${className}`}>{children}</button>
)
export const Input = ({ type = 'text', value, onChange, placeholder, className = '', id }: { type?: string; value: string; onChange?: (v: string) => void; placeholder?: string; className?: string; id?: string }) => (
  <input id={id} type={type} value={value} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder} className={`w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${className}`} />
)
export function Ratings({ rating, max = 5, onRate, size = 24 }: { rating: number; max?: number; onRate?: (v: number) => void; size?: number }) {
  return (
    <div className="flex gap-1 items-center">
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} onClick={() => onRate?.(i + 1)} className="cursor-pointer" aria-label="star" title="star">
          <Star className="inline-block" width={size} height={size} strokeWidth={2} fill={i < rating ? '#F59E0B' : 'none'} color={i < rating ? '#F59E0B' : '#CBD5E1'} />
        </span>
      ))}
      <span className="ml-1 text-sm text-slate-600">{rating}</span>
    </div>
  )
}
export function Radio({ label, value, group, setValue }: { label: string; value: string; group: string; setValue: (v: string) => void }) {
  return (
    <label className="block cursor-pointer px-3 py-2 rounded-lg border-2 border-slate-200 hover:border-emerald-400 transition-colors">
      <input type="radio" name={group} value={value} checked={false} onChange={() => setValue(value)} className="sr-only" />
      <span className="text-sm text-slate-700 flex items-center gap-2"><span className="w-4 h-4 rounded-full border-2 border-slate-400 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-all" /> {label}</span>
    </label>
  )
}
export function Icons({ variant }: { variant: string }) {
  const labels: Record<string, string> = { 'Completion Status': 'Completion Status', 'Detection Status': 'Detection Status', 'SMS Status': 'SMS Status' }
  return <span className="text-xs text-slate-500">{labels[variant] ?? variant}</span>
}
export const IconsFixed = { Shield, User, Plus, Minus, ChartBar, Settings, Bell, Languages }
export { ChartBar, Settings, Bell }
export function DnD({ children, title, subtitle }: { children?: React.ReactNode; title: string; subtitle?: string; defaultOpen?: boolean }) {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="card">
      <h4 className="font-semibold">{title}</h4>
      {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      <div className="mt-3 space-y-2">{open ? children : null}</div>
      <button onClick={() => setOpen(!open)} className="mt-2 text-xs text-emerald-600">{open ? 'Collapse' : 'Expand'}</button>
    </div>
  )
}
export function Sidebar({ title, subTitle, date }: { title: string; subTitle?: string; date?: string }) {
  return (
    <aside className="card">
      <h4 className="font-semibold">{title}</h4>
      {subTitle && <p className="text-xs text-slate-500 mt-1">{subTitle}</p>}
      {date && <p className="text-xs text-slate-400 mt-1">{date}</p>}
    </aside>
  )
}
export function Login({ name, userProfileId }: { name: string; userProfileId: string }) {
  return <div className="card">{name} — {userProfileId}</div>
}
export function ToolSupport({ title, body, key }: { title: string; body: string; key: string }) {
  return <div className="card"><h4 className="font-semibold mb-1">{title}</h4><p className="text-sm text-slate-600">{body}</p></div>
}
export function ToolSupportHome({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
export function Stripe() { return <hr className="border-slate-200" /> }
export function ScrollTo({ to }: { to: string }) {
  return <button onClick={() => document.getElementById(to)?.scrollIntoView({ behavior: 'smooth' })} className="text-xs text-emerald-600 underline">Scroll to {to}</button>
}
export function Panes({ children, title }: { children?: React.ReactNode; title?: string }) {
  return <div className="card">{title}<div className="mt-2">{children}</div></div>
}
export function PaneGroup({ children }: { children: React.ReactNode }) { return <div className="space-y-4">{children}</div> }
export function Main() { return null }
export function ToastIcon() {
  return (
    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 10V3L22 10M6 21h12a2 2 0 0 0 2-2v-6m-4 0h-4V9a2 2 0 0 0-2-2v2M6 9v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
export function Confirm({ children, value, onChange, id }: any) {
  return <input data-tool-id={id} />
}
export function useRatings() { return { ratings: [] as number[], setRatings: () => {} } }
