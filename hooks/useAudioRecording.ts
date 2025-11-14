import {
  AudioModule,
  RecordingPresets,
  RecordingStatus,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
type recordStatus = "recording" | "paused" | "stopped" | "initial";

const useAudioRecording = () => {
  const [recordedStatus, setRecordedStatus] = useState<RecordingStatus | null>(
    null
  );
  const [recordingCurrentState, setRecordingCurrentState] =
    useState<recordStatus>("initial");

  const audioRecorder = useAudioRecorder(
    RecordingPresets.HIGH_QUALITY,
    (status) => {
      setRecordedStatus(status);
    }
  );
  const recorderState = useAudioRecorderState(audioRecorder);

  const record = async () => {
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
    setRecordingCurrentState("recording");
  };

  const stopRecording = async () => {
    await audioRecorder.stop();
    setRecordingCurrentState("stopped");
    return recorderState;
  };

  const pauseRecording = async () => {
    audioRecorder.pause();
    setRecordingCurrentState("paused");
  };

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert("Permission to access microphone was denied");
      }
      setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
    })();
  }, []);

  return {
    recorderState,
    recordedStatus,
    recordingCurrentState,
    record,
    stopRecording,
    pauseRecording,
  };
};

export default useAudioRecording;
