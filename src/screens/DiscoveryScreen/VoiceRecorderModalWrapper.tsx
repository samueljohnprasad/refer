import React, { useState } from "react";
import { useAtom } from "jotai";
import { recorderOpenAtom } from "./helpers";
import { defaultInsights, InsightsType } from "@/src/network/genAi";
import VoiceRecorderModal from "./VoiceRecorderModal";
import VoiceRecorder from "./VoiceRecorder";
import JournalEntryScreen from "../JournalEntryScreen/JournalEntryScreen";
import EmotionAnalysisLoadingScreen from "./EmotionAnalysisLoadingScreen";

type VoiceRecorderModalWrapperProps = {
  selectedDate?: Date;
};

const VoiceRecorderModalWrapper = ({
  selectedDate,
}: VoiceRecorderModalWrapperProps) => {
  const [recorderOpen, setRecorderOpen] = useAtom(recorderOpenAtom);
  const [stepper, setStepper] = useState(0);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [transcripts, setTranscripts] = useState<string[] | null>(null);
  const [insights, setInsights] = useState<InsightsType>(defaultInsights);

  const onClose = () => {
    setRecorderOpen(false);
    setStepper(0);
    setRecordingUri(null);
    setTranscripts(null);
    setInsights(defaultInsights);
  };
  return (
    <VoiceRecorderModal visible={recorderOpen} onRequestClose={onClose}>
      {stepper === 0 && (
        <VoiceRecorder
          onStop={(path) => {
            setRecordingUri(path);
            setStepper(1);
            // uploadAndTranscribe(path);
          }}
          selectedDate={selectedDate}
        />
      )}
      {stepper === 1 && recordingUri && (
        <EmotionAnalysisLoadingScreen
          recordingUri={recordingUri}
          selectedDate={selectedDate}
          onAnalysisCompleted={({ transcripts, insights }) => {
            setTranscripts(transcripts);
            setInsights(insights);
            setStepper(2);
          }}
        />
      )}
      {stepper === 2 && (
        // <HealthTracker transcripts={transcripts || []} onClose={onClose} />
        <JournalEntryScreen
          insights={insights}
          transcripts={transcripts || []}
          selectedDate={selectedDate}
        />
      )}
    </VoiceRecorderModal>
  );
};

export default VoiceRecorderModalWrapper;
