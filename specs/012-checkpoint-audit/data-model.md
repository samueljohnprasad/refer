# Data Model & State Transitions: Checkpoint Audit

## 1. Entities & Content Schema

```typescript
export interface CheckpointOption {
  id?: string;
  label: string;
  feedback: string;
  isCorrect: boolean;
}

export interface CheckpointItem {
  concept: string;
  context?: string;       // Scenario text
  prompt: string;        // Question text
  clue?: string;
  worked?: string;
  options: CheckpointOption[];
}

export interface CourseCheckpointContent {
  category: "course_checkpoint";
  format: "course_checkpoint";
  completionMode: "direct";
  title: string;           // "Sleep science checkpoint"
  instruction?: string;
  introTitle?: string;     // "Let’s see what stuck."
  intro?: string;          // "4 quick questions about the sleep system..."
  introTag?: string;        // "4 QUESTIONS · ~1 MIN"
  items: CheckpointItem[];
  revisitMessage?: string;
  solidMessage?: string;
}
```

## 2. Response State Machine

```typescript
export type CheckpointPhase = "intro" | "question" | "feedback" | "summary";

export interface CheckpointResponseState {
  format: "course_checkpoint";
  phase: CheckpointPhase;
  itemIndex: number;              // Current question index (0 to items.length - 1)
  selectedOptionIndex: number | null;
  attempts: number;
  results: boolean[];             // Array of correctness booleans for each item
  isCorrect: boolean;
}
```

## 3. State Transitions

```mermaid
stateDiagram-v2
    [*] --> intro : Mount
    intro --> question : Press "Start review"
    
    state question {
        [*] --> awaiting_selection
        awaiting_selection --> feedback : Tap Option (Instant commit)
    }
    
    state feedback {
        [*] --> showing_explanation
        showing_explanation --> question : Press "Next question" (if itemIndex < last)
        showing_explanation --> summary : Press "See results" (if itemIndex == last)
    }
    
    summary --> [*] : Press "Continue" (Complete Node)
```
