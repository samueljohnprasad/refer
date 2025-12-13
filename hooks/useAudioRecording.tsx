import {
  AudioModule,
  RecordingPresets,
  RecordingStatus,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import React, { useEffect, useState } from "react";
import { Alert, Linking, Platform } from "react-native";
import { useToast, Toast, ToastTitle } from "@/components/ui/toast";
import { recorderOpenAtom } from "@/src/screens/DiscoveryScreen/helpers";
import { useAtom } from "jotai";
type recordStatus = "recording" | "paused" | "stopped" | "initial";

const useAudioRecording = () => {
  const [recorderOpen, setRecorderOpen] = useAtom(recorderOpenAtom);

  const [recordedStatus, setRecordedStatus] = useState<RecordingStatus | null>(
    null
  );
  const [recordingCurrentState, setRecordingCurrentState] =
    useState<recordStatus>("initial");
  const [totalDuration, setTotalDuration] = useState(0);
  const [timerInterval, setTimerInterval] = useState<number>();
  const audioRecorder = useAudioRecorder(
    RecordingPresets.HIGH_QUALITY,
    (status) => {
      setRecordedStatus(status);
      if (status.isFinished) {
        setRecordingCurrentState("stopped");
      }
    }
  );
  const recorderState = useAudioRecorderState(audioRecorder);

  const toast = useToast();

  // Configure audio session on mount
  useEffect(() => {
    const configureAudioSession = async () => {
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
          allowsRecording: true,
        });
      } catch (error) {
        console.error("Failed to configure audio session:", error);
      }
    };

    configureAudioSession();

    // Cleanup on unmount
    return () => {
      clearInterval(timerInterval);
      // Reset audio mode
      setAudioModeAsync({
        playsInSilentMode: false,
        allowsRecording: false,
      }).catch(console.error);
    };
  }, []);

  const record = async () => {
    try {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert(
          "Microphone Permission Needed",
          "Please enable microphone access in Settings.",
          [
            {
              text: "Open Settings",
              onPress: () => Linking.openURL("app-settings:"),
            },
            { text: "Cancel", style: "cancel" },
          ]
        );
        return setRecorderOpen(false);
      }

      // Ensure audio mode is set before recording
      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });

      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record({
        forDuration: 6000,
      });
      setRecordingCurrentState("recording");
      // Start timer
      const interval = setInterval(() => {
        setTotalDuration((prev) => prev + 1000); // +1 sec
      }, 1000);

      setTimerInterval(interval);
    } catch (error) {
      console.error("Recording error:", error);
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={id} variant="solid" action="error">
            <ToastTitle>
              Failed to start recording. Please try again.
            </ToastTitle>
          </Toast>
        ),
      });
    }
  };

  const stopRecording = async () => {
    try {
      await audioRecorder.stop();
      setRecordingCurrentState("stopped");
      clearInterval(timerInterval);
      return recorderState;
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  };

  const pauseRecording = async () => {
    try {
      audioRecorder.pause();
      setRecordingCurrentState("paused");
      clearInterval(timerInterval);
    } catch (error) {
      console.error("Error pausing recording:", error);
    }
  };

  return {
    recorderState,
    recordedStatus,
    recordingCurrentState,
    record,
    stopRecording,
    pauseRecording,
    totalDuration,
  };
};

export default useAudioRecording;
