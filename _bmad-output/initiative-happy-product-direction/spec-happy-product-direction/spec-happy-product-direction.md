---
id: SPEC-happy-product-direction
companions:
  - product-guardrails.md
  - ../architecture-happy-product-direction/architecture-happy-product-direction.md
  - experience-flow.md
  - starter-paths.md
  - ../../../PRODUCT.md
sources:
  - ../brief-happy-product-direction/brief-happy-product-direction.md
---

> **Canonical contract.** This spec and its companions define the product direction for Happy. The upstream brief is retained for narrative rationale.

# Happy Product Direction

## Why

Happy addresses the gap between mental-health education, practical self-guided exercises, and personal reflection. Adults and young adults dealing with anxious thoughts, stress, overthinking, or sleep difficulty need to understand what is happening, practise a concrete skill, and notice patterns over time. Existing worksheets, trackers, and content libraries often solve only one of these jobs. Happy makes the full loop approachable, structured, and repeatable without presenting itself as diagnosis or professional treatment. Its long-term direction is a trusted personal learning journey that makes mental-health literacy and self-guided practice more understandable, usable, and consistent.

## Capabilities

- **CAP-1**
  - **intent:** Users can choose a plain-language goal and complete a matching short educational lesson about anxiety, stress, sleep, mindfulness, or a related topic as the first step in a reversible starter path.
  - **success:** A demonstration shows a user can choose a goal, start and finish the matching canonical course lesson, see that lesson progress in Journeys, and reach its linked practice without seeing the full catalog first.

- **CAP-2**
  - **intent:** Users can choose and complete a guided CBT or coping practice relevant to the lesson or current need, then reuse that tool later from the exercise library.
  - **success:** A linked or directly selected practice can be started, completed, visibly marked as complete, and reopened without creating duplicate completion evidence on retry.

- **CAP-3**
  - **intent:** Users can create a guided reflection through supported text, voice, photo, or prompt-based input.
  - **success:** The first shippable slice completes a guided text reflection and retrieves it later in the private journal; other modalities require their own verified release gate.

- **CAP-4**
  - **intent:** Users can review time-based reflections and recognise recurring emotions, triggers, habits, or coping patterns.
  - **success:** From the primary Insights destination, the product shows insufficient data until 3 relevant completed practices exist in 7 days for an activity summary or 5 relevant structured observations across 3 days in 30 days for an emerging pattern; ready output includes its count, time window, and no diagnostic conclusion.

- **CAP-5**
  - **intent:** Users can resume or switch their learning and practice path with progress preserved and one clear next action.
  - **success:** After completing any stage, Home gives the active path one dominant next action; a user can return, repeat a learned tool, or switch paths without losing another path's progress.

- **CAP-6**
  - **intent:** Users can understand what Happy provides and does not provide before relying on it.
  - **success:** User-facing boundary and privacy messaging is present where needed and excludes diagnosis, treatment replacement, crisis care, and guaranteed outcomes.

## Constraints

- Happy targets iOS 26+; the contract does not require Android or older-iOS behavior.
- First use shows one goal-led lesson, one related CBT practice, one text reflection, and immediate feedback before exposing the broader catalog and secondary surfaces.
- The primary iOS shell has five direct destinations: Home, Journal, Insights, Journeys, and Exercises. Insights is the Notice step and must not be discoverable only through a generic Tracking route.
- Capture is a prominent add action from Home and Journal, not a permanent primary destination. After activation, Home surfaces insight readiness and explains how to build evidence when thresholds are not met.
- The selected StarterPath is authoritative for its goal, canonical lesson, linked practice, reflection, and course enrollment; a fallback must not silently override that selection.
- StarterPath is a routing layer over canonical course content and progress, not a parallel lesson state with duplicated learning progress.
- When a StarterPath is active, Home has one dominant continuation action; journal, mood, and other entry points remain available but secondary.
- The approved second authored StarterPath is "Feel less overwhelmed" -> "Stress is a signal" -> "Grounding Reset" -> private text reflection; it remains reversible and does not change the existing anxious-thoughts path.
- Existing Journeys, courses, CBT tools, coping cards, journaling, insights, rewards, settings, and capture surfaces remain available; the starter path routes into them and does not replace them.
- Anonymous Supabase auth starts at launch; there is no separate guest mode, and later signup or login links the provider identity to the same user.
- Practice tools remain reusable after first exposure. Home resumes the next action or offers a relevant repeat, while the Exercises and Journeys surfaces remain directly accessible after activation.
- Insights use acknowledged structured evidence. Analytics stores metadata only and never raw reflection text, audio, photos, or health-adjacent free text.
- The first meaningful learning-practice-reflection loop is free of a paywall; premium gates may appear after activation when users choose premium content or limits.
- Happy is self-guided education and support, not diagnosis, professional treatment, therapy replacement, or crisis intervention.
- Only capabilities available and verified in the released build may be marketed. Unsupported clinical efficacy, expert endorsement, privacy, encryption, and outcome claims are prohibited.
- Reflections and health-adjacent information are sensitive. The product must not encourage public disclosure or expose private content through social mechanisms.
- Gamification may support consistency but must not trivialise distress, turn mental health into competition, or become proof of benefit.
- The freemium model must not block the user's first meaningful learning-practice-reflection loop solely to force a subscription decision.

## Non-goals

- Presenting assessment as diagnosis or claiming to cure anxiety, guarantee relief, or replace therapy.
- Crisis intervention, emergency care, or personalised medication or treatment advice.
- An open-ended AI therapist or a social feed for sensitive disclosures.
- Clinical efficacy claims, medical-system integration, or health-record workflows.
- Treating acquisition, streaks, or subscriptions as evidence of clinical benefit.

## Success signal

Within seven days of becoming eligible, a user chooses a plain-language goal, completes at least one matching course lesson, one related practice, and one journal reflection, then returns to a preserved next step or opens the directly reachable Insights destination to see an honest readiness state or time-bounded personal insight. These events are observable, baselines are recorded before targets are set, and trust is not degraded by unsafe claims, privacy confusion, or excessive messaging. Business success is qualified discovery, product-page conversion, trial start, and paid retention without harming early activation; numerical targets remain open until baselines exist.

## Assumptions

- This spec serves product direction and downstream planning, not an investor pitch or clinical efficacy submission.
- The recurring product loop is Learn -> Practise -> Journal -> Notice patterns -> Continue; the first-time flow is a focused entry into that loop, not a separate product mode.
- Voice and photo reflection are supported only where the released build and current privacy disclosures verify them; otherwise they are gated or described as future capability.
- Current activation, retention, conversion, and subscription baselines are unknown.
- The first activation wedge is the approved Understand anxious thoughts path; broader acquisition and additional goal ordering remain open to measurement.

## Open Questions

- Confirm the released-build identifier and final copy for the authored Grounding Reset practice before implementation.
- Which privacy, AI-processing, and data-retention claims are verified for the released build and current policies?
- How should high-risk medical or self-harm content be detected, escalated, and kept outside automated product guidance?
- Which exact premium catalog boundaries, free limits, and paywall copy preserve the first meaningful loop while supporting the freemium model?
