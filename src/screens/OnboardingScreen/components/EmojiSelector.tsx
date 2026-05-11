import React from "react";
import { Text, View, Pressable } from "react-native";
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
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
      withSpring(1.2, { damping: 10, stiffness: 300 }),
      withSpring(1, { damping: 12, stiffness: 200 }),
    );
    scale.value = withSequence(
      withSpring(0.9, { damping: 10, stiffness: 400 }),
      withSpring(1, { damping: 12, stiffness: 200 }),
    );
    onPress();
  };

  const handlePressIn = () => {
    scale.value = withSpring(0.92, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 300 });
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(150 + index * 50).duration(300)}
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
