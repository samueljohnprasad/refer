# Conversational "Read and Learn" Exercise Design

## Purpose
Convert the static, horizontally-paged "Read and Learn" cards into a dynamic, vertical conversational interface. This increases cognitive engagement, utilizes screen real estate better, and establishes the Mascot (Panda) as an active coach.

## Architecture & Components
- **Component:** `src/components/exercise/LearnCardsExercise.tsx` will be completely rewritten.
- **Layout:** Vertical `Animated.ScrollView` or standard `ScrollView` that auto-scrolls to the bottom.
- **Data Flow:** The component receives `payload.content.cards`. It maintains a state of `visibleCards` (a number representing how many cards are currently revealed, starting at 1).
- **Interaction:** A pulsing "Tap to continue" pill floats below the latest chat bubble. Tapping it increments the `visibleCards` count. Once the last message is read, this pill disappears.
- **Completion:** Once `visibleCards === cards.length`, `onInteraction(true)` is called to unlock the main screen's Continue button.

## Visual Details & Premium Polish
- **Message Bubbles:** Use the `OrganicSpeechTail` for the bottom-most message. Stacked messages from the same sender (Mascot) do not repeat the avatar and use tighter vertical margins to feel like a cohesive thought.
- **Animations:** 
  - New messages slide up and fade in using Reanimated layout animations (e.g., `entering={SlideInDown.springify().damping(20).stiffness(200)}`).
- **Haptics:** `Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)` triggers perfectly synced with the message appearance.

## Ambiguity / Scope Constraints Resolved
- *How does auto-scroll work?* We will use a `ref` on the `ScrollView` and call `scrollToEnd({ animated: true })` whenever `visibleCards` increments.
- *Typing Indicator?* We will skip the typing indicator for this iteration to keep the interaction fast and snappy, but the layout animation provides enough visual feedback.
- *Is this scoped appropriately?* Yes. It is a contained replacement of a single exercise component.

## Dependencies
- `react-native-reanimated`
- `expo-haptics`
- Shared UI components: `Text`, `Mascot`, `OrganicSpeechTail`
