import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from "react-native";

export interface TodayReflectionCardProps {
  currentPrompt: string;
  onShuffle: () => void;
  style?: StyleProp<ViewStyle>;
}

const TodayReflectionCard: React.FC<TodayReflectionCardProps> = ({ currentPrompt, onShuffle, style }) => {
  return (
    <View style={[styles.heroCard, style]}>
      <View style={styles.heroContent}>
        <Text style={styles.heroTitle}>Today's Reflection</Text>
        <Text style={styles.heroSubtitle} numberOfLines={2}>
          {currentPrompt}
        </Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.progressText}>3 of 7</Text>
        </View>

        <TouchableOpacity onPress={onShuffle} style={styles.heroButton} activeOpacity={0.9}>
          <Text style={styles.heroButtonText}>Let's go!</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.heroIcon} accessible accessibilityLabel="Brain icon">
        <Text style={styles.heroEmoji}>🧠</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: "#FFD93D",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  heroContent: {
    flex: 1,
    paddingRight: 16,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressTrack: {
    height: 6,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    width: "43%",
    backgroundColor: "#1E293B",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  heroButton: {
    backgroundColor: "#1E293B",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  heroButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  heroIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroEmoji: {
    fontSize: 24,
  },
});

export default TodayReflectionCard;
