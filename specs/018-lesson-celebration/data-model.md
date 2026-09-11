# Data Model: Lesson Completion Celebration

*Note: This feature is primarily client-side UI/UX. There are no direct database changes.*

## 1. Local State (Redux / Component State)

The celebration sequence introduces a new state phase to the exercise session lifecycle.

### `V1SessionDraft.checkStatus` (Extension)
Currently, `V1CheckStatus` handles Idle, Checking, Success, Error.
We need to represent the Celebration phase in the flow state.

```typescript
// Proposed conceptual state additions for the runner
type LessonPhase = 
  | 'playing' 
  | 'evaluating'
  | 'success_feedback' 
  | 'celebrating' // NEW: The active lesson dissolves, Panda appears
  | 'completed';
```

## 2. Celebration Context Object

When transitioning to the `celebrating` phase, the exercise runner must provide the context required to render the authored celebration.

```typescript
interface CelebrationContext {
  // The level of celebration (determines animation complexity and haptics)
  level: 1 | 2; // 1 = Standard Skill, 2 = Daily First Habit (Levels 3-5 out of scope)
  
  // Authored copy
  primaryText: string; // e.g., "You caught the thought."
  secondaryText: string; // e.g., "Reframing · practiced"
  
  // Character asset reference
  pandaAnimationKey: 'anxiety_relax' | 'thought_reframe' | 'sleep_calm' | 'generic_success';
  
  // Environment context
  backgroundColor: string; // Emotion-linked background color token
}
```
