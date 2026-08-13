# Journey Microlearning Exercises Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans`.

**Goal:** Redesign eleven Journey exercise components into focused, resumable microlearning interactions.

**Architecture:** Shared presentation primitives plus separate strict readers, validators, renderers, and transition state machines. Update category seed content in the same task. No compatibility or live-data migration.

**Approved design:** `docs/superpowers/specs/2026-08-12-journey-microlearning-exercises-design.md`

## Global constraints

- Work directly on `journals` by user request.
- Commit every task immediately after its verification; review that commit before starting the next task.
- Preserve unrelated `.claude/skills/*` deletions and unrelated untracked files.
- No automated test cases, runtime dependencies, package-manager changes, universal exercise DSL, backward compatibility, or production migration SQL.
- Update all affected seed SQL content with each category renderer so strict runtime content is always usable.
- One active task, two to four visible choices, compact history, replacing feedback, and only final `Continue` advancing the course.
- Existing tokens/fonts only; VoiceOver, Dynamic Type, Reduce Motion, 48-point targets, private analytics.
- No component, hook, or helper over 300 lines.
- Repository-wide TypeScript has unrelated baseline errors; no touched-file error is allowed.

## Task 1: Shared microlearning foundation

Create the shared phase/types/response helpers and presentation primitives under `src/components/exercise/microlearning/`. Add generic runtime validation dispatch, generic course-data error handling, final-complete semantics, and category-aware skip suppression in the node flow. Add local fixture infrastructure to `CourseExercisesTestScreen`. Add a standalone YAML/SQL validator that parses single- and dollar-quoted recordsets, inventories all eleven categories, and reports malformed matched content rather than skipping it. Keep category fixtures empty until their task. Verify touched TypeScript, validator parser probes, file sizes, and exact staged scope. Commit `feat(journey): add microlearning exercise foundation`.

## Task 2: Guided Discovery Trail

Implement the strict `id`/`prompt`/`summary` and option `id`/`label`/`response` contract, one-current-question renderer, compact summaries, supported inline feedback, `Next clue`/`See the pattern`/`Continue` transitions, strict validators, and a three-question fixture. Rewrite the YAML schema and every Guided Discovery object in affected seed SQL to the new contract. Remove legacy `coach`/`reply`. Verify active/feedback/complete restoration, global ID uniqueness, seed validation, and final-only route advance. Commit `feat(journey): simplify guided discovery trail`.

## Task 3: Reframe Builder

Implement two or three labelled trays with two or three stable choices, one active tray, editable completed slots, ID-keyed response state, and validated `space` or `template` join. Use `ExerciseComparison` for final feedback. Reader and validators reject invalid counts, IDs, templates, references, and budgets. Add two- and three-slot fixtures, rewrite YAML and all affected seed objects, and verify edit restoration plus final-only completion. Commit `feat(journey): simplify reframe builder`.

## Task 4: Teach-Back Chain

Implement strict three/four contiguous ordered steps and a two/three-choice transfer contract. Show one active slot, remaining candidates, and compact future count. Supported order joins; unsupported remains with a hint. Replace the builder with transfer after `Try it yourself`; allow one unsupported retry, then worked support and progress. Update runtime/standalone validation, fixture, YAML, and every affected seed object in the same commit; remove all legacy follow-up shapes. Verify chain and transfer restoration. Commit `feat(journey): simplify teach back chain`.

## Task 5: Explorable Model

Implement two/three guided stages with one typed slider or toggle each, a fixed chart, local slider draft state persisted only after settlement, read-only prior summaries, accessible chart delta, and optional sandbox/reset after guided completion. Remove passive goals. Update reader, validators, fixture, YAML, and every affected seed object. Verify adjustable accessibility state, restore, reset, and no per-frame session writes. Commit `feat(journey): simplify explorable model`.

## Task 6: Faded Thought Record

Implement stable record field IDs, explicit active order, prefilled fields, two/three supported options per active field, one notebook surface, one active field, clue-based retry, and progressively reduced scaffolding. Update strict reader/validators, fixture, YAML, and all affected seed content; remove generic row/slot shapes. Verify sequential fields/examples and restore. Commit `feat(journey): simplify faded thought record`.

## Task 7: Worked Rewrite

Implement structured rewrite moves with stable ID, full result, changed phrase, rationale, and step label. Transform one sentence in place and end with required recognition choices. Update strict reader/validators, fixture, YAML, and all affected seed content; remove tone-row shape. Verify changed phrase reachability, restore, and completion. Commit `feat(journey): simplify worked rewrite`.

## Task 8: Layer Zoom

Implement two/four stable layers in one surface, one expanded body, compressed previous bands, optional accessible image, final string insight caption, and Reduce Motion transition. Update strict reader/validators, fixture, YAML, and every Layer Zoom seed object; remove old kicker-only/unstable shapes. Verify no card accumulation and restoration. Commit `feat(journey): simplify layer zoom`.

## Task 9: Dialogue

Implement two/four stable beats with speaker/message/history summary, at most two decision beats, two/three option responses/effects, current plus one prior turn, and compact `Earlier` history. Update strict reader/validators, fixture, YAML, and every Dialogue seed object; remove flat messages. Verify passive/decision labels and restore. Commit `feat(journey): simplify dialogue exercise`.

## Task 10: What-If Machine

Implement two/three predictions, two/four structured causal steps, user-paced `Run it`/`Next consequence`, compact prediction, and neutral final comparison. Remove every educational reveal timer. Update strict reader/validators, fixture, YAML, and every affected seed object; replace string steps. Verify idle time changes nothing and restore. Commit `feat(journey): simplify what if machine`.

## Task 11: Course Checkpoint

Implement a strict three/five-item discriminated union and container with intro/item/summary modes. Add focused adapters for single choice, ordering, matching, and recall. One item is visible at a time; one retry precedes worked support. Aggregate by concept ID into `Solid` and `Review soon`. Update reader/validators, fixture, YAML, and all checkpoint seed objects; remove `any[]`. Verify every adapter and restore. Commit `feat(journey): simplify course checkpoint`.

## Task 12: Recall Warmup

Implement exactly two/three stable cards with concept ID, question, and answer. One card region shows question, then answer; `Remembered`/`Practice again` advances in place and stores a review signal. Update reader/validators, fixture, YAML, and all Recall seed objects; remove legacy prompt/no-ID shapes. Verify accessibility tree before reveal and saved phases. Commit `feat(journey): simplify recall warmup`.

## Task 13: Final seed and authoring audit

Audit every occurrence of all eleven category strings across YAML and SQL. Require only new shapes, stable global IDs, valid references/counts/budgets, complete paths, and zero standalone-validator errors. Confirm fresh-database seed content is synchronized and no production migration or compatibility code was added. Add no live-data SQL. Commit `chore(journey): audit microlearning exercise content`.

## Task 14: Private analytics and completion feedback

Add typed microlearning events for start, stage view, opaque scored choice, feedback, hint, stage complete, exercise complete, and skip where allowed. Only category, exercise/concept IDs, stage, correctness, attempt count, elapsed time, and existing accessibility flags are permitted. Never accept generic payload text. Track central lifecycle in node flow and renderer-owned stage events without replay on hydration. Add intentional selection/success haptics only. Commit `feat(journey): add private microlearning telemetry`.

## Task 15: Final accessibility and regression verification

Run standalone validation, focused TypeScript, all eleven fixtures, restore probes, file-size/timer/color/privacy scans, and staged-diff review. Perform iOS simulator, Dynamic Type, VoiceOver, and Reduce Motion passes when tooling is available; document unavailable checks honestly. Resolve deferred review minors, request broad whole-branch review, fix verified findings once, and write `docs/superpowers/reviews/2026-08-13-journey-microlearning-exercises-review.md`. Commit `chore(journey): verify microlearning exercise redesign`.

## Definition of done

All eleven categories show one active task, progress internally, restore deterministically, use strict new content in runtime/YAML/seed SQL, pass validation, preserve private data, and advance the course only through final `Continue`. Every task is separately committed and reviewed.
