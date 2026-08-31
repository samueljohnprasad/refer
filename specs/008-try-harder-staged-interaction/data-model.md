# Data Model: Staged Interaction for "Try Harder to Sleep"

## Entities

### `ParadoxCardResponse`
Extends the standard base response for course exercises.

- `stage`: `"ready" | "result" | "explanation"`
  - Tracks the learner's progression through the exercise.
- `animating`: `boolean`
  - Ephemeral state used to block input during the transition animation.

### State Transitions
1. Initial: `{ stage: "ready", animating: false, isCorrect: true }`
   - (`isCorrect: true` ensures the footer CTA is clickable initially)
2. Tap "Try harder": `{ stage: "ready", animating: true }` (Footer disabled)
3. Animation Complete: `{ stage: "result", animating: false }` (Footer says "See why")
4. Tap "See why": `{ stage: "explanation", animating: false }` (Footer says "Continue")
