// AttackSignatures — heuristic spam signatures (spamSignatures.js analog)
// Each entry: required = any-one-of substrings (lowercase), exempt = vetoes.
export interface Signature {
  kind: string
  required: string[]
  exempt?: string[]
  severity: number
  action: string
  any?: boolean // if true, any substring matches (ignore other required)
}

export class AttackSignatures {
  readonly rules: Signature[] = [
    {
      kind: 'Phishing URL (fraud link)',
      required: ['http://', 'https://', 'www.'],
      any: true,
      exempt: ['axismail.in', 'google.com', 'paytm.com', 'gpay.google', 'drive.google', 'kotak.com', 'amazon.in'],
      severity: 0.75,
      action: 'Do NOT click the link. Check the link with the bank\'s app.',
    },
    {
      kind: 'Request for OTP/PIN/CVV (impossible for Banks)',
      required: ['send the otp', 'share the otp', 'forward the otp', 'share otp', 'forward otp', 'text the otp', 'tell me the otp', 'send otp', 'give me the otp'],
      any: true,
      severity: 0.95,
      action: 'Banks never ask for OTP. Call 1930, verify on your card.',
    },
    {
      kind: 'Fake domain (typosquat)',
      required: ['secure', 'unblock', 'kyc', 'verify', 'login'],
      exempt: ['idfc', 'fdp'],
      severity: 0.65,
      action: 'URL looks like your bank but domain is different — verify before clicking.',
    },
    {
      kind: 'Collect request (fraud payment)',
      required: ['pay to', 'approve', 'approved', 'approval', 'payment request', 'collect', 'only appor', 'don\'t pay unless', 'don\'t approve'],
      exempt: ['pay to: me', 'self', 'your bank'],
      any: true,
      severity: 0.8,
      action: 'Never pay without verification. Verify via your bank\'s app.',
    },
    {
      kind: 'Brand impersonation (high pressure)',
      required: ['urgent', 'IMPORTANT', 'ALERT', 'ACTION REQUIRED', 'COMPROMISED', 'EXPIRED'],
      exempt: ['definitely not', 'verify before', 'safe'],
      any: true,
      severity: 0.55,
      action: 'If the message claims to be from your bank, call them.',
    },
    {
      kind: 'Phone call lead (fraud attempt)',
      required: ['call on', 'call this number', 'ring me', 'dial', 'call me', 'resolve with'],
      exempt: ['upi@ybl', 'truebl', 'resolve with me'],
      any: true,
      severity: 0.75,
      action: 'Never call the number — it is a fraudster.',
    },
  ]
}
