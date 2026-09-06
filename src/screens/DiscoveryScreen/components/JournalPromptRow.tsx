import React, { memo, useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { CircleArrowReload01Icon } from "@hugeicons/core-free-icons";
import { SEMANTIC_COLORS } from "@/src/theme/colors";

interface JournalPromptRowProps {
  prompt: string;
  onShuffle: () => void;
}

export const JournalPromptRow: React.FC<JournalPromptRowProps> = memo(
  ({ prompt, onShuffle }) => {
    const rotation = useSharedValue(0);

    const handlePress = useCallback(() => {
      void Haptics.selectionAsync().catch(() => {});
      rotation.value = withSpring(rotation.value + 360, {
        damping: 20,
        stiffness: 100,
        overshootClamping: true,
      });
      onShuffle();
    }, [rotation, onShuffle]);

    const rotateStyle = useAnimatedStyle(() => ({
      transform: [{ rotate: `${rotation.value}deg` }],
    }));

    return (
      // ponytail: tightened prompt -> canvas gap by 6pt (mb-3.5 = 14px)
      <View className="flex-row justify-between items-start mb-3.5">
        <Text className="flex-1 text-ink text-[22px] leading-[26px] pr-2 happy-font-heading-medium">
          {prompt}
        </Text>
        <Pressable
          onPress={handlePress}
          accessibilityLabel="Try another prompt"
          accessibilityRole="button"
          className="w-11 h-11 items-center justify-center -mr-2"
          style={({ pressed }) => ({ opacity: pressed ? 0.45 : 0.85 })}
        >
          <Animated.View style={rotateStyle}>
            <HugeiconsIcon
              icon={CircleArrowReload01Icon}
              size={21}
              color={SEMANTIC_COLORS.text.secondary}
            />
          </Animated.View>
        </Pressable>
      </View>
    );
  }
);

JournalPromptRow.displayName = "JournalPromptRow";
