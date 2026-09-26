/**
 * Global Configuration for Voice and Speech Features
 */
// ponytail: single source of truth for voice capture and transcription engines
export const GLOBAL_VOICE_CONFIG = {
  /**
   * Master toggle for voice input capabilities across the entire application.
   * - true: Voice recording UI is active (Discovery mic button, voice recorder route, CBT waveform buttons, voice prompts).
   * - false: All voice recording UI is hidden; all prompt taps and recorder routes smoothly redirect to text journaling.
   */
  ENABLE_VOICE: false,

  /**
   * Engine strategy for speech-to-text conversion.
   * - true: Transcriptions run locally on-device using whisper.rn models (offline-capable, zero cloud API cost).
   * - false: Transcriptions run via remote Supabase Edge Function (cloud AI backend).
   */
  ENABLE_LOCAL_VOICE_TRANSCRIPTION: false,
} as const;
