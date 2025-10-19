import React, { useEffect } from "react";
import { Buffer } from "buffer";
import { getInsights, InsightsType } from "@/src/network/genAi";
import { supabase } from "@/src/network/auth/supabase";
import { transcribeAudio } from "@/src/network/transcribeAudio";
import { ProcessingPhase } from "@/src/screens/DiscoveryScreen/types";

export type AnalysisCompletedType = {
  transcripts: string[];
  insights: InsightsType;
};

const useEmotionsAnalysis = ({
  uri,
  onAnalysisCompleted,
}: {
  uri: string;
  onAnalysisCompleted: (data: AnalysisCompletedType) => void;
}) => {
  const [transcripts, setTranscripts] = React.useState<string[] | null>([]);
  const [processingPhase, setProcessingPhase] = React.useState<ProcessingPhase>(
    ProcessingPhase.TRANSCRIBING
  );

  const callJournalFunction = async () => {
    try {
      const user = await supabase.auth.getUser();
      const auth = supabase.auth.getSession();
      const token = await auth.then((res) => res.data.session?.access_token);
      const { data, error } = await supabase.functions.invoke(
        "process-journal",
        {
          body: { userId: user.data.user?.id, name: "Today I felt happy." },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (error) console.error(error);
      else console.log("datadatadata", data);
    } catch (error) {
      console.error("Error calling journal function:", error);
    }
  };

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
      const insights = await getInsights(transcripts.join(" "));
      console.log("insightsinsights", insights);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setProcessingPhase(ProcessingPhase.GENERATING_INSIGHTS);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setProcessingPhase(ProcessingPhase.FINALIZING);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      onAnalysisCompleted({ transcripts, insights });
    };
    fetch();
  }, []);

  return {
    processingPhase,
    transcripts,
  };
};

export default useEmotionsAnalysis;
