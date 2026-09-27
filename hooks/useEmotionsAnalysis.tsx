import React, { useEffect } from "react";
import {
  callMyFunction,
  EdgeFunctionError,
} from "@/src/network/transcribeAudio";
import { ProcessingPhase } from "@/src/screens/DiscoveryScreen/types";
import { File } from "expo-file-system";
import { recorderOpenAtom, selectedDateDiscoveryAtom } from "@/src/screens/DiscoveryScreen/helpers";
import { useAtom, useAtomValue } from "jotai";
import { JournalEntry } from "./data/types";
import { getAudioDuration } from "@/src/utils/date";
import { useToast } from "heroui-native";
import { createLogger } from "@/src/lib/logger";

const log = createLogger("EmotionAnalysis");

export type AnalysisCompletedType = {
  insights: JournalEntry;
};

export type AnalysisErrorType = {
  message: string;
  isNetworkError: boolean;
};

interface UseEmotionsAnalysisProps {
  uri?: string;
  journalText?: string;
  onAnalysisCompleted: (data: AnalysisCompletedType) => void;
  onAnalysisError?: (error: AnalysisErrorType) => void;
}

const useEmotionsAnalysis = ({
  uri,
  journalText,
  onAnalysisCompleted,
  onAnalysisError,
}: UseEmotionsAnalysisProps) => {
  const [, setRecorderOpen] = useAtom(recorderOpenAtom);
  const selectedDate = useAtomValue(selectedDateDiscoveryAtom);
  const { toast } = useToast();

  const [processingPhase, setProcessingPhase] = React.useState<ProcessingPhase>(
    ProcessingPhase.TRANSCRIBING
  );

  const getBase64Audio = (uri: string) => {
    let absoluteUri = uri;
    if (!uri.startsWith("file://") && !uri.startsWith("content://")) {
      absoluteUri = `file://${uri}`;
    }
    log.info("Encoding audio file to base64...", { uri: absoluteUri });
    const audioFile = new File(absoluteUri);
    const base64Audio = audioFile.base64Sync();
    log.info("Audio file encoded to base64 successfully", {
      base64Length: base64Audio.length,
      estimatedKB: Math.round((base64Audio.length * 0.75) / 1024),
    });

    return base64Audio;
  };

  const uploadAndTranscribe = async (): Promise<JournalEntry | null> => {
    log.info("Starting journal upload & transcription pipeline...", { isAudio: !!uri });

    // ponytail: journal uses Expo Audio directly to cloud backend; text journal passes text
    const isAudioPayload = Boolean(uri);
    const journalEntry: string | undefined = uri
      ? getBase64Audio(uri)
      : journalText?.trim();

    if (!journalEntry) {
      log.warn("No journal content provided to uploadAndTranscribe");
      throw new Error("No journal content provided");
    }

    let duration = 0;
    if (uri) {
      log.info("Calculating audio duration from file...", { uri });
      duration = await getAudioDuration(uri);
      log.info("Audio duration determined", { durationSeconds: Math.round(duration) });
    }

    const payload = {
      journal: journalEntry,
      isAudio: isAudioPayload,
      selectedDate: selectedDate ? new Date(selectedDate).toISOString() : undefined,
      inputType: uri ? "voice" : "typing",
      durationSeconds: Math.round(duration),
    };

    log.info("Dispatching journal to save-journal-ai-insights edge function...", {
      isAudio: payload.isAudio,
      inputType: payload.inputType,
      durationSeconds: payload.durationSeconds,
      selectedDate: payload.selectedDate,
      payloadLength: payload.journal.length,
    });

    const insights = await callMyFunction(payload);

    const rawAi = (insights as any)?.journal_ai;
    const summaryText =
      rawAi?.summary ||
      (insights as any)?.summary ||
      (insights as any)?.reflection ||
      null;

    const formattedEntry: JournalEntry = {
      ...(insights as any),
      duration_seconds: (insights as any)?.duration_seconds ?? Math.round(duration),
      transcripts: (insights as any)?.transcripts || (insights as any)?.enrichedTranscript || journalText || "",
      journal_ai: (insights as any)?.journal_ai || (summaryText ? { summary: summaryText } : null),
    };

    log.info("Successfully formatted AI journal entry from server response", {
      id: formattedEntry.id,
      title: formattedEntry.title,
      mood: (formattedEntry as any)?.moods?.main_mood,
      hasSummary: Boolean(summaryText),
    });
    return formattedEntry;
  };

  useEffect(() => {
    const fetch = async (): Promise<void> => {
      try {
        log.info("Pipeline Step 1/4: TRANSCRIBING");
        setProcessingPhase(ProcessingPhase.TRANSCRIBING);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const insights: JournalEntry | null = await uploadAndTranscribe();

        if (!insights) {
          throw new Error("Failed to process journal entry");
        }

        log.info("Pipeline Step 2/4: ANALYZING_EMOTIONS");
        setProcessingPhase(ProcessingPhase.ANALYZING_EMOTIONS);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        log.info("Pipeline Step 3/4: GENERATING_INSIGHTS");
        setProcessingPhase(ProcessingPhase.GENERATING_INSIGHTS);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        log.info("Pipeline Step 4/4: FINALIZING");
        setProcessingPhase(ProcessingPhase.FINALIZING);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        log.info("Emotion analysis pipeline finished successfully", { id: insights.id, title: insights.title });
        onAnalysisCompleted({ insights });
      } catch (error) {
        log.error("Error in emotion analysis pipeline:", error);
        // Close the recorder
        setRecorderOpen(false);

        // Handle EdgeFunctionError specifically
        if (error instanceof EdgeFunctionError) {
          const errorData: AnalysisErrorType = {
            message: error.message,
            isNetworkError: error.isNetworkError,
          };

          onAnalysisError?.(errorData);

          // Show toast notification
          toast.show({
            placement: "top",
            variant: "danger",
            label: error.isNetworkError ? "Connection Error" : "Processing Error",
            description: error.message,
          });
        } else {
          // Handle unexpected errors
          const errorMessage: string =
            error instanceof Error
              ? error.message
              : "An unexpected error occurred";

          onAnalysisError?.({
            message: errorMessage,
            isNetworkError: false,
          });

          toast.show({
            placement: "top",
            variant: "danger",
            label: "Error",
            description: errorMessage,
          });
        }
      }
    };
    fetch();
  }, []);

  return {
    processingPhase,
  };
};

export default useEmotionsAnalysis;
