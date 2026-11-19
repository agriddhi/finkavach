// ToolNotifications — notification/toast store (rewritten to avoid dup exports)
export interface ToolNotification {
  id: string
  title: string
  body: string
  priority: number
  openedAt: Date
}

export function fireNotification(t: Omit<ToolNotification, 'id' | 'openedAt'>): ToolNotification {
  return { ...t, id: crypto.randomUUID(), openedAt: new Date() }
}
