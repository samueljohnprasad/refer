import React, { useEffect } from "react";
import { Text, View, Pressable } from "react-native";
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { QuizOption } from "../types";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface OptionCardProps<T extends string> {
  option: QuizOption<T>;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

function OptionCardInner<T extends string>({
  option,
  isSelected,
  onSelect,
  index,
}: OptionCardProps<T>) {
  const scale = useSharedValue(1);
  const selectionProgress = useSharedValue(0);
  const checkScale = useSharedValue(0);
  const emojiScale = useSharedValue(1);

  useEffect(() => {
    if (isSelected) {
      selectionProgress.value = withTiming(1, { duration: 180 });
      checkScale.value = withTiming(1, { duration: 140 });
      emojiScale.value = withSequence(
        withTiming(1.015, { duration: 100 }),
        withTiming(1, { duration: 140 }),
      );
    } else {
      selectionProgress.value = withTiming(0, { duration: 160 });
      checkScale.value = withTiming(0, { duration: 120 });
      emojiScale.value = withTiming(1, { duration: 160 });
    }
  }, [isSelected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const borderStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      selectionProgress.value,
      [0, 1],
      ["#E5EDE1", "#5F7F58"],
    ),
    backgroundColor: interpolateColor(
      selectionProgress.value,
      [0, 1],
      ["#FFFFFF", "#F2F8EF"],
    ),
  }));

  const checkmarkStyle = useAnimatedStyle(() => ({
    opacity: checkScale.value,
  }));

  const emojiAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: emojiScale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.985, { duration: 90 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 120 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect();
  };

  return (
    <Animated.View entering={FadeIn.delay(140 + index * 60).duration(220)}>
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[animatedStyle, borderStyle]}
        className="flex-row items-center gap-3.5 rounded-2xl border-2 border-b-4 px-[18px] py-[18px]"
      >
        <Animated.View
          style={emojiAnimStyle}
          className={`h-11 w-11 items-center justify-center rounded-xl ${
            isSelected ? "bg-sage-500" : "bg-sage-50"
          }`}
        >
          <Text className="text-[22px]">{option.emoji}</Text>
        </Animated.View>
        <View className="flex-1">
          <Text
            className={`happy-font-body-semibold text-[15px] font-semibold ${
              isSelected ? "text-sage-700" : "text-ink"
            }`}
          >
            {option.title}
          </Text>
          <Text
            className="happy-font-body text-xs text-ink-muted"
          >
            {option.subtitle}
          </Text>
        </View>
        <Animated.View
          style={checkmarkStyle}
          className="h-6 w-6 items-center justify-center rounded-full bg-sage-500"
        >
          <Text className="text-xs font-extrabold text-white">✓</Text>
        </Animated.View>
      </AnimatedPressable>
    </Animated.View>
  );
}

const OptionCard = React.memo(OptionCardInner) as typeof OptionCardInner;
export default OptionCard;
