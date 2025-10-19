import React from "react";
import { View, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";

export interface LevelProgressCardProps {
  xp: number;
  levelLabel: string; // e.g., "Gold"
  percent: number; // 0-100
  style?: StyleProp<ViewStyle>;
}

const LevelProgressCard: React.FC<LevelProgressCardProps> = ({ xp, levelLabel, percent, style }) => {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <View style={[styles.levelCard, style]}>
      <View style={styles.levelHeader}>
        <Text style={styles.levelTitle}>My Level Progress</Text>
        <Text style={styles.levelXP}>{xp} XP</Text>
      </View>
      <View style={styles.levelProgress}>
        <View style={[styles.levelProgressFill, { width: `${clamped}%` }]} />
      </View>
      <Text style={styles.levelText}>
        {levelLabel} • {clamped}%
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  levelCard: {
    backgroundColor: "#8B5CF6",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  levelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  levelXP: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFD93D",
  },
  levelProgress: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
    marginBottom: 8,
    overflow: "hidden",
  },
  levelProgressFill: {
    height: "100%",
    backgroundColor: "#FFD93D",
    borderRadius: 4,
  },
  levelText: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,255,255,0.8)",
  },
});

export default LevelProgressCard;
