// LocalStorage-backed user data (ToolExecutor store shape, mirrors docs/plan.md)
import type { ToolMode } from '@/modules/tools/Dtool'

export interface UserProfile {
  id: string
  name: string
  tools: string[]
  toolsArr: { id: string; name: string; toolIds: string[]; created: number; enabled: boolean }[]
  timeline: { id: string; time: string; metadata: any }[]
  mode: ToolMode
}

export interface UserPrefs {
  acRole: number
  llmApiKey: string
  mmProbeApiKey?: string
}

export interface UserProfileAPI {
  username: string
  email: string
  llmApiKey: string
  toolsCount?: number
}

export interface ToolPayload {
  json: { tools?: any[]; safe: any[]; created: number; name: string }
}
