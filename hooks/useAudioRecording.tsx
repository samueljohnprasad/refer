import {
  AudioModule,
  RecordingPresets,
  RecordingStatus,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import React, { useEffect, useState } from "react";
import { Alert, Linking } from "react-native";
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
      setAudioModeAsync({
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
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={id} variant="solid" action="error">
            <ToastTitle>
              Recording permission has not been granted. Please enable it in
              settings.
            </ToastTitle>
          </Toast>
        ),
      });
    }
  };

  const stopRecording = async () => {
    await audioRecorder.stop();
    setRecordingCurrentState("stopped");
    clearInterval(timerInterval);
    return recorderState;
  };

  const pauseRecording = async () => {
    audioRecorder.pause();
    setRecordingCurrentState("paused");
    clearInterval(timerInterval);
  };

  useEffect(() => {
    return () => {
      clearInterval(timerInterval);
    };
  }, []);

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
