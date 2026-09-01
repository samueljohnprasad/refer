# Data Model: Clear Space Guided Discovery

## Content Schema (`exercise.content`)

The existing configuration structure is preserved to maintain compatibility with the CMS.

```typescript
interface ToolkitTool {
  label: string;
  use: string;
}

interface ToolkitMoment {
  label: string;
  toolIndex: number; // Maps to the tools array, if needed
  key: string;       // Typically the Tool name/label (e.g., "NO WRITING")
  response: string;  // The explanation text
}

// Expected in exercise.content
interface ToolkitShelfContent {
  title?: string;
  instruction?: string;
  note?: string;
  tools: ToolkitTool[];
  moments: ToolkitMoment[];
}
```

## Saved State Schema (`savedResponse`)

The user's progress is saved as a record containing the selected index and phase.

```typescript
interface ToolkitShelfSavedState {
  selectedMomentIndex: number | null;
  phase: "selecting_moment" | "review";
}
```

## State Transitions

1. **Initial (State 1)**: `phase: "selecting_moment"`, `selectedMomentIndex: null`
   - Render Title, Subtitle, "PICK A MOMENT" label, and 4 Moment cards.
   - Strategy carousel is HIDDEN.
2. **User selects Moment (State 2)**:
   - Save `selectedMomentIndex: index`.
   - Transition to `phase: "review"`.
   - Render selected Moment (as disabled `CourseExerciseOptionButton` with `selected: true`).
   - Render the mapped Strategy as a non-interactive information block.
   - "Continue" CTA becomes available.
