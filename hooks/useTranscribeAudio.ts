import { useCallback, useState } from "react";
import { callMyFunction } from "@/src/network/transcribeAudio";
import { File } from "expo-file-system";
import { getAudioDuration } from "@/src/utils/date";
import { useVoiceFeature } from "@/src/hooks/useVoiceFeature";
import { useWhisperModels } from "@/hooks/ai/useWhisperModels";

interface TranscribeResult {
  transcript: string;
  duration: number;
}

export const useTranscribeAudio = () => {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const { isVoiceEnabled, isLocalTranscription } = useVoiceFeature();
  const { whisperContext, initializeWhisperModel } = useWhisperModels();

  const transcribeAudio = useCallback(
    async (uri: string): Promise<TranscribeResult> => {
      // ponytail: return empty if voice disabled
      if (!isVoiceEnabled) {
        return { transcript: "", duration: 0 };
      }

      setIsTranscribing(true);
      try {
        const duration = (await getAudioDuration(uri)) || 0;

        // ponytail: route to on-device Whisper when local transcription enabled
        if (isLocalTranscription) {
          try {
            let context = whisperContext;
            if (!context) {
              const initRes = await initializeWhisperModel("tiny");
              context = initRes?.whisperContext || null;
            }
            if (context) {
              const { promise } = context.transcribe(uri);
              const whisperResult = await promise;
              return {
                transcript: (whisperResult?.result || "").trim(),
                duration,
              };
            }
          } catch (localError) {
            console.warn("Local transcription failed, falling back to cloud:", localError);
          }
        }

        // Convert audio to base64 for cloud transcription
        let absoluteUri = uri;
        if (!uri.startsWith("file://") && !uri.startsWith("content://")) {
          absoluteUri = `file://${uri}`;
        }
        const audioFile = new File(absoluteUri);
        const base64Audio = audioFile.base64Sync();

        // Transcribe via cloud function
        const result = await callMyFunction({
          journal: base64Audio,
          isAudio: true,
        });

        return {
          transcript: result.enrichedTranscript || "",
          duration,
        };
      } finally {
        setIsTranscribing(false);
      }
    },
    [isVoiceEnabled, isLocalTranscription, whisperContext, initializeWhisperModel]
  );

  return { transcribeAudio, isTranscribing };
};
