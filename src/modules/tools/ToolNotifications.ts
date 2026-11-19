// ToolNotifications — notification/toast store
export interface ToolNotification {
  id: string
  title: string
  body: string
  priority: number
  openedAt: Date
}

export function fireNotification(t: Omit<ToolNotification, 'id' | 'openedAt'>): ToolNotification {
  const n: ToolNotification = { ...t, id: crypto.randomUUID(), openedAt: new Date() }
  return n
}
