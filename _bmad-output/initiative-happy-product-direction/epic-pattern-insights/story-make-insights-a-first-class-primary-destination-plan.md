---
title: "Make Insights a first-class primary destination"
type: "feature"
ticket: 5
created: "2026-10-16"
status: "built"
baseline_revision: "8da06ecc985c2f81dc23d4c820831583fc061734"
route: "oneshot"
route_source: "auto"
review: "quick"
review_source: "pinned"
lenses_ran: ["quick"]
review_loop_iteration: 0
context:
  - "/Users/samuelprasad/Desktop/happy/journals/PRODUCT.md"
  - "/Users/samuelprasad/Desktop/happy/journals/DESIGN.md"
  - "/Users/samuelprasad/Desktop/happy/journals/_bmad-output/initiative-happy-product-direction/spec-happy-product-direction/spec-happy-product-direction.md"
  - "/Users/samuelprasad/Desktop/happy/journals/app/tabs/(tabs)/_layout.tsx"
  - "/Users/samuelprasad/Desktop/happy/journals/app/_layout.tsx"
  - "/Users/samuelprasad/Desktop/happy/journals/app/tabs/screens/(recording)/record.tsx"
  - "/Users/samuelprasad/Desktop/happy/journals/app/tabs/screens/(recording)/_layout.tsx"
  - "/Users/samuelprasad/Desktop/happy/journals/src/screens/JournalCalendarScreen/JournalCalendarScreen.tsx"
  - "/Users/samuelprasad/Desktop/happy/journals/src/screens/DiscoveryScreen/DiscoveryView.tsx"
  - "/Users/samuelprasad/Desktop/happy/journals/src/components/insights/InsightNudgeCard.tsx"
  - "/Users/samuelprasad/Desktop/happy/journals/src/screens/DailyNotesScreen/notes/EntryCardsView.tsx"
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Insights already provides deterministic readiness and pattern views, but the primary shell spends a destination on Capture while Insights remains hidden behind the legacy Tracking route. This makes a core product outcome harder to discover and leaves Capture without a natural Home entry point.

**Approach:** Replace the permanent Capture tab with the existing canonical Insights tab, add a localized Capture toolbar action to Home, and preserve Journal’s existing capture actions and the legacy Tracking route as compatibility paths. Do not change insight evidence, readiness thresholds, privacy boundaries, or capture behavior.

</frozen-after-approval>

## Implementation Notes

This is a bounded navigation slice: the existing Insights screen already owns the loading, insufficient-data, and ready states; Journal already owns its add actions. The only new behavior is primary-shell discoverability and a Home capture entry.

- The native tab navigator only registers routes represented by `NativeTabs.Trigger`. Capture therefore moved to `/tabs/screens/record` in the existing recording stack so Home and Journal actions remain navigable after Capture leaves the primary shell.
- The existing CAP-4 readiness-model gap reported by review predates this navigation change and remains outside this ticket's frozen boundary; this ticket preserves the existing deterministic evidence rules and surfaces them through the primary destination.
- The full TypeScript check remains baseline-noisy, including the pre-existing `app/tabs/screens/(recording)/journal-entry.tsx:27` error; filtering diagnostics to changed files produced no TypeScript errors.
- The final Capture route keeps a native back control and uses standalone safe-area spacing because it is no longer hosted by the tab bar.
- The native Capture header owns the top inset; Discovery keeps only the bottom safe area so the prompt region is not offset twice.
- Notification and insight-nudge links now target `/tabs/insights`; the Tracking route remains compatibility-only.
- The insight nudge remains informational on the canonical Insights screen; its self-navigation and CTA affordance were removed so it cannot stack duplicate Insights routes or imply a dead tap target.

## Verification

**Commands:**
- `npx tsc --noEmit` -- full output remains baseline-noisy; changed-file diagnostics produced no new type errors.
- `git diff --check` -- expected: no whitespace errors.
- `node -e "for (const l of ['ar','de','en','es','fr','it','pt','zh']) JSON.parse(require('fs').readFileSync('src/locales/'+l+'/common.json','utf8'))"` -- expected: all locale JSON parses successfully.

**Manual checks:**
- Primary shell shows exactly Home, Journal, Insights, Journeys, and Exercises; Insights opens the existing readiness/ready surface.
- Home toolbar opens Capture; Journal’s existing Record Voice and Write text actions still open their existing routes.
- Legacy Tracking Insights route remains available and uses the same screen.
- English and non-English tab labels use the localized `navigation.insights` key.

## Review Triage Log

- **patch** — Moving Capture out of the primary tabs initially left internal `/tabs/(tabs)/record` paths unreachable; Capture moved to the recording stack and all code/docs references were updated.
- **defer** — The pre-existing CAP-4 readiness-model gap remains outside the frozen navigation boundary; evidence rules were preserved.
- **patch** — Standalone Capture lacked a native back affordance and retained tab-bar spacing; the recording stack now supplies the header and standalone bottom spacing.
- **patch** — Native Capture header plus top safe-area handling duplicated the inset; Discovery now keeps bottom-only safe-area handling.
- **patch** — Stale documentation referenced the removed Capture route; documentation now points to the recording-stack route.
- **patch** — Canonicalizing the insight nudge target made the in-place card push Insights onto itself; the card is now informational, non-navigating, and has no dead CTA affordance.
