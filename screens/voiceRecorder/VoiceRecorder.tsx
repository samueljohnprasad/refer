import { View, Text, SafeAreaView, Alert } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import MicControlContainer from "@/components/ui/MicControlContainer";
import {
  PlayerState,
  RecorderState,
  Waveform,
  useAudioPlayer,
  type IWaveformRef,
} from "@simform_solutions/react-native-audio-waveform";
import { Box } from "@/components/ui/box";
import { useSeasonalTheme } from "@/hooks/useSeasonalTheme";
import MindfulGradient, {
  GradientPosition,
} from "../components/MindfulGradient";

interface VoiceRecorderProps {
  onStop: (uri: string) => void;
}
const VoiceRecorder = ({ onStop }: VoiceRecorderProps) => {
  const [position, setPosition] = useState<GradientPosition>("top");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const ref = useRef<IWaveformRef>(null);
  const [recoderCurrentState, setRecoderCurrentState] = useState<
    RecorderState | undefined
  >();
  const activeTheme = useSeasonalTheme();

  const isRecording = recoderCurrentState === RecorderState.recording;
  const isPaused = recoderCurrentState === RecorderState.paused;

  const {
    stopAllWaveFormExtractors,
    stopAllPlayers,
    stopPlayersAndExtractors,
    onCurrentDuration,
  } = useAudioPlayer();

  const handleStopRecording = async () => {
    const path = await ref.current?.stopRecord();
    if (!path) return Alert.alert("Error", "Failed to stop recording");
    setIsSpeaking(false);
    onStop(path);
  };

  const handlePauseRecording = async () => {
    await ref.current?.pauseRecord();
    setIsSpeaking(false);
  };

  const handleResumeRecording = async () => {
    await ref.current?.resumeRecord();
    setIsSpeaking(true);
  };

  const handleStartRecording = async () => {
    await ref.current?.startRecord();
    setIsSpeaking(true);
  };

  useEffect(() => {
    return () => {
      ref.current?.stopRecord();
      ref.current?.currentState;
      stopPlayersAndExtractors();
      stopAllPlayers();
      stopAllWaveFormExtractors();
    };
  }, []);

  return (
    <SafeAreaView className="flex-1 flex  justify-start">
      {/* <PlaybackControls
            isPlaying={isRecording}
            onPlay={() => startRecord?.()}
            onPause={() => pauseRecord?.()}
            onClear={() => stopRecord?.()}
            recordingUri={recordingUri}
          /> */}
      <MindfulGradient position={position} isSpeaking={isSpeaking} />
      {/* <Button onPress={() => setIsSpeaking(!isSpeaking)}>
            <ButtonText>{isSpeaking ? "Stop" : "Start"}</ButtonText>
          </Button> */}
      <Box className="w-full " style={{ height: 200 }}>
        <Waveform
          key={"player1"}
          showsHorizontalScrollIndicator={true}
          candleHeightScale={12}
          mode="live"
          waveColor={activeTheme.highlight}
          ref={ref}
          candleSpace={4}
          candleWidth={6}
          onRecorderStateChange={(recorderState) => {
            setRecoderCurrentState(recorderState);
          }}
        />
      </Box>

      <MicControlContainer
        isRecording={isRecording}
        isPaused={isPaused}
        durationSeconds={1}
        onToggleRecord={
          isRecording
            ? () => handlePauseRecording()
            : isPaused
            ? () => {
                handleResumeRecording();
              }
            : () => handleStartRecording()
        }
        onStop={handleStopRecording}
      />
    </SafeAreaView>
  );
};

export default VoiceRecorder;
