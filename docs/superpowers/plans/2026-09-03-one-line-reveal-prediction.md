# End-to-End Prediction Transformation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the passive "OneLineReveal" exercise into an active "PredictiveReveal" exercise end-to-end, modifying the database schema, seed data, and React component to implement the learning science recommendation: SCENARIO -> PREDICT -> FEEDBACK.

## Task 1: Update Schema & Engine Config
**File:** `src/exercises/OneLineReveal/data.ts` and `config.ts`
- [ ] Add `options` array to `OneLineRevealData`.
- [ ] Update `readOneLineRevealData` to parse options (using `readArray(content.options)` and parsing `id`, `label`, `isCorrect`, `feedback`).
- [ ] Update `config.ts` so `submissionMode` is `"explicit"` (if it's not already) and it handles the selected response.

## Task 2: Update the React Native Component
**File:** `src/components/exercise/OneLineRevealCategoryEngine.tsx`
- [ ] Read `data = readOneLineRevealData(exercise)`.
- [ ] If `!revealed`, render `data.firstLine`, followed by the `options` (using `CourseExerciseOptionButton`).
- [ ] When an option is pressed, call `onInteraction` with the selected option ID and set `revealed: true`.
- [ ] If `revealed`, show `data.firstLine`, then the selected option's label as `secondLine`, and the option's `feedback` in the `whyCard`.
- [ ] Keep the visual aesthetic (large text for the first and second line).

## Task 3: Update Supabase Seed Data
**File:** `supabase/seed/sleep_reset_section_2.sql`
- [ ] Line ~758: Change `Breathe in gently for 4.` to use `options` instead of `secondLine` and `why`.
      Option 1: "Let the breath out for 6." (Correct, feedback: "The slightly longer exhale gives you a simple, general-purpose calming cue.")
      Option 2: "Hold it for 4." (Incorrect, feedback: "Holding comes later in Box Breathing. For basic calming, just focus on a longer exhale.")
- [ ] Line ~1221: Change `A body scan notices tension.`
      Option 1: "The next tool actively releases it." (Correct, feedback: "Body scan is awareness. Progressive Muscle Relaxation adds deliberate tension and release.")
      Option 2: "The next tool ignores it." (Incorrect, feedback: "Not quite. We don't ignore tension, we use Progressive Muscle Relaxation to actively release it.")

## Task 4: Create Supabase Migration
**File:** `supabase/migrations/XXXX_update_one_line_reveal.sql`
- [ ] Write a SQL migration to update the `content` JSONB for the two `one_line_reveal` exercises in the `learning_nodes` table (if they exist) so the user doesn't have to `db reset`.
