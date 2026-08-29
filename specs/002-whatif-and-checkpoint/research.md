# Research & Decisions: whatif-and-checkpoint

## Decision 1: What-If Machine Pacing
- **Decision**: Remove all time-based automatic reveals. Use a user-paced "Run it" / "Next consequence" button flow.
- **Rationale**: Timers induce anxiety in therapeutic contexts, violating Constitution Principle I & II. User-paced interaction provides agency and simplifies state restoration if the app is suspended.
- **Alternatives considered**: CSS/Reanimated sequence timers (rejected due to complexity on resume and anxiety induction).

## Decision 2: Course Checkpoint Type Safety
- **Decision**: Replace `any[]` with a strict discriminated union for `CheckpointItem` (`single_choice`, `ordering`, `matching`, `recall`).
- **Rationale**: Strict typing prevents runtime crashes and ensures the `validateCheckpointContent` boundary can safely reject malformed fixtures before rendering.
- **Alternatives considered**: Loose typing with runtime optional chaining (rejected as it violates TypeScript standards and Constitution Principle VII).

## Decision 3: Matching UI Mechanics
- **Decision**: Tap-to-pair (Select an item in list A, then select its match in list B).
- **Rationale**: Highly accessible for VoiceOver users, deterministic, and avoids complex drag-and-drop gesture states which are prone to bugs on older devices.
- **Alternatives considered**: Drag-and-drop (rejected due to gesture complexity and accessibility challenges).
