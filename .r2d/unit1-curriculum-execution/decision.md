# Decision — unit1-curriculum-execution

Rebuild Sleep Reset Unit 1 around “sleep is body rhythm, not willpower test”: sleep pressure, body clock, arousal, then one tiny reset cue. Use current V1 shared exercises.

**Reversibility:** two-way door. Mock data only. Easy to rewrite before Supabase/content publishing.

# Why

- CBT-I guidance supports education plus behavioral/cognitive mechanisms; sleep hygiene alone is weak. Use model, not checklist. https://jcsm.aasm.org/doi/10.5664/jcsm.8986
- ACP recommends CBT-I as first-line for chronic insomnia; app must stay psychoeducation, not claim treatment. https://pubmed.ncbi.nlm.nih.gov/27136449/
- NHLBI links sleep with mood, decision-making, coping, and safety; Unit 1 should reduce self-blame and explain body systems. https://www.nhlbi.nih.gov/health/sleep-deprivation/health-effects
- Duolingo method uses bite-size lessons, active practice, feedback, and repetition. Copy structure. Skip pressure mechanics. https://blog.duolingo.com/duolingo-teaching-method/
- Repo already has V1 shared runtime: `close_discrimination`, `guided_recall`, `scenario_why`, support ladder, mock evidence. No new engine needed.

# Rejected

- Stage-first Unit 1: useful science, but weak first value for anxious users; can increase sleep-stage monitoring.
- Sleep-hygiene checklist Unit 1: too generic; weak as core intervention; feels like advice list.
- Full CBT-I protocol Unit 1: unsafe V1; needs screening, diary logic, clinician review, persistence.
- New sleep-specific exercise engine: fragments shared course system; current V1 formats are enough.
- Duolingo pressure mechanics: lives, streak shame, timers, leaderboards are wrong for mental-health learning.

# Risks

- Sleep claims overreach: use bounded copy: “can,” “often,” “may help,” “if persistent, consider support.”
- V1 lacks delayed review: record concept evidence now; defer scheduler.
- Unit 1 loses science depth: keep one small “sleep changes overnight” explainer, but not as main spine.

# Confidence: 88%

Would rise after clinical copy review and one iOS smoke pass with tired-user pacing.

# Blueprint (dispatch-ready)

**Dispatch shape:** single agent, multi-file

Files to touch:
- `src/data/mock/sleep-reset-unit1-v1.ts` — rewrite Unit 1 V1 exercises to four-lesson three-lever curriculum.
- `src/data/mock/sleep-reset-flat.ts` — update Unit 1 node titles/descriptions if current mock tree still says stage-first.
- `docs/sleep-reset-unit1-v1-implementation-report.md` — update implemented curriculum summary.
- `docs/sleep-reset-unit1-learning-audit.yaml` — mark previous stage-first audit as superseded or add new decision reference.

Interfaces / contracts:
- `ExerciseContent.concept: string` — use stable concept ids: `sleep_pressure`, `body_clock`, `arousal`, `self_blame_reframe`, `tiny_reset_cue`.
- `close_discrimination` — choose safer belief vs misconception.
- `guided_recall` — reconstruct short model: pressure, clock, arousal.
- `scenario_why` — apply model to changed sleep situation and explain why.
- unscored `close_discrimination` with `acceptAnyOption: true` — capture worry/action choice without mastery scoring.

Unit 1 curriculum contract:
- Lesson 1: `Three levers` — sleep is shaped by pressure, clock, and arousal.
- Lesson 2: `Sleep pressure` — tiredness builds and releases; naps/in-bed wake time can affect it.
- Lesson 3: `Body clock` — wake timing and morning light are gentle cues, not moral discipline.
- Lesson 4: `Arousal reset` — trying harder can keep body alert; choose one tiny reset cue.

Execution pattern per lesson:
1. Easy discrimination: correct one misconception.
2. Guided recall: rebuild lesson model from short chips.
3. Scenario-why: apply idea to changed real-life case.
4. Low-pressure choice: optional worry/action, unscored, `acceptAnyOption`.
5. Recap: one fast retrieval or safer-copy choice.

Steps:
1. Rewrite `src/data/mock/sleep-reset-unit1-v1.ts` with 20 exercises, 5 per lesson, only current supported V1 formats.
2. Keep prompts short: one screen, one task, no stacked paragraph choices.
3. Replace stage-heavy concepts with five stable concept ids above.
4. Keep one bounded stage/cycle explanation only if needed inside Lesson 1 or recap: “sleep changes across the night.”
5. Add authored feedback, misconception codes, clue/easier/worked support for every scored item.
6. Keep exactly two unscored low-friction moments: early worry area, final tiny action.
7. Update docs to reflect new Unit 1 curriculum and old audit supersession.

Test file(s) + expected test names:
- No test files. User requested no test case files.
- Verify by focused TypeScript and data inspection only.

Scope fence (do NOT change):
- `supabase/`
- edge functions
- package manager files
- legacy deleted exercise components
- later Sleep Reset units
- new exercise engines or course-specific React components

Dependencies to add:
- none

Config / env changes:
- none

Acceptance criteria (pass/fail from diff):
- `src/data/mock/sleep-reset-unit1-v1.ts` still exports 20 Unit 1 V1 exercises.
- Unit 1 has exactly 4 lessons/nodes and 5 exercises per lesson.
- All exercise `type` values are only `close_discrimination`, `guided_recall`, or `scenario_why`.
- Concept ids include only `sleep_pressure`, `body_clock`, `arousal`, `self_blame_reframe`, `tiny_reset_cue`.
- No prompt says or implies diagnosis, cure, guaranteed sleep improvement, or “sleep is broken.”
- Scored exercises include authored correct/incorrect feedback plus support text.
- Exactly two unscored `acceptAnyOption` exercises exist: one personalization, one tiny action.
- No files under `supabase/` changed.
- No component, hook, or helper file exceeds 300 lines from this work.

# Sources (top 5)

- AASM behavioral and psychological treatments guideline — https://jcsm.aasm.org/doi/10.5664/jcsm.8986 — Strong
- ACP insomnia guideline — https://pubmed.ncbi.nlm.nih.gov/27136449/ — Strong
- NHLBI sleep deprivation and deficiency effects — https://www.nhlbi.nih.gov/health/sleep-deprivation/health-effects — Strong
- Duolingo teaching method — https://blog.duolingo.com/duolingo-teaching-method/ — Strong
- Duolingo spaced repetition — https://blog.duolingo.com/spaced-repetition-for-learning/ — Medium

# Decision-point log

- None.

# Next Action

Dispatch coding subagent with `.r2d/unit1-curriculum-execution/decision.md` and `.r2d/unit1-curriculum-execution/codebase-context.md` as brief.
