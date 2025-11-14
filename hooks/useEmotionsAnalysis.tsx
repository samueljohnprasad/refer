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
import {
  useToast,
  Toast,
  ToastTitle,
  ToastDescription,
} from "@/components/ui/toast";

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
  const toast = useToast();

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
    const journalEntry: string | undefined = uri
      ? getBase64Audio(uri)
      : journalText;
    if (!journalEntry) {
      throw new Error("No journal content provided");
    }

    const insights = await callMyFunction({
      journal: journalEntry,
      isAudio: uri ? true : false,
    });

    const duration: number = uri ? await getAudioDuration(uri) : 0;
    const journalEntryData: JournalEntry = {
      duration_seconds: Math.round(duration),
      input_type: uri ? "voice" : "typing",
      title: insights.title,
      transcripts: insights.enrichedTranscript,
      journal_ai_insights: {
        achievements: insights.achievements,
        aiInsights: insights.aiInsights,
        energyLevel: insights.energyLevel,
        feelings: insights.feelings,
        sleepQuality: insights.sleepQuality,
        stressLevel: insights.stressLevel,
        triggers: insights.triggers,
        worries: insights.worries,
        journal_entry_id: 0,
      },
      moods: {
        main_mood: insights.mainEmoji,
      },
    };
    return journalEntryData;
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

        onAnalysisCompleted({ insights });
      } catch (error) {
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
            render: ({ id }) => (
              <Toast nativeID={id} variant="solid" action="error">
                <ToastTitle>
                  {error.isNetworkError
                    ? "Connection Error"
                    : "Processing Error"}
                </ToastTitle>
                <ToastDescription>{error.message}</ToastDescription>
              </Toast>
            ),
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
            render: ({ id }) => (
              <Toast nativeID={id} variant="solid" action="error">
                <ToastTitle>Error</ToastTitle>
                <ToastDescription>{errorMessage}</ToastDescription>
              </Toast>
            ),
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
