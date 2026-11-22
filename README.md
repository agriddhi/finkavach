# FinKavach AI — Personal Finance Assistant — Docs Pack

- **Created**: Tue Nov 19 2026 (mobile-first PWA, `finil/`)
- **Owner**: FinKavach AI
- **Version**: 1.0
- **Local dev**: http://localhost:4321
- **Repo**: https://github.com/agriddhi/finkavach

---

## 🎯 Quick Vision

> Personal AI assistant for Indian salaried users:
> **Shield Mode**: "Bachao" — SMS detection (OTP sharing, phishing links, account-blocked, UPI collect fraud)
> **Surgeon Mode**: "Badhao" — Tax & laziness calculator (Old vs New regime, tax engine, returns)
> **Chat Mode**: "Ask anything" — LLM-backed chatbot

> **Redesign note (Nov 2026)**: warm "Paper" + "Navy Night" planner themes, editorial ledger UI (hairlines, mono labels, flat fills, 10px radius), mobile-first shell (≥1024px sidebar / <1024px bottom tab bar), installable PWA, Gemini-backed chat.

---

## 🛡️ Team

| Member | Role | Contact |
|---|---|---|

---

## 🛠️ Dev Stack

| Layer | Choice |
|---|---|
| Frontend | React 18 + TypeScript + Tailwind CSS 4 + Vite 8 + framer-motion + lucide-react |
| UI style | Editorial ledger: hairline borders, flat fills, mono uppercase micro-labels, 10px radius, paper grain, washi-tape |
| Server | Vite Dev Server, Vercel (static PWA) |
| Database | Supabase PostgreSQL (planned) |
| Hosting | Vercel |
| AI | **Google Gemini** via OpenAI-compatible endpoint — primary `gemini-3.5-flash-lite`, fallback `gemini-3.5-flash` (`VITE_LLM_*` in `.env`) |

## 🚀 Quick Start

```bash
npm run dev       # -> http://localhost:4321
npm run build     # -> dist/
npm run preview   # -> serve dist/ (PWA SW registers only in prod)
```

---

## ✨ Features

- **Home**: personalised savings statement + regime ledger (RECOMMENDED sticker, savings ring), sticky note, quick actions
- **Compare / Surgeon**: Old vs New regime sliders (salary, HRA, 80C, NPS, home loan interest), savings band, breakdown modal
- **Shield**: SMS scan → SCAM / SAFE / NOT_SURE with evidence + actions (Do NOT click, Call 1930)
- **Chat**: Gemini Q&A grounded in user income, attaches rules-engine breakdown card
- **Learn / Profile**: lessons, themes (Paper / Navy Night / Auto)

---

## 🤖 AI Usage

- **Money math** is deterministic (TaxEngine) — AI explains, never computes.
- LLM: Google Gemini (OpenAI-compatible `/chat/completions`); key/model/base via `VITE_LLM_*` in `.env` (gitignored).

---

## 📱 PWA

- `public/manifest.json`, icons (`favicon-192.png`, `favicon-512.png`, `favicon.svg`, `img/`), `public/sw.js` (network-first + offline shell); service worker registers in production builds only.

---

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
| `VITE_LLM_API_KEY` | Gemini API key (chat) |
| `VITE_LLM_MODEL` | Primary chat model (`gemini-3.5-flash-lite`) |
| `VITE_LLM_MODEL_FALLBACK` | Fallback (`gemini-3.5-flash`) |
| `VITE_LLM_BASE_URL` | Gemini OpenAI-compatible base |

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
