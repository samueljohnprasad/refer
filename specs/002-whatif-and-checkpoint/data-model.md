# Data Model: whatif-and-checkpoint

## What-If Machine

### WhatIfContent
```typescript
export interface WhatIfContent {
  format: "what_if";
  predictions: { id: string; text: string }[]; // 2-3 items
  consequences: { id: string; text: string }[]; // 2-4 items
  finalComparison: {
    heading: string;
    description: string;
  };
}
```

### WhatIfResponse
```typescript
export interface WhatIfResponse {
  format: "what_if";
  phase: "prediction" | "running" | "complete";
  selectedPredictionId: string | null;
  consequenceIndex: number; // 0 to consequences.length
  [key: string]: unknown;
}
```

## Course Checkpoint

### CheckpointContent
```typescript
export interface CheckpointContent {
  format: "checkpoint";
  intro: { title: string; subtitle: string };
  items: CheckpointItem[]; // 3-5 items
  summary: { title: string; subtitle: string };
}
```

### CheckpointItem (Discriminated Union)
```typescript
export type CheckpointItem = 
  | CheckpointSingleChoice
  | CheckpointOrdering
  | CheckpointMatching
  | CheckpointRecall;

export interface CheckpointSingleChoice {
  type: "single_choice";
  id: string;
  conceptId: string;
  question: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  workedSupport: string;
}

export interface CheckpointOrdering {
  type: "ordering";
  id: string;
  conceptId: string;
  instruction: string;
  items: { id: string; text: string }[];
  correctOrderIds: string[]; // Ordered list of item IDs
  workedSupport: string;
}

export interface CheckpointMatching {
  type: "matching";
  id: string;
  conceptId: string;
  instruction: string;
  pairs: { id: string; left: string; right: string }[];
  workedSupport: string;
}

export interface CheckpointRecall {
  type: "recall";
  id: string;
  conceptId: string;
  question: string;
  answer: string;
}
```

### CheckpointResponse
```typescript
export interface CheckpointResponse {
  format: "checkpoint";
  phase: "intro" | "item" | "summary" | "complete";
  currentItemIndex: number; // 0 to items.length - 1
  itemAttempts: Record<string, number>; // item.id -> number of failed attempts
  itemOutcomes: Record<string, "solid" | "review_soon">; // conceptId -> outcome
  currentMatchSelection: { leftId: string | null; rightId: string | null }; // Transient state for matching adapter
  [key: string]: unknown;
}
```
