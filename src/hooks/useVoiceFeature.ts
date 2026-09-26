import { useMemo } from "react";
import { GLOBAL_VOICE_CONFIG } from "@/src/constants/voice";
import type { VoiceFeatureState, JournalRoute } from "@/src/types/voice";

/**
 * Hook to access voice feature flags and dynamic routing targets.
 */
// ponytail: lightweight hook providing reactive flags and route resolution
export function useVoiceFeature(): VoiceFeatureState {
  return useMemo(() => {
    const isVoiceEnabled = Boolean(GLOBAL_VOICE_CONFIG.ENABLE_VOICE);
    const isLocalTranscription = Boolean(
      GLOBAL_VOICE_CONFIG.ENABLE_LOCAL_VOICE_TRANSCRIPTION,
    );
    const journalRoute: JournalRoute = isVoiceEnabled
      ? "/tabs/screens/voice-recorder"
      : "/tabs/screens/keyboard-recorder";

    return {
      isVoiceEnabled,
      isLocalTranscription,
      journalRoute,
    };
  }, []);
}
