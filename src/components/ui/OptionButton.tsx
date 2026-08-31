import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React from 'react';
import { View, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { Text } from '@/src/components/ui/Text';
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface OptionButtonProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  className?: string;
  disabled?: boolean;
  prefix?: React.ReactNode;
  alignText?: 'center' | 'left';
}

export const OptionButton = ({ 
  label, 
  isSelected, 
  onPress, 
  className = "", 
  disabled = false,
  prefix,
  alignText = 'center'
}: OptionButtonProps) => {
  const pressY = useSharedValue(0);
  
  const faceColor = isSelected ? SEMANTIC_COLORS.info.surface : SEMANTIC_COLORS.surface.primary;
  const rimColor = isSelected ? SEMANTIC_COLORS.info.indicator : SEMANTIC_COLORS.border.strong;
  const labelColor = isSelected ? '#0A7DB8' : SEMANTIC_COLORS.text.secondary;

  const handlePressIn = () => {
    Haptics.selectionAsync();
    pressY.value = withTiming(4, { duration: 20 });
  };

  const handlePressOut = () => {
    pressY.value = withSpring(0, { damping: 20, stiffness: 100, overshootClamping: true });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: pressY.value }],
  }));

  return (
    <View className={`w-full relative mb-1 ${className}`}>
      {/* Rim (Shadow Base) */}
      <View
        className="absolute left-0 right-0 top-[3px] bottom-[-3px] rounded-xl"
        style={{ backgroundColor: rimColor }}
      />
      
      {/* 3D Face */}
      <AnimatedPressable
        disabled={disabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        className="rounded-xl px-4 py-3 border-2 flex-row items-center"
        style={[
          {
            backgroundColor: faceColor,
            borderColor: rimColor,
            minHeight: 48,
            justifyContent: prefix || alignText === 'left' ? 'flex-start' : 'center',
          },
          animatedStyle
        ]}
      >
        {prefix && <View className="mr-3">{prefix}</View>}
        <Text
          className={`flex-1 ${alignText === 'center' && !prefix ? 'text-center' : 'text-left'}`}
          style={{
            fontSize: 14,
            lineHeight: 19,
            color: labelColor,
            fontFamily: APP_FONT_FAMILIES.bold,
            letterSpacing: 0.08
          }}
        >
          {label}
        </Text>
      </AnimatedPressable>
    </View>
  );
};
