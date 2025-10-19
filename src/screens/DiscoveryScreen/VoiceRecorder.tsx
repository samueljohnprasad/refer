import {
  View,
  Text,
  SafeAreaView,
  Alert,
  Platform,
  Linking,
  PermissionsAndroid,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  PlayerState,
  RecorderState,
  Waveform,
  useAudioPlayer,
  useAudioPermission,
  PermissionStatus,
  UpdateFrequency,
  type IWaveformRef,
} from "@simform_solutions/react-native-audio-waveform";
import { Box } from "@/components/ui/box";
import MindfulGradient, { GradientPosition } from "./MindfulGradient";
import MicControlContainer from "./MicControlContainer";

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

  const isRecording = recoderCurrentState === RecorderState.recording;
  const isPaused = recoderCurrentState === RecorderState.paused;

  const {
    stopAllWaveFormExtractors,
    stopAllPlayers,
    stopPlayersAndExtractors,
    onCurrentDuration,
  } = useAudioPlayer();

  // Microphone permission helpers (Android requires runtime permission)
  const { checkHasAudioRecorderPermission, getAudioRecorderPermission } =
    useAudioPermission();

  // Fallback: Explicitly request Android RECORD_AUDIO via PermissionsAndroid
  const ensureAndroidMicPermission = async (): Promise<boolean> => {
    if (Platform.OS !== "android") return true;
    try {
      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
      );
      return status === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.log("PermissionsAndroid.request error", err);
      return false;
    }
  };

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

  const handleStartRecording = async (): Promise<void> => {
    try {
      // Ensure any players/extractors are stopped before starting a new recording
      await stopPlayersAndExtractors();
      await stopAllPlayers();
      await stopAllWaveFormExtractors();

      const hasPermission = await checkHasAudioRecorderPermission();

      if (hasPermission === PermissionStatus.granted) {
        const ok = await ref.current?.startRecord({
          updateFrequency: UpdateFrequency.high,
          ...(Platform.OS === "android" ? { useLegacy: true } : {}),
        });
        if (ok) {
          setIsSpeaking(true);
          return;
        } else {
          console.log("startRecord returned false (granted)");
        }
      }

      if (hasPermission === PermissionStatus.undetermined) {
        const status = await getAudioRecorderPermission();
        if (status === PermissionStatus.granted) {
          const ok = await ref.current?.startRecord({
            updateFrequency: UpdateFrequency.high,
            ...(Platform.OS === "android" ? { useLegacy: true } : {}),
          });
          if (ok) {
            setIsSpeaking(true);
            return;
          } else {
            console.log("startRecord returned false (post-request)");
          }
        }
      }

      if (
        hasPermission === PermissionStatus.denied &&
        Platform.OS === "android"
      ) {
        const granted = await ensureAndroidMicPermission();
        if (granted) {
          const ok = await ref.current?.startRecord({
            updateFrequency: UpdateFrequency.high,
            useLegacy: true,
          });
          if (ok) {
            setIsSpeaking(true);
            return;
          }
        }
      }

      Alert.alert(
        "Microphone permission required",
        "Please enable microphone access in Settings to start recording.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ]
      );
    } catch (e) {
      console.log("handleStartRecording", e);
      Alert.alert(
        "Recording error",
        "Unable to start recording. Please try again."
      );
    }
  };

  // Preflight permission on mount for smoother UX (Android)
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "android") return;
      const has = await checkHasAudioRecorderPermission();
      if (has === PermissionStatus.undetermined) {
        await getAudioRecorderPermission();
      }
    })();
  }, []);

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
          waveColor="#F6C24B"
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
