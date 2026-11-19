// Dtool — ToolDtool: authoring-time tool abstraction ("plug a module into the graph")
// See docs/plan.md — ToolDtool, ToolAIUsage
export type ToolName =
  | 'UserProfile'
  | 'UserPrefs'
  | 'Sessions'
  | 'Tools'
  | 'Firebase'
  | 'Palette'
  | 'UserProfileData'
  | 'UserProfileAPI'
  | 'Safematic'

export type ToolID =
  | 'ToolMessaging'
  | 'ToolIngester'
  | 'ToolAI'
  | 'StreamChatModule'
  | 'AuditSmsConsole'
  | 'IncomingSms'
  | 'DetectorConfig'
  | 'AttackSignatures'
  | 'TaxEngine'
  | 'TaxData'
  | 'LazinessCalculator'
  | 'ReturnMetrics'
  | 'RealTimeRankingEngine'
  | 'CDChecker'
  | 'LazinessCalc'
  | 'LandmarksModule'
  | 'CDChecker'
  | 'UserPrefs'
  | 'ToolSafematic'

export type Tools = ToolID[]

export type ToolMode = 'both' | 'chatbot' | 'visual'

export interface Tool {
  id: ToolID
  name: ToolName
  tools?: ToolID[]
  url?: string
}
