/**
 * Types for Voice Features and Configuration
 */

export interface GlobalVoiceConfig {
  readonly ENABLE_VOICE: boolean;
  readonly ENABLE_LOCAL_VOICE_TRANSCRIPTION: boolean;
}

export type JournalRoute =
  | "/tabs/screens/voice-recorder"
  | "/tabs/screens/keyboard-recorder";

export interface VoiceFeatureState {
  /** Master flag: true if voice capture/recording is allowed across app */
  readonly isVoiceEnabled: boolean;
  /** Transcription strategy: true if running local on-device whisper */
  readonly isLocalTranscription: boolean;
  /** Dynamic target route for quick journal actions */
  readonly journalRoute: JournalRoute;
}
