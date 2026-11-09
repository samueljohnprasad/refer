# Phase 6 — Implementation spec

## Objective
Apply Phases 1–5 screen by screen so an engineer can implement without re-deciding anything. Specification only; no code is changed.

## Required inputs
- Phases 1–5 artifacts — all PASS
- Screens (read, do not edit): `src/screens/JournalCalendarScreen/` (Home), `src/screens/ExerciseFlowScreen/`, `src/screens/ExercisesScreen/`, `src/screens/ThoughtReframingScreen/`, `src/screens/OnboardingScreen/`, `src/screens/CopingCardsScreen/`, `src/screens/StarterPathScreen/`, `src/components/exercise/`, navigation in `app/` (tabs layout)
- HTML explorations for reference only: `.agents/home.html`, `.agents/onboarding.html`, `.agents/thought-catcher.html`, `.agents/exercises.html`, `.agents/thought-reframing.html`, `.agents/abc-analysis.html`, `.agents/behavioral-activation.html`, `.agents/fear-ladder.html`

## Required tools
- Read/Grep/Glob to inventory every screen and exercise type in the repo (list them; nothing skipped silently).
- `references/prototype-learnings.md` (L1–L16): cite as `L#` alongside a `P#-F#` or `T:` ref (the machine check requires one of those).
- Mobbin only if a screen pattern has no precedent yet in Phases 2–4.

## Method
1. **Inventory**: list every user-facing screen and every CBT exercise type found in code, with file path. Each one gets a spec section or an explicit "out of scope because …".
2. Per screen, a `## Screen: <Name>` section with this table:

   | Dimension | Current (file:line) | Change | Driven by |
   |---|---|---|---|
   | Layout | | | F#, token |
   | Type | | | |
   | Color | | | |
   | Spacing | | | |
   | Illustration / mascot | | | |
   | Motion | | | |
   | Haptics | | | |
   | Copy (exact strings) | | | |
   | Accessibility | | | |
   | Ethics guard | | | |

   "Driven by" cites phase findings as `P1-F3`, `P4-F7`, or tokens as `T:motion.enter`.
3. Required screens: Home, Exercise hub, Exercise flow runner, Thought Catcher, Reframe, every other CBT exercise (ABC, behavioral activation, fear ladder, coping cards, …), Onboarding (each step), Completion, Empty states, Navigation/tab bar, Return-after-absence, Crisis path.
4. **Build order**: ≤10 ordered slices, smallest usable first, each with acceptance checks (e.g. "VoiceOver reads mascot as decorative", "reduced motion shows final frame").
5. **Measurement plan**: per slice, the metric and guardrail (e.g. D7 retention up AND no rise in "guilt"/"pressure" in reviews; notification opt-out rate).
6. Contradictions, Rejected ideas (≥3), critique → revise → check → self-critique.

## Output
`docs/research/soul/06-implementation-spec.md`

## Exit criteria
- `check_phase.py 6` exits 0: inventory present, ≥10 `## Screen:` sections, every screen table has all 10 dimension rows and a non-empty Driven-by cell containing `P#-F#` or `T:`, build order present, measurement plan present.
- All four checklists PASS.
