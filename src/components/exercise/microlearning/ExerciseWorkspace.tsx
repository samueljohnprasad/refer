import { SEMANTIC_COLORS } from "@/src/components/exercise/courseExerciseTheme";
import React, { type ReactNode, useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";

interface ExerciseWorkspaceProps {
  children: ReactNode;
  accessibilityLabel?: string;
  transitionKey?: string | number;
}

export function ExerciseWorkspace({
  children,
  accessibilityLabel,
  transitionKey,
}: ExerciseWorkspaceProps) {
  const reducedMotion = useReducedMotion();
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (reducedMotion || transitionKey === undefined) {
      opacity.setValue(1);
      return;
    }
    opacity.setValue(0);
    Animated.timing(opacity, {
      duration: 180,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [opacity, reducedMotion, transitionKey]);

  return (
    <Animated.View
      accessibilityLabel={accessibilityLabel}
      focusable
      style={[styles.workspace, { opacity }]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  workspace: {
    minHeight: 240,
    gap: 18,
    borderRadius: 20,
    padding: 20,
    backgroundColor: SEMANTIC_COLORS.surface.primary,
  },
});
