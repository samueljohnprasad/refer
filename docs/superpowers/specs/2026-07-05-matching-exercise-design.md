# Matching Exercise Design Spec

## 1. Overview
The `MatchingExercise` component allows users to match a list of "Left" items (e.g., concepts) to a list of "Right" items (e.g., definitions). It replaces traditional drag-and-drop mechanics with a highly accessible, mobile-first Tap-to-Match interaction pattern.

## 2. Layout & UI Components
- **Header**: Mascot component presenting the `prompt` string via a speech bubble (with the standard `rounded-bl-[4px]` softened corner).
- **Grid Layout**: A `flex-row` container with a `gap-4` gap, dividing the screen into two equal columns (`flex-1` each).
  - Left column renders the original `left` items.
  - Right column renders the `right` items in a randomly shuffled order.
- **Card Elements**: Each item is wrapped in the existing `Card` component. Text uses a slightly smaller scale (`text-sm` or `text-base`) to accommodate the two-column constraints.

## 3. Interaction Flow & State Management
- **Selection State**:
  - Tapping a card selects it, applying a highlight border (e.g., `sage-400`).
  - The component tracks `selectedLeftId` and `selectedRightId`.
- **Pairing Mechanism**:
  - Once both a Left and Right card are selected, they form a "Match".
  - Matches are stored in a state object mapping `leftId -> rightId`.
  - Paired cards display a matching numerical badge (e.g., "1", "2") in the corner. This number corresponds to the pairing sequence (first pair gets 1, second gets 2, etc.) ensuring strong accessibility and visual association.
- **Unpairing**:
  - Tapping a card that is already part of a pair will break that pair, removing it from the matches object and freeing both cards to be re-matched.

## 4. Integration & Validation
- **NodeEngine Contract**: 
  - The `onInteraction` prop is called whenever the matches state updates.
  - The `isReady` flag is passed as `true` only when the number of formed matches equals the total number of pairs.
- **Payload Structure**:
  - Expects `payload.content.pairs`, an array of objects containing `{ left: string, right: string }`.
