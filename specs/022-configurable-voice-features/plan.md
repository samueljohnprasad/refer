# Implementation Plan: Configurable Voice Features & Transcription Architecture

**Branch**: `022-configurable-voice-features` | **Date**: 2026-09-26 | **Spec**: [specs/022-configurable-voice-features/spec.md](file:///Users/samuelprasad/Desktop/happy/journals/specs/022-configurable-voice-features/spec.md)

**Input**: Feature specification from `/specs/022-configurable-voice-features/spec.md`

## Summary

Implement a unified, configurable architecture for voice capture features and speech transcription execution. The system introduces two centralized configuration flags (`ENABLE_VOICE` and `ENABLE_LOCAL_VOICE_TRANSCRIPTION`) via `GLOBAL_VOICE_CONFIG` and a lightweight consumer hook (`useVoiceFeature`). When voice is disabled, all microphone UI affordances across the Journal Discovery cluster, prompt library, calendar, assistant, and CBT exercises adapt dynamically or redirect to text entry with zero data loss or layout breakage. When voice is enabled, transcription execution cleanly toggles between offline, on-device Whisper (`whisper.rn`) and cloud AI backend (`transcribeAudio` edge function), optimizing for privacy, offline resilience, and server economics.

## Technical Context

**Language/Version**: TypeScript 5.3+, React Native 0.76+ (Expo SDK 52 / React 19)

**Primary Dependencies**: `expo-audio`, `whisper.rn`, `expo-router`, `jotai`, React Native Reanimated, `@hugeicons/react-native`, Expo Symbols

**Storage**: Local file system (`expo-file-system`) for temporary recording WAV/M4A files + cached GGML Whisper models in document directory

**Testing**: Strict TypeScript verification (`npx tsc --noEmit`), manual smoke scenarios via `quickstart.md`. Unit test writing disabled per repo instructions.

**Target Platform**: iOS 26+ (Apple HIG, NativeWind, SF Symbols)

**Project Type**: Universal Mobile Application (React Native / Expo Router)

**Performance Goals**: UI adaptation rendered in single frame (<16ms); route redirect to keyboard recorder <50ms without visible flicker; local transcription started immediately upon recording completion.

**Constraints**: Single source of truth for voice config; no unrequested abstractions (Ponytail / YAGNI); no breaking existing text/photo journal entry paths; offline audio privacy when local transcription flag is active.

**Scale/Scope**: Impacts 8 touchpoints: `RecordActionCluster`, `useDiscoveryScreenViewModel`, `voice-recorder.tsx`, `AllPromptsScreen`, `JournalCalendarScreen`, `useHappyAssistantCommandExecutor`, `ExerciseTextComposer`, and `useTranscribeAudio`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evaluation |
| :--- | :--- | :--- |
| **I. One Learning Job Per Exercise** | **PASS** | Gating audio input simply alters the input modality (voice or keyboard) without adding competing cognitive tasks. |
| **II. One Active Decision at a Time** | **PASS** | Hiding disabled voice controls simplifies the active choice area; does not introduce competing controls. |
| **III. Resumable, Deterministic State** | **PASS** | State reconstruction is unaffected. Text entered via typing or speech transcription is stored identically in deterministic schema. |
| **IV. Internal Buttons Update; Only Final Continue Advances** | **PASS** | Waveform and microphone tap actions update current text field in place; do not cause premature exercise advance. |
| **V. Private Data — Store IDs and State, Never Therapeutic Text** | **PASS** | When `ENABLE_LOCAL_VOICE_TRANSCRIPTION` is true, audio never leaves the device, enhancing data privacy. |
| **VI. Premium, Editorial, Calm Design** | **PASS** | Clean transitions, proper 3D button styling, no dead buttons or disabled ghost controls. |
| **VII. Minimal, Ponytail-Mode Code (YAGNI)** | **PASS** | Simple constants object + hook; no heavy Redux slice or third-party feature flag SDKs. |

## Project Structure

### Documentation (this feature)

```text
specs/022-configurable-voice-features/
├── spec.md              # Feature specification
├── plan.md              # Implementation plan (this file)
├── research.md          # Phase 0 architectural decisions & trade-offs
├── data-model.md        # Phase 1 domain entities & configuration schemas
├── quickstart.md        # Phase 1 validation scenarios & verification guide
├── contracts/           # Phase 1 TypeScript interfaces & contracts
│   ├── voice-config-contract.ts
│   └── transcription-contract.ts
└── checklists/
    └── requirements.md  # Quality verification checklist
```

### Source Code (repository root)

```text
src/
├── constants/
│   └── voice.ts                            # Central GLOBAL_VOICE_CONFIG definition
├── hooks/
│   └── useVoiceFeature.ts                  # Lightweight consumer hook for flags and routes
├── components/
│   └── exercise/
│       └── ExerciseTextComposer.tsx        # Conditionally mounts voice button based on isVoiceEnabled
└── screens/
    ├── DiscoveryScreen/
    │   ├── components/
    │   │   ├── RecordActionCluster.tsx     # Conditionally renders mic button; adapts layout
    │   │   └── KeyboardJournalBottomBar.tsx# Conditionally renders WhisperUI dictation
    │   └── hooks/
    │       └── useDiscoveryScreenViewModel.ts # Uses dynamic journalRoute
    ├── AllPromptsScreen/
    │   └── AllPromptsScreen.tsx            # Routes prompt tap to journalRoute
    └── JournalCalendarScreen/
        └── JournalCalendarScreen.tsx       # Routes quick journal to journalRoute

app/
└── tabs/screens/(recording)/
    └── voice-recorder.tsx                  # Adds isVoiceEnabled route guard redirect to keyboard-recorder

hooks/
└── useTranscribeAudio.ts                   # Conditionally branches between whisper.rn and cloud function
```

**Structure Decision**: Clean feature architecture integrating directly into existing directories (`src/constants/`, `src/hooks/`, `src/screens/DiscoveryScreen/`, `src/components/exercise/`). No unnecessary folders or wrappers created.

## Complexity Tracking

*No violations. Clean architecture and Ponytail minimalism maintained.*
