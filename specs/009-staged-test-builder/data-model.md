# Data Model: Staged Test Builder

## Content Schema (`exercise.content`)

The `IfThenPlan` configuration needs to be updated to support contextual actions based on the selected cue.

```typescript
type IfThenAction = {
  id: string;
  text: string;
};

type IfThenCue = {
  id: string;
  text: string;
  actions: IfThenAction[];
};

interface IfThenPlanContent {
  cues: IfThenCue[];
}
```

## Saved State Schema (`savedResponse`)

The user's progress is saved as a simple record containing the selected IDs.

```typescript
interface IfThenPlanSavedState {
  cueId?: string;
  actionId?: string;
  phase?: "selecting_trigger" | "selecting_action" | "review" | "complete";
}
```

## State Transitions

1. **Initial**: `phase: "selecting_trigger"`
2. **User selects Cue**:
   - Save `cueId`.
   - Transition to `phase: "selecting_action"`.
3. **User selects Action**:
   - Save `actionId`.
   - Transition to `phase: "review"`.
4. **User clicks Save**:
   - Transition to `phase: "complete"`.
   - (Parent `NodeEngineRouter` displays `Continue` button)
