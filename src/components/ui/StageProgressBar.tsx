import React from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { SAGE, SAGE_OVERLAY } from "@/lib/tokens";

interface StageProgressBarProps {
  /** Progress value: supports both decimal (0 to 1) and percentage (0 to 100) */
  progress: number;
  fillColor?: string;
  trackColor?: string;
  height?: number;
  showGlow?: boolean;
  className?: string;
}

const StageProgressBar: React.FC<StageProgressBarProps> = ({
  progress,
  fillColor = SAGE[500],
  trackColor = SAGE[100],
  height = 12,
  showGlow = true,
  className,
}) => {
  const [trackWidth, setTrackWidth] = React.useState(0);
  
  // Auto-sense if progress is percentage (0-100) or decimal (0-1)
  const isPercentage = progress > 1;
  const normalizedProgress = isPercentage ? progress / 100 : progress;
  const clampedProgress = Math.max(0, Math.min(normalizedProgress, 1));
  
  const animatedProgress = useSharedValue(clampedProgress);

  React.useEffect(() => {
    animatedProgress.value = withSpring(clampedProgress, {
      damping: 12,
      stiffness: 90,
      mass: 0.8,
    });
  }, [animatedProgress, clampedProgress]);

  const fillStyle = useAnimatedStyle(() => ({
    width: trackWidth * animatedProgress.value,
  }));

  return (
    <View 
      style={{ height, justifyContent: "center" }}
      className={className}
    >
      <View
        onLayout={(event) => {
          setTrackWidth(event.nativeEvent.layout.width);
        }}
        style={{
          height,
          overflow: "hidden",
          borderRadius: 999,
          borderCurve: "continuous",
          backgroundColor: trackColor,
        }}
      >
        <Animated.View
          style={[
            {
              height,
              overflow: "hidden",
              borderRadius: 999,
              borderCurve: "continuous",
              backgroundColor: fillColor,
            },
            fillStyle,
          ]}
        >
          {showGlow && (
            <View
              style={{
                position: "absolute",
                top: Math.max(1, height * 0.15),
                left: 6,
                right: 6,
                height: Math.max(2, height * 0.25),
                borderRadius: 999,
                backgroundColor: SAGE_OVERLAY.whiteTint,
              }}
            />
          )}
        </Animated.View>
      </View>
    </View>
  );
};

export default React.memo(StageProgressBar);
