---
title: 'Anonymous starter path reaches a reusable next action'
type: 'feature'
ticket: 1
created: '2026-10-11'
status: done
baseline_revision: '656f03223e38af81c8ddd4ecafd74b77135cfeb1'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context:
  - '/Users/samuelprasad/Desktop/happy/journals/PRODUCT.md'
  - '/Users/samuelprasad/Desktop/happy/journals/DESIGN.md'
  - '/Users/samuelprasad/Desktop/happy/journals/_bmad-output/initiative-happy-product-direction/spec-happy-product-direction/experience-flow.md'
  - '/Users/samuelprasad/Desktop/happy/journals/_bmad-output/initiative-happy-product-direction/architecture-happy-product-direction/architecture-happy-product-direction.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The current first-use route asks an anonymous user to complete a long motivation, reminder, plan, and soft-paywall sequence before receiving a useful learning action. That contradicts the agreed focused entry loop and makes the reusable practice next step hard to discover.

**Approach:** Replace the current first-use screen with a small local starter-path tracer: choose Understand anxious thoughts, read one authored anxiety lesson, see Thought Catcher as the linked next action with boundary copy, optionally open the existing exercise route, then return to Home. Keep anonymous Supabase continuity and existing catalog/exercise routes intact.

## Boundaries & Constraints

**Always:** Start from the existing anonymous Supabase session; use the explicit local bundle `understand_anxious_thoughts` → `anxiety` → `anxiety-s1-u1-n1-anxiety-has-a-job` → `thought_catcher`; keep the first loop text-only, non-diagnostic, and free of signup/paywall; use the existing Thought Catcher route; preserve the broader Journeys, Exercises, Journal, Insights, rewards, settings, and capture surfaces; mark onboarding complete through the existing completion boundary; follow the Happy Nunito/tactile design system.

**Never:** Add a separate guest identity; write the future durable `StarterPathV1` tables or migrations in this tracer; expose the full course or exercise catalog before the linked action; show clinical diagnosis, treatment, crisis-care, or guaranteed-outcome claims; remove or rewrite the existing reusable course and exercise implementations; move account linking ahead of the first useful loop.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| HAPPY_PATH | Anonymous session, user selects the anxious-thoughts goal | Authored lesson appears, then Thought Catcher handoff and Home action | No error expected |
| PRACTICE_HANDOFF | User taps Thought Catcher | Existing `exercise-flow?type=thought_catcher` route opens without a paywall or signup wall | Back returns to the starter handoff |
| COMPLETION_FAILURE | Existing onboarding/profile completion rejects | User remains in the starter flow and can retry; no false completion is shown | Log the failure through the existing boundary |
| RETURNING_USER | Onboarding already completed | Existing `onboard-container` sends the user to Home; starter tracer is not shown | Preserve current route behavior |

</frozen-after-approval>

## Code Map

- `app/tabs/screens/(onboarding)/premium-onboarding.tsx` -- current first-use route; replace its long `OnboardingScreen` wrapper with the focused tracer and keep the route boundary.
- `app/tabs/screens/(onboarding)/onboard-container.tsx` -- existing anonymous/completed routing; reuse without changing its redirect contract.
- `app/index.tsx` -- establishes the anonymous session before entering onboarding; reuse without changing auth startup.
- `src/context/AuthContext.tsx` -- provides `ensureAnonymousSession`, `session`, and anonymous identity; do not create a second guest mode or edit this provider in this ticket.
- `hooks/data/useCompleteOnboarding.ts` -- existing profile/preferences/onboarding completion boundary and course enrollment attempt; call it after the tracer's Home action.
- `src/screens/OnboardingScreen/OnboardingScreen.tsx` and `src/screens/OnboardingScreen/*` -- current long flow and its components; do not add behavior to the already oversized component.
- `src/domains/journey/model/` -- canonical location for the local StarterPath bundle definition and typed next-action contract used by the tracer.
- `app/tabs/screens/(exercises)/exercise-flow.tsx` and `src/screens/ExerciseFlowScreen/` -- existing reusable exercise route and completion/back behavior; route Thought Catcher through it.
- `src/exercises/thoughtCatcher/config.ts` and `src/data/exerciseLinkingMap.ts` -- existing Thought Catcher metadata; reuse identifiers, do not duplicate exercise logic.
- `app/tabs/(tabs)/home/index.tsx` -- current Home surface; leave its existing calendar intact for this tracer, with durable Home coordination deferred to ticket 1.5.
- `PRODUCT.md`, `DESIGN.md`, `experience-flow.md`, and architecture AD-1/AD-4 -- product, visual, flow, anonymous-auth, and StarterPath constraints.

## Tasks & Acceptance

**Execution:**
- [x] `src/domains/journey/model/starterPath.ts` -- define the local typed starter bundle, authored lesson content, linked Thought Catcher action, and boundary copy -- keep the tracer aligned with the future StarterPath contract without persisting it yet.
- [x] `src/screens/StarterPathScreen/StarterPathScreen.tsx` -- implement the focused goal → lesson → practice handoff → Home state flow using existing UI primitives and small named render sections -- avoid growing the existing onboarding component.
- [x] `app/tabs/screens/(onboarding)/premium-onboarding.tsx` -- mount the tracer, remove the pre-loop sign-in/paywall sequence, and complete onboarding only when the user leaves for Home -- preserve the existing route and anonymous session.
- [x] `src/locales/en/onboarding.json` -- add concise English copy for the tracer and boundary guidance -- allow the existing translation fallback to serve other locales until localization is separately scoped.

**Acceptance Criteria:**
- Given a fresh anonymous session, when the user opens onboarding and selects Understand anxious thoughts, then Happy shows the authored anxiety lesson and does not show the full catalog.
- Given the user finishes the authored lesson, when the next action is shown, then it identifies Thought Catcher, explains that the tool is self-guided and not diagnosis or treatment, and offers the existing exercise route.
- Given the user taps the linked practice, when the exercise route opens, then it opens `thought_catcher` without a signup or paywall wall and can return to the starter handoff.
- Given the user chooses to continue Home, when onboarding completion succeeds, then the user reaches the existing Home route and the next first-use screen is not replayed.
- Given onboarding completion fails, when the user remains in the tracer, then the UI does not claim completion and offers a retryable path.

## Implementation Notes

- Implemented the focused anonymous tracer with the existing completion boundary and Thought Catcher route.
- Preserved first-day streak and 15 XP onboarding reward behavior.
- Added metadata-only starter-path funnel events and bound the authored copy to the typed local bundle.
- Changed-file Oxlint reports no errors; existing complexity and unused-parameter warnings remain in shared files, and full repository lint passes with the same warning baseline.
- Full TypeScript check remains red on unrelated pre-existing files; no errors reference the ticket files.
- The linked starter practice passes `textOnly=true`, disabling its AI suggestions and voice controls while preserving the normal Thought Catcher route elsewhere.
- The text-only flag also propagates through Thought Catcher's existing deeper-exercise navigation.
- Thought Reframing's custom input steps also honor the propagated text-only flag, so the deeper path cannot re-enable voice or AI/example assistance.

## Plan Change Log

## Review Triage Log

- `medium` / `patch` — `src/screens/StarterPathScreen/StarterPathScreen.tsx`: replacing the old onboarding route dropped the first-day streak and 15 XP reward. Verified in baseline `OnboardingScreen.tsx:179-183`; restored with `updateUserStreak()` and `awardXP(... customAmount: 15)`.
- `medium` / `patch` — `src/domains/journey/model/starterPath.ts`: the local contract omitted `nextAction.pathId`, closed action kinds, and a binding for authored copy. Verified against architecture AD-4; added the fields and screen copy-key bindings.
- `medium` / `patch` — `src/locales/en/onboarding.json`: boundary copy did not explicitly exclude professional treatment. Added the explicit treatment boundary.
- `medium` / `patch` — `src/screens/StarterPathScreen/StarterPathScreen.tsx`: replacing the old flow removed first-use funnel events. Restored start, step, goal, practice-open, and completion metadata without recording reflection content.
- `low` / `patch` — `src/locales/en/onboarding.json`: new eyebrow labels were tracked uppercase, contrary to DESIGN.md. Changed them to sentence case.
- `low` / `patch` — `src/screens/StarterPathScreen/StarterPathScreen.tsx`: new screen functions exceeded the repository complexity threshold. Split header/content/footer responsibilities and removed the changed-file Oxlint warnings.
- `high` / `patch` — `src/screens/StarterPathScreen/StarterPathScreen.tsx`: the screen exceeded the 300-line repository limit. Moved presentational parts into `StarterPathParts.tsx`; both files are now below the limit.
- `medium` / `patch` — `src/screens/StarterPathScreen/StarterPathScreen.tsx`: removing the completion guard allowed rapid taps to duplicate completion and XP. Restored a ref-based in-flight guard that remains active until the completion promise settles.
- `medium` / `patch` — `src/screens/StarterPathScreen/StarterPathScreen.tsx`: reward failures could present a retry error after onboarding was already durably completed. Rewards now run best-effort after completion and do not block Home navigation.
- `medium` / `patch` — `src/screens/StarterPathScreen/StarterPathScreen.tsx`: `markCompleted()` is a no-op when the auth user is missing. Added an explicit user-availability assertion so the UI stays retryable instead of claiming completion.
- `medium` / `patch` — `src/screens/StarterPathScreen/StarterPathScreen.tsx`, `src/screens/ExerciseFlowScreen/`, and shared exercise composer files: the starter handoff previously exposed Thought Catcher voice and AI assistance. Added a scoped `textOnly` route flag that disables both for this first loop without changing ordinary exercise routes.
- `medium` / `patch` — `src/screens/ExerciseFlowScreen/useExerciseFlowActions.ts`: the existing Thought Reframing deep link could drop the starter's text-only flag. Propagated the flag through deeper exercise navigation.
- `medium` / `patch` — `src/exercises/thoughtReframing/TRSituationStep.tsx`, `TRAutomaticThoughtStep.tsx`, and `TRBalancedThoughtStep.tsx`: custom Thought Reframing steps ignored the propagated flag. They now suppress voice and optional AI/example surfaces during the starter path.
- `medium` / `patch` — `src/exercises/thoughtReframing/TREvidenceForStep.tsx`, `TREvidenceAgainstStep.tsx`, and `TRDistortionsStep.tsx`: remaining Thought Reframing helper disclosures did not honor the propagated flag. They now hide list voice affordances, examples, and pattern help during the starter path.
- `low` / `patch` — `src/exercises/thoughtReframing/TRAutomaticThoughtStep.tsx` and `TRSituationStep.tsx`: open disclosure state could leave helper content visible if the route changed in place. Helper rendering now also checks the text-only flag.
- `review` / `pass` — final complete-diff review traced the starter path and deeper Thought Reframing steps; no remaining findings.
- `defer` — unrelated metadata, skill bundles, and BMAD artifacts were already present in the dirty worktree before ticket 1.1 and are preserved per repository instructions; recorded in `deferred-work.md`.

## Design Notes

Use the existing `ScreenLayout`, `TactileButton`, Nunito typography, tonal sage surfaces, and tactile primary action treatment. The tracer should feel like one calm learning card at a time: the user goal and lesson lead, the boundary note stays concise, and the Thought Catcher action is the single clear next step. Do not add a new gradient, assistant decoration, or catalog card wall.

## Verification

**Commands:**
- `npm run lint` -- expected: no new lint errors in changed files.
- `npx tsc --noEmit` -- expected: no new TypeScript errors attributable to the tracer.
- `git diff --check` -- expected: no whitespace errors.

**Manual checks:**
- Start from a fresh anonymous session and confirm the focused goal → lesson → Thought Catcher handoff → Home sequence.
- Confirm no signup, paywall, full catalog, notification permission, or diagnosis language appears before the linked action.
- Back out of Thought Catcher and confirm the starter handoff remains usable.
- Confirm an already completed onboarding session still redirects directly to Home.
