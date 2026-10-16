---
title: 'Activation and paywall boundaries are observable without blocking the first loop'
type: 'feature'
ticket: 7
created: '2026-10-12'
status: done
baseline_revision: '656f03223e38af81c8ddd4ecafd74b77135cfeb1'
route: 'full'
route_source: 'queue'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context:
  - '/Users/samuelprasad/Desktop/happy/journals/src/screens/OnboardingScreen/hooks/useOnboardingAnalytics.ts'
  - '/Users/samuelprasad/Desktop/happy/journals/src/screens/StarterPathScreen/StarterPathScreen.tsx'
  - '/Users/samuelprasad/Desktop/happy/journals/src/context/RevenueCatProvider.tsx'
  - '/Users/samuelprasad/Desktop/happy/journals/app/paywall.tsx'
---

## Intent

The anonymous first lesson-to-practice-to-reflection loop must remain usable without a paywall, while activation and premium-gate events remain observable through metadata-only analytics.

## Current evidence

- The onboarding route now mounts the StarterPath tracer instead of the previous soft-paywall sequence.
- Existing onboarding analytics tracks start, steps, completion, and paywall/trial events.
- Existing journal save telemetry emits `journal_entry_saved` without reflection content.
- RevenueCat paywall presentation remains available through the post-activation purchase surface.

## Remaining implementation

- Added explicit starter start, completion, and Home-return events with path/version metadata only.
- Verify the premium surface cannot be reached before the first meaningful loop through the current route graph.
- Record hosted Supabase, RevenueCat offering, iOS 26, and release evidence separately; local static checks cannot prove those runtime states.

## Verification

- Static route and event search completed on 2026-10-12.
- Full runtime/release verification remains pending; this plan is built with those limits recorded below.
- Targeted TypeScript output contained no errors for the StarterPath or new activation-event files; repository baseline errors remain elsewhere.

## Review Triage Log

- `defer` — `src/context/AuthContext.tsx:122-125` and `src/network/auth/identity-link-result.ts:3`: the fallback result/type and alias errors are real in the pre-existing ticket 2 identity-link work, not caused by ticket 7; the focused ticket 7 change does not touch either file.
- `patch` — `src/context/RevenueCatProvider.tsx:125-183`: paywall entry had no metadata-only `premium_gate_hit` event. Added fixed feature/context telemetry before both paywall presentation methods while preserving purchase/restore events.
- `false` — `app/paywall.tsx:5-19`: the route renders a paywall when directly opened, but the normal first-use route mounts StarterPath and has no pre-loop navigation edge to `/paywall`; the review claim relies on an unsupported direct deep-link scenario.
- `defer` — `src/screens/StarterPathScreen/StarterPathScreen.tsx:94-109` and `src/screens/ExerciseFlowScreen/useExerciseFlowActions.ts:94-109`: the generic completed-exercise event lacks starter-path identifiers, but this is pre-existing route instrumentation from tickets 1/3 and needs an explicit route-context decision beyond ticket 7.
- `defer` — `src/screens/StarterPathScreen/StarterPathScreen.tsx:91-129`: the revision-zero re-entry write is a real stale-progress risk in ticket 3's persistence implementation and predates ticket 7.
- `defer` — `src/screens/StarterPathScreen/StarterPathScreen.tsx:177-203` and `src/domains/journey/ui/components/StarterPathNextActionCard.tsx:18-28`: completion status/next-action advancement remains incomplete in ticket 3/5 work and is outside ticket 7's paywall telemetry change.
- `defer` — `src/screens/StarterPathScreen/StarterPathScreen.tsx:180-186`: onboarding completion is written before the active-path pointer in pre-existing ticket 1/3 code; ticket 7 does not change this ordering.
- `defer` — `src/context/AuthContext.tsx`: the 560-line provider and ticket 2 identity-link additions predate ticket 7; splitting that file is separate cleanup work.
- `defer` — `src/domains/journey/data/starterPathProgress.repo.ts:8`: the `any` database boundary is pre-existing ticket 3 persistence code and is not introduced by ticket 7.
- `defer` — the full baseline diff includes unrelated metadata, skill bundles, BMAD artifacts, generated files, and temporary Supabase state that were already dirty before ticket 7; preserve them per the repository instructions and existing deferred-work record.
