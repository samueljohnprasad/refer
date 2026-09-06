import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";

interface TimelineDotProps {
  readonly status: "completed" | "in_progress" | "draft" | "challenge" | "milestone";
}

// ponytail: subtle star indicator for challenges/milestones per audit #15-#16
const TimelineDot: React.FC<TimelineDotProps> = React.memo(({ status }) => {
  const isSpecial = status === "challenge" || status === "milestone";
  const isCompleted = status === "completed" || isSpecial;

  return (
    <View style={[styles.halo, isCompleted ? styles.haloCompleted : styles.haloCollapsed]}>
      <View
        style={[
          styles.inner,
          isCompleted ? styles.innerCompleted : styles.innerNeutral,
          isSpecial && styles.innerSpecial,
        ]}
      >
        {status === "challenge" && (
          <Text style={styles.starText}>★</Text>
        )}
        {status === "milestone" && (
          <Text style={styles.diamondText}>◇</Text>
        )}
      </View>
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
  haloCollapsed: {
    width: 12,
    height: 12,
    borderRadius: 6,
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
  innerSpecial: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: SEMANTIC_COLORS.brand.pressed,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  starText: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: -1,
  },
  diamondText: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: -1,
  },
});
