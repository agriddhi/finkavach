// ToolSupport — help modal and notifications drawer
export interface ToolSupport {
  title: string
  body: string
  key: string
  tools: string[]
}

export const HELP_TOPICS: ToolSupport[] = [
  {
    key: 'what-is-finra',
    title: 'What is FinKavach?',
    tools: ['Surgeon', 'Shield'],
    body: 'FinKavach is your personal money co-pilot. Shield Mode screens your SMS for phishing and fraud; Surgeon Mode tells you your tax savings, laziness calculator, return metrics, and lets you chat with AI about your money.',
  },
  {
    key: 'surgeon-mode',
    title: 'Surgeon Mode — Your Money Gym',
    tools: ['Surgeon'],
    body: 'Upload your Form 16 PDF or bank statement (CSV), and the engine compares Old vs New tax regime in plain words, finds your lazy savings, and gives you a laziness estimate.',
  },
  {
    key: 'shield-mode',
    title: 'Shield Mode — SMS Bodyguard',
    tools: ['Shield'],
    body: 'Paste SMS messages you receive: new ones are tagged by a Rule-Based Detector. Messages flagged as phishing or fraud get a red alert. Say it\'s legit in chat, and the ToolDtool AI tooling records it as safe.',
  },
  {
    key: 'ai-chat',
    title: 'AI Chatbot',
    tools: ['Chat'],
    body: 'Ask anything about your money — "How to save tax?" — and it answers in a friendly Hinglish voice. Tip: the AI is designed to be transparent, show its reasoning, and never fabricate numbers you can verify in the app.',
  },
  {
    key: 'how-to-use-sms',
    title: 'How to use the SMS audit console',
    tools: ['Shield'],
    body: 'Paste the text of the SMS or screenshot — one per line. The Detector runs deterministically. Spam verdicts appear as red chips, spam vertices are labeled with reason: e.g. \'phishing: holds urllike\'. You can click "Mark as safe" which records it in the UserProfile store.',
  },
]
