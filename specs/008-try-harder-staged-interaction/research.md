# Research: Staged Interaction for "Try Harder to Sleep"

## Findings

1. **State Management**: We will use a `stage` property in the `response` object (`"ready" | "result" | "explanation"`). The initial response will set `stage: "ready"`. 
2. **Interaction Mapping**: We will map the global footer CTA in `src/exercises/ParadoxCard/config.ts` to transition the `stage`.
   - In `ready`, it says "Try harder". Tapping it tells the component to run the animation.
   - When the component finishes the animation, it emits `stage: "result"` and `ready: true`, causing the CTA to say "See why".
   - Tapping "See why" emits `stage: "explanation"`, causing the CTA to say "Continue".
3. **Animations**: The existing `alarm` (0-100) logic and multiple push interactions will be replaced by a single Reanimated `useSharedValue` that transitions from `0` to `1` (or directly maps to the marker position) upon entering the `result` stage.
