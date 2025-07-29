import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onClear: () => void;
  recordingUri: string | null;
}

const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  onPlay,
  onPause,
  onClear,
  recordingUri,
}) => {
  if (!recordingUri) {
    return null;
  }
  return (
    <View style={styles.playbackContainer}>
      <View style={styles.playbackControls}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={isPlaying ? onPause : onPlay}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={20}
            color="#6B73FF"
          />
          <Text style={styles.playButtonText}>
            {isPlaying ? "Pause" : "Play"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.clearButton}
          onPress={onClear}
          activeOpacity={0.7}
        >
          <Ionicons name="trash" size={20} color="#FF6B6B" />
          <Text style={styles.clearButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PlaybackControls;

const styles = StyleSheet.create({
  playbackContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  playButtonText: {
    fontSize: 16,
    color: "#6B73FF",
    marginLeft: 8,
    fontWeight: "500",
  },
  clearButtonText: {
    fontSize: 16,
    color: "#FF6B6B",
    marginLeft: 8,
    fontWeight: "500",
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  playbackControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  playButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(107, 115, 255, 0.1)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
});
