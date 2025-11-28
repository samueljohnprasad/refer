import React, { createContext, useContext, useEffect, useState } from "react";
import {
  AudioModule,
  RecordingPresets,
  RecordingStatus,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { Alert } from "react-native";

type RecordStatus = "recording" | "paused" | "stopped" | "initial";

interface AudioRecordingContextValue {
  recorderState: ReturnType<typeof useAudioRecorderState>;
  recordedStatus: RecordingStatus | null;
  recordingCurrentState: RecordStatus;
  record: () => Promise<void>;
  pauseRecording: () => Promise<void>;
  stopRecording: () => Promise<ReturnType<typeof useAudioRecorderState>>;
  totalDuration: number;
}

const AudioRecordingContext = createContext<
  AudioRecordingContextValue | undefined
>(undefined);

export const useAudioRecording = () => {
  const ctx = useContext(AudioRecordingContext);
  if (!ctx) {
    throw new Error(
      "useAudioRecording must be used inside AudioRecordingProvider"
    );
  }
  return ctx;
};

export const AudioRecordingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [recordedStatus, setRecordedStatus] = useState<RecordingStatus | null>(
    null
  );
  const [recordingCurrentState, setRecordingCurrentState] =
    useState<RecordStatus>("initial");
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
      forDuration: 6000,
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

  return (
    <AudioRecordingContext.Provider
      value={{
        recorderState,
        recordedStatus,
        recordingCurrentState,
        record,
        stopRecording,
        pauseRecording,
        totalDuration,
      }}
    >
      {children}
    </AudioRecordingContext.Provider>
  );
};
