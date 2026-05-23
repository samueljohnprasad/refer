import React from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

interface StageProgressBarProps {
  progress: number;
  fillColor?: string;
  trackColor?: string;
}

const TRACK_HEIGHT = 12;

const StageProgressBar: React.FC<StageProgressBarProps> = ({
  progress,
  fillColor = "#5F7F58",
  trackColor = "#E9EFE5",
}) => {
  const [trackWidth, setTrackWidth] = React.useState(0);
  const clampedProgress = Math.max(0, Math.min(progress, 1));
  const animatedProgress = useSharedValue(clampedProgress);

  React.useEffect(() => {
    animatedProgress.value = withTiming(clampedProgress, {
      duration: 220,
      easing: Easing.out(Easing.cubic),
    });
  }, [animatedProgress, clampedProgress]);

  const fillStyle = useAnimatedStyle(() => ({
    width: trackWidth * animatedProgress.value,
  }));

  return (
    <View style={{ height: TRACK_HEIGHT, justifyContent: "center" }}>
      <View
        onLayout={(event) => {
          setTrackWidth(event.nativeEvent.layout.width);
        }}
        style={{
          height: TRACK_HEIGHT,
          overflow: "hidden",
          borderRadius: 999,
          borderCurve: "continuous",
          backgroundColor: trackColor,
        }}
      >
        <Animated.View
          style={[
            {
              height: TRACK_HEIGHT,
              overflow: "hidden",
              borderRadius: 999,
              borderCurve: "continuous",
              backgroundColor: fillColor,
            },
            fillStyle,
          ]}
        >
          <View
            style={{
              position: "absolute",
              top: 2,
              left: 6,
              right: 6,
              height: 3,
              borderRadius: 999,
              backgroundColor: "rgba(255, 255, 255, 0.3)",
            }}
          />
        </Animated.View>
      </View>
    </View>
  );
};

export default React.memo(StageProgressBar);
