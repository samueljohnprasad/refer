# Data Model

## Recall Warmup (Task 12)

### `RecallCard`
- `id` (string): Stable UUID.
- `conceptId` (string): Relates to a learning concept to aggregate mastery.
- `question` (string): The prompt text shown initially.
- `answer` (string): The answer text revealed after tapping.

### `RecallWarmupContent`
- `type` (literal `"recall_warmup"`)
- `cards` (Array<RecallCard>): Must contain exactly 2 or 3 cards.

### `RecallWarmupResponse`
- `format` (literal `"recall_warmup"`)
- `phase` (literal `"intro" | "card" | "complete"`)
- `currentCardIndex` (number): 0 to cards.length - 1.
- `cardPhase` (literal `"question" | "answer"`): Local state (or stored) tracking if the current card is flipped.
- `reviewSignals` (Record<string, "remembered" | "practice_again">): Keyed by `conceptId`.

## Telemetry (Task 14)

### `MicrolearningEventName`
Enum of allowed events:
- `"exercise_start"`
- `"stage_view"`
- `"opaque_scored_choice"`
- `"feedback_shown"`
- `"hint_shown"`
- `"stage_complete"`
- `"exercise_complete"`
- `"exercise_skipped"`

### `MicrolearningTelemetryEvent`
Strictly bounds the payload. Generic text properties are NOT allowed.
- `eventName` (MicrolearningEventName)
- `category` (CourseExerciseCategoryEnum)
- `exerciseId` (string)
- `conceptId` (string | null)
- `stageIndex` (number)
- `correctness` (boolean | null)
- `attemptCount` (number | null)
- `elapsedSeconds` (number)
- `accessibilityFlags` (Record<string, boolean>): E.g., `{ isVoiceOverRunning: true, isReduceMotionEnabled: false }`
