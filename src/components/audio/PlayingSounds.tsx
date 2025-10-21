import { useState, useEffect } from "react";
import { View, StyleSheet, Button, Alert, Text } from "react-native";
import {
  useAudioRecorder,
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorderState,
  useAudioPlayerStatus,
  useAudioSampleListener,
  RecordingStatus,
} from "expo-audio";
import Play from "./Play";

type recordStatus = "recording" | "paused" | "stopped";
export default function PlayingSounds() {
  const [recordingState, setRecordingState] = useState<RecordingStatus | null>(
    null
  );
  const [recordStatus, setRecordStatus] = useState<recordStatus | null>(null);
  const audioRecorder = useAudioRecorder(
    RecordingPresets.HIGH_QUALITY,
    (status) => {
      setRecordingState(status);
    }
  );
  const recorderState = useAudioRecorderState(audioRecorder);

  const record = async () => {
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
    setRecordStatus("recording");
  };

  const pauseRecording = async () => {
    audioRecorder.pause();
    setRecordStatus("paused");
  };

  const stopRecording = async () => {
    await audioRecorder.stop();
    setRecordStatus("stopped");
    return recorderState;
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

  return (
    <View style={styles.container}>
      <Text>Duration: {Math.round(recorderState.durationMillis / 1000)}s</Text>
      <Text>Can Record: {recorderState.canRecord ? "Yes" : "No"}</Text>
      <Button
        title={
          recordStatus === "recording"
            ? "Pause Recording"
            : recordStatus === "paused"
            ? "Resume Recording"
            : "Start Recording"
        }
        onPress={
          recordStatus === "recording"
            ? pauseRecording
            : recordStatus === "paused"
            ? record
            : record
        }
      />

      <Button title="Stop Recording" onPress={stopRecording} />

      {recordingState?.url && <Play audioSourceString={recordingState.url} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    padding: 10,
  },
});
