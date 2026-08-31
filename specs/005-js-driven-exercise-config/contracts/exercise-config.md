# Contract: CourseExerciseCategoryConfig

This is the internal TypeScript contract for how exercise configurations are defined and resolved.

## Type Definition

```typescript
export interface CourseExerciseCategoryConfig<TContent = unknown> {
  category: RenderableExerciseCategory;
  formats: string[];
  engine: React.ComponentType<any>;
  goalLabel: string;
  unavailableCopy: string;

  // New configuration properties
  presentation?: {
    showSubtitle?: boolean;
    showInstruction?: boolean;
  };
  layout?: Record<string, unknown>;
  progress?: Record<string, unknown>;
  interaction?: ExerciseInteractionConfig; // Re-use existing if present
  feedback?: Record<string, unknown>;
  actions?: Record<string, unknown>;
  capabilities?: Record<string, unknown>;
  
  // Dynamic behavior
  validation?: (content: TContent) => MicrolearningContentIssue[];
}
```

## Resolution Contract

The `resolveCourseExerciseConfig` function must accept a `category` enum and return a fully populated config object that guarantees no required values are undefined by falling back to `DEFAULT_COURSE_EXERCISE_CONFIG`.

```typescript
export function resolveCourseExerciseConfig(category: RenderableExerciseCategory): Required<CourseExerciseCategoryConfig> {
  // Implementation guarantees
}
```
