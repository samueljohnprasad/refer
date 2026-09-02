# Research & Technical Decisions: Interactive Reframe Correct/Wrong States

## Decision 1: Animation Staggering for Consequence Chains

**Decision**: Extend the existing `InteractiveReframeStagger` component to accept a `path` prop (`'correct'` | `'wrong'`) instead of creating a completely new component, or rename it to `InteractiveReframeConsequenceStagger`.

**Rationale**: The wrong consequence cascade ("TRY HARDER -> more checking -> more pressure") has the exact same visual architecture (cascading text with downward arrows) as the correct consequence ("WHAT CHANGED? -> timing... -> investigate"). Sharing the component reduces code duplication and keeps the file size below the 300-line constitution limit.

**Alternatives considered**: 
- Building the cascade directly inside the Engine file (rejected due to 300-line limit and component bloat).
- Creating a separate `InteractiveReframeWrongStagger.tsx` (rejected to adhere to Principle VII: Minimal Code/YAGNI).

## Decision 2: State Management for Branching

**Decision**: Track the user's choice using a `selectedPath: 'correct' | 'wrong' | null` state, combined with the existing `step` state.

**Rationale**: The engine currently uses a linear `step` state (0 -> 1 -> 2 -> 3). With branching, `step` 1 will mean "user selected an option and cascade is revealing". The UI rendered at step 1 will depend on `selectedPath`. If the user selects the wrong path, they can click "TRY ANOTHER READING", which resets `selectedPath` to `null` and `step` back to 0, seamlessly restoring the initial choice state.

**Alternatives considered**:
- Updating the global database state for the wrong path (rejected; we only need to persist the completed correct path, the wrong path is just interactive exploration).

## Decision 3: "Not Quite" and Error Styling

**Decision**: When `selectedPath === 'wrong'`, the chosen option will have a red border (`border-[#A74141]`), but the hero box revealing the consequence will use neutral/warning colors (e.g., `#3F3A34` or `#F8F1E7`) rather than aggressive red backgrounds, and the "Not Quite" text will be completely removed.

**Rationale**: Directly fulfills the user's request to make the mistake explorable rather than punishing.
