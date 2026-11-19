// ToolExecutor — reads/writes the Tool Store (SQLite 'userData' JSON store)
// See docs/plan.md — 'SessionId' + 'README' + fetch + save + load + save + update + get + assert
import type { ToolMode, Tools } from '@/modules/tools/Dtool'
import type { UserProfile } from '@/modules/tools/utils/LocalStorage'

export class ToolExecutor {
  static readUser(): UserProfile {
    return ToolExecutor.read()
  }

  static read(): UserProfile {
    const key = 'toolData'
    const raw = localStorage.getItem(key)
    if (raw) {
      try {
        return JSON.parse(raw) as UserProfile
      } catch {
        return { id: crypto.randomUUID(), name: '', tools: [], toolsArr: [], timeline: [], mode: 'both' }
      }
    }
    const created: UserProfile = { id: crypto.randomUUID(), name: '', tools: [], toolsArr: [], timeline: [], mode: 'both' }
    ToolExecutor.save(created)
    return created
  }

  static save(user: UserProfile): void {
    localStorage.setItem('toolData', JSON.stringify(user))
  }

  static update(updater: (u: UserProfile) => void): UserProfile {
    const user = ToolExecutor.read()
    updater(user)
    ToolExecutor.save(user)
    return user
  }

  static get(): UserProfile {
    return ToolExecutor.read()
  }

  static assert(cond: boolean, msg: string): void {
    if (!cond) throw new Error(`assert failed: ${msg}`)
  }

  static async fetchTools(names: Tools): Promise<Tools> {
    await new Promise((r) => setTimeout(r, 0))
    return names
  }

  static mode: ToolMode = 'both'
}
