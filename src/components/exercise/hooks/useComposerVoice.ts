import { useEffect, useRef, useState } from "react";
import * as Haptics from "expo-haptics";
import useAudioRecording from "@/hooks/useAudioRecording";
import { useTranscribeAudio } from "@/hooks/useTranscribeAudio";
import { useVoiceFeature } from "@/src/hooks/useVoiceFeature";
import { useExerciseCopy } from "@/src/hooks/useExerciseCopy";

interface UseComposerVoiceOptions {
  enabled: boolean;
  currentValue: string;
  onTranscription: (text: string) => void;
}

export function useComposerVoice({
  enabled,
  currentValue,
  onTranscription,
}: UseComposerVoiceOptions) {
  const translateCopy = useExerciseCopy();
  const { isVoiceEnabled } = useVoiceFeature();
  const canUseVoice = isVoiceEnabled && enabled;

  const [voiceError, setVoiceError] = useState<string | null>(null);
  const { recordedStatus, recordingCurrentState, record, stopRecording } = useAudioRecording();
  const { transcribeAudio, isTranscribing } = useTranscribeAudio();
  const processedRecordingUrlRef = useRef<string | null>(null);
  const isRecording = recordingCurrentState === "recording";

  useEffect(() => {
    const uri = recordedStatus?.url;
    if (!recordedStatus?.isFinished || !uri || processedRecordingUrlRef.current === uri) return;
    processedRecordingUrlRef.current = uri;
    let cancelled = false;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    void transcribeAudio(uri)
      .then((result) => {
        if (!cancelled && result?.transcript) {
          const combined = currentValue ? `${currentValue} ${result.transcript}` : result.transcript;
          onTranscription(combined);
        }
      })
      .catch(() => {
        if (!cancelled) setVoiceError(translateCopy("Voice input unavailable. You can type this instead."));
      });
    return () => {
      cancelled = true;
    };
  }, [recordedStatus, transcribeAudio, currentValue, onTranscription, translateCopy]);

  const handleToggleRecording = async () => {
    if (!canUseVoice) return;
    setVoiceError(null);
    if (isRecording) {
      try {
        const uri = (await stopRecording())?.url;
        if (uri) {
          processedRecordingUrlRef.current = uri;
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          const result = await transcribeAudio(uri);
          if (result?.transcript) {
            const combined = currentValue ? `${currentValue} ${result.transcript}` : result.transcript;
            onTranscription(combined);
          }
        }
      } catch {
        setVoiceError(translateCopy("Voice input unavailable. You can type this instead."));
      }
      return;
    }
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await record();
    } catch {
      setVoiceError(translateCopy("Voice input unavailable. You can type this instead."));
    }
  };

  return {
    canUseVoice,
    isRecording,
    isTranscribing,
    voiceError,
    handleToggleRecording,
  };
}
