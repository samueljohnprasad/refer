import React from "react";
import { Text, View, Pressable } from "react-native";
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { FeelingEmoji, FeelingOption } from "../types";
import { FEELINGS } from "../constants";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface EmojiSelectorProps {
  selected?: FeelingEmoji;
  onSelect: (feeling: FeelingEmoji) => void;
}

const EmojiButton: React.FC<{
  option: FeelingOption;
  isSelected: boolean;
  onPress: () => void;
  index: number;
}> = ({ option, isSelected, onPress, index }) => {
  const scale = useSharedValue(1);
  const emojiScale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const emojiAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: emojiScale.value }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    emojiScale.value = withSequence(
      withTiming(1.03, { duration: 110 }),
      withTiming(1, { duration: 140 }),
    );
    scale.value = withSequence(
      withTiming(0.985, { duration: 90 }),
      withTiming(1, { duration: 120 }),
    );
    onPress();
  };

  const handlePressIn = () => {
    scale.value = withTiming(0.99, { duration: 90 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 120 });
  };

  return (
    <Animated.View
      entering={FadeIn.delay(120 + index * 40).duration(180)}
      className="items-center"
    >
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={animatedStyle}
        className={`aspect-square w-full items-center justify-center rounded-[14px] ${
          isSelected ? "border-2 border-sage-500 bg-sage-50" : "bg-cream"
        }`}
      >
        <Animated.Text style={emojiAnimStyle} className="text-[28px]">
          {option.emoji}
        </Animated.Text>
      </AnimatedPressable>
      <Text className="mt-1 text-[10px] font-medium text-ink-muted">
        {option.label}
      </Text>
    </Animated.View>
  );
};

const EmojiSelector: React.FC<EmojiSelectorProps> = ({
  selected,
  onSelect,
}) => {
  return (
    <View className="flex-row flex-wrap gap-2.5">
      {FEELINGS.map((feeling, index) => (
        <View key={feeling.id} className="w-[22%]">
          <EmojiButton
            option={feeling}
            isSelected={selected === feeling.id}
            onPress={() => onSelect(feeling.id)}
            index={index}
          />
        </View>
      ))}
    </View>
  );
};

export default React.memo(EmojiSelector);
