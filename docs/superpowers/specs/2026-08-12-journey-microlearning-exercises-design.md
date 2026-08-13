# Journey Microlearning Exercise Redesign

**Status:** Approved
**Direction:** Small shared UI primitives with separate category renderers
**Clean-cutover ruling:** The course is not live. Update seed content with each renderer. Do not add backward compatibility or production migration SQL.

## Product outcome

The eleven highest-load Journey exercises should feel like short sequences of small successes. Bite-sized means one active decision at a time, not one route per tap and not shallow therapeutic content.

The redesign covers, in order:

1. `GuidedDiscoveryTrail`
2. `ReframeBuilder`
3. `TeachBackChain`
4. `ExplorableModel`
5. `FadedThoughtRecord`
6. `WorkedRewrite`
7. `LayerZoom`
8. `Dialogue`
9. `WhatIfMachine`
10. `CourseCheckpoint`
11. `RecallWarmup`

## Shared interaction contract

An exercise remains one route-level item and may contain multiple internal stages.

```ts
type MicrolearningPhase = "active" | "feedback" | "complete";

interface MicrolearningResponseBase {
  format: CourseExerciseCategoryEnum;
  phase: MicrolearningPhase;
  stageIndex: number;
  isCorrect: boolean;
}
```

- One task is active at a time.
- Completed work becomes a compact summary, never a stack of disabled cards.
- Immediate feedback replaces the active choice region.
- Internal CTAs update the current exercise in place.
- Only final `Continue` advances the course exercise index.
- The eleven redesigned categories do not expose a premature route-level skip.
- Saved responses restore the same visible phase without replaying animation, audio, haptics, or analytics.

## Shared presentation primitives

Create focused presentation-only primitives under `src/components/exercise/microlearning/`:

- `ExerciseWorkspace`
- `ActivePrompt`
- `ChoiceTray`
- `CompactHistory`
- `InlineFeedback`
- `StageProgress`
- `ExerciseComparison`
- `MicrolearningMedia`

No shared primitive owns a therapeutic state machine or category content.

## Screen anatomy

1. Existing course progress header
2. Title and one-action instruction
3. Stable workspace
4. One active prompt or control
5. Two to four choices maximum
6. One reserved feedback region
7. Existing persistent footer with a state-specific CTA

Use tonal hierarchy rather than repeated border-and-shadow cards. Use existing course tokens, Cormorant only for reflective text, and Geist for operational UI.

## Content budgets

| Content | Limit |
| --- | ---: |
| Title | 7 words |
| Instruction | 12 words |
| Scenario/setup | 40 words |
| Active prompt | 24 words |
| Visible choices | 2–4 |
| Choice label | 12 words |
| Feedback | 24 words, one sentence |
| Standard internal stages | 3–4 |
| Recall cards | 2–3 |
| Standard duration | 30–90 seconds |
| Course checkpoint | 2–4 minutes |

Validation rejects empty collections, duplicate authored IDs, invalid references, impossible completion paths, and budget violations. Runtime never truncates invalid authored content.

## Media, accessibility, motion, and privacy

- At most one instructional image or chart is active.
- Images have a learning-purpose accessibility description.
- Audio never auto-plays and always has explicit play/pause/replay plus a text equivalent.
- Missing optional media preserves a complete text path; missing required stimulus uses the existing course-data error surface.
- Choices expose button role, label, selected and disabled state, with 48-point minimum targets.
- Feedback and stage changes announce politely; removed choices leave the accessibility tree.
- Charts expose a textual result; sliders expose min/max/current and a human-readable value.
- Reduce Motion uses crossfade or immediate replacement. Educational text never advances on a timer.
- Analytics never include prompt, option, scenario, dialogue, written thought, or private-plan text.

## Category designs

### Guided Discovery Trail

Three or four guided questions. Show compact completed summaries, one current prompt, and two or three choices. Selection replaces choices with one response. Footer progresses through `Next clue`, `See the pattern`, and final `Continue`. New keys are stable question/option IDs, `prompt`, `summary`, and option `response`.

### Reframe Builder

Two or three labelled slots. Only one tray is expanded. Completed slots show selected text and an Edit action. A validated `space` or `template` join strategy builds the final thought. Footer enables `Compare thoughts` only when all slots are complete; final state uses `ExerciseComparison`.

### Teach-Back Chain

Exactly three or four ordered steps. Show completed steps, one active slot, remaining candidates, and a future-step count. Unsupported order gets a specific hint without error haptic. Chain completion replaces the workspace with a transfer question. One retry is allowed before worked support permits progress.

### Explorable Model

Keep one chart fixed. Guide one lever at a time, summarize committed controls, and show one meaningful delta. Slider drafts stay local and persist only when interaction settles. Final optional sandbox exposes learned controls and Reset without being required for completion.

### Faded Thought Record

One notebook surface with stable field IDs. Completed fields are quiet text; one field is active. Later examples contain fewer prefills. A final example may require two fields sequentially, never simultaneously.

### Worked Rewrite

Keep one original reference and transform one working sentence in place. Emphasize the changed phrase and show one rationale. Completed moves become short labels. Finish with a two- or three-choice recognition question.

### Layer Zoom

Use one layered surface. Expand one active layer; compress previous layers into labelled bands. Footer `Zoom in` reveals the next layer. Final insight becomes the surface caption, not another card.

### Dialogue

Use two to four ordered beats with at most two decisions. Show current turn plus at most one relevant previous turn; older content becomes one `Earlier` summary. Passive beats use `Next message`; decision feedback explains likely effect without shame.

### What-If Machine

Choose one prediction, then reveal two to four structured causal steps under learner control. Remove all automatic timers. Final state compares prediction and outcome neutrally in the same workspace.

### Course Checkpoint

Container owns intro, item order, retry policy, concept results, and summary. Atomic adapters handle single choice, ordering, matching, and recall. Show one item at a time. Allow one retry, then worked support. Summary groups `Solid` and `Review soon`.

### Recall Warmup

Use one stable card region. Show question first, then reveal answer in place. Learner chooses `Remembered` or `Practice again`; neither is correct/wrong. Store only concept ID plus review signal.

## Content cutover policy

- Runtime readers accept only the new contract.
- Standalone validation accepts only the new contract after that category task lands.
- Every category task rewrites every affected seed SQL object in the same commit.
- Because the course is not live, do not add production update migrations or compatibility branches.
- The final content task audits all SQL/YAML sources and confirms no deprecated category shape remains.

## Verification policy

Repository instruction forbids automated test cases for this work. Use:

- focused TypeScript output for touched files;
- authoring-content validation;
- direct reader/transition probes;
- local exercise fixtures;
- iOS simulator, VoiceOver, Dynamic Type, and Reduce Motion when available;
- file-size, timer, token, privacy, and staged-diff checks.
