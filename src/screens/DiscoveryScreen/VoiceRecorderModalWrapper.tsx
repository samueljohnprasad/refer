import React, { useState } from "react";
import { useAtom } from "jotai";
import { recorderOpenAtom } from "./helpers";
import VoiceRecorderModal from "./VoiceRecorderModal";
import { JournalEntry } from "@/hooks/data/types";
import SuspensLoader from "@/src/components/SuspensLoader";

const VoiceRecorder = React.lazy(() => import("./VoiceRecorder"));
const JournalEntryScreen = React.lazy(
  () => import("../JournalEntryScreen/JournalEntryScreen")
);
const EmotionAnalysisLoadingScreen = React.lazy(
  () => import("./EmotionAnalysisLoadingScreen")
);

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
      <SuspensLoader>
        {stepper === 0 && (
          <VoiceRecorder
            onClose={onClose}
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
        {stepper === 2 && (
          <JournalEntryScreen insights={insights} onClose={onClose} />
        )}
      </SuspensLoader>
    </VoiceRecorderModal>
  );
};

export default VoiceRecorderModalWrapper;
