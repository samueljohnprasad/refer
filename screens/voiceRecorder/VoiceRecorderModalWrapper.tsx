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
import { useSeasonalTheme } from "@/hooks/useSeasonalTheme";
import { DurationType } from "@simform_solutions/react-native-audio-waveform/lib/constants";
import { transcribeAudio } from "@/network/transcribeAudio";
import MindfulGradient, {
  GradientPosition,
} from "../components/MindfulGradient";
import { Buffer } from "buffer";

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
  const activeTheme = useSeasonalTheme();
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const ref = useRef<IWaveformRef>(null);
  const ref2 = useRef<IWaveformRef>(null);
  const isRecording = recoderCurrentState === RecorderState.recording;
  const isPaused = recoderCurrentState === RecorderState.paused;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [position, setPosition] = useState<GradientPosition>("top");

  const {
    stopAllWaveFormExtractors,
    stopAllPlayers,
    stopPlayersAndExtractors,
    onCurrentDuration,
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
    setIsSpeaking(true);
  };

  const uploadAndTranscribe = async (uri: string) => {
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
    } catch (error) {
      console.error("Error transcribing audio:", error);
    }
  };

  const handleStopRecording = async () => {
    const path = await ref.current?.stopRecord();
    if (!path) return Alert.alert("Error", "Failed to stop recording");
    setRecordingUri(path);
    uploadAndTranscribe(path);
    setIsSpeaking(false);
  };

  const handlePauseRecording = async () => {
    await ref.current?.pauseRecord();
    setIsSpeaking(false);
  };

  const handleResumeRecording = async () => {
    await ref.current?.resumeRecord();
    setIsSpeaking(true);
  };

  console.log(
    "isRecording",
    isRecording,
    ref2.current?.currentState,
    onCurrentDuration((result) => {
      console.log("resultttt", result);
    })
  );

  return (
    <VoiceRecorderModal
      visible={recorderOpen}
      onRequestClose={() => setRecorderOpen(false)}
    >
      <MindfulBackground>
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
      </MindfulBackground>
    </VoiceRecorderModal>
  );
};

export default VoiceRecorderModalWrapper;
