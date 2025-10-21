import React, { useState } from "react";
import { Box } from "@/components/ui/box";
import MindfulGradient, { GradientPosition } from "./MindfulGradient";
import MicControlContainer from "./MicControlContainer";
import { SafeAreaView } from "react-native-safe-area-context";
import useAudioRecording from "@/hooks/useAudioRecording";

interface VoiceRecorderProps {
  onStop: (uri: string) => void;
}
const VoiceRecorder = ({ onStop }: VoiceRecorderProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const {
    recorderState,
    recordedStatus,
    recordingCurrentState,
    record,
    pauseRecording,
    stopRecording,
  } = useAudioRecording();

  const handleStopRecording = async () => {
    if (
      recordingCurrentState === "recording" ||
      recordingCurrentState === "paused"
    ) {
      const pathState = await stopRecording();
      setIsSpeaking(false);

      if (!pathState?.url) return;
      onStop(pathState.url);
    }
  };

  const handlePauseRecording = async () => {
    if (recordingCurrentState === "recording") {
      await pauseRecording();
    }
    setIsSpeaking(false);
  };

  const handleStartRecording = async (): Promise<void> => {
    if (
      recordingCurrentState === "initial" ||
      recordingCurrentState === "paused"
    ) {
      await record();
      setIsSpeaking(true);
    }
  };

  const isRecording = recordingCurrentState === "recording";
  const isPaused = recordingCurrentState === "paused";

  return (
    <SafeAreaView className="flex-1 flex  justify-start">
      <MindfulGradient position={"top"} isSpeaking={isSpeaking} />
      <Box className="w-full " style={{ height: 200 }}></Box>
      <MicControlContainer
        isRecording={isRecording}
        isPaused={isPaused}
        durationSeconds={recorderState.durationMillis / 1000}
        onToggleRecord={() => {
          if (isRecording) {
            return handlePauseRecording();
          }
          return handleStartRecording();
        }}
        onStop={handleStopRecording}
      />
    </SafeAreaView>
  );
};

export default VoiceRecorder;
