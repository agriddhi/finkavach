// Firebase — FirebaseConfiguration (Mock for hackathon; Firebase app on Product)
export interface FirebaseConfig {
  name: string
  kind: string
  field: string
  value: any
  inputs?: string[]
  dapp?: string
  connectedAt: number
}

export class Firebase {
  static stored(): FirebaseConfig[] {
    return JSON.parse(localStorage.getItem('firebase') ?? '[]')
  }
  static append(f: FirebaseConfig) {
    localStorage.setItem('firebase', JSON.stringify([...Firebase.stored(), f]))
  }
  static registerSmsSink(id: string) {
    Firebase.append({ name: id, kind: 'WebRTC', field: 'userInfo', value: null, connectedAt: Date.now() })
  }
  static async send(from: string, to: string, body: string) {
    const h = JSON.parse(localStorage.getItem('smsHistory') ?? '[]')
    h.push({ sms: body, sender: from })
    localStorage.setItem('smsHistory', JSON.stringify(h))
    return { sent: true }
  }
}
export const DB_SCHEMA = 'finobbs'
export const DB_VERSION = 1
