# E2E Plan — FinKavach AI

## Tools

- Playwright (primary, chromium-only in this repo)
- For manual verification: Chrome DevTools / Console

## Run Playwright

```bash
cd finil
npx playwright test --headed
```

Or to see the test output live, or install browsers first:

```bash
npx playwright install chromium --with-deps
```

## What to Test (manual, quick smoke)

1. **Shield Mode**
   - Paste a phishing SMS (e.g., "Hello, this is Axis Bank. Your account is blocked. Click https://ax-ismail.in/v2/?next=/kyc to unblock. OTP 112233")
   - Click "Analyze" → Expect: verdict shows `SCAM` with reason mentioning "Phishing URL (fraud link)"
   - Click "Mark as safe" → changes label to `SAFE`
   - Paste legit SMS: "SBI CSG 372: OTP 112233 for UPI @MUMPS. Verified successfully."
   - Click "Analyze" → Expect: verdict shows `SAFE`

2. **Surgeon Mode**
   - Look at the stat card: ₹0 or some tax savings value.
   - Click "Ask AI" → chat opens.

3. **Ask AI Mode**
   - Send: "Hello" → expect an assistant reply (or error message if no key set).
   - Send: "Am I paying too much tax?" → assistant replies with a tax answer.

## Automated (Playwright)

| Test | File | Notes |
|---|---|---|
| Shield | `tests/shield.spec.ts` | Analyze phishing → expect SCAM chip; analyze legit → expect SAFE chip |
| Surgeon | `tests/surgeon.spec.ts` | Visit /surgeon → expect ₹ amount rendered |
| Ask AI | `tests/chat.spec.ts` | Send message → expect assistant bubble appears |

Run: `npx playwright test --headed --screenshot on --verbose`
