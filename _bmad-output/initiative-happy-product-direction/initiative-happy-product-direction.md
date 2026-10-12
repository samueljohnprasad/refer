---
tracker_id: ""
key: ""
type: initiative
title: "Happy Product Direction"
parent: none
covers: ["CAP-1", "CAP-2", "CAP-3", "CAP-4", "CAP-5", "CAP-6"]
after: []
assignee: ""
risk: high
estimate: ""
estimate_basis: ""
---

# Happy Product Direction

## Description

Happy becomes a trustworthy, guided mental-health learning journey: users choose what they want to understand or practise, learn one useful idea, complete a relevant CBT or coping practice, reflect privately, and return to a time-bounded pattern they can understand. Existing Journeys, courses, CBT tools, coping cards, journaling, insights, rewards, and settings remain available; first use reveals only the smallest useful slice. The product-direction spec owns the capabilities, health boundaries, and non-goals; this initiative turns that contract into a buildable first-use path and its supporting recurring loop.

## Outcome

Within seven days of becoming eligible, a user silently receives anonymous Supabase continuity, chooses a plain-language goal, completes one matching lesson, one related practice, and one guided text reflection, then returns to a preserved next step or later time-bounded personal insight without unsafe claims, a premature paywall, or privacy confusion.

## Requirements

- CAP-1: Users can choose a plain-language goal, complete a matching short educational lesson, and reach its linked next step.
- CAP-2: Users can choose and complete a guided CBT or coping practice relevant to the lesson or current need.
- CAP-3: Users can create a guided reflection through a supported input and retrieve it later in their private journal.
- CAP-4: Users can review time-based reflections and recognise recurring patterns without a diagnostic conclusion.
- CAP-5: Users can resume or switch their learning and practice path with progress preserved and one clear next action.
- CAP-6: Users can understand what Happy provides and does not provide before relying on it.

## Done when

1. The four epics below cover CAP-1 through CAP-6 with no capability left unowned.
2. The first-use tracer works as anonymous continuity → goal → lesson → practice → text reflection → immediate feedback → Home; the first shippable bundle is explicitly named during Epic 1 inception.
3. Existing direct surfaces remain reachable after activation, while Home coordinates resume, repeat, reflection, path switching, and later insight readiness.
4. The selected path and its progress remain resumable and switchable without silently discarding user work.
5. Boundary, privacy, and safety language is accurate at the surfaces where users make, review, or act on sensitive reflections.
6. Activation, completion, recurrence, and trust signals are observable before numerical business targets are set.

## Boundaries

This initiative covers the existing iOS 26+ Expo app's product-direction work across onboarding, guided courses, CBT/coping exercises, private journaling, and personal insights. It does not add diagnosis, professional treatment, crisis intervention, an open-ended AI therapist, social disclosure, medical-system integration, or unsupported clinical, efficacy, privacy, encryption, or outcome claims.

Tracer path: one user receives anonymous continuity, selects a plain-language goal, completes one lesson, uses one linked practice, saves one private text reflection, returns through Home, and later sees one time-bounded personal pattern when sufficient evidence exists.

- Touch point: onboarding and personalization — starter goal and course selection; owner: epic-job-led-first-use
- Touch point: journey and exercise runtime — lesson progression, practice handoff, and completion; owner: epic-guided-practice-loop
- Touch point: journal persistence and retrieval — private reflection capture; owner: epic-private-reflection
- Touch point: insight aggregation and presentation — one deterministic pattern; owner: epic-pattern-insights
- Touch point: localization — copy for each owned surface; owner: the epic changing that surface
- Touch point: analytics, subscription boundaries, platform, and policy verification — shared contracts and release checks; owner: epic-job-led-first-use for the initial contract

## References

- spec — _bmad-output/initiative-happy-product-direction/spec-happy-product-direction/spec-happy-product-direction.md, Capabilities, Constraints, Non-goals, and Success signal
- guardrails — _bmad-output/initiative-happy-product-direction/spec-happy-product-direction/product-guardrails.md
- brief — _bmad-output/initiative-happy-product-direction/brief-happy-product-direction/brief-happy-product-direction.md
- product — PRODUCT.md
- design — DESIGN.md

## Notes

- Decision: Use a job-led first-use flow: the user chooses what they want to understand or practise; the path is non-diagnostic, reversible, and does not restrict other courses or tools.
- Decision: Build in four epics: job-led first use and trust foundation, guided practice, private reflection, then one deterministic pattern insight.
- Decision: No separate platform-baseline epic is added; Epic 1 owns the opening platform, environment, identity, and trust gates needed by dependent work. The current native iOS target and hosted environment isolation remain blocking implementation evidence, not completed capabilities.
- Decision: The first tracer uses text reflection; voice and photo remain follow-on scope until current privacy and processing behavior is verified.
- Decision: First use shows one goal, lesson, practice, text reflection, and feedback before the broader screen set; existing surfaces remain available after activation.
- Decision: CBT tools remain reusable through both lesson links and the Exercises library; the first provided tool is not a one-time-only feature.
- Decision: The first meaningful loop is free of a paywall; premium gates may appear after activation when users select premium content or limits.
- Decision: Anonymous Supabase auth is continuity, not a separate guest mode; signup later links the provider identity to the same user.
- Decision: Activity summary readiness requires 3 distinct completed practices in 7 days; pattern readiness requires 5 relevant structured observations across 3 distinct days in 30 days.
- Decision: Epic 1 establishes the shared CAP-6 boundary contract; later epics adopt contextual privacy and safety messaging at their own surfaces.
- Open question: The exact first goal, lesson, practice, reflection prompt, and next action must be named during Epic 1 inception.
- Open question: Exact premium catalog boundaries, free limits, and paywall copy remain to be decided without blocking the first loop.
- Open question: Hosted privacy, retention, deletion, high-risk handling, and sensitive-processing behavior must be verified before related release claims.
- Source conflict: CAP-5 spans onboarding, journey progress, exercise completion, and reflection state; Epic 1 owns path selection and course-progress resume semantics, while downstream epics own their own completion persistence.
- Source conflict: The current code uses both `journal_records` and `journal_entries`; Epic 3 must resolve the canonical persistence and ownership boundary before claiming private retrieval.
