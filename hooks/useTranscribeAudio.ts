import { useCallback, useState } from "react";
import { callMyFunction } from "@/src/network/transcribeAudio";
import { File } from "expo-file-system";
import { getAudioDuration } from "@/src/utils/date";

interface TranscribeResult {
  transcript: string;
  duration: number;
}

export const useTranscribeAudio = () => {
  const [isTranscribing, setIsTranscribing] = useState(false);

  const transcribeAudio = useCallback(
    async (uri: string): Promise<TranscribeResult> => {
      setIsTranscribing(true);
      try {
        // Convert audio to base64
        let absoluteUri = uri;
        if (!uri.startsWith("file://") && !uri.startsWith("content://")) {
          absoluteUri = `file://${uri}`;
        }
        const audioFile = new File(absoluteUri);
        const base64Audio = audioFile.base64Sync();

        // Transcribe
        const result = await callMyFunction({
          journal: base64Audio,
          isAudio: true,
        });

        // Get duration
        const duration = (await getAudioDuration(uri)) || 0;

        return {
          transcript: result.enrichedTranscript || "",
          duration,
        };
      } finally {
        setIsTranscribing(false);
      }
    },
    []
  );

  return { transcribeAudio, isTranscribing };
};
