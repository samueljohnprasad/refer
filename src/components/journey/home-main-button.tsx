import React, { useEffect, useRef } from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/src/components/ui/Text";
import * as Haptics from "expo-haptics";
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withTiming 
} from "react-native-reanimated";
import JourneyUnitIcon from "@/src/components/journey/JourneyUnitIcon";
import { darkenHex } from "@/src/utils/colorUtils";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type HomeMainButtonProps = {
  unitLabel: string;
  unitTitle: string;
  faceColor: string;
  rimColor: string;
  unitIconKey?: string | null;
  onPress: () => void;
};

export const HomeMainButton = ({
  unitLabel,
  unitTitle,
  faceColor,
  rimColor,
  unitIconKey,
  onPress,
}: HomeMainButtonProps) => {
  const isFirstMount = useRef(true);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    // Provide a nice light haptic click when the user scrolls into a new section
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [faceColor]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      backgroundColor: withTiming(faceColor, { duration: 300 }),
      borderBottomColor: withTiming(rimColor, { duration: 300 }),
    };
  });

  return (
    <View className="px-5 w-full max-w-[420px] self-center my-2">
      <AnimatedPressable
        onPressIn={() => {
          scale.value = withSpring(0.96, { damping: 20, stiffness: 400 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 20, stiffness: 400 });
        }}
        onPress={() => {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        style={[
          {
            borderRadius: 20,
            borderBottomWidth: 3,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 4,
          },
          animatedStyle,
        ]}
        className="flex-row items-center justify-between px-5 py-4"
      >
        <View className="flex-1 mr-4">
          <Text
            variant="eyebrow"
            className="mb-1 opacity-90 !text-white"
          >
            {unitLabel}
          </Text>
          <Text
            variant="h3"
            className="!text-white"
            numberOfLines={2}
          >
            {unitTitle}
          </Text>
        </View>
        <View 
          className="w-12 h-12 items-center justify-center rounded-full mr-2"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
        >
          <JourneyUnitIcon iconKey={unitIconKey} size={24} color="#FFFFFF" />
        </View>
      </AnimatedPressable>
    </View>
  );
};
