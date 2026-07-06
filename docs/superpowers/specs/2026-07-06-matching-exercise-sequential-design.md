# Matching Exercise (Sequential Design)

## Overview
The Matching Exercise is being redesigned to use a "Sequential Matching" layout. Instead of presenting all items mixed together in a confusing grid, the UI will present one "Concept" (e.g., a time frame) at a time, and the user must select the correct "Description" from a vertical list of options. This reduces cognitive load and provides a much clearer interaction model for text-heavy matching exercises.

## Layout & Components

1. **Header**
   - Renders the Mascot and the exercise prompt (e.g., "Match time of night to sleep stage composition:").
   
2. **Active Concept**
   - The current concept to match is displayed prominently at the top, just below the header.
   - It will use a distinct visual style (e.g., a solid blue or gray background card with bold text) to differentiate it from the clickable options below.
   
3. **Options List (Descriptions)**
   - All remaining, unmatched descriptions are displayed in a vertical list below the active concept.
   - These are rendered as standard interactive Cards (using the `answer` variant).
   - The options are randomly shuffled on initial mount.

## State Management

- `unmatchedConcepts`: An array of remaining indices representing the left-side concepts. The first element is always the "Active Concept".
- `unmatchedOptions`: An array of remaining indices representing the right-side descriptions.
- `matches`: A record of successful matches (mapping concept index to description index).
- `interactionState`: Local state to manage visual feedback (e.g., `selectedWrongId` for briefly flashing red, or `matchedId` for briefly flashing green before progressing).

## Interaction Flow

1. **User taps an option (Description Card):**
   - The system checks if the tapped description's original index matches the active concept's index.
2. **On Correct Match:**
   - Visual feedback is shown (e.g., the option briefly turns green).
   - A short delay (e.g., 400ms) occurs to allow the user to see the success state.
   - The active concept is removed from `unmatchedConcepts` (revealing the next one).
   - The matched description is removed from `unmatchedOptions`.
   - The match is recorded in the `matches` state, and `onInteraction` is called to sync the state.
3. **On Incorrect Match:**
   - Visual feedback is shown (e.g., the option briefly flashes red).
   - No penalty is applied (safe failure). The user can immediately try another option.
4. **Completion:**
   - When all pairs are matched (`unmatchedConcepts.length === 0`), `isReady` becomes true, and `onInteraction` signals completion. The UI can display a simple "All matched!" message or remain empty at the bottom while the engine handles progression.

## Error Handling & Edge Cases
- **Missing Payload:** If `pairs` is empty or undefined, the component renders gracefully without crashing.
- **Pre-filled Data:** If `savedResponse.matches` exists on mount, the component restores state by filtering out already matched pairs from `unmatchedConcepts` and `unmatchedOptions`.
- **Rapid Tapping:** The component must ignore taps on other cards while a correct or incorrect match animation/delay is currently playing.

## Extensibility
This design leverages the existing `Card` component. Any new variants needed for success/error states (e.g., `success`, `error`) will either be added to `Card` or simulated locally using NativeWind classes if `Card` does not support them natively.
