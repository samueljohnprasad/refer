import React from "react";
import { View, StyleSheet } from "react-native";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";

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
    backgroundColor: "rgba(95, 127, 88, 0.15)", // SEMANTIC_COLORS.brand.pressed with 15% opacity
  },
  haloNeutral: {
    backgroundColor: "transparent",
  },
  inner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
  innerCompleted: {
    backgroundColor: SEMANTIC_COLORS.brand.pressed,
    borderColor: "#FFFFFF",
  },
  innerNeutral: {
    backgroundColor: "#FDFDFD",
    borderColor: "#C7C7CC",
  },
});
