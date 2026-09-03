# Feature Specification: Course Rewards MVP

**Feature Directory:** `specs/014-course-rewards-mvp`
**Status:** Draft
**Created:** 2026-09-03

---

## Overview

Happy will add a small, coherent reward loop to its mental-health course journey map. When a learner completes a lesson, reaches a unit midpoint chest, finishes a unit, or finishes an entire course, they receive a recognizably different — and appropriately scaled — acknowledgement.

The MVP contains exactly four user-facing features:

1. A short lesson-completion celebration.
2. One deterministic insight chest per eligible unit (four or more required nodes).
3. A permanent unit trophy earned on unit completion.
4. A distinctive full-course-completion celebration shown once.

The reward loop celebrates learning and practice without scoring emotions, symptoms, disclosures, speed, perfection, or treatment outcomes.

---

## Problem Statement

When every completed lesson returns silently to the map, progress feels mechanical. Learners cannot clearly feel the difference between finishing one small lesson, reaching the midpoint of a unit, developing a complete unit-level capability, or finishing an entire course. Conversely, giving every action a large celebration creates cognitive load and makes important milestones feel ordinary.

The MVP creates a restrained hierarchy in which each significant level has a recognizably different response.

---

## Goals

1. Make lesson, unit, and course progress feel meaningfully different to the learner.
2. Add a visible chest on the journey map to create anticipation within longer units.
3. Connect every trophy and insight reward to something the learner actually studied.
4. Give the end of a course a clear, memorable conclusion.
5. Preserve a calm adult tone appropriate for learners who may be anxious, tired, or emotionally activated.
6. Ensure rewards cannot be duplicated or lost during retries, app closure, or ordinary offline behavior.
7. Build on the existing architecture and design system without introducing new state libraries, currency, or a generalized reward platform.
8. **Config-Driven Architecture**: Ensure all reward rules (e.g., node thresholds) and authored copy are driven by a locally bundled configuration schema rather than hardcoded in source.

## Clarifications

### Session 2026-09-03
- Q: Are chest and trophy nodes generated dynamically by the client or provided by the backend? → A: They are part of the course content, driven by the backend.
- Q: When restoring a missed course-completion finale after an app closure (FR-4.7), what specific event should trigger the restoration? → A: When the user navigates back to the specific course's journey map.
- Q: When making the rewards config-driven, how should the application retrieve this configuration? → A: Option A - Bundled locally (e.g., a JSON file in the repo updated via EAS/OTA updates).
- Q: If the local configuration is missing or malformed for a specific unit's rewards, what should the fallback behavior be? → A: Option A - Gracefully skip/disable the reward for that unit (fail open).
- Q: To enforce Domain Driven Design (DDD) and Separation of Concerns, how should the rewards feature interact with the core progress engine? → A: Option A - Isolated module: reacts to progress state but cannot mutate it.

---

## Actors

| Actor | Role |
|-------|------|
| **Learner** | Primary user who completes lessons, claims chests, earns trophies, and reaches course completion |
| **Curriculum author** | Provides authored metadata: lesson takeaways, insight card content, unit capability statements, course capability summaries |
| **System** | Evaluates canonical completion rules, determines which celebration to display, persists reward state durably |

---

## User Scenarios

### Scenario 1: Learner completes an ordinary lesson

1. Learner completes the final exercise of a lesson.
2. Existing answer feedback resolves.
3. Progress is committed using the existing canonical progress rules.
4. A short lesson-completion surface appears with a learning takeaway and a "Back to path" action.
5. Learner returns to the journey map.

**Edge cases:**
- Learner replays an already-completed lesson → no new celebration shown.
- App closes before acknowledgement → progress remains complete; celebration does not replay automatically.

### Scenario 2: Learner reaches and claims the insight chest

1. Learner completes the node immediately before the chest position.
2. After the lesson-completion flow, the journey map focuses on the newly available chest.
3. Chest transitions from locked to available.
4. Learner taps the chest at any time (chest does not block continuing the path).
5. A short reveal plays; the Insight Card appears with title, body, and "Back to path".
6. Claim is durably recorded; subsequent taps reopen the same card without replaying the reward.

**Edge cases:**
- Chest tapped twice rapidly → only one claim recorded.
- App closes during opening after claim commit → chest stays claimed.
- App closes before claim commit → chest remains available.
- Artwork or content fails to load → fallback text state shown; claim still recorded.
- Unit has fewer than four required nodes → no chest present.

### Scenario 3: Learner completes a unit

1. Learner completes the final required node of the unit.
2. Progress is committed.
3. Lesson-completion surface is absorbed into the unit flow.
4. Unit trophy is awarded; "Unit complete", unit title, and one capability statement ("You can now…") are shown.
5. One primary CTA returns to the map or advances.
6. Trophy is permanently visible on the journey map.

**Edge cases:**
- Learner re-enters app after trophy earned → trophy still visible, no duplicate grant.
- Tapping earned trophy → reopens capability message; no new grant.

### Scenario 4: Learner completes the full course

1. Learner completes the final required node of the final unit.
2. All progress committed; unit trophy granted silently as durable state.
3. Only the course-completion finale is shown (absorbs both lesson and unit celebrations).
4. Finale contains: "Course complete", course title, warm acknowledgement, three to five concrete learned capabilities, and action options (review course / finish for now).
5. Finale shown once; re-entering the course shows a stable completed state without replaying.
6. If app closes before learner sees the finale, it is restored once the next time they navigate to that course's journey map.

**Edge cases:**
- Learner opens the completed course later → stable completed state shown, not the full finale.
- Optional content not yet done → does not block course completion.

---

## Functional Requirements

### FR-0: Architectural Constraints (Config, DDD, DRY, SRP)

| ID | Requirement |
|----|-------------|
| FR-0.1 | **Domain Isolation**: The rewards feature must be built as an isolated module that reads core progress state but never mutates it. |
| FR-0.2 | **No Hardcoded Values**: All thresholds (e.g., minimum nodes for chest) and user-facing copy must be driven by an externalized configuration schema. |
| FR-0.3 | **DRY & SRP**: UI components (chests, trophies, modals) must be pure presentation primitives with zero embedded business logic, built for reuse. |
| FR-0.4 | **YAGNI**: Speculative features (e.g. plugin marketplace, generic hot-reloading) must not be built. Only the strict minimum for MVP rewards is permitted. |

### FR-1: Lesson completion celebration

| ID | Requirement |
|----|-------------|
| FR-1.1 | When a required lesson transitions from incomplete to complete for the first time, display a short completion surface. |
| FR-1.2 | The surface must include: short title ("Lesson complete" or existing equivalent), one learning takeaway, and one primary "Back to path" CTA. |
| FR-1.3 | The takeaway must come from authored lesson outcome metadata; if absent, show an approved neutral fallback and flag the content gap. |
| FR-1.4 | The surface must not display speed, rank, accuracy rate, or any sensitive mental-health metric. |
| FR-1.5 | Replaying an already-completed lesson must not trigger a new celebration. |
| FR-1.6 | If the lesson also completes the unit or course, the higher-level celebration replaces this surface. |

### FR-2: Insight chest

| ID | Requirement |
|----|-------------|
| FR-2.1 | **(Backend Rule)** Units with four or more required nodes receive exactly one chest by default. Units with fewer than four required nodes receive no chest. The client simply renders what the backend provides. |
| FR-2.2 | **(Backend Rule)** Default chest position is after the required node closest to the unit midpoint, with at least one required node before it and one after it, and not immediately before the unit trophy. |
| FR-2.3 | Curriculum authors may explicitly omit the chest or override its position. Invalid positions cause the chest to be omitted with a validation warning logged. |
| FR-2.4 | The chest must have four distinct persistent states: Locked, Available, Opening (transient), and Claimed. |
| FR-2.5 | States must not rely on color alone to be distinguishable. |
| FR-2.6 | The chest must not open automatically and must not block the learner from continuing or stopping. |
| FR-2.7 | Tapping an available chest triggers a short reveal and grants exactly one authored Insight Card. |
| FR-2.8 | The claim action is idempotent: repeated taps or retries cannot create duplicate grant records. |
| FR-2.9 | Tapping a claimed chest reopens the Insight Card without replaying the full reward grant. |
| FR-2.10 | The Insight Card must contain: a title, one concise useful idea connected to the unit's learning outcome, and a "Back to path" CTA. |
| FR-2.11 | The same chest always reveals the same authored insight (deterministic, no randomness). |
| FR-2.12 | A fallback content state must be shown if artwork or remote content fails to load; the claim state remains intact. |

### FR-3: Unit trophy

| ID | Requirement |
|----|-------------|
| FR-3.1 | When a unit becomes complete according to existing canonical completion rules, award exactly one unit trophy. |
| FR-3.2 | No new assessment is created solely to justify the trophy. |
| FR-3.3 | The unit completion surface shows: "Unit complete", unit title, and one "You can now…" capability statement. |
| FR-3.4 | The capability statement must be authored per unit; if absent, implementation must flag the content gap rather than generate copy at runtime. |
| FR-3.5 | The trophy is earned automatically; it does not require a second learner claim action. |
| FR-3.6 | The trophy remains permanently visible on the journey map after the session ends and after app restarts. |
| FR-3.7 | Tapping a previously earned trophy reopens the capability message without granting another trophy. |
| FR-3.8 | Next-unit unlock follows existing prerequisite logic. |

### FR-4: Course completion celebration

| ID | Requirement |
|----|-------------|
| FR-4.1 | When the course becomes complete according to existing required-content and prerequisite rules, show a visually and structurally distinctive finale. |
| FR-4.2 | Optional content must not block course completion unless it is already explicitly required by the existing course schema. |
| FR-4.3 | The finale must contain: "Course complete", course title, a warm acknowledgement of effort, three to five concrete capabilities developed across the course, and actions for reviewing the course, optionally starting another relevant course, or finishing for now. |
| FR-4.4 | The finale must never claim recovery, treatment completion, symptom elimination, or permanent mental-health mastery. |
| FR-4.5 | When the final action simultaneously completes the lesson, final unit, and course: commit all progress; grant the unit trophy as silent durable state; show only the course finale; include the final unit capability in the course summary. |
| FR-4.6 | The full finale is shown exactly once per original completion event. |
| FR-4.7 | If the app closes before the learner sees the finale, it must be restored once the next time the user navigates to that specific course's journey map. |
| FR-4.8 | After dismissal, re-entering the completed course shows a stable completed state, not the full finale. |

### FR-5: Reliability and idempotency

| ID | Requirement |
|----|-------------|
| FR-5.1 | Completion state for lessons, chests, trophies, and courses is durable even if the celebration fails to render. |
| FR-5.2 | Double taps, retries, and repeated requests cannot duplicate reward grants. |
| FR-5.3 | Analytics failures must not block learning progress or reward delivery. |
| FR-5.4 | Animation and asset failures must not block navigation. |
| FR-5.5 | Replaying a completed lesson cannot re-grant chests or trophies. |
| FR-5.6 | If the local configuration for a specific unit's rewards is missing or malformed, the system must gracefully skip the reward (fail open) without crashing or blocking progression. |

### FR-6: Accessibility

| ID | Requirement |
|----|-------------|
| FR-6.1 | All four flows must respect system Reduce Motion and existing in-app preferences. |
| FR-6.2 | Reduced-motion variants use fades and direct state changes in place of large movement or particle effects. |
| FR-6.3 | No essential information appears only through animation, sound, haptic feedback, or color. |
| FR-6.4 | Sound and haptics are optional enhancements only. |
| FR-6.5 | Chest opening must be completable with one standard activation tap without precise timing. |
| FR-6.6 | All completion surfaces must provide accessible roles, names, states, hints, and correct focus order. |

---

## Mental-Health Safety Constraints

**Happy may celebrate:**
- Completing required educational content.
- Practising a taught skill.
- Completing an existing course checkpoint.
- Correcting a misunderstanding and continuing.

**Happy must never celebrate or score:**
- Reporting fewer symptoms of anxiety, depression, or distress.
- Selecting a positive emotion or disclosure.
- Writing longer or more intimate journal responses.
- Maintaining perfect coping behavior.
- Completing content quickly.
- Never making a mistake.

**Required tone:** Warm, factual language that names progress without exaggeration.
- ✅ "You can now identify the trigger, prediction, and response in an anxiety loop."
- ❌ "You conquered anxiety." / "You are healed." / "Perfect mind!"

Course completion represents completion of education, not completion of treatment.

---

## Key Entities

| Entity | Description |
|--------|-------------|
| **Lesson / Node** | An atomic learning step with a completion state (first-time vs. replay) and an authored takeaway. |
| **Unit** | A group of lessons with a completion state, an authored capability statement, and optional chest configuration. |
| **Course** | An ordered collection of units with canonical completion rules and an authored capability summary. |
| **Chest** | A single per-unit claimable object, delivered as a node in the course content by the backend. States: Locked / Available / Opening / Claimed. Tied to one authored Insight Card. |
| **Insight Card** | Authored reward content: title + body + optional visual. Deterministically linked to the chest. |
| **Trophy** | A permanent per-unit achievement state earned automatically on unit completion, delivered as a node in the course content by the backend. Carries the capability statement. |
| **Celebration Orchestrator** | Minimal logic layer that determines which single celebration surface to display when multiple completion events fire simultaneously. |

---

## Success Criteria

| # | Criterion | Measure |
|---|-----------|---------|
| SC-1 | Lesson completion is acknowledged immediately | Learner sees completion surface within one screen transition of exercise completion, with no perceptible delay from secondary network requests. |
| SC-2 | Chest anticipation is visible | 100% of eligible units (≥4 required nodes) display a chest on the journey map. |
| SC-3 | Reward state survives interruption | Chest claim, unit trophy, and course completion states are durable across app close and reopen in 100% of covered scenarios. |
| SC-4 | No duplicate rewards | Zero duplicate chest grants under retry, double-tap, and replay scenarios in automated tests. |
| SC-5 | Celebration hierarchy is enforced | When the final lesson also completes the unit and course, learners see exactly one completion surface (course finale), not three consecutive screens. |
| SC-6 | Course finale is distinctive | Qualitative review confirms the course finale is visually and structurally different from both lesson and unit completion surfaces. |
| SC-7 | Accessibility compliance | All four completion flows pass with Reduce Motion enabled, screen reader active, and sound/haptics disabled — with no essential information lost. |
| SC-8 | Safety language holds | Zero celebration surfaces contain language about symptom improvement, treatment completion, speed, perfection, or personal disclosure. |
| SC-9 | No performance degradation | Completion flows do not add perceptible latency to lesson completion or map navigation under ordinary conditions. |
| SC-10 | Content gaps are surfaced | Missing authored metadata (takeaways, insights, capability statements) is flagged during implementation discovery rather than silently generated at runtime. |

---

## Scope

### In scope
- Lesson completion celebration (first-time only).
- One insight chest per eligible unit (≥4 required nodes), deterministic, claimable.
- Unit trophy with capability statement, permanently visible on map.
- Course-completion finale, shown once, with stable revisit state.
- Celebration collision rules (one surface per simultaneous completion event).
- Durable idempotent state using existing persistence patterns.
- Accessibility and Reduce Motion variants for all four flows.
- Minimal analytics using existing project conventions.
- Repository discovery report prior to implementation.

### Out of scope (MVP)
- Section-completion celebrations.
- Multiple chests per unit or randomized/tiered chests.
- Gems, coins, currency, shop, or paid chest keys.
- A reward inventory, collectible gallery, or achievement page.
- XP boosts, timers, expiring rewards, or forced continuation.
- Leaderboards or social sharing.
- New streak mechanics.
- Cosmetic map customization.
- Rewarding journal writing, mood logging, or symptom change.
- Locking essential lessons or safety content behind rewards.
- Historical replay of previously completed content celebrations.

---

## Dependencies and Assumptions

### Dependencies
- Existing canonical lesson, unit, and course completion logic (source of truth — not modified by this feature).
- Existing journey-map components and navigation primitives.
- Existing progress persistence layer (local and/or remote).
- Authored content: lesson takeaways, unit insight cards, unit capability statements, course capability summaries.
- Existing animation, haptics, modal/sheet, and sound primitives.
- Existing design tokens and color system.
- Existing analytics infrastructure.

### Assumptions
- The existing progress model can be extended with chest state (locked / available / claimed) and trophy state without a new state management library.
- If the app currently supports offline lesson completion, the same architecture will be used for offline chest and trophy state; if offline completion is not supported, this feature does not introduce full offline infrastructure.
- Real learner progress may exist; the implementation plan will include a discovery report before any schema changes that could affect existing users.
- Performance targets follow standard mobile app expectations (no perceptible delay added to lesson completion).
- Authored reward content (insight cards, capability statements) will be provided by curriculum authors in a follow-up content pass; implementation must define and validate the mechanism and flag missing fields.
- The celebration orchestrator is a minimal deterministic piece of logic, not a generalized rules engine.
