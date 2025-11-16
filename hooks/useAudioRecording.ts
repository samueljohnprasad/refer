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

  const record = async () => {
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record({
      forDuration: 10,
    });
    setRecordingCurrentState("recording");
    // Start timer
    const interval = setInterval(() => {
      setTotalDuration((prev) => prev + 1000); // +1 sec
    }, 1000);

    setTimerInterval(interval);
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
    totalDuration,
  };
};

export default useAudioRecording;
