# Quickstart Validation Guide: Configurable Voice Features & Transcription Architecture

**Feature**: `022-configurable-voice-features` | **Date**: 2026-09-26

## Validation Scenarios

### Scenario 1: Voice Disabled - Discovery Capture Cluster Layout
- **Preconditions**: In `src/constants/voice.ts`, set `ENABLE_VOICE = false`.
- **Steps**:
  1. Launch app and navigate to Discovery tab.
  2. Observe the capture action cluster beneath Mochi.
- **Expected Outcome**:
  - The green round microphone button is absent.
  - The Text button is rendered as the primary capture action (or secondary beside Photo).
  - No empty whitespace gaps or broken layout alignment.

---

### Scenario 2: Voice Disabled - Route Guard & Redirection
- **Preconditions**: `ENABLE_VOICE = false`.
- **Steps**:
  1. Trigger deep link or programmatic navigation to `/tabs/screens/voice-recorder`.
- **Expected Outcome**:
  - The screen does not show microphone permissions or audio recorder UI.
  - User is immediately and smoothly replaced into `/tabs/screens/keyboard-recorder`.
  - Zero crashes, zero flash of unstyled content.

---

### Scenario 3: Voice Disabled - Prompt Library Routing
- **Preconditions**: `ENABLE_VOICE = false`.
- **Steps**:
  1. Open All Prompts screen (`/tabs/screens/all-prompts`).
  2. Tap on any prompt card.
- **Expected Outcome**:
  - Keyboard Journal screen opens with the selected prompt text pre-populated.
  - Does NOT open the voice recorder.

---

### Scenario 4: Voice Disabled - CBT Exercise Voice Button Suppression
- **Preconditions**: `ENABLE_VOICE = false`.
- **Steps**:
  1. Start "Thought Catcher" or "Thought Reframing" exercise.
  2. Navigate to a text input step.
- **Expected Outcome**:
  - `ExerciseTextComposer` renders text input box without the wave icon (`AudioWave01Icon`).
  - No audio recording session is prepared or initiated.

---

### Scenario 5: Voice Enabled + Local On-Device Transcription
- **Preconditions**: `ENABLE_VOICE = true`, `ENABLE_LOCAL_VOICE_TRANSCRIPTION = true`.
- **Steps**:
  1. Toggle device to Airplane Mode (no internet).
  2. Open voice recorder or tap wave button in CBT text composer.
  3. Speak a test sentence and tap Stop.
- **Expected Outcome**:
  - Spoken text appears transcribed directly on the device.
  - Console / network inspector logs show 0 HTTP requests dispatched to Supabase Edge Function.

---

### Scenario 6: Voice Enabled + Cloud Backend Transcription
- **Preconditions**: `ENABLE_VOICE = true`, `ENABLE_LOCAL_VOICE_TRANSCRIPTION = false`.
- **Steps**:
  1. Ensure device has internet connection.
  2. Record a journal entry or CBT thought.
  3. Tap Stop.
- **Expected Outcome**:
  - Audio is dispatched to Supabase `save-journal-ai-insights` edge function.
  - Returned transcript is rendered in the entry summary.
  - On-device Whisper models are not initialized or downloaded.

---

### Typecheck Verification
Run narrow TypeScript check:
```bash
npx tsc --noEmit
```
Expected: 0 new errors in voice config and integration files.
