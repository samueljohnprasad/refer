import React, { useState } from "react";
import { useAtom } from "jotai";
import { recorderOpenAtom } from "./helpers";
import { defaultInsights, InsightsType } from "@/src/network/genAi";
import VoiceRecorderModal from "./VoiceRecorderModal";
import VoiceRecorder from "./VoiceRecorder";
import JournalEntryScreen from "../JournalEntryScreen/JournalEntryScreen";
import EmotionAnalysisLoadingScreen from "./EmotionAnalysisLoadingScreen";
import { JournalEntry } from "@/hooks/data/types";

type VoiceRecorderModalWrapperProps = {};

const VoiceRecorderModalWrapper = () => {
  const [recorderOpen, setRecorderOpen] = useAtom(recorderOpenAtom);
  const [stepper, setStepper] = useState(0);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [insights, setInsights] = useState<JournalEntry>();

  const onClose = () => {
    setRecorderOpen(false);
    setStepper(0);
    setRecordingUri(null);
    setInsights(undefined);
  };
  return (
    <VoiceRecorderModal visible={recorderOpen} onRequestClose={onClose}>
      {stepper === 0 && (
        <VoiceRecorder
          onStop={(path) => {
            setRecordingUri(path);
            setStepper(1);
          }}
        />
      )}
      {stepper === 1 && recordingUri && (
        <EmotionAnalysisLoadingScreen
          recordingUri={recordingUri}
          onAnalysisCompleted={({ insights }) => {
            setInsights(insights);
            setStepper(2);
          }}
        />
      )}
      {stepper === 2 && <JournalEntryScreen insights={insights} />}
    </VoiceRecorderModal>
  );
};

export default VoiceRecorderModalWrapper;
