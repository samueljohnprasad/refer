# Data Model: Arun's Night Audit

## Entities

### TimelineRewindContent
The content structure passed to the exercise engine.
- `title` (string): e.g., "Arun's two versions of the night"
- `setup` (string): e.g., "Arun has a drink in the evening and falls asleep quickly."
- `prompt` (string): e.g., "How would you read the night?"
- `timelineEvents` (array): The objective events (Evidence).
  - `time` (string)
  - `description` (string)
- `paths` (array): The two interpretative paths.
  - `id` (string): e.g., "first-hour", "whole-night"
  - `choiceLabel` (string): The label for the initial selection button.
  - `visibleEventCount` (number): How many timeline events are visible in this path (e.g., 2 for first-hour, all for whole-night).
  - `interpretation` (string): The subjective conclusion drawn.
  - `subConclusion` (string): Text shown before rewinding or finishing.
- `reflectionQuestion` (string): e.g., "What did the first hour hide?"
- `reflectionOptions` (array): 
  - `id` (string)
  - `label` (string)
  - `isCorrect` (boolean)
- `finalInsight` (object):
  - `headline` (string): e.g., "FIRST HOUR ≠ WHOLE NIGHT"
  - `body` (string)
  - `nuance` (string)

### TimelineRewindState
The user's progress through the exercise, persisted to the session store.
- `selectedPathId` (string | null): Which path they chose first.
- `revealCount` (number): How many items are currently revealed in the active path.
- `rewound` (boolean): Whether they have triggered the rewind action.
- `alternatePathId` (string | null): The path they view after rewinding.
- `selectedReflectionId` (string | null): Their answer to the final question.
- `completed` (boolean): Whether the exercise is finished.

## State Transitions
1. `initial` -> User selects a path -> `path_active` (selectedPathId set)
2. `path_active` -> Auto-advances revealCount -> `path_complete`
3. `path_complete` -> User taps Rewind -> `rewinding` (rewound set to true)
4. `rewinding` -> Auto-advances revealCount for alternate path -> `alternate_complete`
5. `alternate_complete` -> User answers reflection question -> `completed`
