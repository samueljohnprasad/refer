import React from "react";
import { View, StyleSheet } from "react-native";
import { SAGE } from "@/lib/tokens";

interface TimelineDotProps {
  readonly status: "completed" | "in_progress" | "draft";
}

const TimelineDot: React.FC<TimelineDotProps> = React.memo(({ status }) => {
  const isCompleted: boolean = status === "completed";

  return (
    <View style={[styles.halo, isCompleted ? styles.haloCompleted : styles.haloNeutral]}>
      <View style={[styles.inner, isCompleted ? styles.innerCompleted : styles.innerNeutral]} />
    </View>
  );
});

TimelineDot.displayName = "TimelineDot";
export { TimelineDot };

const styles = StyleSheet.create({
  halo: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  haloCompleted: {
    backgroundColor: "rgba(95, 127, 88, 0.15)", // SAGE[600] with 15% opacity
  },
  haloNeutral: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  inner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  innerCompleted: {
    backgroundColor: SAGE[600],
  },
  innerNeutral: {
    backgroundColor: "#E5E5EA",
  },
});
