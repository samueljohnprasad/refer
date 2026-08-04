# Decision — nodeengine-duolingo-v1

Build calm deterministic v1 lesson shell: micro-progress, goal cue, bounded attempt ladder, real support, worked answer, changed retry metadata. No XP loop.

**Reversibility:** two-way door. Internal v1 runtime and mock content only.

# Why

- Retrieval practice beats rereading for retention and transfer: https://doi.org/10.1126/science.1152408
- Corrective feedback reduces later lure errors: https://pubmed.ncbi.nlm.nih.gov/18491500/
- Different examples improve transfer more than repeating same item: https://pubmed.ncbi.nlm.nih.gov/29265856/
- Duolingo uses adaptive lessons/scaffolding, mistake practice, and explanation. Use pattern. Skip hearts/streak pressure: https://blog.duolingo.com/keeping-you-at-the-frontier-of-learning-with-adaptive-lessons/
- Determinate progress belongs in consistent place: https://developer.apple.com/design/human-interface-guidelines/progress-indicators

# Rejected

- Add lives/streaks/XP: pressure unsafe for mental-health learning.
- Add new exercise types: v1 scope is three reusable categories.
- Add Supabase scoring now: user said mock data first.

# Risks

- Fake mastery: supported/skip never counts as readiness.
- Same-item retry becomes recognition: store retry metadata now; authored variants later.
- Friction for distressed users: keep skip, clue, easier always reachable.

# Confidence: 92%

Would rise after iOS smoke with stressed-user copy review.

# Blueprint (dispatch-ready)

**Dispatch shape:** single agent, multi-file

Files to touch:
- `src/types/journeyLearning.ts` — add attempt/support metadata enum/types.
- `src/domains/journey/learning/v1LearningSessionSlice.ts` — store attempt count, last resolution, feedback support state.
- `src/domains/journey/learning/sessionDraftStore.ts` — persist bounded attempt state.
- `src/components/node/NodeEngineRouter.tsx` — render goal cue, `1 of N`, attempt ladder, worked answer, no endless retry.
- `src/components/exercise/RecallCategoryEngine.tsx` — easier mode reduces word bank support.
- `src/components/exercise/ScenarioCategoryEngine.tsx` — easier mode reduces choices when configured.
- `src/components/exercise/DiscriminationCategoryEngine.tsx` — easier mode reduces options when configured.
- `src/data/mock/sleep-reset-flat.ts` — add shared config fields to v1 pilot items.

Interfaces / contracts:
- `V1LearningNodeSession.attemptCount: number` — bounded tries for current item.
- `V1LearningNodeSession.lastResolution: V1ActivityResolution | null` — independent/support/skip signal.
- `content.goalLabel?: string` — short reusable practice cue.
- `content.easierOptionIds?: string[]` — material easier mode.
- `content.workedExample?: string` — worked answer panel.
- `content.retryVariantId?: string` — authored changed retry hook for later.
- `content.maxAttempts?: number` — default `3`.

Steps:
1. Extend v1 types/session state/draft.
2. Update router to show goal + item count + attempt support ladder.
3. On first miss: show clue, increment attempt, reset answer, no advance.
4. On second miss or easier: show worked/easier support, reset answer.
5. On max miss: allow supported continue without mastery wording.
6. Reduce visible options in easier mode when mock config supplies IDs.
7. Add mock content fields to three pilot items.

Test file(s) + expected test names:
- No test files. User requested no test case files.
- Verify by focused TypeScript and diff inspection.

Scope fence (do NOT change):
- `supabase/`
- legacy exercise categories beyond current safety behavior
- package manager files
- database/edge-function contracts

Dependencies to add:
- none

Config / env changes:
- none

Acceptance criteria (pass/fail from diff):
- `NodeEngineRouter` renders learner-visible item count and `goalLabel`.
- `v1LearningSessionSlice` stores bounded `attemptCount`.
- Wrong check increments attempt and does not advance.
- Max attempts can resolve as `supported_complete` and continue.
- `Make easier` materially filters options/chips when `easierOptionIds` exists.
- Mock v1 pilot items include `goalLabel`, `workedExample`, `easierOptionIds`, `retryVariantId`, and `maxAttempts`.
- No files under `supabase/` changed.

# Sources (top 5)

- Karpicke & Roediger, The critical importance of retrieval for learning — https://doi.org/10.1126/science.1152408 — Strong
- Butler & Roediger, Feedback effects in multiple-choice testing — https://pubmed.ncbi.nlm.nih.gov/18491500/ — Strong
- Butler et al., Different examples promote transfer — https://pubmed.ncbi.nlm.nih.gov/29265856/ — Strong
- Duolingo adaptive lessons/scaffolding — https://blog.duolingo.com/keeping-you-at-the-frontier-of-learning-with-adaptive-lessons/ — Strong
- Apple progress indicators — https://developer.apple.com/design/human-interface-guidelines/progress-indicators — Strong

# Decision-point log

- None.

# Next Action

Implement blueprint inline in current v1 mock-only branch.
