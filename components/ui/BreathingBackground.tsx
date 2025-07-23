import React, { useEffect, useState } from "react";
import { Animated, AccessibilityInfo, StyleSheet } from "react-native";
import MindfulBackground from "@/components/ui/MindfulBackground";
import { useBreathingOpacity } from "@/hooks/useBreathingOpacity";

export interface BreathingBackgroundProps {
  children: React.ReactNode;
  /** Brightness factor: 1 (normal), >1 brighter, <1 dimmer */
  brightness?: number;
  /** Enabled flag; if false breathing animation is disabled entirely */
  enabled?: boolean;
}

/**
 * Wraps `MindfulBackground` and adds a softly pulsing white overlay to create
 * a "breathing" brightness effect. Honors iOS/Android Reduce Motion setting.
 */
const BreathingBackground: React.FC<BreathingBackgroundProps> = ({
  children,
  brightness = 1,
  enabled = true,
}) => {
  const [allowMotion, setAllowMotion] = useState(true);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      setAllowMotion(!reduce);
    });
  }, []);

  const overlayOpacity = useBreathingOpacity(enabled && allowMotion, brightness);

  return (
    <MindfulBackground>
      {/* Animated white overlay to brighten/dim */}
      <Animated.View
        pointerEvents="none"
        style={[styles.overlay, { opacity: overlayOpacity }]}
      />
      {children}
    </MindfulBackground>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "white",
  },
});

export default BreathingBackground;
