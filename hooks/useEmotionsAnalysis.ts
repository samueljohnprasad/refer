import React, { useEffect } from "react";
import { InsightsType } from "@/src/network/genAi";
import { callMyFunction } from "@/src/network/transcribeAudio";
import { ProcessingPhase } from "@/src/screens/DiscoveryScreen/types";
import { File } from "expo-file-system";

export type AnalysisCompletedType = {
  insights: InsightsType;
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
    console.log(
      "Base64 audio length:",
      base64Audio.length,
      audioFile.exists,
      audioFile.size
    );

    return base64Audio;
  };

  const uploadAndTranscribe = async () => {
    const journalEntry = uri ? getBase64Audio(uri) : journalText;
    if (!journalEntry) return null;

    const insights = await callMyFunction({
      journal: journalEntry,
      isAudio: uri ? true : false,
    });

    console.log("insights>>>", insights);
    return insights;
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
