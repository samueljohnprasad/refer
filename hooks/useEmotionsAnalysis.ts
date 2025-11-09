import React, { useEffect } from "react";
import { callMyFunction } from "@/src/network/transcribeAudio";
import { ProcessingPhase } from "@/src/screens/DiscoveryScreen/types";
import { File } from "expo-file-system";
import { recorderOpenAtom } from "@/src/screens/DiscoveryScreen/helpers";
import { useAtom } from "jotai";
import { JournalEntry } from "./data/types";
import { getAudioDuration } from "@/src/utils/date";

export type AnalysisCompletedType = {
  insights: JournalEntry;
};

const useEmotionsAnalysis = ({
  uri,
  journalText,
  onAnalysisCompleted,
}: {
  uri?: string;
  journalText?: string;
  onAnalysisCompleted: (data: AnalysisCompletedType) => void;
}) => {
  const [, setRecorderOpen] = useAtom(recorderOpenAtom);

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

  const uploadAndTranscribe = async () => {
    const journalEntry = uri ? getBase64Audio(uri) : journalText;
    if (!journalEntry) return null;

    const insights = await callMyFunction({
      journal: journalEntry,
      isAudio: uri ? true : false,
    });

    if (!insights) {
      setRecorderOpen(false);
      return null;
    }
    const duration = uri ? await getAudioDuration(uri) : 0;
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
    const fetch = async () => {
      setProcessingPhase(ProcessingPhase.TRANSCRIBING);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const insights = await uploadAndTranscribe();
      if (!insights) return;
      setProcessingPhase(ProcessingPhase.ANALYZING_EMOTIONS);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProcessingPhase(ProcessingPhase.GENERATING_INSIGHTS);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProcessingPhase(ProcessingPhase.FINALIZING);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onAnalysisCompleted({ insights });
    };
    fetch();
  }, []);

  return {
    processingPhase,
  };
};

export default useEmotionsAnalysis;
