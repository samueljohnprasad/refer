# Tasks: Configurable Voice Features & Transcription Architecture

**Input**: Design documents from `/specs/022-configurable-voice-features/` (`spec.md`, `plan.md`, `data-model.md`, `contracts/`, `research.md`, `quickstart.md`)

---

## Phase 1: Setup (Shared Infrastructure & Types)

**Purpose**: Centralized constants, configuration flags, and type definitions

- [X] T001 Define `GLOBAL_VOICE_CONFIG` constants with `ENABLE_VOICE` and `ENABLE_LOCAL_VOICE_TRANSCRIPTION` in `src/constants/voice.ts`
- [X] T002 [P] Define `GlobalVoiceConfig` and `VoiceFeatureState` types in `src/types/voice.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core hook providing reactive flags and route resolution for all user stories

**⚠️ CRITICAL**: Must be completed before user story implementation

- [X] T003 Create centralized `useVoiceFeature` hook in `src/hooks/useVoiceFeature.ts`

**Checkpoint**: Foundation ready - UI adaptation and transcription engine integration can now begin

---

## Phase 3: User Story 1 - Unified Voice Capture Toggle Across Application UI (Priority: P1) 🎯 MVP

**Goal**: Hide all microphone controls when `ENABLE_VOICE` is false, redirect voice routes to keyboard journal, and suppress audio buttons in CBT exercises

**Independent Test**: Set `ENABLE_VOICE = false`. Verify: (1) Discovery screen shows Photo + Text only; (2) Tapping prompts opens Keyboard Journal; (3) CBT exercises hide waveform wave buttons; (4) Deep-linking to voice recorder redirects to keyboard journal.

- [X] T004 [P] [US1] Adapt `RecordActionCluster` layout to conditionally render mic button and promote Text to primary action in `src/screens/DiscoveryScreen/components/RecordActionCluster.tsx`
- [X] T005 [P] [US1] Update `useDiscoveryScreenViewModel` to use dynamic `journalRoute` for recorder initiation in `src/screens/DiscoveryScreen/hooks/useDiscoveryScreenViewModel.ts`
- [X] T006 [P] [US1] Add `isVoiceEnabled` route guard to redirect to keyboard recorder in `app/tabs/screens/(recording)/voice-recorder.tsx`
- [X] T007 [P] [US1] Update prompt card selection to route to dynamic `journalRoute` in `src/screens/AllPromptsScreen/AllPromptsScreen.tsx`
- [X] T008 [P] [US1] Update quick journal button to route to dynamic `journalRoute` in `src/screens/JournalCalendarScreen/JournalCalendarScreen.tsx`
- [X] T009 [P] [US1] Update `VoiceJournal` assistant command to fallback to keyboard journal in `src/components/happy-assistant/useHappyAssistantCommandExecutor.tsx`
- [X] T010 [P] [US1] Update `ExerciseTextComposer` to hide `VoiceButton` and wave animation in `ListComposer` and `SingleComposer` when `!isVoiceEnabled` in `src/components/exercise/ExerciseTextComposer.tsx`
- [X] T011 [P] [US1] Update custom Thought Reframing steps to conditionally render voice controls based on `isVoiceEnabled` in `src/exercises/thoughtReframing/customSteps.tsx`

**Checkpoint**: User Story 1 functional - Entire UI seamlessly switches between voice-enabled and voice-disabled states

---

## Phase 4: User Story 2 - Configurable Transcription Execution (On-Device Local vs Cloud Backend) (Priority: P1)

**Goal**: Route speech-to-text to local `whisper.rn` on-device models when `ENABLE_LOCAL_VOICE_TRANSCRIPTION` is true, or to Supabase cloud function when false; toggle dictation in keyboard journal

**Independent Test**: Set `ENABLE_LOCAL_VOICE_TRANSCRIPTION = true`. Turn on Airplane Mode. Record voice in CBT composer; verify text transcribes offline without network request. Set to `false`; verify cloud function handles audio and local Whisper models do not load.

- [X] T012 [P] [US2] Update `useTranscribeAudio` to branch between on-device `whisper.rn` and cloud `callMyFunction` in `hooks/useTranscribeAudio.ts`
- [X] T013 [P] [US2] Update `KeyboardJournalBottomBar` to render `WhisperUI` dictation only when `isVoiceEnabled && isLocalTranscription` in `src/screens/DiscoveryScreen/components/KeyboardJournalBottomBar.tsx`
- [X] T014 [US2] Guard Whisper model initialization to avoid downloading or memory allocation when `!ENABLE_LOCAL_VOICE_TRANSCRIPTION || !ENABLE_VOICE` in `hooks/ai/useWhisperModels.ts`

**Checkpoint**: User Story 2 functional - Transcription engine switches cleanly between on-device Whisper and cloud backend

---

## Phase 5: User Story 3 - Backend & Network Protection Gating (Priority: P2)

**Goal**: Prevent unnecessary raw audio serialization and upload requests when voice or cloud transcription is disabled

**Independent Test**: Complete a journal entry with voice disabled or with local transcription active; monitor network logs to verify zero audio payloads are dispatched to backend endpoints.

- [X] T015 [P] [US3] Add audio upload guard in `hooks/useEmotionsAnalysis.tsx` to skip base64 audio encoding when voice or cloud transcription is disabled
- [X] T016 [US3] Add validation guard in `src/network/transcribeAudio.ts` to prevent audio invocations when voice features are disabled

**Checkpoint**: User Story 3 functional - Network bandwidth and server resources protected

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Type safety verification, quickstart validation, and knowledge graph synchronization

- [X] T017 [P] Run strict TypeScript typecheck verification (`npx tsc --noEmit`)
- [X] T018 [P] Verify scenarios in `specs/022-configurable-voice-features/quickstart.md`
- [X] T019 Update codebase knowledge graph with `graphify update .`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - US1 (UI Capture Toggle) and US2 (Transcription Engine) can proceed in parallel
  - US3 (Backend Protection) can proceed after US1/US2
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1 - Capture Toggle)**: Depends on T001, T002, T003
- **User Story 2 (P1 - Transcription Engine)**: Depends on T001, T002, T003
- **User Story 3 (P2 - Backend Protection)**: Depends on T001, T003, T012

---

## Parallel Opportunities

- **Phase 1 Setup**: T001 and T002 can execute in parallel
- **Phase 3 (US1)**: T004, T005, T006, T007, T008, T009, T010, and T011 can all execute in parallel
- **Phase 4 (US2)**: T012 and T013 can execute in parallel
- **Phase 5 (US3)**: T015 and T016 can execute in parallel

---

## Implementation Strategy

### MVP First (User Story 1 - Voice Capture Toggle)

1. Complete Phase 1: Setup (`src/constants/voice.ts`, `src/types/voice.ts`)
2. Complete Phase 2: Foundational (`src/hooks/useVoiceFeature.ts`)
3. Complete Phase 3: User Story 1 (Discovery cluster, prompts, route guard, CBT composer)
4. **STOP and VALIDATE**: Verify UI cleanly toggles between voice-enabled and voice-disabled

### Incremental Delivery

1. Complete Setup + Foundational → Base flags and hooks ready
2. Add US1 → Complete UI adaptation and route guards active (MVP)
3. Add US2 → On-device Whisper vs Cloud transcription engine switching active
4. Add US3 → Network and backend protection active
5. Polish & Verification → TypeScript verification and knowledge graph update
