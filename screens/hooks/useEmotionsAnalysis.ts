import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { transcribeAudio } from "@/network/transcribeAudio";
import { Buffer } from "buffer";
import { ProcessingPhase } from "@/components/custom/helpers";

const useEmotionsAnalysis = ({
  uri,
  onAnalysisCompleted,
}: {
  uri: string;
  onAnalysisCompleted: (transcripts: string[]) => void;
}) => {
  const [loading, setLoading] = React.useState(true);
  const [transcripts, setTranscripts] = React.useState<string[] | null>([]);
  const [processingPhase, setProcessingPhase] = React.useState<ProcessingPhase>(
    ProcessingPhase.TRANSCRIBING
  );

  const uploadAndTranscribe = async () => {
    try {
      // Step 1: Upload audio file to AssemblyAI
      const audioData = await fetch(uri);
      const audioBlob = await audioData.arrayBuffer();
      const base64Audio = Buffer.from(audioBlob).toString("base64");
      const transcripts = await transcribeAudio(
        "AIzaSyCfc4bT2M0K4z3mVjvra2T-VV65ZtWr7cM",
        base64Audio
      );
      console.log("transcripts", transcripts);
      setTranscripts(transcripts);
      return transcripts;
    } catch (error) {
      console.error("Error transcribing audio:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetch = async () => {
      const transcripts = await uploadAndTranscribe();
      setProcessingPhase(ProcessingPhase.ANALYZING_EMOTIONS);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setProcessingPhase(ProcessingPhase.GENERATING_INSIGHTS);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setProcessingPhase(ProcessingPhase.FINALIZING);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      onAnalysisCompleted(transcripts);
    };
    fetch();
  }, []);

  return {
    processingPhase,
  };
};

export default useEmotionsAnalysis;
