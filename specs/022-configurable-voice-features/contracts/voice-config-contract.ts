/**
 * Contract: Voice Feature Configuration & Hook Interface
 */

export interface GlobalVoiceConfig {
  readonly ENABLE_VOICE: boolean;
  readonly ENABLE_LOCAL_VOICE_TRANSCRIPTION: boolean;
}

export interface UseVoiceFeatureReturn {
  /** Master flag: true if voice capture/recording is allowed across app */
  readonly isVoiceEnabled: boolean;
  /** Transcription strategy: true if running local on-device whisper */
  readonly isLocalTranscription: boolean;
  /** Dynamic target route for quick journal actions */
  readonly journalRoute: "/tabs/screens/voice-recorder" | "/tabs/screens/keyboard-recorder";
}
