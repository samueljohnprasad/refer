import React from 'react';
import { Image } from 'react-native';
import Animated, { useAnimatedStyle, SharedValue, interpolate, Extrapolation, useReducedMotion } from 'react-native-reanimated';
import { CelebrationContext } from '../../types/celebration';

interface PandaMetaphorProps {
  progress: SharedValue<number>;
  animationKey: CelebrationContext['pandaAnimationKey'];
}

export function PandaMetaphor({ progress, animationKey }: PandaMetaphorProps) {
  const reducedMotion = useReducedMotion();

  const pandaStyle = useAnimatedStyle(() => {
    if (reducedMotion) {
      // Respect Reduce Motion: simple fade and tiny scale
      const opacity = interpolate(progress.value, [0, 1], [0, 1], Extrapolation.CLAMP);
      const scale = interpolate(progress.value, [0, 1], [0.95, 1], Extrapolation.CLAMP);
      return {
        transform: [{ scale }],
        opacity,
      };
    }

    // ponytail: playful pop and settle bounce
    const translateY = interpolate(progress.value, [0, 0.4, 0.7, 1], [60, -15, 5, 0], Extrapolation.CLAMP);
    const opacity = interpolate(progress.value, [0, 0.1, 1], [0, 1, 1], Extrapolation.CLAMP);
    const scale = interpolate(progress.value, [0, 0.4, 0.6, 0.8, 1], [0.5, 1.15, 0.95, 1.02, 1], Extrapolation.CLAMP);
    const rotate = interpolate(progress.value, [0, 0.4, 0.6, 0.8, 1], [-5, 4, -2, 1, 0], Extrapolation.CLAMP);

    return {
      transform: [{ translateY }, { scale }, { rotate: `${rotate}deg` }],
      opacity,
    };
  });

  const getImageSource = () => {
    switch (animationKey) {
      case 'anxiety_relax': return require('../../../assets/images/panda/panda-love-hug.png');
      case 'thought_reframe': return require('../../../assets/images/panda/panda-confused-thinking.png');
      case 'sleep_calm': return require('../../../assets/images/panda/panda-pillow-hug.png');
      case 'generic_success': return require('../../../assets/images/panda/panda-happy.png');
      default: return require('../../../assets/images/panda/panda-happy.png');
    }
  };

  return (
    <Animated.View style={pandaStyle} className="items-center justify-center absolute w-full h-full">
      <Image
        source={getImageSource()}
        style={{ width: '100%', height: '100%' }}
        resizeMode="contain"
      />
    </Animated.View>
  );
}
