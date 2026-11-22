// ToolAI — the LLM entry point. Calls an OpenAI-compatible /chat/completions
// endpoint (see docs/design-system.md 'API request/response shape') and
// validates the answer shape. Graceful fallback when no key is set.
//
// Endpoint / model / key default to the VITE_LLM_* values in .env and can be
// overridden per call (stored user preferences win when set). On a transient
// provider error (429/5xx) we retry once with the configured fallback model.

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

const envBase: string = import.meta.env.VITE_LLM_BASE_URL ?? 'https://api.openai.com/v1'
const envModel: string = import.meta.env.VITE_LLM_MODEL ?? 'gpt-4o-mini'
const envKey: string = import.meta.env.VITE_LLM_API_KEY ?? ''
const envFallbackModel: string = import.meta.env.VITE_LLM_MODEL_FALLBACK ?? ''

function trimSlash(url: string): string {
  return url.replace(/\/+$/, '')
}

async function attempt(
  prompt: string,
  model: string,
  key: string,
  baseURL: string,
): Promise<{ out: string | null; retryable: boolean }> {
  try {
    const res = await fetch(`${trimSlash(baseURL)}/chat/completions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 600,
      }),
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) {
      return { out: null, retryable: res.status === 429 || res.status >= 500 }
    }
    const j = await res.json()
    return { out: j?.choices?.[0]?.message?.content ?? null, retryable: false }
  } catch {
    return { out: null, retryable: false }
  }
}

export async function callLLM(
  prompt: string,
  model?: string,
  key?: string,
  baseURL?: string,
): Promise<string | null> {
  const base = (baseURL ?? '').trim() || envBase
  const k = (key ?? '').trim() || envKey
  const m = (model ?? '').trim() || envModel
  if (!k) return null

  const first = await attempt(prompt, m, k, base)
  if (first.out !== null) return first.out
  if (first.retryable && envFallbackModel && envFallbackModel !== m) {
    const second = await attempt(prompt, envFallbackModel, k, base)
    if (second.out !== null) return second.out
  }
  return null
}

export class ToolAI {
  static async chat(prompt: string, model?: string, key?: string): Promise<string | null> {
    const out = await callLLM(prompt, model, key)
    if (!out) return null
    return out.trim().slice(0, 800)
  }
}
