# PostHog Telemetry & Behavioral Audit (2026-10-16)

> **Audit Period**: Sept 26, 2026 – Oct 16, 2026 (20 days)  
> **PostHog Project**: 236166  
> **Dataset Scope**: **Real devices ONLY** (19 physical devices). All simulator/emulator telemetry filtered out.

---

## 1. Executive Summary

During this 20-day observation window, 19 physical devices accessed Happy across 7 international regions. While top-of-funnel engagement through the initial quiz was exceptionally high (100% completion across steps 0–5), severe drop-offs occurred at three friction points:
1. **Soft Paywall Trap (42.8% drop-off)**: V2 Paywall lacked an explicit close/dismiss button, trapping users who did not want to buy immediately.
2. **Apple Reviewer Loop (Pact Signing)**: Cupertino test device was trapped in a 4x loop between `lesson_complete` and `pact_signing`.
3. **Apple Sign-In Drop-off (60% drop-off)**: 5 users initiated Apple Sign-In, but only 2 converted to registered accounts; sheet heights clipped buttons and gave no error/cancellation feedback.
4. **Great Firewall Lockout (China)**: Shanghai and Guangzhou users encountered fatal `AuthRetryableFetchError` timeouts to Supabase on cold launch.

---

## 2. Key Baseline Metrics (Real Devices)

| Metric | Value | Benchmark / Target | Status |
|---|---|---|---|
| **Total Real Users** | 19 | — | Active baseline |
| **Onboarding Start $\rightarrow$ Step 5** | 100% (10/10) | $> 85\%$ | 🟢 Strong engagement |
| **Soft Paywall Completion** | 57.1% (4/7) | $> 80\%$ | 🔴 High drop-off (42.8% loss) |
| **Apple Sign-In Success Rate** | 40% (2/5) | $> 75\%$ | 🔴 60% failure/abandonment |
| **Crash / Lockout Rate (China)** | 100% (2/2) | $< 1\%$ | 🔴 Fatal network block |

---

## 3. Telemetry Documents in this Folder

- [cohort-breakdown.md](file:///Users/samuelprasad/Desktop/happy/journals/docs/telemetry/2026-10-16/cohort-breakdown.md) — Country-level distribution, user paths, and region-specific issues.
- [funnel-analysis.md](file:///Users/samuelprasad/Desktop/happy/journals/docs/telemetry/2026-10-16/funnel-analysis.md) — Step-by-step onboarding drop-off funnel and friction forensics.
- [event-catalog-and-queries.md](file:///Users/samuelprasad/Desktop/happy/journals/docs/telemetry/2026-10-16/event-catalog-and-queries.md) — HogQL queries, event schemas, and tracking definitions for the next audit.

---

## 4. Remediation Shipped on 2026-10-16

1. **Paywall Close Affordance**: Added visible header with "✕" button calling `goNext()` + `updateTrialStarted(false)` on `soft_paywall`.
2. **Pact Signing Hold Fallback**: Added tap-to-complete fallback and VoiceOver support on commitment button; disabled back button on pact.
3. **Apple Auth Feedback & Detents**: Increased sheet heights to 320pt/410pt (prevents button clipping) and wired error/cancel event telemetry.
4. **Offline / Great Firewall Fallback**: Added "Continue Offline" button to `AuthNetworkErrorScreen` and allowed guest mode on onboarding start.
