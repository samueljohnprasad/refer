import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { formatDuration } from "@/utils/formatDuration";

export interface TimerStatusProps {
  durationMs: number;
  isRecording: boolean;
  isPaused: boolean;
}

const TimerStatus: React.FC<TimerStatusProps> = ({
  durationMs,
  isRecording,
  isPaused,
}) => {
  if (!isRecording && !isPaused) {
    return <Text style={styles.tap}>Tap to start recording</Text>;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.time}>{formatDuration(durationMs)}</Text>
      <Text style={styles.status}>{isRecording ? "Recording" : "Paused"}</Text>
    </View>
  );
};

export default TimerStatus;

const styles = StyleSheet.create({
  container: { alignItems: "center", justifyContent: "center" },
  time: { fontSize: 20, fontWeight: "600", color: "#2D3748", marginBottom: 4 },
  status: { fontSize: 12, color: "#A0AEC0", fontWeight: "500" },
  tap: { fontSize: 16, color: "#A0AEC0", textAlign: "center" },
});
