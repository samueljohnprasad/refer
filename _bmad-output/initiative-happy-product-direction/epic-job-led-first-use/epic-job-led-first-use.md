---
tracker_id: ""
key: ""
type: epic
status: done
title: "Job-led first use and trust foundation"
parent: initiative-happy-product-direction
covers: ["CAP-1", "CAP-5", "CAP-6"]
after: []
assignee: ""
risk: high
estimate: ""
estimate_basis: ""
---

# Job-led first use and trust foundation

## Description

Give a new user a clear, non-diagnostic starting point: receive anonymous continuity, choose what they want to understand or practise, enter one matching short lesson, see the next useful action, and return to the same path later. Keep first use focused without hiding the existing course and tool catalog after activation. Establish the shared StarterPath, activation, privacy, safety, and screen-exposure contracts that the later practice, reflection, and insight epics adopt.

## Outcome

An eligible user reaches a relevant first lesson and a preserved next action from a plain-language goal through anonymous continuity, while understanding Happy's self-guided boundaries; CAP-1, CAP-5, and CAP-6 are observable without a signup wall or paywall before the first meaningful loop.

## Requirements

- CAP-1: Users choose a plain-language goal, complete a matching short educational lesson, and reach its linked next step.
- CAP-5: Users resume or switch the selected learning path with course progress preserved and one clear next action.
- CAP-6: Users understand what Happy provides and does not provide before relying on it.

## Done when

1. A user selects a plain-language goal without being asked to identify or accept a diagnosis.
2. The goal resolves to one explicit starter lesson and a clear linked next action.
3. The selected path and course progress can be resumed, and switching paths does not silently discard existing progress.
4. First use reaches Home after one lesson, linked practice handoff, text-reflection handoff, and immediate feedback without exposing the full catalog first.
5. First-use boundary, privacy, anonymous continuity, and optional account-linking language accurately describes self-guided education, sensitive reflections, and what Happy does not provide.
6. Starter-path, screen-exposure, activation, paywall-boundary, and release-gate contracts are documented for the dependent epics.

## Boundaries

Owns onboarding and personalization, anonymous-to-identified continuity, starter-path selection, course-level resume/switch state, first-use and return-surface exposure, first-use trust copy, subscription boundary, and shared activation contracts. It does not author the full lesson catalog, implement practice completion, define journal persistence, or calculate insights.

## References

- spec — _bmad-output/initiative-happy-product-direction/spec-happy-product-direction/spec-happy-product-direction.md, CAP-1, CAP-5, CAP-6, Constraints, and Success signal
- guardrails — _bmad-output/initiative-happy-product-direction/spec-happy-product-direction/product-guardrails.md, Positioning, Health and claim boundaries, Privacy and sensitive content, and Experience rules
- flow — _bmad-output/initiative-happy-product-direction/spec-happy-product-direction/experience-flow.md, First-time user, Returning user, and Existing surface map
- architecture — _bmad-output/initiative-happy-product-direction/architecture-happy-product-direction/architecture-happy-product-direction.md, AD-1, AD-4, AD-7, AD-8, and Operational Envelope
- product — PRODUCT.md
- design — DESIGN.md, Overview, Typography, and Components

## Notes

- Decision: Use job-led first use; the path is reversible and non-diagnostic.
- Decision: This epic establishes the CAP-6 contract; later epics add contextual messaging at reflection and insight surfaces.
- Decision: The first tracer uses one text-reflection bundle; exact goal, lesson, practice, prompt, and next action are selected during inception.
- Decision: Anonymous Supabase continuity is established before onboarding; signup is optional identity linking after activation and never a prerequisite for the first loop.
- Decision: The broader Journey, Exercises, Journal, Insights, rewards, settings, and capture surfaces remain available after Home; first use does not display all of them.
- Decision: The first meaningful loop is free of a paywall; exact premium boundaries remain an open product decision.
- Unknown: activation event names, baseline window, and hosted environment/release evidence.
- Unknown: verified privacy, AI-processing, retention, and high-risk handling behavior.
- Decision: CAP-5 is narrowed here to starter-path selection and course-progress resume semantics; downstream epics own practice and reflection completion persistence.
- Source conflict: current onboarding flow — `premium-onboarding` runs a multi-step motivation, reminder, plan, and soft-paywall sequence before Home, while the spec requires one plain-language goal, one lesson, and the first meaningful learning-practice-reflection loop before a paywall.
- Source conflict: anonymous continuity — `useGuestProgress` and `useJourneyAuthGate` still model an unauthenticated guest, while the spec defines anonymous Supabase continuity as the only pre-signup identity and requires later signup to link that same user.
- Source conflict: current course state — Redux active-course selection and v5 course progress exist, but they are not yet the persisted, versioned `StarterPathV1` contract owned by Journey.
- Source conflict: Home surface — the current Home tab renders the journal calendar, while the target Home surface must coordinate one next action and keep direct Journeys, Exercises, Journal, Insights, and settings access available.
- Decision: The first bundle is `understand_anxious_thoughts` → course `anxiety` → lesson `anxiety-s1-u1-n1-anxiety-has-a-job` → reusable exercise `thought_catcher` → guided text prompt `notice_the_anxiety_alarm`; the first next action is the linked practice.
- Decision: Epic 1 has a tracer first, then identity continuity, durable StarterPath progress, bundle mapping, Home coordination, trust copy, activation/paywall gates, and a closing refactor sweep. Trust copy can proceed beside path persistence after the auth contract; Home waits for durable path state and bundle mapping.
- Decision: No separate platform-baseline ticket is added. The opening tracer records the local/preview assumptions, and the activation/release ticket owns hosted auth, iOS 26, environment isolation, paywall, and metadata-only telemetry evidence.
