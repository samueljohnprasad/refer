import React, { useState } from "react";
import VoiceRecorderModal from "@/components/modals/VoiceRecorderModal";
import VoiceRecorder from "./VoiceRecorder";
import EmotionAnalysisLoadingScreen from "@/components/custom/EmotionAnalysisLoadingScreen";
import HealthTracker from "@/components/custom/HealthTrackert";
import { useAtom } from "jotai";
import { recorderOpenAtom } from "./helpers";

type VoiceRecorderModalWrapperProps = {};

const VoiceRecorderModalWrapper = ({}: VoiceRecorderModalWrapperProps) => {
  const [recorderOpen, setRecorderOpen] = useAtom(recorderOpenAtom);
  const [stepper, setStepper] = useState(0);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [transcripts, setTranscripts] = useState<string[] | null>(null);
  const onClose = () => {
    setRecorderOpen(false);
    setStepper(0);
    setRecordingUri(null);
    setTranscripts(null);
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
        />
      )}
      {stepper === 1 && recordingUri && (
        <EmotionAnalysisLoadingScreen
          recordingUri={recordingUri}
          onAnalysisCompleted={(transcripts) => {
            setTranscripts(transcripts);
            setStepper(2);
          }}
        />
      )}
      {stepper === 2 && (
        <HealthTracker transcripts={transcripts || []} onClose={onClose} />
      )}
    </VoiceRecorderModal>
  );
};

export default VoiceRecorderModalWrapper;
