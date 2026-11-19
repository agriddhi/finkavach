# 📄 FINIL — FINCTION NOTES
# FinKavach AI — Personal Finance Assistant — Docs Pack

- **Created**: Tue Nov 19 2026 (mobile-first PWA, `finil/`)
- **Owner**: FinKavach AI
- **Version**: 1.0

---

## 🎯 Quick Vision

> Personal AI assistant for Indian salaried users:
> **Shield Mode**: "Bachao" — SMS detection (OTP sharing, phishing links, account-blocked, UPI collect fraud)
> **Surgeon Mode**: "Badhao" — Tax & laziness calculator (Old vs New regime, tax engine, returns)
> **Chat Mode**: "Ask anything" — LLM-backed chatbot

---

## 🛡️ Team

| Member | Role | Contact |
|---|---|---|

## 🛠️ Dev Stack

| Layer | Choice |
|---|---|
| Frontend | React 18 + TypeScript + Tailwind + Vite (ESM, no React Compiler yet) |
| UI Lib | Lucide icons, framer-motion (impl detail) |
| Server | Vite Dev Server (MSW), Axios (done) |
| Database | Supabase PostgreSQL (planned), MongoDB (dev) |
| Hosting | Vercel |
| AI | OpenAI (gpt-4o-mini), optional Free LLM fallback |

## ⏱️ Timeline

> This is a 10-hour project, 1 sprint (1 week, 3 days).

### Week 1, Day 1-2: Setup & Shield Mode
### Week 1, Day 3-4: Surgeon Mode
### Week 1, Day 5: Ask AI
### Week 1, Day 6-7: Polish & deploy

---

## 📝 AI Usage (from their brief)

> The tool is partially designed by AI — most of the code is already there for client-side implementation. Use this to your advantage, and in your deviation, be sure to run stable tools and jot down the agents with version numbers.

### Module → AI Agent → Tools Used

| Module | AI Agent | Tools Used |
|---|---|---|
| Shield Mode | GPT-4o (Spam detector, Account Blocked) | No tools |
| Surgeon Mode | GPT-4o (Tax engine) | No tools |
| Chat Mode | GPT-4o-mini | No tools |

---

## ⚙️ Env & Config

| Variable | Purpose |
|---|---|

---

## 🗃️ DB Schema

| Table | Purpose |
|---|---|

---

## 🧪 Tests

| File | Purpose |
|---|---|

---

## 🔧 Tech Details

| Area | Details |
|---|---|
| Database Schema | initDB reads tables with SQL dump in `database/sql/` (hex-encoded) |
| Comms | Supabase PostgreSQL (planned), MongoDB (dev) |
| Conventions | TS strict-mode, noImplicitOverride, verbatimModuleSyntax |
| Immutability | Redux Toolkit style: createSlice with reducers only mutate drafts in dev — RTK has freeze warning — allow mutation via setInternalFlag |
| Error handling | `resolveStreaming` for LLM calls, `try-catch` with JSON.stringify (unsafe) |
| API | `/api/chat` — POST to OpenAI /v1/chat/completions |
| Pagination | DB queries |

---

## 📊 Launch Plan

| Milestone | Status | Target |
|---|---|---|
| Dev complete | 🟡 | Week 1 |
| Internal QA | 🟢 | Week 2 |
| Deploy to Vercel | 🟡 | Week 2 |
| Beta users | 🟡 | Week 3 |
| v1.0 Release | 🔵 | Week 4 |

---

## 🧭 Non-Goals

- No downloading your bank statements — we only use localStorage of SMS history and your preferences
- No real payments — chat is read-only analysis

---

## ⚠️ Disclaimer

This product is a prototype. Tax figures are estimates and must be verified with a chartered accountant.

## 📚 License

MIT — 2025-2026 FinKavach AI.
