# Threat Model — FinKavach AI

## Trust Zones

| Zone | Description |
|---|---|
| User | The authenticated user |
| App | The FinKavach PWA (private zone) |
| Public | Internet-facing (Vercel / Netlify / Firebase hosting) |

## Trust Boundaries

| Boundary | Data Flow | Protection |
|---|---|---|
| Public ↔ App | API requests to /api/* endpoints | Server-side validation, CORS, rate limits |
| App ↔ User | WebSocket/WebAPI to browser | Signatures on WebSockets (if enabled), HTTPS |
| App ↔ Database | Supabase PostgreSQL, MongoDB | Access tokens, restricted user scopes |

## Attack Vectors & Mitigations

| Attack | Impact | Mitigation |
|---|---|---|
| Prompt Injection | AI gives wrong advice | Structured outputs, human-in-the-loop for critical actions, clear disclaimers |
| XSS | Session theft | React default (no dangerouslySetInnerHTML), DOMPurify for markdown |
| CSRF | State-changing actions | SameSite cookies, CSRF tokens |
| Dependency Confusion | Malicious package injection | Pin versions in lockfile, audit dependencies weekly |
| API key exposure | Key leaks | Store in env, NEVER in frontend — use backend for all AI calls |
| Database injection | Data theft | Parameterized queries, input validation with zod |
| Data integrity | Bad financial data | Input validation, manual review flows, audit logs |
| DoS | Service disruption | Rate limits, circuit breakers, monitoring |
| Supply chain attacks | Malware injection | Only use dependencies from trusted vendors, SBOM (Software Bill of Materials), regular audits |

## Security Testing Schedule

| Activity | Frequency | Owner |
|---|---|---|
| Manual penetration testing | Weekly | Security |
| Static analysis | Daily (CI) | Dev |
| Dynamic analysis (fuzzing) | Weekly | Security |
| Automated scans | Daily (CI) | Dev |
| Manual reviews | Weekly (SAST) | Dev |
| Threat modeling reviews | Bi-weekly | Security |

## Data Storage & Retention

| Data | Retention | Notes |
|---|---|---|
| User data | Until deletion | 30-day retention after account deletion |
| Audit logs | 90 days | Required for compliance |
| Financial data | Retention policy | Until user explicitly deletes |

## Incident Response

| Incident | Response Time | Owner |
|---|---|---|
| Critical security incident | ≤ 24 hours | Security Lead |
| Non-critical incident | ≤ 7 days | Security Lead |
| Data breach notification | 30 days | Legal Team |

## Compliance

| Area | Required | Status |
|---|---|---|
| PCI DSS | N/A | N/A |
| SOC 2 Type II | Planned | In progress |
| ISO 27001 | Planned | Pending |
