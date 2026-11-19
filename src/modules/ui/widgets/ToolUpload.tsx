// ToolUpload — file upload UI + useUploadFile hook
import { useState } from 'react'
import { Card, CardHeader } from './Table'
import { showToast } from './ToolMessaging'
import { callLLM } from '@/modules/tools/ToolAI'
import { uploadCSV } from '@/modules/surgeon/CDChecker'

export function useUploadFile() {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle')
  const upload = async (file: File) => { setStatus('uploading'); await new Promise((r) => setTimeout(r, 10)); setStatus('done') }
  return { status, upload }
}

export function TextInput({ value, onChange, placeholder, className }: { value: string; onChange?: (v: string) => void; placeholder?: string; className?: string }) {
  return <input value={value} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder} className={`w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${className}`} />
}

export function FileInput({ onChange }: { onChange: (f: File | null) => void }) {
  return <input type="file" onChange={(e) => onChange(e.target.files?.[0] ?? null)} accept="text/*,.csv,.xlsx" className="w-full text-sm text-slate-600 file:bg-emerald-600 file:text-white file:rounded file:px-2 file:py-1.5" />
}

export function CDCheckerUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<{ header: string; rows: any[] } | null>(null)
  const { status, upload } = useUploadFile()
  async function pick() {
    if (!file) return
    await upload(file)
    try {
      const parsed = await uploadCSV(file)
      setPreview(parsed)
      const explain = await callLLM(
        `Explain these billing items in 5 words each and flag the suspicious ones:\n` + parsed.rows.slice(0, 25).map((r) => `${r.description} (${r.amount})`).join('\n'),
        'gpt-4o-mini',
        '',
      )
      showToast('info', 'Explained' + (explain ? `: ${explain.slice(0, 200)}` : ''))
    } catch {
      showToast('error', 'Parse failed')
    }
  }
  return (
    <Card>
      <CardHeader><h4 className="font-semibold">Upload CD checker file</h4><span className="text-xs text-slate-500">CSV/XLSX (Safe + Verification required)</span></CardHeader>
      <FileInput onChange={setFile} />
      <Button className="mt-3" onClick={pick} disabled={status === 'uploading'}>Upload &amp; Parse</Button>
      {preview && <pre className="mt-3 text-xs overflow-x-auto">{JSON.stringify(preview, null, 2).slice(0, 900)}</pre>}
    </Card>
  )
}

function Button({ children, onClick, className, disabled }: { children: React.ReactNode; onClick?: () => void; className?: string; disabled?: boolean }) {
  return <button onClick={onClick} disabled={disabled} className={`px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-sm ${className}`}>{children}</button>
}
export { Button }

