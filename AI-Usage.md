# AI Usage Disclosure — FinKavach AI

> The tool is partially designed by AI — most of the code is already there for client-side implementation. We used stable tools and jotted down the agents with version numbers.

## AI Agents Used

| Agent | Model | Tools Used | Scope |
|---|---|---|---|
| GPT-4o | OpenAI (current) | — | Codebase scaffold, Shield Mode logic, Surgeon tax engine (rules engine) |
| GPT-4o-mini | OpenAI (current) | — | Chat Mode responses |
| Claude 3.5 Sonnet | Anthropic (planned) | — | Alternative LLM |

## Version History

| Date | Version | Description |
|---|---|---|
| 2026-11-19 | 1.0 | Initial scaffold, Shield detector, Surgeon tax engine, chat mode. |

## Human Decision Points

The AI made suggestions; humans made final calls on:
- Product name, theme, and positioning ("Bachao bhi, Badhao bhi")
- Design palette & UX flow
- Architecture decisions (Vite/TS/React, Supabase as planned DB)
- Tax slabs verification (with sources)

## AI Limitations & Verification

- All money numbers are computed by deterministic rules engines (not AI).
- LLM never generates money figures or tax computations.
- Tax slabs verified with source URLs and dates (see docs/tax-slabs.md).

## Tests & Metrics

- Unit tests: `npm run test` (vitest)
- E2E: `npm run e2e` (Playwright)
- Coverage: 80%+ target.
