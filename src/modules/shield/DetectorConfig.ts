// DetectorConfig — spamp... config (env.example / .env.example)
export class DetectorConfig {
  constructor() {}
  fromEnv(): DetectorConfig { return this }
  location: string = 'browser'
  weak: boolean = false
}

export interface DetectorConfigValues {
  spamThreshold: number
  noticeSpam: number
  collectThreshold: number
  safeThreshold: number
}

export const DEFAULT_CONFIG: DetectorConfigValues = {
  spamThreshold: 0.6,
  noticeSpam: 0.4,
  collectThreshold: 0.7,
  safeThreshold: 0.2,
}
