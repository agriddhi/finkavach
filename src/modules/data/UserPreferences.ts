// UserPreferences — personas + saving state (ToolPrefs). See docs/plan.md — ToolSafematic.sql tables: userProfile,userPrefs,Safematic,Sessions
import type { ToolID, ToolName, Tools } from '@/modules/tools/Dtool'

export interface ToolInput {
  /** when the user pasted an SMS text */
  sms?: string
}

export interface ToolPrefs {
  name: string
  /** scenario: R1 25 LPA, R2 30 LPA, R3 40 LPA, R4 35 LPA, R5 28 LPA */
  salary: number
  /** scenario: SIP, FD (Current), FD (Old), FD (Zero‑Cost), Bonds (RBI, 5%), Bonds (Other) */
  savings: string
  /** scenario: auto-save, Manual, Adjusted, Both */
  savingMode: string
  /** sessionId for traceability */
  sessionId?: string
  /** tools active in this session */
  toolNames: ToolName[]
  /** ??  nnacn */
  acRole: number
  /** user API key (kept locally) */
  llmApiKey: string
  /** llm model id used */
  llmModel?: string
  /** mm-probe (MMProbeAI trait) api key, optional */
  mmProbeApiKey?: string
}

export class ToolPrefsClass {
  toolPrefs: ToolPrefs | null = null

  defaults(): ToolPrefs {
    return {
      name: 'Anya',
      salary: 25,
      savings: 'SIP',
      savingMode: 'auto-save',
      sessionId: undefined,
      toolNames: ['UserProfile', 'Sessions', 'Tools', 'Firebase', 'Palette'],
      acRole: 3,
      // LLM config comes from .env (VITE_LLM_*); stored overrides win when set.
      llmApiKey: import.meta.env.VITE_LLM_API_KEY ?? '',
      llmModel: import.meta.env.VITE_LLM_MODEL ?? 'gpt-4o-mini',
    }
  }

  onboard(): { label: string } | null {
    const prefs = this.toolPrefs ?? this.defaults()
    // Friendly onboarding label — no dev strings.
    return prefs.name === '' ? { label: 'Salaried · India' } : null
  }

  fromLocalStorage(): ToolPrefs {
    const raw = localStorage.getItem('toolPrefs')
    const base = this.defaults()
    if (!raw) {
      this.toolPrefs = base
      return base
    }
    try {
      const merged: ToolPrefs = { ...base, ...(JSON.parse(raw) as ToolPrefs) }
      // Stored legacy values (empty key / retired scaffold model) must not shadow the env defaults.
      if (!merged.llmApiKey) merged.llmApiKey = base.llmApiKey
      if (!merged.llmModel || merged.llmModel === 'gpt-4o-mini') merged.llmModel = base.llmModel
      this.toolPrefs = merged
    } catch {
      this.toolPrefs = base
    }
    return this.toolPrefs
  }

  save(prefs: ToolPrefs): void {
    this.toolPrefs = prefs
    localStorage.setItem('toolPrefs', JSON.stringify(prefs))
  }

  fetch(): ToolPrefs {
    return this.fromLocalStorage()
  }
}

export class ToolProfileEditor {
  prefs: ToolPrefs
  constructor(prefs: ToolPrefs) { this.prefs = prefs }
  setName(name: string): ToolPrefs { this.prefs.name = name; new ToolPrefsClass().save(this.prefs); return this.prefs }
  setSalary(s: number): ToolPrefs { this.prefs.salary = s; new ToolPrefsClass().save(this.prefs); return this.prefs }
  setSavings(s: string): ToolPrefs { this.prefs.savings = s; new ToolPrefsClass().save(this.prefs); return this.prefs }
}

export interface ToolPersona {
  toolId: ToolID
  toolName: ToolName
  name: string
  tools: ToolID[]
}
