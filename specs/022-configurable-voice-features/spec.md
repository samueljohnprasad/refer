# Feature Specification: Configurable Voice Features & Transcription Architecture

**Feature Branch**: `022-configurable-voice-features`

**Created**: 2026-09-26

**Status**: Draft

**Input**: User description: "now, based on the lacks [flags], we need to enable or disable this functions. This voice related features. On the UI and functionality, as in the supervise [supabase] also. we need one more flag for local voice transcriptions, which is running on ondevice"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Unified Voice Capture Toggle Across Application UI (Priority: P1)

A user opens the application to reflect on their thoughts, complete a daily journal entry, or participate in a CBT microlearning exercise. The product and system administrators configure whether voice capture capabilities are active across the application via a central configuration setting.

When voice features are disabled:
- The Journal Discovery screen adapts its capture actions cleanly. The prominent microphone button is hidden, and the text journaling action is presented as the primary input affordance alongside photo capture.
- Tapping any prompt card in the prompt library or journal calendar routes directly to the keyboard journaling interface instead of an audio recorder.
- Navigating directly to the voice recording screen (via direct link, assistant command, or restored state) gracefully bounces the user to the keyboard journal without errors or blank screens.
- In all cognitive-behavioral exercises and text composers, the inline voice recording button and wave animation controls are hidden, providing an uncluttered, distraction-free typing interface.

When voice features are enabled:
- The full suite of voice input capabilities is accessible: microphone capture on the discovery screen, audio journal recording, quick voice prompts, and voice dictation inside CBT exercises.

**Why this priority**: Core architectural gate. Determines user input modalities across the entire product. Prevents broken navigation, dead buttons, and confusing user states when audio recording is toggled off.

**Independent Test**: Set the global voice toggle to disabled. Open the app and verify: (1) Discovery screen shows only Photo and Text actions; (2) Tapping a prompt opens Keyboard Journal; (3) Opening CBT exercises displays only text inputs without mic/waveform buttons. Set toggle to enabled and verify all audio buttons and recording flows reappear.

**Acceptance Scenarios**:

1. **Given** voice features are disabled in configuration, **When** a user views the Journal Discovery screen, **Then** the voice capture button is hidden and text journaling is presented as the primary capture mode.
2. **Given** voice features are disabled, **When** a user selects a quick prompt from the prompt catalog or calendar, **Then** the app opens the text journaling screen with the prompt pre-populated.
3. **Given** voice features are disabled, **When** an assistant command or route request triggers voice recording, **Then** the system automatically navigates to the text journaling screen instead.
4. **Given** voice features are disabled, **When** a user engages in any CBT exercise with text input steps, **Then** all voice recording wave buttons are hidden and only standard keyboard entry is available.
5. **Given** voice features are enabled in configuration, **When** a user interacts with the discovery screen or CBT exercises, **Then** all voice recording buttons and flows operate normally.

---

### User Story 2 - Configurable Transcription Execution (On-Device Local vs Cloud Backend) (Priority: P1)

When voice features are enabled, the application transcribes spoken thoughts into readable text. The application supports two distinct execution strategies for transcription, controlled by a dedicated configuration flag:

1. **Local On-Device Transcription**: When the local transcription flag is active, audio speech is converted to text entirely on the user's device using local speech recognition models. This enables completely offline voice dictation, provides absolute data privacy (audio never leaves the device), and eliminates third-party cloud compute costs.
2. **Cloud Backend Transcription**: When the local transcription flag is inactive, audio recordings are transmitted to the secure cloud backend for server-side processing and enrichment. Local model downloads, background memory retention, and on-device processing overhead are bypassed, keeping device storage and battery consumption minimal.

**Why this priority**: Governs data privacy, offline usability, device storage footprint, and backend compute economics. Gives the platform full control over where compute heavy speech recognition executes.

**Independent Test**: Enable voice and set transcription flag to local on-device. Place device in airplane mode and record a journal or CBT reflection; verify the spoken words are accurately transcribed without network connectivity. Then toggle transcription flag to cloud backend; verify that local models are not downloaded and audio is sent to the backend endpoint.

**Acceptance Scenarios**:

1. **Given** voice is enabled and local transcription is active, **When** a user records audio in a journal or exercise, **Then** transcription executes locally on the device without transmitting audio over the network.
2. **Given** local transcription is active, **When** a user is offline with no internet connection, **Then** voice transcription continues to function reliably.
3. **Given** local transcription is active, **When** a user types in the keyboard journal, **Then** a real-time on-device speech-to-text dictation button is available.
4. **Given** local transcription is disabled and voice is enabled, **When** a user records audio, **Then** audio is processed via the secure cloud backend endpoint.
5. **Given** local transcription is disabled, **When** the app runs, **Then** on-device speech recognition models are not initialized or downloaded into device memory.

---

### User Story 3 - Backend & Network Protection Gating (Priority: P2)

When voice features are disabled or local transcription is selected, the application prevents unnecessary backend audio processing requests from being dispatched to the cloud infrastructure.

If the client or cloud backend detects that voice processing is turned off or redirected locally:
- Network clients bypass audio payload serialization, saving bandwidth and upload latency.
- Backend cloud functions validate whether audio processing is accepted and return clear, non-failing status responses if text-only processing is requested.
- Client state machines ensure that journal entries completed via text or image never trigger audio processing pipelines.

**Why this priority**: Prevents wasted network bandwidth, reduces server compute costs, and prevents edge function execution errors when audio features are inactive.

**Independent Test**: Disable voice features and submit a journal entry. Monitor network logs to verify that no audio payloads or audio processing requests are dispatched to backend endpoints.

**Acceptance Scenarios**:

1. **Given** voice features are disabled, **When** a journal entry is submitted, **Then** only text and metadata are dispatched to the backend, with zero audio payload traffic.
2. **Given** local transcription is active, **When** a voice journal entry is completed, **Then** only the locally generated text transcript is sent to the backend for insights, with zero raw audio data uploaded.
3. **Given** audio processing is inactive, **When** a backend service receives an entry, **Then** it processes the text directly without initializing speech recognition services.

---

### Edge Cases

- **Toggling Configuration Mid-Session**: If the configuration flags change while the application is active in memory, the user interface and routing dynamically reflect the updated configuration without requiring a force restart.
- **Background App Resumption on Gated Screen**: If a user suspends the application while on the voice recorder screen and returns after voice features have been disabled, the screen detects the disabled state and immediately redirects back to the primary home view or keyboard recorder.
- **Local Model Storage Exhaustion**: If local on-device transcription is enabled but the device lacks sufficient storage to download or run the speech model, the system gracefully falls back to keyboard input or cloud processing with a polite explanation.
- **Audio Permission Denied While Voice Enabled**: If voice features are enabled but the user has denied microphone permissions at the operating system level, tapping voice actions provides a clear, helpful prompt guiding the user to OS settings without crashing or freezing.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a centralized, single source of truth configuration defining:
  - `ENABLE_VOICE`: Master boolean toggle enabling or disabling voice capture and recording features app-wide.
  - `ENABLE_LOCAL_VOICE_TRANSCRIPTION`: Boolean toggle specifying whether voice-to-text runs locally on-device or via cloud backend.
- **FR-002**: System MUST dynamically adapt the Journal Discovery action cluster based on `ENABLE_VOICE`:
  - When `false`: Hide the microphone button and render text capture as the primary action alongside photo capture.
  - When `true`: Render photo, primary microphone, and text capture actions.
- **FR-003**: System MUST intercept direct navigation or deep links to the voice recorder route when `ENABLE_VOICE` is `false` and redirect the user to the keyboard recorder without visual glitches or unhandled errors.
- **FR-004**: System MUST dynamically route prompt selections from all prompt screens and the calendar screen to the keyboard recorder when `ENABLE_VOICE` is `false`, and to the voice recorder when `ENABLE_VOICE` is `true`.
- **FR-005**: System MUST route assistant commands requesting voice journaling to the keyboard recorder when `ENABLE_VOICE` is `false`.
- **FR-006**: System MUST hide all voice recording buttons, waveform icons, and recording triggers in `ExerciseTextComposer` and CBT exercise steps when `ENABLE_VOICE` is `false`.
- **FR-007**: System MUST execute speech-to-text conversion locally on-device without network transmission when `ENABLE_VOICE` is `true` and `ENABLE_LOCAL_VOICE_TRANSCRIPTION` is `true`.
- **FR-008**: System MUST route speech-to-text conversion to the cloud backend endpoint when `ENABLE_VOICE` is `true` and `ENABLE_LOCAL_VOICE_TRANSCRIPTION` is `false`.
- **FR-009**: System MUST display the real-time dictation button in the keyboard journal bottom toolbar only when both `ENABLE_VOICE` and `ENABLE_LOCAL_VOICE_TRANSCRIPTION` are `true`.
- **FR-010**: System MUST omit initializing or downloading local speech recognition models when `ENABLE_LOCAL_VOICE_TRANSCRIPTION` is `false` or when `ENABLE_VOICE` is `false`.
- **FR-011**: System MUST bypass raw audio upload requests to the backend when local transcription is active or when voice features are disabled.

### Key Entities

- **Voice Feature Configuration**: A centralized configuration entity containing boolean flags controlling voice availability (`ENABLE_VOICE`) and transcription execution strategy (`ENABLE_LOCAL_VOICE_TRANSCRIPTION`).
- **Journal Capture Mode**: The active modality for capturing thoughts (Voice Recording, Keyboard Text, Photo Scan).
- **Transcription Execution Strategy**: The processing location and engine for speech recognition (`LocalOnDevice` vs `CloudBackend`).
- **Exercise Composer State**: The display and functional state of the text composer, conditionally incorporating audio recording capabilities based on feature flags.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of voice-related UI affordances (microphone buttons, audio waves, voice action buttons) are completely hidden when `ENABLE_VOICE` is disabled.
- **SC-002**: 100% of navigation requests targeting voice recording seamlessly redirect to keyboard journaling without error screens or layout breakage when voice is disabled.
- **SC-003**: Zero network requests for audio processing are made when speech is transcribed locally on-device (`ENABLE_LOCAL_VOICE_TRANSCRIPTION: true`).
- **SC-004**: 0 MB of network data is downloaded for local speech models when `ENABLE_LOCAL_VOICE_TRANSCRIPTION` is disabled.
- **SC-005**: User spoken or written input experiences 0% data loss across all transition and fallback states.
- **SC-006**: Mode switching and UI adaptation respond within 16 milliseconds (single frame) with zero layout shifting or flicker.

---

## Assumptions

- **Centralized Client Configuration**: Configuration flags are defined in a clean, typed constants file accessible to all UI layers, hooks, and services, with potential to bind to remote configuration in the future.
- **Dual Engine Availability**: The app environment supports both on-device model execution and cloud API endpoints.
- **Non-Destructive Degradation**: Disabling voice features strictly narrows the input affordances to text and image without impacting historical voice journal playback or stored transcripts.
- **Audio Playback Distinction**: Disabling voice recording and transcription does not disable ambient audio or sound effects (e.g. soothing exercises, bells, completion chimes).
