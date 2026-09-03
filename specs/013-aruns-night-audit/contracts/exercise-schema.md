# Contracts: Timeline Rewind Exercise Schema

## Component Props
The `TimelineRewindCategoryEngine` will adhere to the `V1CategoryEngineProps` interface defined in `v1LearningEngineTypes.ts`.

```typescript
export interface V1CategoryEngineProps {
  exercise: NodeExerciseData;
  savedResponse: unknown;
  locked?: boolean;
  onInteraction: (response: unknown, isComplete: boolean) => void;
}
```

## Content Validation
The content schema for `timeline_rewind` exercises must be registered in the microlearning content validators to ensure safe runtime rendering. It must validate the presence of `timelineEvents`, `paths`, and `finalInsight`.
