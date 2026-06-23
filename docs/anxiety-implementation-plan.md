# Anxiety Section — Implementation Plan

## What exists today

| Layer             | Status                                                                                                                                   |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Exercise registry | `box_breathing`, `grounding_54321`, `body_scan_pmr`, `worry_time`, `fear_ladder`, `decatastrophizing`, `worry_decision_tree` — all wired |
| History log       | `useCBTHistory` — queries `exercise_entries`, legacy tables                                                                              |
| Analytics         | `anxietyConfig` — tracks pre/post anxiety delta per exercise type                                                                        |
| Recommendations   | `RecommendedForYouCard` via `usePersonalEffectiveness`                                                                                   |
| Progress viz      | `TrendLine`, `HorizontalBarChart` in anxiety deep-dive                                                                                   |

**Gap:** Everything is static. The same exercises are shown to a Day 1 crisis user and a Day 30 advanced user. There is no readiness logic, no stage graduation, and no advanced behavioral metrics beyond anxiety delta.

---

## Phase 1 — Readiness Engine (Week 1)

**Goal:** Compute a user's current stage (1–4) from existing `exercise_entries` data. No new DB tables needed yet.

### 1.1 `useAnxietyStage` hook

File: `src/hooks/anxiety/useAnxietyStage.ts`

```ts
type AnxietyStage = 1 | 2 | 3 | 4;

// Derives stage from exercise_entries query already used by useCBTHistory
// Stage 1 → < 5 completions in last 7 days
// Stage 2 → Rule 1 met: 5+ sessions with avg drop ≥ 2pts
// Stage 3 → Rule 2 met: 4+ emotion logs, 3+ distinct categories
// Stage 4 → Rule 3 met: 3+ thought records + 1 behavioral experiment
```

Uses the existing `exercise_entries` Supabase table — no migrations. Derives stage from:

- completion count + avg pre/post delta (already in `anxietyConfig.fieldMappings`)
- exercise type diversity (session variety across anxiety exercises)
- behavioral experiment presence (`fear_ladder` completions)

### 1.2 Persist stage to AsyncStorage

Stage is recomputed on query, but cached locally to avoid flicker. `useAnxietyStage` returns `{ stage, isLoading, daysAtStage }`.

---

## Phase 2 — Staged Exercise Surface (Week 1–2)

**Goal:** ExercisesScreen anxiety category shows stage-appropriate exercises first, with soft unlock prompts for next-stage tools.

### 2.1 Stage filter in `exerciseRegistry`

Add `minStage?: 1 | 2 | 3 | 4` to `ExerciseConfig`. Existing exercises get:

| Exercise                                            | minStage |
| --------------------------------------------------- | -------- |
| `box_breathing`, `grounding_54321`, `body_scan_pmr` | 1        |
| `worry_time`, `worry_decision_tree`                 | 2        |
| `decatastrophizing`, `thought_reframing`            | 3        |
| `fear_ladder`, `abc_analysis`                       | 4        |

New export: `getExercisesByStage(stage)` — returns exercises at or below `stage`.

### 2.2 `StagedExerciseSection` component

Wraps the existing `DiscoverSection`. Exercises above the user's stage render as locked cards (greyed, padlock icon, "Unlock after X more sessions"). No hard gate — user can still tap and see a brief "coming soon" explainer. Soft friction only.

### 2.3 Stage unlock toast

When `useAnxietyStage` returns a higher stage than last session (detected via AsyncStorage diff), show a one-time in-app toast: _"New exercises unlocked."_ No modal, no interruption.

---

## Phase 3 — Advanced Behavioral Metrics (Week 2–3)

**Goal:** Add Recovery Velocity and Pre-Trigger Recognition to the existing anxiety deep-dive dashboard. Extends `anxietyConfig` without restructuring the analytics pipeline.

### 3.1 Recovery Velocity

**Where it lives:** New section in `anxietyConfig.sections`.

**Computation:** From `exercise_entries`, group completions by calendar day. For each day with a high pre-rating (≥7), find the next completion timestamp and compute the gap in minutes. 7-day rolling average. Display as a trend line using the existing `TrendLine` component.

**No new DB column needed** — timestamps are in `created_at` and `completed_at` on the existing table.

### 3.2 Distortion Fingerprint

**Where it lives:** New section, anxiety deep-dive.

**Computation:** Aggregate `selectedDistortions` from all `thought_reframing` and `thought_catcher` entries. Group by week, count per distortion type. Render as `HorizontalBarChart` with week selector.

Already available in `response` JSON on `exercise_entries`. Parser lives in `src/hooks/insights/useDistortionFingerprint.ts`.

### 3.3 Confrontation Rate (Avoidance Index)

**Where it lives:** New card in `src/components/insights/AvoidanceIndexCard.tsx`.

**Computation:** Count `fear_ladder` entries where `anxietyDuring` was logged (confronted) vs. created but `status !== completed` (avoided). Weekly ratio. Simple percentage pill with a sparkline.

---

## Phase 4 — Crisis Re-Routing (Week 3)

**Goal:** Implement Rule 4 — auto-surface grounding exercises when regression is detected, without hiding advanced tools.

### 4.1 Regression signal

In `useAnxietyStage`, compute a secondary flag: `isRegressing`.

```ts
// true when:
// - 3+ sessions rated ≥ 8/10 in last 5 days
// - OR avg recovery time increased > 50% vs prior 7-day avg
```

### 4.2 Home screen surface change

In `ExercisesScreen`, when `isRegressing === true`:

- Reorder anxiety exercises so `box_breathing` and `grounding_54321` appear first, regardless of stage
- Show a soft contextual nudge above the list: _"Starting with something grounding today."_
- Advanced exercises remain fully visible and tappable below

No modal, no explanation, no "you've regressed" language. The reorder is the intervention.

### 4.3 Auto-clear

`isRegressing` flag clears automatically when 3 consecutive sessions show recovery time ≤ prior baseline.

---

## Phase 5 — 30-Day Progress Report (Week 4)

**Goal:** A shareable summary screen generated from `exercise_entries` data.

### 5.1 `useThirtyDayReport` hook

Aggregates across all existing analytics hooks:

- Total sessions, completion rate
- Best exercise (from `usePersonalEffectiveness`, already exists)
- Recovery velocity trend (Phase 3)
- Distortion fingerprint delta: top distortion at Day 1–7 vs. Day 24–30
- Avoidance confrontation count

### 5.2 `ThirtyDayReportScreen`

New screen at `app/tabs/screens/thirty-day-report.tsx`. Static layout, no new infra. Shareable via `expo-sharing` as a screenshot. Entry point: a card in the Insights tab after Day 28.

---

## Delivery Order

```
Week 1   useAnxietyStage + minStage on configs + StagedExerciseSection
Week 2   Recovery Velocity + Distortion Fingerprint sections in deep-dive
Week 3   AvoidanceIndexCard + regression re-routing
Week 4   ThirtyDayReportScreen
```

## What requires no new infrastructure

- All analytics derive from existing `exercise_entries` table
- All visualization uses existing `TrendLine` / `HorizontalBarChart` components
- Stage lock UI reuses existing `Card` + `HugeiconsIcon` patterns
- `useAnxietyStage` is a pure query hook — no new Supabase tables, no migrations
