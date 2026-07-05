# Multiple Choice Component Design

## Objective
Implement the `MultipleChoiceExercise` component and update the core engine (`NodeEngine`, `LessonScreen`) to support a 2-step "Check" flow with a colored success/error footer banner, matching the Duolingo interaction model.

## 1. Data Structure Updates
- The JSON mock data for `multiple_choice` exercises will be updated to support an optional `subPrompt` string inside `content`.
- The existing `prompt` will be used as the speech bubble text, and `subPrompt` will be displayed below it.

```typescript
type MultipleChoiceContent = {
  prompt: string;
  subPrompt?: string; // e.g., "The speaker's talking to..."
  options: Array<{
    id: string;
    text: string;
    correct: boolean;
  }>;
};
```

## 2. MultipleChoiceExercise Component
- **Header:** Displays a generic title like "Read and respond" or "Knowledge Check".
- **Mascot & Speech Bubble:** Uses the `Mascot` component and a custom speech bubble view (similar to `LearnCardsExercise`) to display `content.prompt`.
- **Sub-prompt:** A `Text` element displaying `content.subPrompt` if it exists.
- **Options List:** A vertical list of buttons for each option. 
  - Unselected: White background, standard border.
  - Selected: Blue/gray background or border outline.
- **Interaction:** When tapped, the component records `selectedOptionId`. It then calls `onInteraction({ optionId, isCorrect })`.

## 3. NodeEngine Updates
- Introduce a new state `checkStatus: 'idle' | 'success' | 'error'`.
- When an exercise is `isScored`, the primary button label becomes "Check".
- When the user presses "Check":
  - `NodeEngine` checks `currentResponse.isCorrect`.
  - If true, `setCheckStatus('success')`.
  - If false, `setCheckStatus('error')`.
- When `checkStatus` is `'success'` or `'error'`:
  - The primary button label becomes "Continue".
  - Pressing "Continue" advances to the next exercise and resets `checkStatus` to `'idle'`.

## 4. LessonScreen Footer Updates
- Add `status?: 'default' | 'success' | 'error'` to `ActionFooterProps`.
- Update `ActionFooter` styling:
  - If `success`: Footer background becomes light green (`bg-green-100`). Display a green banner with a checkmark and "Awesome!" text above the button. The button becomes solid green.
  - If `error`: Footer background becomes light red (`bg-red-100`). Display a red banner with an "X" and "Incorrect" text above the button. The button becomes solid red.
  - If `default`: Retain current white background styling.

## 5. Testing & Validation
- Ensure that the two-step flow works smoothly without breaking non-scored exercises (which should skip the "Check" step and go straight to "Continue").
- Ensure smooth transitions and accurate layout mapping for the speech bubble.
