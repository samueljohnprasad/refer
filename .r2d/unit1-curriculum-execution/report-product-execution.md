# Report: Product Execution — unit1-curriculum-execution

## Recommendation

Ship Unit 1 as a short, linear "sleep map, not sleep score" curriculum using the current V1 shared exercise runtime and mock data.

Model:

- 4 lessons, 5 exercises each.
- One idea per lesson.
- Exercise arc: easy discrimination -> guided recall -> scenario + why -> low-pressure personalization/action -> recap.
- Runtime arc: answer -> check -> specific feedback -> clue/easier/worked support -> retry or supported completion -> mock evidence saved.
- No new exercise engine. No Supabase. No course-specific React components.

Lesson sequence:

1. Sleep has stages. Teach N1/N2/N3/REM as a changing pattern, not a personal score.
2. Sleep cycles repeat. Teach "early often has more deep sleep, later often has more REM" and normalize brief wakings.
3. Body clock cues. Teach wake timing and morning light as gentle cues, not moral discipline.
4. Sleep need varies. Teach healthy adult ranges and individual variation; end with one tiny experiment.

Product stance:

- Duolingo-like in structure: bite-size, active practice, progressive difficulty, review, immediate feedback.
- Not Duolingo-like in pressure: no streak loss, leaderboard, lives, timers, shame, or "perfect sleeper" framing.
- Progress means "I can explain the idea safely in a changed situation," not "I slept better tonight."

## Confidence

High: 86%.

Why not higher: current runtime handles answer/support/evidence, but V1 still lacks delayed review scheduling and concept-level mastery state. Good enough for V1 mock-data execution, not enough for production efficacy claims.

## Evidence

### Strong sources

- Repo codebase context: `.r2d/unit1-curriculum-execution/codebase-context.md` says current V1 uses mock data, shared config-driven categories, `NodeEngineRouter`, Redux learning session state, and `mockLearningEvidenceStore`; it also fences out Supabase, new dependencies, new engines, and later units.
- Current Unit 1 file: `src/data/mock/sleep-reset-unit1-v1.ts` has 20 V1 exercises across 4 nodes/lessons. Formats are `close_discrimination`, `guided_recall`, and `scenario_why`, with unscored personalization/action checks.
- Current runtime:
  - `src/components/node/NodeEngineRouter.tsx` routes exercises through shared category engines, shows `Check`/`Try again`/`Continue`, support rows, and inline feedback panels.
  - `src/domains/journey/learning/v1LearningSessionSlice.ts` tracks current response, readiness, check status, attempts, support level, timing, and resolution.
  - `src/components/node/NodeEngineRouter.helpers.ts` records concept, category, resolution, support used, attempts, and timing in resolved responses.
  - `src/domains/journey/learning/mockLearningEvidenceStore.ts` stores completed node evidence in memory.
- Duolingo official learning/product sources:
  - Duolingo teaching method: bite-sized lessons, motivation, and a course design focused on high-value skills. Source: https://blog.duolingo.com/duolingo-teaching-method/
  - Duolingo path redesign: spaced repetition, interspersed review, and practice as forward progress. Source: https://blog.duolingo.com/new-duolingo-home-screen-design/
  - Duolingo 101: units cover a few topics, begin easier, get harder, and include personalized practice around review and mistakes. Source: https://blog.duolingo.com/duolingo-101-how-to-learn-a-language-on-duolingo/
  - Duolingo Time Spent Learning Well: product metrics should optimize learning quality, not just total sessions. Source: https://blog.duolingo.com/time-spent-learning-well/
  - Duolingo frontend prediction: mobile lesson progress can update immediately with local state, useful when offline/low-latency matters, but duplicate business logic becomes risky if server rules later diverge. Source: https://blog.duolingo.com/frontend-prediction/

### Medium sources

- `PRODUCT.md`: app users need accessible CBT/mental-health exercises in a calm, premium, trustworthy environment.
- `DESIGN.md`: exercise screens should center the user's work, use calm sage/white/ink styling, keep support secondary, and avoid AI slop, decorative pressure, and over-coaching.
- Prior internal research memory: shared CBT exercise model should use teaching feedback, changed examples, optional private reflection, low-pressure support, and bounded telemetry.

## Key findings

- Current repo fit is strong. The V1 runtime already supports the right product pattern: shared exercise category engines, immediate correctness checks, support escalation, non-punitive skip, mock evidence, and no backend requirement.
- The winning execution model is "guided path with adaptive support," not "content library" and not "quiz course." Tired users should not choose what to study. The path should carry them.
- Unit 1 should teach fewer concepts better. Four lessons is enough: sleep stages, cycles/wakings, circadian cues, sleep-need variation. Later units can cover stimulus control, worry, caffeine, naps, etc.; Unit 1 should not become a sleep encyclopedia.
- Bite-size does not mean shallow. Each node should include recognition, recall, changed-situation transfer, and one optional action/personalization moment.
- For mental health UX, skip/personalization must be treated as safety valves, not failure. Unscored choices reduce friction and avoid implying diagnosis.
- Mock evidence should remain bounded: exercise id, concept, category, correctness/resolution, attempt count, support level, timing bucket. Do not capture free text, mood explanations, voice, or personal situations in V1.
- Duolingo's strongest transferable pattern is structured sequencing: easy -> harder, new -> review, mistake -> targeted practice. Its pressure mechanics should not transfer into a sleep/anxiety product.
- Current V1 file has 734 lines, which is fine as data, but future growth should split by unit/lesson before it becomes hard to review. Component/helper files are currently under the 300-line repo cap, with `NodeEngineRouter.tsx` at 298 and `v1LearningSessionSlice.ts` at 295; do not add behavior there without splitting.

## Contradictions found within this domain

- Duolingo uses streaks, XP, competition, and playful pressure; this app should avoid pressure. Resolution: copy the lesson architecture, not the reward psychology. Use completion and gentle forward progress, not social comparison or loss aversion.
- Duolingo path supports interspersed spaced review; V1 constraint says mock data only and Unit 1 only. Resolution: include same-session recap and record evidence fields now; defer delayed review scheduling/mastery persistence until backend/product scope expands.
- Duolingo official writing emphasizes engagement; mental-health learning needs reduced self-blame and safety. Resolution: optimize for "learning well" evidence and calm completion, not session count alone.
- Existing runtime now improves on the older audit gap, but still lacks durable mastery/review. Resolution: ship V1 as a learning prototype with honest limits; do not claim production efficacy.

## Open questions

- Should Unit 1 unlock the next unit after supported completion, or require at least one independent correct challenge per lesson? Product recommendation: V1 unlocks after supported completion, but mark supported concepts for later review.
- Should low-pressure personalization be one per lesson or only at Unit 1 end? Product recommendation: keep two unscored moments only: one worry-area choice early, one tiny action at the end.
- What exact copy needs clinical review before release? Product recommendation: review claims about stage timing, adult sleep duration ranges, insomnia, alcohol/caffeine, and when to seek professional help.

## Rejected alternatives

- Build a new Sleep Reset exercise engine. Rejected: violates scope, fragments shared course mechanics, and duplicates current V1 runtime.
- Add Supabase mastery tables now. Rejected: violates mock-data V1 and would turn product execution into persistence architecture.
- Make Unit 1 a broad "everything about sleep" unit. Rejected: too much for tired/anxious users; worse recall and more anxiety.
- Use generic MCQ cards only. Rejected: too recognition-heavy; cannot show transfer to changed sleep situations.
- Use Duolingo-style streak pressure/lives. Rejected: wrong affect for sleep anxiety and self-blame.
- Require journaling/reflection for completion. Rejected: high friction, privacy-sensitive, and not valid mastery evidence.
