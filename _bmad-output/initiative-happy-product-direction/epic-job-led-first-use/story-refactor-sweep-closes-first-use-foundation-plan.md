---
title: 'Refactor sweep closes the first-use foundation'
type: 'feature'
ticket: 8
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
  - '/Users/samuelprasad/Desktop/happy/journals/src/domains/journey/data/starterPathProgress.repo.ts'
  - '/Users/samuelprasad/Desktop/happy/journals/src/domains/journey/data/useStarterPathProgress.ts'
  - '/Users/samuelprasad/Desktop/happy/journals/src/screens/StarterPathScreen/StarterPathScreen.tsx'
  - '/Users/samuelprasad/Desktop/happy/journals/src/domains/journey/ui/components/StarterPathNextActionCard.tsx'
---

## Intent

Close duplicate StarterPath mutation and direct persistence paths after tickets 3–7, while keeping the first-use contracts intact.

## Review findings

- StarterPath persistence is centralized in `starterPathProgress.repo.ts`; UI uses the repository or its hook rather than writing database rows directly.
- Completion serialization is centralized in the Supabase RPC `complete_starter_path_step`.
- The Home card and starter tracer share the same typed path definition and progress model.
- Existing direct Journey navigation remains separate and reusable.

## Remaining

- Run device/preview verification after hosted schema deployment.
- Revisit the split between existing Redux course state and durable StarterPath state once a second authored path exists.

## Verification

- Targeted Oxlint and `git diff --check` pass.
- Full TypeScript output contains unrelated baseline errors and no errors referencing the new StarterPath files.
- Plan is built; runtime evidence and the second-path product decision remain deferred.

## Review Triage Log

- `defer` — `src/network/auth/identity-link-result.ts:3` and `src/context/AuthContext.tsx:122-125`: the identity-link import and fallback typing errors are real pre-existing ticket 2 work, not introduced by this refactor review.
- `defer` — `src/screens/StarterPathScreen/StarterPathScreen.tsx:113-203` and `src/domains/journey/data/starterPathProgress.repo.ts:64-86`: completion-state advancement and revision-zero re-entry are real ticket 3/5 persistence gaps; closing them requires the unresolved second-path/state-transition decision.
- `defer` — `src/locales/en/onboarding.json` and `src/locales/en/home.json`: the new first-use copy lacks parity in other locales, which is separate ticket 6/localization work and not a refactor-sweep change.
- `defer` — `metadata/app-info/es-MX.json`: the App Store metadata change is unrelated pre-existing dirty work and is preserved without review-scope expansion.
- `defer` — `src/domains/journey/data/starterPathProgress.repo.ts:8`: the `any` Supabase cast is pre-existing ticket 3 persistence code and is not introduced by this sweep.
- `defer` — `src/context/AuthContext.tsx`: the oversized provider and ticket 2 identity-link additions predate this sweep; splitting it is separate cleanup work.
