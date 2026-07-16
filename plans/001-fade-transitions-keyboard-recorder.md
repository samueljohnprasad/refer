# 001 — Add fade transitions to the keyboard and voice recorder states

- **Status**: TODO
- **Commit**: (HEAD)
- **Severity**: HIGH
- **Category**: Missed opportunities
- **Estimated scope**: 2 files (`keyboard-recorder.tsx`, `voice-recorder.tsx`), minor edits

## Problem

The recording flows (`app/tabs/screens/keyboard-recorder.tsx` and `app/tabs/screens/voice-recorder.tsx`) instantly teleport between states (Recording -> Analyzing -> Result) with no bridge. This jarring screen swap breaks spatial consistency and makes the UI feel unpolished. 

```tsx
/* app/tabs/screens/keyboard-recorder.tsx:35-56 — current */
        {stepper === 0 && (
          <KeyboardJournalScreen
            onClose={onClose}
            onStop={(text) => {
              setJournalText(text);
              setStepper(1);
            }}
          />
        )}
        {stepper === 1 && journalText && (
          <EmotionAnalysisLoadingScreen
            journalText={journalText}
            onAnalysisCompleted={({ insights }) => {
              setInsights(insights);
              setStepper(2);
            }}
            onCancel={onClose}
          />
        )}
        {stepper === 2 && (
          <JournalEntryScreen insights={insights} onClose={onClose} />
        )}
```

## Target

The exact end state introduces a subtle, fast crossfade between these states using `react-native-reanimated`. The duration should be kept under 300ms so it doesn't block the user, using an ease-out curve.

```tsx
/* target (applied to both keyboard-recorder.tsx and voice-recorder.tsx) */
import Animated, { FadeIn, FadeOut, Easing } from 'react-native-reanimated';

// ... Inside the component render:

        {stepper === 0 && (
          <Animated.View 
            entering={FadeIn.duration(250).easing(Easing.out(Easing.ease))}
            exiting={FadeOut.duration(200).easing(Easing.out(Easing.ease))}
            style={{ flex: 1 }}
          >
            <KeyboardJournalScreen
              onClose={onClose}
              onStop={(text) => {
                setJournalText(text);
                setStepper(1);
              }}
            />
          </Animated.View>
        )}
        {stepper === 1 && journalText && (
          <Animated.View 
            entering={FadeIn.duration(250).easing(Easing.out(Easing.ease))}
            exiting={FadeOut.duration(200).easing(Easing.out(Easing.ease))}
            style={{ flex: 1 }}
          >
            <EmotionAnalysisLoadingScreen
              journalText={journalText}
              onAnalysisCompleted={({ insights }) => {
                setInsights(insights);
                setStepper(2);
              }}
              onCancel={onClose}
            />
          </Animated.View>
        )}
        {stepper === 2 && (
          <Animated.View 
            entering={FadeIn.duration(250).easing(Easing.out(Easing.ease))}
            exiting={FadeOut.duration(200).easing(Easing.out(Easing.ease))}
            style={{ flex: 1 }}
          >
            <JournalEntryScreen insights={insights} onClose={onClose} />
          </Animated.View>
        )}
```

## Repo conventions to follow

- The repository uses `react-native-reanimated` for standard gesture and transition motion.
- Keep `style={{ flex: 1 }}` on the `Animated.View` wrappers to ensure the inner screens continue to occupy the full modal space.

## Steps

1. In `app/tabs/screens/keyboard-recorder.tsx`, import `Animated`, `FadeIn`, `FadeOut`, and `Easing` from `react-native-reanimated`.
2. Wrap each conditionally rendered component (`stepper === 0`, `stepper === 1`, `stepper === 2`) in an `<Animated.View>` with the `entering` and `exiting` props exactly as defined in the target.
3. In `app/tabs/screens/voice-recorder.tsx`, repeat Steps 1 and 2 for the voice recorder flow.

## Boundaries

- Do NOT touch `KeyboardJournalScreen`, `EmotionAnalysisLoadingScreen`, `VoiceRecorder`, or `JournalEntryScreen` components themselves.
- Do NOT add new dependencies. Reanimated is already available.

## Verification

- **Mechanical**: Run `tsc` to verify type safety.
- **Feel check**: run the UI, trigger the keyboard or voice recorder flow, and confirm:
  - The transition from Recording to Analyzing crossfades smoothly without a jarring flash or layout jump.
  - The transition takes exactly 250ms and feels responsive, not sluggish.
- **Done when**: All three states in both files have smooth enter and exit transitions without breaking the layout.
