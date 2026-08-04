# Decision — cbt-learning-mechanics

Build **Evidence Ladder**: teach one micro-skill, retrieve it, correct it, retry in changed context, then recheck at `+1d`, `+3d`, `+10d`, `+30d`, `+90d`. Advance mastery only from spaced, unaided evidence.

**Reversibility:** one-way door. Persistent `skill_id`, item version, evidence meaning, privacy boundary, and event semantics become sticky. Lock them before collecting learner data.

# Why

- Retrieval improves durable learning beyond rereading; repeated successful retrieval matters. [Yang et al., 2021](https://doi.org/10.1037/bul0000309)
- Spacing works; useful gap depends on target retention period. [Cepeda et al., 2006](https://doi.org/10.1037/0033-2909.132.3.354)
- Transfer needs changed tasks and elaborated retrieval, not same-question repetition. [Pan & Rickard, 2018](https://doi.org/10.1037/bul0000151)
- Digital health UX should support tailoring, feedback, data preferences, literacy, and safe goals. [NICE NG183](https://www.nice.org.uk/guidance/ng183/chapter/recommendations)
- Wellness claim boundary matters: intended purpose plus functionality can move digital mental-health software into medical-device territory. [MHRA DMHT guidance](https://www.gov.uk/government/publications/digital-mental-health-technology-qualification-and-classification)

# Rejected

- Completion, XP, time, or mood as mastery: measure activity or self-report, not learned skill.
- Recognition-only quizzes: inflate fluency; keep only as scaffold or misconception diagnostic.
- BKT, IRT, half-life model, or LLM free-text grading in v1: sparse data, opaque rules, privacy risk.

# Risks

- Exact thresholds unproven for Happy: pilot 8 weeks or 500 delayed-review attempts; recalibrate item-by-item.
- Open recall can punish language/disability: use short bounded answers, visible structural examples, voice/accessibility paths, support without point penalties.
- CBT copy can imply diagnosis/treatment: clinical review authored items; claim course-example performance only.

# Confidence: 85%

Core learning and safety direction strong. Exact spacing, mastery threshold, and far real-life CBT transfer still need diverse learner testing.

# Blueprint (dispatch-ready)

**Dispatch shape:** SDD 4-task plan

## Priority exercise formats

| # | Format | Mobile UI + feedback/retry | CBT mapping | Mastery telemetry |
|---|---|---|---|---|
| P0.1 | Faded guided recall | Show prompt first. Accept 3–8-word bounded answer. Keep 2 structural examples; reveal answer-bearing example after miss. Retry changed item. | Name distortion in neutral thought; later name it without label bank. | `skill_id`, `item_version`, unaided/support level, outcome, latency bucket, changed-item result |
| P0.2 | Changed-context scenario + reason | One short case, one choice, then “What clue tells you?” Specific explanation. Wrong answer stays. Retry new case. | Pick next CBT step after tense message; separate thought, feeling, action. | `evidence_type=transfer`, `scenario_family`, clue code, retry index, delayed result |
| P0.3 | Close discrimination + misconception repair | Compare 2–3 plausible near-neighbours. Explain chosen lure and correct rule. Recheck with different surface details. | Mind reading vs fortune telling vs all-or-nothing thinking. | `misconception_code`, distractor ID, correction seen, corrected retry, later recurrence |
| P1.1 | Guided reconstruction | Order or complete only missing links. Correct wrong part, not whole screen. Fade labels after success. | Rebuild situation → thought → feeling → action chain. | step accuracy, support tier, partial-to-unaided conversion |
| P1.2 | Causal explanation / evidence sort | Sort `fact`, `guess`, `missing information`; choose authored reason. No raw prose scoring. | Weigh evidence for/against automatic thought without declaring thought false. | rubric code, sort accuracy, explanation-choice ID, transfer follow-up |
| P1.3 | Safe action plan / behavioural experiment | Bounded cue + tiny action + kind fallback. Optional private text. Outcome cannot fail. | “If worry starts after email, then pause and list facts before replying.” | structured fields complete, safety tag, later plan recall; never score real-world result |
| P2 | Private reflection | Input leads. 2 adaptive examples visible. `Use sample`, `Skip`, `Stop` always available. | Notice personal thought or write balanced alternative. | completion/skip only; no text, mood, voice, or AI output in analytics |

Support-only formats: cards, matching, ordering, MCQ. Useful for teaching and rescue. Never sufficient alone for `ready` or `retained`.

## Feedback, adaptation, progression

- First miss: state correct rule + why. Offer clue. No generic “Incorrect.”
- Second miss: show 2 worked examples; reduce one variable; mark evidence `supported`.
- Third miss/stall: `Learn with support`, `Use sample`, or `Skip for now`. No mastery loss.
- Two unaided correct attempts on separate days, including changed case: stage `ready`.
- Unaided due review at `+10d` or later: stage `retained`.
- Delayed miss: keep earned stage, set `needs_review`, schedule `+1d`.
- Show `Introduced`, `Practising`, `Ready to use`, `Kept fresh`. Celebrate stage change once.
- Cap due queue at 3. Offer `Now`, `Later`, `Tomorrow`, `Not now`. No debt, streak loss, leaderboard, chest, timer, or variable reward.
- Keep current XP activity-only. Never label XP as skill growth.

## Mastery data

`learning_skill_state`:

- PK: `user_id, skill_id`
- `stage: introduced|practising|ready|retained`
- `needs_review`, `unaided_correct_count`, `transfer_correct_count`, `delayed_correct_count`
- `last_evidenced_at`, `next_review_at`, `last_outcome`, `state_version`, `updated_at`

`learning_item_attempts`:

- `id, user_id, node_attempt_id, node_id, item_id, item_version, skill_id`
- `outcome`, `evidence_type`, `scenario_family`, `support_level`, `retry_index`
- `response_ms_bucket`, `answer_key_version`, `occurred_at`
- No answer body or free text.

Completion remains in course progress. Mastery remains in skill state. Symptom/mood data remains separate.

Files to touch:

- `src/types/learning.ts` — typed item, attempt, support, feedback, stage contracts.
- `src/components/node/NodeEngine.tsx` — `answering -> feedback -> retry -> confirmed` state machine; submit every scored attempt.
- `src/components/node/exerciseFeedback.ts` — resolve specific authored feedback and misconception code.
- `src/components/ui/LessonScreen.tsx` — calm inline/footer teaching feedback; long-copy, keyboard, safe-area support.
- `src/components/exercise/ShortRecallExercise.tsx` — bounded concept recall; accepted aliases only; never personal text.
- `src/components/exercise/ExerciseRegistry.tsx` and `ExerciseRenderer.tsx` — typed registration; remove new `any` widening.
- `src/lib/learning/scheduler.ts` — `1/3/10/30/90` due selection and queue cap.
- `src/domains/journey/data/journeyApi.ts` — submit-attempt mutation and typed response.
- `src/domains/journey/analytics/courseLearningAnalytics.ts` — explicit PostHog allowlist; bounded enums/IDs only.
- `src/domains/journey/ui/components/ReviewQueueCard.tsx` — finite, optional review surface.
- `supabase/migrations/20260729230000_course_learning_mastery.sql` — new state/attempt tables, indexes, RLS. Do not rewrite old migration.
- `supabase/functions/submit-learning-attempt/index.ts` — authenticated transactional persistence + server-authoritative state.
- `supabase/functions/_shared/course-learning/applyEvidence.ts` — deterministic reducer.

Interfaces / contracts:

- `type LearningStage = "introduced" | "practising" | "ready" | "retained"`
- `type SupportLevel = "none" | "clue" | "worked_example" | "guided"`
- `type EvidenceType = "recall" | "reconstruction" | "discrimination" | "transfer"`
- `type AttemptOutcome = "correct" | "incorrect" | "partial" | "abandoned"`
- `type ResponseMsBucket = "0_5s" | "6_20s" | "21_60s" | "60s_plus"`
- `interface LearningItemMeta { itemId: string; itemVersion: number; skillId: string; evidenceType: EvidenceType; scenarioFamily: string; answerKeyVersion: number }`
- `interface LearningAttempt extends LearningItemMeta { nodeAttemptId: string; outcome: AttemptOutcome; supportLevel: SupportLevel; retryIndex: number; responseMsBucket: ResponseMsBucket; occurredAt: string }`
- `interface LearningFeedback { title: string; explanation: string; clue?: string; misconceptionCode?: string; nextAction: "continue" | "retry_changed" | "show_support" | "skip" }`
- `interface LearningSkillState { stage: LearningStage; needsReview: boolean; unaidedCorrectCount: number; transferCorrectCount: number; delayedCorrectCount: number; lastEvidencedAt: string | null; nextReviewAt: string | null }`
- `interface SubmitLearningAttemptResult { state: LearningSkillState; feedback: LearningFeedback; nextReviewAt: string | null }`
- `applyEvidence(state: LearningSkillState | null, attempt: LearningAttempt): LearningSkillState`
- `getNextReview(stage: LearningStage, outcome: AttemptOutcome, now: Date): Date`
- `submitLearningAttempt(input: LearningAttempt): Promise<SubmitLearningAttemptResult>`

Steps:

1. Add contracts, migration, server reducer, scheduler, and pure tests. Resolve `user_node_progress` vs `user_course_node_progress` naming drift first.
2. Replace `NodeEngine` done/check flow with typed corrective state machine. Register bounded recall. Reuse scenario, ordering, matching, and choice renderers.
3. Persist item attempts server-side. Emit privacy-allowlisted PostHog events: `course_learning_item_submitted`, `course_learning_support_used`, `course_learning_feedback_shown`, `course_learning_state_changed`, `course_learning_review_actioned`.
4. Add finite review queue. Pilot one authored distortion-identification skill set. Keep current Sleep Reset plan/content untouched.

Test file(s) + expected test names:

- `supabase/functions/_shared/course-learning/applyEvidence.test.ts`:
  - `aided correct never marks skill ready`
  - `ready needs two unaided days and changed scenario`
  - `retained needs delayed unaided review`
  - `delayed miss keeps earned stage and sets needs review`
- `src/lib/learning/scheduler.test.ts`:
  - `uses 1 3 10 30 90 day ladder`
  - `caps due queue at three without overdue debt`
- `src/components/node/NodeEngine.test.tsx`:
  - `wrong answer teaches and cannot advance`
  - `changed answer retries without duplicate completion`
  - `third miss offers supported exit`
- `src/components/exercise/ShortRecallExercise.test.tsx`:
  - `normalizes authored aliases without storing personal text`
- `src/domains/journey/analytics/courseLearningAnalytics.test.ts`:
  - `drops raw response prompt mood voice and free text`
  - `emits bounded learning evidence properties only`

Scope fence (do NOT change):

- `docs/plans/2026-07-29-001-feat-sleep-reset-unit-1/` and `docs/sleep-reset-production-learning-audit.md`
- `src/data/mock/sleep-reset-flat.ts` during engine work
- `src/context/XPContext.tsx`, rewards, streak, achievement, chest, or leaderboard systems
- journal, mood, AI insight, crisis-routing, diagnosis, or treatment-outcome logic
- package locks and dependency versions

Dependencies to add (if any):

- None.

Config / env changes (if any):

- None. Add PostHog `before_send` event/property allowlist in existing provider options. Set provider `autocapture={{ captureTouches: false, captureScreens: false }}`; capture allowlisted course events explicitly.

Acceptance criteria (pass/fail from diff):

- Scored item cannot advance after incorrect response; changed-case retry appears.
- `ready` requires 2 unaided correct days plus changed scenario; `retained` requires delayed unaided review.
- Supported success advances learning flow but never counts as unaided mastery.
- Personal reflection remains optional, unscored, and excluded from mastery.
- PostHog payload tests reject raw response, prompt, option text, mood, voice, journal, AI, and free text.
- Review queue contains at most 3 items and never displays overdue debt or streak loss.
- No existing XP/reward system is called “mastery” or used in mastery reducer.
- RLS restricts learning rows to owning user; account deletion cascades.
- `npx tsc --noEmit --pretty false`, focused Jest/Deno tests, `git diff --check`, and `graphify update .` pass.

# Sources (top 5)

- Yang et al., Retrieval Practice in Classroom Learning — https://doi.org/10.1037/bul0000309 — Strong
- Cepeda et al., Distributed Practice Meta-analysis — https://doi.org/10.1037/0033-2909.132.3.354 — Strong
- Pan & Rickard, Retrieval Practice and Transfer Meta-analysis — https://doi.org/10.1037/bul0000151 — Strong
- NICE NG183 Digital and Mobile Health Interventions — https://www.nice.org.uk/guidance/ng183/chapter/recommendations — Strong
- MHRA Digital Mental Health Technology Guidance — https://www.gov.uk/government/publications/digital-mental-health-technology-qualification-and-classification — Strong

# Decision-point log (if any dev input was needed)

- None. Repo context resolved audience, platform, risk tolerance, and existing learning gaps.

# Next Action

Dispatch `superpowers:subagent-driven-development` with `.r2d/cbt-learning-mechanics/decision.md` and `.r2d/cbt-learning-mechanics/codebase-context.md` as brief.
