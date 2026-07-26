import React, { useEffect } from "react";
import {
  callMyFunction,
  EdgeFunctionError,
} from "@/src/network/transcribeAudio";
import { ProcessingPhase } from "@/src/screens/DiscoveryScreen/types";
import { File } from "expo-file-system";
import { recorderOpenAtom } from "@/src/screens/DiscoveryScreen/helpers";
import { useAtom } from "jotai";
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
  const { toast } = useToast();

  const [processingPhase, setProcessingPhase] = React.useState<ProcessingPhase>(
    ProcessingPhase.TRANSCRIBING
  );

  const getBase64Audio = (uri: string) => {
    let absoluteUri = uri;
    if (!uri.startsWith("file://") && !uri.startsWith("content://")) {
      absoluteUri = `file://${uri}`;
    }
    const audioFile = new File(absoluteUri);
    const base64Audio = audioFile.base64Sync();

    return base64Audio;
  };

  const uploadAndTranscribe = async (): Promise<JournalEntry | null> => {
    log.info("Starting journal upload & transcription...", { isAudio: !!uri });

    const journalEntry: string | undefined = uri
      ? getBase64Audio(uri)
      : journalText;
    if (!journalEntry) {
      log.warn("No journal content provided to uploadAndTranscribe");
      throw new Error("No journal content provided");
    }

    const insights = await callMyFunction({
      journal: journalEntry,
      isAudio: uri ? true : false,
    });

    const duration: number = uri ? await getAudioDuration(uri) : 0;
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

    log.debug("Successfully formatted AI journal entry", { id: formattedEntry.id, title: formattedEntry.title });
    return formattedEntry;
  };

  useEffect(() => {
    const fetch = async (): Promise<void> => {
      try {
        setProcessingPhase(ProcessingPhase.TRANSCRIBING);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const insights: JournalEntry | null = await uploadAndTranscribe();

        if (!insights) {
          throw new Error("Failed to process journal entry");
        }

        setProcessingPhase(ProcessingPhase.ANALYZING_EMOTIONS);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setProcessingPhase(ProcessingPhase.GENERATING_INSIGHTS);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setProcessingPhase(ProcessingPhase.FINALIZING);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        log.info("Emotion analysis pipeline finished successfully");
        onAnalysisCompleted({ insights });
      } catch (error) {
        log.error("Error in emotion analysis pipeline", error);
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
