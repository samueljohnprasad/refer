import { View, Text, SafeAreaView, Alert } from "react-native";
import React, { use, useEffect, useRef, useState } from "react";
import VoiceRecorderModal from "@/components/modals/VoiceRecorderModal";
import BreathingBackground from "@/components/ui/BreathingBackground";
import MicControlContainer from "@/components/ui/MicControlContainer";
import {
  PlayerState,
  RecorderState,
  Waveform,
  useAudioPlayer,
  type IWaveformRef,
} from "@simform_solutions/react-native-audio-waveform";
import { Button, ButtonText } from "@/components/ui/button";
import { Box } from "@/components/ui/box";
import MindfulBackground from "@/components/ui/MindfulBackground";

const stateBasedDetails = {
  [PlayerState.paused]: {
    isPlaying: false,
    brightness: 1,
  },
  [PlayerState.playing]: {
    isPlaying: true,
    brightness: 1.3,
  },
  [PlayerState.stopped]: {
    isPlaying: false,
    brightness: 1,
  },
};
type VoiceRecorderModalWrapperProps = {
  recorderOpen: boolean;
  setRecorderOpen: (open: boolean) => void;
};

const VoiceRecorderModalWrapper = ({
  recorderOpen,
  setRecorderOpen,
}: VoiceRecorderModalWrapperProps) => {
  const [recoderCurrentState, setRecoderCurrentState] = useState<
    RecorderState | undefined
  >();
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const ref = useRef<IWaveformRef>(null);
  const ref2 = useRef<IWaveformRef>(null);
  const isRecording = recoderCurrentState === RecorderState.recording;
  const isPaused = recoderCurrentState === RecorderState.paused;

  const {
    stopAllWaveFormExtractors,
    stopAllPlayers,
    stopPlayersAndExtractors,
  } = useAudioPlayer();

  useEffect(() => {
    return () => {
      ref.current?.stopRecord();
      ref2.current?.stopPlayer();
      ref.current?.currentState;
      stopPlayersAndExtractors();
      stopAllPlayers();
      stopAllWaveFormExtractors();
    };
  }, []);

  const handleStartRecording = async () => {
    await ref.current?.startRecord();
  };

  const handleStopRecording = async () => {
    const path = await ref.current?.stopRecord();
    if (!path) return Alert.alert("Error", "Failed to stop recording");
    setRecordingUri(path);
  };

  const handlePauseRecording = async () => {
    await ref.current?.pauseRecord();
  };

  const handleResumeRecording = async () => {
    await ref.current?.resumeRecord();
  };

  console.log("isRecording", isRecording, ref2.current?.currentState);

  return (
    <VoiceRecorderModal
      visible={recorderOpen}
      onRequestClose={() => setRecorderOpen(false)}
    >
      <MindfulBackground >
        <SafeAreaView className="flex-1 flex  justify-center">
          {/* <PlaybackControls
            isPlaying={isRecording}
            onPlay={() => startRecord?.()}
            onPause={() => pauseRecord?.()}
            onClear={() => stopRecord?.()}
            recordingUri={recordingUri}
          /> */}
          <Box className="w-full">
            <Waveform
              showsHorizontalScrollIndicator={true}
              candleHeightScale={18}
              mode="live"
              waveColor="lightblue"
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
      </MindfulBackground>
    </VoiceRecorderModal>
  );
};

export default VoiceRecorderModalWrapper;
