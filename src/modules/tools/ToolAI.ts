// ToolAI — the LLM entry point. Calls an OpenAI-compatible /chat/completions
// endpoint (see docs/design-system.md 'API request/response shape') and
// validates the answer shape. Graceful fallback when no key is set.
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export async function callLLM(prompt: string, model: string, key: string): Promise<string | null> {
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
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
    const j = await res.json()
    return j?.choices?.[0]?.message?.content ?? null
  } catch {
    return null
  }
}

export class ToolAI {
  static async chat(prompt: string, model: string, key: string): Promise<string | null> {
    const out = await callLLM(prompt, model, key)
    if (!out) return null
    return out.trim().slice(0, 800)
  }
}
