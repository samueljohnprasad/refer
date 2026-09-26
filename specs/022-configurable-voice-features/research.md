# Phase 0 Research: Configurable Voice Features & Transcription Architecture

**Feature**: `022-configurable-voice-features` | **Date**: 2026-09-26

## Architectural Decisions & Trade-Offs

### 1. Central Configuration Architecture & Hook Layer

- **Decision**: Define typed global constants in `src/constants/voice.ts` (`GLOBAL_VOICE_CONFIG`) and export a lightweight consumer hook `useVoiceFeature()` from `src/hooks/useVoiceFeature.ts`.
- **Rationale**: 
  - Follows existing project patterns seen in `src/constants/ai.ts` (`GLOBAL_AI_CONFIG`).
  - Meets Ponytail / YAGNI rule: Avoids unnecessary Redux slices or external feature flag services for static/build-time/run-time flags.
  - Exposing via `useVoiceFeature()` allows instant component reactivity and future-proofs binding to dynamic remote configuration without refactoring call sites.
- **Alternatives Considered**:
  - *Redux slice*: Rejected as over-engineering for simple boolean configurations.
  - *Inline constants in each screen*: Violates Single Responsibility and DRY; leads to configuration drift across screens.

---

### 2. Dual-Engine Transcription Pipeline: Local On-Device (`whisper.rn`) vs Cloud Backend (`transcribeAudio`)

- **Decision**: Adapt `hooks/useTranscribeAudio.ts` to inspect `GLOBAL_VOICE_CONFIG.ENABLE_LOCAL_VOICE_TRANSCRIPTION`.
  - When `true`: Uses `whisper.rn` via `whisperContext.transcribe(fileUri)` for offline on-device speech-to-text.
  - When `false`: Calls `callMyFunction({ journal: base64Audio, isAudio: true })` via Supabase Edge Function `save-journal-ai-insights`.
- **Rationale**:
  - The codebase already contains `whisper.rn` and `useWhisperModels.ts` (currently wired for real-time dictation in `swiftui.tsx`).
  - Reusing this existing capability for audio file transcription in CBT and journaling avoids adding any new dependencies.
  - Cloud fallback ensures low-end devices or users who prefer not downloading local models can still transcribe reliably.
- **Alternatives Considered**:
  - *Hardcoding on-device only*: Breaks on platforms or architectures without local Whisper binary support or when storage is constrained.
  - *Hardcoding cloud only*: Incurs recurring LLM/Whisper API costs and prevents offline journaling.

---

### 3. UI Adaptation & Route Interception

- **Decision**:
  - `src/screens/DiscoveryScreen/components/RecordActionCluster.tsx`: Conditionally renders the primary microphone action. When `ENABLE_VOICE` is `false`, renders a balanced 2-action cluster (Photo + Text as primary).
  - `app/tabs/screens/(recording)/voice-recorder.tsx`: Route guard at top of component. If `!isVoiceEnabled`, immediately calls `router.replace("/tabs/screens/keyboard-recorder")`.
  - `src/screens/AllPromptsScreen/AllPromptsScreen.tsx` & `src/screens/JournalCalendarScreen/JournalCalendarScreen.tsx`: Selects navigation target based on `isVoiceEnabled ? "/tabs/screens/voice-recorder" : "/tabs/screens/keyboard-recorder"`.
  - `src/components/exercise/ExerciseTextComposer.tsx`: `ListComposer` and `SingleComposer` check `isVoiceEnabled`. When `false`, the waveform voice button is hidden and audio recording hooks are not invoked.
- **Rationale**:
  - Provides seamless, frictionless UX with zero dead buttons or broken links.
  - Single frame transition without UI jumps.
- **Alternatives Considered**:
  - *Showing disabled mic button with alert*: Frustrating and confusing to users. Hiding or substituting with Text is cleaner and matches modern iOS design standards.

---

### 4. Backend & Network Guard Strategy

- **Decision**: Ensure that when `ENABLE_VOICE` is `false` or local transcription is used:
  - Client never encodes or uploads multi-megabyte base64 audio payloads.
  - Edge function `save-journal-ai-insights` only receives text payloads (`{ journal: text, isAudio: false }`), cutting network bandwidth by ~99% and server memory overhead.
- **Rationale**:
  - Audio upload consumes significant mobile cellular data and battery.
  - Local transcription should yield instant local text, so only the transcript needs sync with Supabase.
