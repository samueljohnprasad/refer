import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";
import { OnboardingStage } from "../types";

interface StageProgressBarProps {
  currentStage: OnboardingStage;
}

const TOTAL_STAGES = 7;

const Segment: React.FC<{ index: number; currentStage: OnboardingStage }> = ({
  index,
  currentStage,
}) => {
  const progress = useSharedValue(index < currentStage ? 1 : 0);

  useEffect(() => {
    const isActive = index < currentStage;
    progress.value = withTiming(isActive ? 1 : 0, {
      duration: 180,
    });
  }, [currentStage]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ["#E8E2D2", "#5A7A56"],
    ),
  }));

  return (
    <Animated.View style={animatedStyle} className="h-1 flex-1 rounded-full" />
  );
};

const StageProgressBar: React.FC<StageProgressBarProps> = ({
  currentStage,
}) => {
  return (
    <View className="flex-row items-center gap-1.5 px-6">
      {Array.from({ length: TOTAL_STAGES }).map((_, index) => (
        <Segment key={index} index={index} currentStage={currentStage} />
      ))}
    </View>
  );
};

export default React.memo(StageProgressBar);
