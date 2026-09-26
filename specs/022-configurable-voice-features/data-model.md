# Phase 1 Data Model: Configurable Voice Features & Transcription Architecture

**Feature**: `022-configurable-voice-features` | **Date**: 2026-09-26

## Domain Entities & Configuration Schema

### 1. GlobalVoiceConfig (Configuration Schema)

Represents the centralized feature flags governing audio recording and speech recognition across the client.

```typescript
export interface GlobalVoiceConfig {
  /**
   * Master toggle for voice input capabilities.
   * - true: Voice recording UI is enabled (discovery mic, voice recorder route, CBT waveforms, prompt routing to voice).
   * - false: All voice recording UI is hidden; all prompt and recorder routes divert to keyboard journal.
   */
  readonly ENABLE_VOICE: boolean;

  /**
   * Engine strategy for speech-to-text conversion.
   * - true: Transcriptions run locally on-device via whisper.rn models (offline-capable, zero cloud API cost).
   * - false: Transcriptions run via remote Supabase Edge Function (cloud AI backend).
   */
  readonly ENABLE_LOCAL_VOICE_TRANSCRIPTION: boolean;
}
```

---

### 2. VoiceFeatureState (Consumer Hook State)

The resolved state object consumed by UI components, routers, and CBT engines.

```typescript
export interface VoiceFeatureState {
  /** Whether any voice recording or capture affordance should be presented */
  readonly isVoiceEnabled: boolean;

  /** Whether transcription is executing locally on device */
  readonly isLocalTranscriptionEnabled: boolean;

  /** Resolved route for primary journaling capture ('/tabs/screens/voice-recorder' or '/tabs/screens/keyboard-recorder') */
  readonly defaultJournalRoute: string;

  /** Helper to verify if real-time dictation is supported in text fields */
  readonly canDictateRealtime: boolean;
}
```

---

### 3. TranscriptionExecutionPayload

Input and output contracts for the dual-engine transcription pipeline.

```typescript
export type TranscriptionEngine = "local_whisper" | "cloud_edge_function";

export interface TranscribeAudioParams {
  /** Local filesystem URI to audio file (e.g., file:///...) */
  readonly uri: string;
  /** Force specific engine override (optional) */
  readonly engineOverride?: TranscriptionEngine;
}

export interface TranscribeAudioResult {
  /** Resulting converted text transcript */
  readonly transcript: string;
  /** Audio duration in milliseconds */
  readonly duration: number;
  /** Which engine performed the conversion */
  readonly engineUsed: TranscriptionEngine;
}
```

---

### 4. CaptureActionClusterConfig

Defines the dynamic button layout for the Journal Discovery screen.

| State | Primary Action | Secondary Actions | Route / Trigger |
|---|---|---|---|
| `ENABLE_VOICE: true` | Voice (`mic.fill`, green round 68pt) | Photo (52pt) + Text (52pt) | Voice: `/tabs/screens/voice-recorder`<br>Text: `/tabs/screens/keyboard-recorder`<br>Photo: `isImageJournalVisible(true)` |
| `ENABLE_VOICE: false` | Text (`square.and.pencil`, green round 68pt) | Photo (52pt) | Text: `/tabs/screens/keyboard-recorder`<br>Photo: `isImageJournalVisible(true)` |

