// Ingestor — SMS ingester + parses real world bank SMS
export interface SMSMetadata {
  id: string
  timestamp: number
  sender: string
  body: string
  type: string
}

const KINDS = {
  // type => { regexes for extraction of interesting fields }
  collect: [/pay to[:=]?\s*([^.\n]+)/i, /\b(collect|approve|approval)\b[:\s]+?([^.\n]+)/i],
  phishing: [/\b(go|visit|click|open)\b[^.\n]*\b(link|website|url|site|URL)\b/i],
  otp: [/\b(otp|passcode|pin|cvv|PIN\b|\d{4,8})\b/i],
  urgent: [/\b(URGENT|IMPORTANT|ACTION REQUIRED|COMPROMISED|EXPIRED|ALERT)\b/i],
}

export class Ingestor {
  private static seq = 0
  static ingest(smsText: string): SMSMetadata[] {
    return smsText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((body) => ({
        id: `sms-${++Ingestor.seq}-${Date.now().toString(36)}`,
        timestamp: Date.now(),
        sender: detectSender(body),
        body,
        type: 'generic',
      }))
  }
}

function detectSender(body: string): string {
  const m = body.match(/^\s*(?:from:?\s*)?([A-Za-z0-9\-_' ]{2,20}[A-Za-z])(?=\s|:)/)
  return m?.[1]?.trim() ?? 'unknown'
}
