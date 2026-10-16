---
tracker_id: ""
key: ""
type: epic
status: in-progress
title: "One deterministic pattern insight"
parent: initiative-happy-product-direction
covers: ["CAP-4"]
after: []
assignee: ""
risk: high
estimate: ""
estimate_basis: ""
---

# One deterministic pattern insight

## Description

Help the user notice one personal pattern from sufficient reflection and practice data, using a defined time window, threshold, source fields, and plain-language explanation. Start with a deterministic pattern so the product can prove usefulness and trust before expanding to broad AI narratives or multiple pattern families.

## Outcome

After sufficient private data exists, a user can reach Insights directly as the Notice destination and see one dated, time-bounded personal pattern with an understandable non-diagnostic explanation; CAP-4 is observable without treating an insight as a clinical conclusion.

## Requirements

- CAP-4: Users can review time-based reflections and recognise recurring emotions, triggers, habits, or coping patterns without a diagnostic conclusion.

## Done when

1. The first supported pattern type, structured source fields, and deterministic explanation are explicit.
2. The pattern is calculated deterministically from the canonical reflection/practice data contract.
3. Activity summary readiness requires 3 distinct completed practice sessions in a rolling 7-day window.
4. Pattern readiness requires 5 relevant structured observations across at least 3 distinct user-local days in a rolling 30-day window.
5. The insight states its observation count and time window and explains what was observed without diagnosing or prescribing.
6. Empty, insufficient-data, projection-pending, and changed-data states are understandable.
7. The insight surface adopts the shared privacy and safety boundary contract; AI narrative is not required.
8. The primary iOS shell exposes Insights directly as Notice through Home, Journal, Insights, Journeys, and Exercises; Capture is reached from Home and Journal add actions, and Home explains readiness before thresholds pass.

## Boundaries

Owns one initial pattern calculation, threshold and explanation rules, insight presentation, and localized insight copy. It does not own journal capture, raw reflection storage, broad AI narratives, diagnosis, or crisis guidance.

## References

- spec — _bmad-output/initiative-happy-product-direction/spec-happy-product-direction/spec-happy-product-direction.md, CAP-4, Constraints, Non-goals, Success signal, and Open Questions
- guardrails — _bmad-output/initiative-happy-product-direction/spec-happy-product-direction/product-guardrails.md, Privacy and sensitive content and Experience rules
- flow — _bmad-output/initiative-happy-product-direction/spec-happy-product-direction/experience-flow.md, Returning user, Existing surface map, and Recurring evidence
- architecture — _bmad-output/initiative-happy-product-direction/architecture-happy-product-direction/architecture-happy-product-direction.md, AD-5, AD-6, AD-7, and Operational Envelope
- design — DESIGN.md, Overview, Typography, and Components
- code — src/hooks/insights, src/components/insights, and app/tabs/(tabs)/insights

## Notes

- Waits on Epic 3's canonical private reflection and source-data contract.
- Decision: The tracer is the canonical observation projection; readiness and the insight surface consume that contract rather than legacy temporal or AI narrative paths.
- Decision: The first deterministic family is `coping_path`, using repeated authored path completion as a source-transparent coping-pattern observation; its metric keys are `path_id` and `path_version`.
- Decision: Sequence contract and metric choice before deterministic readiness, then surface states, then a cleanup pass.
- Decision: Voice, photo, free-text AI narratives, diagnosis, and crisis guidance remain deferred from CAP-4.
- Recommendation: begin with one deterministic CBT/reflection pattern rather than AI-generated narrative themes.
- Decision: The readiness ladder is 3 distinct completed practices in 7 days for activity summary and 5 relevant structured observations across 3 distinct days in 30 days for pattern readiness.
- Decision: The first pattern is deterministic, source-transparent, time-bounded, and non-diagnostic; insufficient data is a valid visible state.
- Unknown: the exact first pattern family, metric schema, empty-state wording, and hosted privacy/retention evidence.
- Decision: Do not treat streaks, completion counts, or subscriptions as evidence that the product works clinically.
- Source conflict: Current routes expose the Insights screen both as a hidden primary-tab route (`app/tabs/(tabs)/insights`) and under `(tracking)`; the spec requires the primary route to become canonical and Tracking to remain compatibility-only.
- Decision: Reopen Epic 4 for one navigation follow-up story; completed insight-contract, readiness, surface, and cleanup work remains unchanged.
- Decision: Do not add a second refactor sweep for this follow-up; the navigation slice is one bounded UI route/trigger change and its cleanup belongs inside that story.
