# Exercise Patterns

Use the approved plan and target content as the source of truth. These patterns preserve the settled low-cognitive-load behavior and prevent a return to card stacks or multi-control screens.

## Completed Redesign Patterns

| Category | Core interaction | Completion boundary |
|---|---|---|
| Guided Discovery Trail | One clue question with 2–3 choices; selection becomes feedback; prior clue collapses; next clue appears in the same workspace | Final `See the pattern`, conclusion, then `Continue` |
| Reframe Builder | Original thought stays visible; fill one authored phrase slot at a time; completed slots compact with Edit; later slots survive earlier edits | Compare original and balanced thought, then `Continue` |
| Teach-Back Chain | Add the correct causal step; wrong order stays put with a hint; completed steps compact; then one transfer choice with exactly one unsupported retry before worked support | Supported or worked transfer state, then `Continue` |
| Explorable Model | One fixed chart; one guided control at a time; immediate chart and textual delta; persist slider on settlement; prior lever compacts | Core levers complete; optional learned-control sandbox/Reset cannot block `Continue` |
| Faded Thought Record | One stable notebook; first worked example has one choice, second has two sequential choices; future rows remain quiet; unsupported answer gets a clue and retry | Completed notebook insight, then `Continue` |
| Worked Rewrite | Original thought stays visible; apply one authored rewrite move at a time; highlight changed phrase and explain it; completed moves compact | Required recognition choice succeeds, then `Continue` |
| Layer Zoom | One layered surface; exactly one expanded layer; earlier layers compress into stable bands; reveal changes the same visual | Final insight becomes the surface caption, then `Continue` |

## Remaining Planned Patterns

Do not infer detailed copy or schema from this summary. Reconcile each target with the approved design before implementation.

| Category | Required interaction direction | Avoid |
|---|---|---|
| Dialogue | Continue one short exchange in place; show one active response decision; compact prior turns while preserving conversational context | A tall transcript, several simultaneous choices, or navigation per turn |
| What-If Machine | Change one variable and update the same visualization; explain the delta; progress through guided scenarios before optional exploration | Separate result cards, hidden causal deltas, or many controls at once |
| Course Checkpoint | Dedicated review node combining a small number of retrieval decisions with clear mastery feedback and safe restoration | A normal lesson disguised as review, punitive scoring, or route completion from partial answers |
| Recall Warmup | Replace the prompt card in place; one quick retrieval action at a time; compact or discard prior prompt as designed | A scrollable quiz sheet or several prompts on screen |

## Category-Specific Test Matrix

For every category, derive tests for:

- all malformed required content fields and deprecated keys;
- zero, minimum, normal, and maximum authored collection sizes;
- every phase label, enabled state, and internal action;
- supported and unsupported choices;
- clue/retry limits;
- interrupted progress at each prefix;
- unknown, duplicated, reordered, and forged stored IDs;
- partial `complete` and full-but-not-yet-feedback responses;
- valid complete restoration without replayed side effects;
- edit/reset/sandbox behavior where applicable;
- final-only course routing.

The test matrix must match the category. Do not add generic fields or states solely to make all exercise types look alike.

