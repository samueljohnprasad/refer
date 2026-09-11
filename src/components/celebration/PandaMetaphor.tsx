import React from 'react';
import { View, Text } from 'react-native';
import Animated, { useAnimatedStyle, SharedValue, interpolate, Extrapolation } from 'react-native-reanimated';
import { CelebrationContext } from '../../types/celebration';

interface PandaMetaphorProps {
  progress: SharedValue<number>;
  animationKey: CelebrationContext['pandaAnimationKey'];
}

export function PandaMetaphor({ progress, animationKey }: PandaMetaphorProps) {
  // In a real implementation, this would map animationKey to a Lottie view.
  // We use Reanimated here to mock the motion of the panda.

  const pandaStyle = useAnimatedStyle(() => {
    const translateY = interpolate(progress.value, [0, 0.5, 1], [20, -10, 0], Extrapolation.CLAMP);
    const opacity = interpolate(progress.value, [0, 0.2, 1], [0, 1, 1], Extrapolation.CLAMP);
    return {
      transform: [{ translateY }],
      opacity,
    };
  });

  const getEmoji = () => {
    switch (animationKey) {
      case 'anxiety_relax': return '😌';
      case 'thought_reframe': return '🤔';
      case 'sleep_calm': return '😴';
      case 'generic_success': return '🐼';
      default: return '🐼';
    }
  };

  return (
    <Animated.View style={pandaStyle} className="items-center justify-center">
      <View className="w-32 h-32 bg-white/50 rounded-full items-center justify-center shadow-sm border border-white/20">
        <Text className="text-6xl">{getEmoji()}</Text>
      </View>
    </Animated.View>
  );
}
