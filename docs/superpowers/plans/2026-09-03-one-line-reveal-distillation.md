# One-line reveal distillation

## Goal

Make the belly-breath summary teach one clear rhythm through one reveal, with all learner-facing copy authored in the backend and presentation aligned with shared course components.

## Global constraints

- Keep the `one_line_reveal` interaction: initial line → learner taps reveal → second line and concise connection appear → Continue.
- Do not turn this screen into a quiz or add scoring.
- Move hardcoded learner-facing strings (`One idea, one tap. That’s the whole exercise.`, `Why it matters`) into backend content fields or remove them.
- Keep content parsing in the exercise data/presentation boundary; do not hardcode course content in the engine.
- Convert static `StyleSheet` values in the touched OneLineReveal implementation to NativeWind/Tailwind classes using existing global tokens/utilities.
- Keep runtime-computed, animated, safe-area, or third-party-only styles inline.
- Preserve shared `CourseExerciseHeading`, `CourseExerciseFooter`, and primary CTA behavior.
- Update the Supabase seed and add a deployable migration for the authored content shape/value.
- Keep changed component/helper files under 300 lines.
- Do not write tests; run focused TypeScript, lint, diff, and graph checks.

## Tasks

- [ ] Update backend content and data parsing for optional completion note and why title/body.
- [ ] Refactor OneLineReveal presentation to the shared Tailwind design language and preserve reveal state/CTA transitions.
- [ ] Add deployable Supabase migration and verify focused checks.
